($ => {

function getBrowserSignature(conf) {
  const config = conf || {}
  const kit = config.kit || {
    global: globalThis.window,
    hash: getBrowserSignature.hash
  }
  if(typeof kit.global != "object" || typeof kit.hash != "function") throw new Error("Invalid or no provided kit")
  const n = kit.global.navigator
  const s = kit.global.screen
  let sw = [n.appName, n.appCodeName, n.product, n.productSub, n.vendor]
  if(Array.isArray(config.software)) {
    if(config.override == true) {
      sw = config.software
    } else {
      sw = sw.concat(config.software)
    }
  }
  let hw = [s.availHeight, s.availWidth, s.pixelDepth, s.colorDepth, n.hardwareConcurrency, n.maxTouchPoints, kit.devicePixelRatio]
  if(Array.isArray(config.hardware)) {
    if(config.override == true) {
      hw = config.hardware
    } else {
      hw = hw.concat(config.hardware)
    }
  }
  let comp = ["WebGL2RenderingContext", "Worker", "WebSocket", "WebAssembly", "RTCCertificate", "IDBDatabase"]
  if(Array.isArray(config.compatibility)) {
    if(config.override == true) {
      comp = config.compatibility
    } else {
      comp = comp.concat(config.compatibility)
    }
  }
  const sign = {
    software: kit.hash(sw.join("")),
    hardware: kit.hash(hw.join("")),
    compatibility: kit.hash(comp.map(i => i in kit.global ? 1 : 0).join(""))
  }
  sign.signature = {
    all: kit.hash(sign.software + sign.hardware + sign.compatibility),
    softhard: kit.hash(sign.software + sign.hardware),
    hardcomp: kit.hash(sign.hardware + sign.compatibility),
    softcomp: kit.hash(sign.software + sign.compatibility)
  }
  return sign
}

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

getBrowserSignature.version = 2;

if("module" in $) $.module.exports = getBrowserSignature;
else $.getBrowserSignature = getBrowserSignature
})(globalThis)