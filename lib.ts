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

@global
class Inliner {
  @inline
  static inlineFileAsString(path: string): string {
    return path;
  }

  // This function is just a placeholder so that the TS language server
  // is happy during author time. It will be replaced with the internal
  // version during compilation.
  static inlineFileAsStaticArray(buf: string): StaticArray<u8> {
    return new StaticArray<u8>(0);
  }

  @inline
  static inlineFileAsStaticArray_internal(
    buf: StaticArray<u8>
  ): StaticArray<u8> {
    return buf;
  }
}
