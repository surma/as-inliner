# as-inliner

`as-inliner` allows you to inline the contents of a file into your [AssemblyScript]. This all happens at build time as either a `string` or a `StaticArray`.

## Example & Documentation

```ts
const image: StaticArray<u8> = Inliner.inlineFileAsStaticArray(
  "../images/hero.png"
);
const welcomeText: string = Inline.inlineFileAsString("../README.md");

export function main(): void {
  /* ... */
}
```

It’s worth nothing that inlining a file as a string will assume that the file is encoded in UTF-8 and will put it into linear memory in WTF-16, taking up ~twice as much space (but gzip compression will negate most of that).

## Usage

`as-inliner` works through [ASC transforms][transforms]:

```
$ npx asc -b your/output/path/file.wasm --transform as-inliner -O3
```

or place it in your `asconfig.json`:

```json
{
  ...
  "options": {
    "transform": ["as-inliner"]
  }
}
```

Or extend the `asconfig.json` here:

```json
{
  "extend": "as-inliner/asconfig.json"
}
```

---

License Apache-2.0

[assemblyscript]: https://www.assemblyscript.org/
[transforms]: https://www.assemblyscript.org/transforms.html#transforms
