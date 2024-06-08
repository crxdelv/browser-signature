# browser-signature <kbd>v3.1</kbd>
`browser-signature` is a client-side tool that generates custom browser signature, relying on the browser's navigator, window, and screen.

Browser signatures are used to identify devices, even with different user-agents or IP origins. [^1]

<p align="center"><a href="https://crebin.vercel.app/demo/signature.html"><kbd>Try it online :green_circle:</kbd></a></p>

# :package: Installation

## Client-side
Download [`browser-signature.js`](https://github.com/creuserr/browser-signature/blob/main/dist/browser-signature.js) and embed it locally:

```html
<script src="browser-signature.js"></script>
```

Or use CDN instead:

```html
<script src="https://cdn.jsdelivr.net/gh/creuserr/browser-signature/dist/browser-signature.js"></script>
```

## Server-side
Download [`browser-signature.js`](https://github.com/creuserr/browser-signature/blob/main/dist/browser-signature.js) and import it.

```js
const getBrowserSignature = require("./browser-signature.js")
console.log(getBrowserSignature.version)
```

> [!IMPORTANT]
> Using this tool on server-side requires additional steps. See [#creating-a-kit](https://github.com/creuserr/browser-signature?tab=readme-ov-file#creating-a-kit) for more informations.

# :books: Usage
```js
getBrowserSignature(Object: config)
// Returns an object
```

```js
{
  software: String,
  hardware: String,
  compatibility: String,
  signature: {
    all: String,
    softcomp: String,
    hardcomp: String,
    softhard: String
  }
}
```

## Comparison

| Negative Feature | Hardware | Software | Compatibility |
|:--------|:--------:|:--------:|:-------------:|
| Modifiable | No | Yes | No |
| Dependability by browser | No | Yes | Yes |
| Similarity conflicts | Yes | No | Yes |

`Modifiable` refers to values that can be modified by the browser, server-side, or even the client-side.

`Dependability by browser` refers to values that depend on whether they are supported by the browser.

`Similarity conflicts` refers to values that are too weak and can cause similarity conflicts with other devices.

> [!TIP]
> Based on the comparison, `hardcomp` is the best signature to use. The vulnerability can somehow be replenished by combining the two constant components.

# Under the hood
## Software
`software` is a signature derived from the navigator's client information.

It is made up of:
- App name
- App code name
- Product
- Sub-product
- Vendor

## Hardware
`hardware` is a signature derived from the navigator's hardware information and the device's screen information.

It is made up of:
- Device's available height
- Device's available width
- Pixel depth
- Color depth
- Hardware concurrency
- Maximum touch points
- Device's pixel ratio

## Compatibility
`compatibility`, on the other hand, is a signature derived from a set of 1s and 0s depending on the compatibility of:

- `WebGL2RenderingContext`
- `Worker`
- `WebSocket`
- `WebAssembly`
- `RTCCertificate`
- `IDBDatabase`

## Signatures
`signatures` is a compilation of overall signatures. It consists of four signatures:

`softcomp` refers to the overall signature of software and compatibility.

`hardcomp` refers to the overall signature of hardware and compatibility.

`softhard` refers to the overall signature of software and hardware.

`all` refers to the overall signature of software, hardware, and compatibility.

## Hashing

`browser-signature` uses this hashing method:

```js
getBrowserSignature.hash = (raw) => {
  function hash(str) {
    let h1 = 0xdeadbeef ^ 0
    let h2 = 0x41c6ce57 ^ 0
    for(let i = 0; i < str.length; i++) {
    var ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)
    return 4294967296 * (2097151 & h2) + (h1 >>> 0)
  }
  function pair(a, b) {
    return 0.5 * (a + b) * (a + b + 1) + b
  }
  return hash(new Array(Math.ceil(raw.length / 2)).fill(0).map((_, i) => {
    return pair(raw.charCodeAt(i * 2), raw.charCodeAt(i * 2 + 1) || 0)
  }).join("")).toString(16)
}
```

It merges two characters by using cantor-pairing method before hashing it.

# :wrench: Configuration

```js
// getBrowserSignature(configuration)

getBrowserSignature({
  hash: Function, // REQUIRED
  kit: Object, // REQUIRED
  override: Boolean,
  software: Array,
  hardware: Array,
  compatibility: Array
})
```

## Creating a kit

If you're using this tool on a client-side application, you don't necessarily need to use kit.

Kit is basically the global instance. Think of kit as the `window` instance. Since NodeJS is server-side, `window` is inaccessible.

**Kit Template**

```js
getBrowserSignature({
  kit: {
    // both navigator and screen
    // must be objects
    navigator: {
      // these are keys needed
      // for the default software
      appName: "...",
      appCodeName: "...",
      product: "...",
      productSub: "...",
      vendor: "...",
      // used in hardware
      hardwareConcurrency: 5,
      maxTouchPoints: 5
    },
    screen: {
      // these are keys needed
      // for the default hardware
      availHeight: 800,
      availWidth: 360,
      pixelDepth: 1,
      colorDepth: 1
    },
    // these are keys needed
    // for the default compatibility.
    // any value is accepted
    // as long as it's defined
    WebGL2RenderingContext: 1,
    Worker: 1,
    WebSocket: 1,
    WebAssembly: 1
    RTCCertificate: 1,
    IDBDatabase: 1,
    // used in hardware
    devicePixelRatio: 5
  }
})
```

## Configuring the components

Every components must be an array of string that points to a property of the kit. Every keys are obtained from `kit`.

```js
getBrowserSignature({
  software: ["screen.foo"],
  // kit.screen.foo
  hardware: ["navigator.foo"],
  // kit.navigator.foo
  compatibility: ["foo"]
  // "foo" in kit
})
```

### Overriding

By default, custom components are concatenated to the original one. To fully override the components, set `override` to true.

```js
getBrowserSignature({
  // overrides all the components instead
  override: true
})
```

## Custom hash

```js
getBrowserSignature({
  // ...
  hash: Function
})
```

> [!NOTE]
> Overriding the default hash method can lead to similarity conflicts if both party uses different hash methods.

To use the default one, use the function `getBrowserSignature.hash`.

[^1]: Since this browser signature library uses software-based information, I'm still unsure if it can affect the signature. <p>If so, please report an issue regarding it. Thank you!</p> <p align="center"><a href="https://github.com/creuserr/browser-signature/issues/new?assignees=&labels=&projects=&template=report---signature-inaccuracy.md&title=Report+~+Signature+inaccuracy"><kbd>Submit a report :red_circle:</kbd></a></p>
