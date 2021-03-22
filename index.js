/**
 * Copyright 2021 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require("fs");
const path = require("path");
const {
  Node,
  NodeKind,
  AssertionKind,
  ASTBuilder,
  Transform,
} = require("visitor-as/as");

function* walk(maybeNode, visited = new WeakSet()) {
  if (!(maybeNode instanceof Node)) {
    return;
  }
  if (visited.has(maybeNode)) {
    return;
  }
  yield maybeNode;
  visited.add(maybeNode);

  for (const value of Object.values(maybeNode)) {
    if (Array.isArray(value)) {
      for (const element of value) {
        yield* walk(element, visited);
      }
    } else {
      yield* walk(value, visited);
    }
  }
}

class InlinerTransform extends Transform {
  afterParse(parser) {
    const inlinerSrc = fs.readFileSync(require.resolve("./lib.ts"), "utf8");
    parser.parseFile(inlinerSrc, "~inliner/lib.ts", true);
    for (const source of parser.sources) {
      for (const node of walk(source)) {
        if (this.isInlineFileAsStringCall(node)) {
          this.handleInlineFileAsStringCall(source, node);
        } else if (this.isInlineFileAsStaticArrayCall(node)) {
          this.handleInlineFileAsStaticArrayCall(source, node);
        }
      }
    }
  }

  isInlineFileAsStringCall(node) {
    return (
      node.kind === NodeKind.CALL &&
      ASTBuilder.build(node.expression) === "Inliner.inlineFileAsString"
    );
  }

  isInlineFileAsStaticArrayCall(node) {
    return (
      node.kind === NodeKind.CALL &&
      ASTBuilder.build(node.expression) === "Inliner.inlineFileAsStaticArray"
    );
  }

  handleInlineFileAsStringCall(source, node) {
    console.assert(
      node.args.length === 1,
      "inlineFileAsString takes exactly one argument"
    );
    const filePath = path.resolve(
      path.dirname(source.normalizedPath),
      node.args[0].value
    );
    const string = fs.readFileSync(filePath, "utf8");
    node.args[0].value = string;
  }

  handleInlineFileAsStaticArrayCall(source, node) {
    console.assert(
      node.args.length === 1,
      "inlineFileAsStaticArray takes exactly one argument"
    );
    node.expression.property.text += "_internal";

    const filePath = path.resolve(
      path.dirname(source.normalizedPath),
      node.args[0].value
    );
    const data = fs.readFileSync(filePath);
    const originalRange = node.args[0].range;
    node.args[0] = Node.createAssertionExpression(
      AssertionKind.PREFIX,
      Node.createArrayLiteralExpression(
        [...new Uint8Array(data)].map((v) =>
          Node.createIntegerLiteralExpression(
            { low: v, high: 0, unsigned: false },
            originalRange
          )
        ),
        originalRange
      ),
      Node.createNamedType(
        Node.createSimpleTypeName("StaticArray", originalRange),
        [
          Node.createNamedType(
            Node.createSimpleTypeName("u8", originalRange),
            [],
            false,
            originalRange
          ),
        ],
        false,
        originalRange
      ),
      originalRange
    );
  }
}
module.exports = InlinerTransform;
