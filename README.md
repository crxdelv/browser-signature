# browser-signature
`browser-signature` is a client-side library that generates custom browser signature, relying on the browser's navigator, window, and screen.

<p align="center"><a href="https://crebin.vercel.app/demo/signature.html"><kbd>Try it online :green_circle:</kbd></a></p>

# Installation
```html
<script src="https://cdn.jsdelivr.net/gh/creuserr/browser-signature/dist/browser-signature.js"></script>
```

# Usage
```js
getBrowserSignature()
// Returns an object
```

```js
{
  software: String,
  hardware: String,
  compatibility: String,
  signature: String
}
```

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

## Signature
`signature` is the overall signature of those three components.

Generated signatures are hexadecimal Jenkins hashes.
