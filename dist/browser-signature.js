function getBrowserSignature() {
  if(this.window == undefined) throw Error("Cannot obtain the browser signature in a non-client-sided program")
  var n = window.navigator
  var s = window.screen
  var sw = [n.appName, n.appCodeName, n.product, n.productSub, n.vendor]
  var hw = [s.availHeight, s.availWidth, s.pixelDepth, s.colorDepth, n.hardwareConcurrency, n.maxTouchPoints, window.devicePixelRatio]
  var sp = ["WebGL2RenderingContext", "Worker", "WebSocket", "WebAssembly", "RTCCertificate", "IDBDatabase"]
  function enc(raw) {
    return hash(new Array(Math.ceil(raw.length / 2)).fill(0).map((_, i) => {
    return pair(raw.charCodeAt(i * 2), raw.charCodeAt(i * 2 + 1) || 0)
    }).join("")).toString(16)
  }
  function hash(str) {
    var h1 = 0xdeadbeef ^ 0
    var h2 = 0x41c6ce57 ^ 0
    for(var i = 0; i < str.length; i++) {
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
  var sign = {
    software: enc(sw.join("")),
    hardware: enc(hw.join("")),
    compatibility: enc(sp.map(i => i in window ? 1 : 0).join(""))
  }
  sign.signature = enc(sign.software + sign.hardware + sign.compatibility)
  return sign
}