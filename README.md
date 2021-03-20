# as-inliner

`as-inliner` allows you to inline the contents of a file into your [AssemblyScript]. This all happens at build time as either a `string` or a `StaticArray`.

## Example & Documentation

```ts
const image: StaticArray<u8> = Inliner.inlineFileAsStaticArray("../images/hero.png");
const welcomeText: string = Inline.inlineFileAsString("../README.md");

export function main(): void {
  /* ... */
}
```

It’s worth nothing that inlining a file as a string will assume that the file is encoded in UTF-8 and will put it into linear memory in WTF-16, taking up ~twice as much space (but gzip compression will negate most of that).

## Usage

`as-inliner` works through [ASC transforms][transforms]:

```
$ npx asc -b your/output/path/file.wasm --transform ./node_modules/as-inliner/transform.js -O3
```

---
License Apache-2.0

[AssemblyScript]: https://www.assemblyscript.org/
[transforms]: https://www.assemblyscript.org/transforms.html#transforms