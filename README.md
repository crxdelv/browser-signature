# browser-signature
`browser-signature` is a client-side library that generates custom browser signature, relying on the browser's navigator, window, and screen.

Browser signatures are used to identify devices, even with different user-agents or IP origins. [^1]

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

`Similarity conflicts` refers to values that are too wrak and can cause similarity conflicts with other devices.

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

[^1]: Since this browser signature library uses software-based information, I'm still unsure if it can affect the signature. <p>If so, please report an issue regarding it. Thank you!</p> <p align="center"><a href="https://github.com/creuserr/browser-signature/issues/new?assignees=&labels=&projects=&template=report---signature-inaccuracy.md&title=Report+~+Signature+inaccuracy"><kbd>Submit a report :red_circle:</kbd></a></p>
