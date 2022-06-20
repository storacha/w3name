"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod4) => function __require() {
    return mod4 || (0, cb[__getOwnPropNames(cb)[0]])((mod4 = { exports: {} }).exports, mod4), mod4.exports;
  };
  var __export = (target, all2) => {
    for (var name2 in all2)
      __defProp(target, name2, { get: all2[name2], enumerable: true });
  };
  var __copyProps = (to, from4, except, desc) => {
    if (from4 && typeof from4 === "object" || typeof from4 === "function") {
      for (let key of __getOwnPropNames(from4))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from4[key], enumerable: !(desc = __getOwnPropDesc(from4, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod4, isNodeMode, target) => (target = mod4 != null ? __create(__getProtoOf(mod4)) : {}, __copyProps(isNodeMode || !mod4 || !mod4.__esModule ? __defProp(target, "default", { value: mod4, enumerable: true }) : target, mod4));
  var __toCommonJS = (mod4) => __copyProps(__defProp({}, "__esModule", { value: true }), mod4);

  // ../node_modules/multiformats/esm/vendor/base-x.js
  function base(ALPHABET, name2) {
    if (ALPHABET.length >= 255) {
      throw new TypeError("Alphabet too long");
    }
    var BASE_MAP = new Uint8Array(256);
    for (var j = 0; j < BASE_MAP.length; j++) {
      BASE_MAP[j] = 255;
    }
    for (var i = 0; i < ALPHABET.length; i++) {
      var x = ALPHABET.charAt(i);
      var xc = x.charCodeAt(0);
      if (BASE_MAP[xc] !== 255) {
        throw new TypeError(x + " is ambiguous");
      }
      BASE_MAP[xc] = i;
    }
    var BASE = ALPHABET.length;
    var LEADER = ALPHABET.charAt(0);
    var FACTOR = Math.log(BASE) / Math.log(256);
    var iFACTOR = Math.log(256) / Math.log(BASE);
    function encode20(source) {
      if (source instanceof Uint8Array)
        ;
      else if (ArrayBuffer.isView(source)) {
        source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
      } else if (Array.isArray(source)) {
        source = Uint8Array.from(source);
      }
      if (!(source instanceof Uint8Array)) {
        throw new TypeError("Expected Uint8Array");
      }
      if (source.length === 0) {
        return "";
      }
      var zeroes = 0;
      var length2 = 0;
      var pbegin = 0;
      var pend = source.length;
      while (pbegin !== pend && source[pbegin] === 0) {
        pbegin++;
        zeroes++;
      }
      var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
      var b58 = new Uint8Array(size);
      while (pbegin !== pend) {
        var carry = source[pbegin];
        var i2 = 0;
        for (var it1 = size - 1; (carry !== 0 || i2 < length2) && it1 !== -1; it1--, i2++) {
          carry += 256 * b58[it1] >>> 0;
          b58[it1] = carry % BASE >>> 0;
          carry = carry / BASE >>> 0;
        }
        if (carry !== 0) {
          throw new Error("Non-zero carry");
        }
        length2 = i2;
        pbegin++;
      }
      var it2 = size - length2;
      while (it2 !== size && b58[it2] === 0) {
        it2++;
      }
      var str = LEADER.repeat(zeroes);
      for (; it2 < size; ++it2) {
        str += ALPHABET.charAt(b58[it2]);
      }
      return str;
    }
    function decodeUnsafe(source) {
      if (typeof source !== "string") {
        throw new TypeError("Expected String");
      }
      if (source.length === 0) {
        return new Uint8Array();
      }
      var psz = 0;
      if (source[psz] === " ") {
        return;
      }
      var zeroes = 0;
      var length2 = 0;
      while (source[psz] === LEADER) {
        zeroes++;
        psz++;
      }
      var size = (source.length - psz) * FACTOR + 1 >>> 0;
      var b256 = new Uint8Array(size);
      while (source[psz]) {
        var carry = BASE_MAP[source.charCodeAt(psz)];
        if (carry === 255) {
          return;
        }
        var i2 = 0;
        for (var it3 = size - 1; (carry !== 0 || i2 < length2) && it3 !== -1; it3--, i2++) {
          carry += BASE * b256[it3] >>> 0;
          b256[it3] = carry % 256 >>> 0;
          carry = carry / 256 >>> 0;
        }
        if (carry !== 0) {
          throw new Error("Non-zero carry");
        }
        length2 = i2;
        psz++;
      }
      if (source[psz] === " ") {
        return;
      }
      var it4 = size - length2;
      while (it4 !== size && b256[it4] === 0) {
        it4++;
      }
      var vch = new Uint8Array(zeroes + (size - it4));
      var j2 = zeroes;
      while (it4 !== size) {
        vch[j2++] = b256[it4++];
      }
      return vch;
    }
    function decode21(string3) {
      var buffer2 = decodeUnsafe(string3);
      if (buffer2) {
        return buffer2;
      }
      throw new Error(`Non-${name2} character`);
    }
    return {
      encode: encode20,
      decodeUnsafe,
      decode: decode21
    };
  }
  var src, _brrp__multiformats_scope_baseX, base_x_default;
  var init_base_x = __esm({
    "../node_modules/multiformats/esm/vendor/base-x.js"() {
      src = base;
      _brrp__multiformats_scope_baseX = src;
      base_x_default = _brrp__multiformats_scope_baseX;
    }
  });

  // ../node_modules/multiformats/esm/src/bytes.js
  var empty, equals, coerce, fromString, toString;
  var init_bytes = __esm({
    "../node_modules/multiformats/esm/src/bytes.js"() {
      empty = new Uint8Array(0);
      equals = (aa, bb) => {
        if (aa === bb)
          return true;
        if (aa.byteLength !== bb.byteLength) {
          return false;
        }
        for (let ii = 0; ii < aa.byteLength; ii++) {
          if (aa[ii] !== bb[ii]) {
            return false;
          }
        }
        return true;
      };
      coerce = (o) => {
        if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
          return o;
        if (o instanceof ArrayBuffer)
          return new Uint8Array(o);
        if (ArrayBuffer.isView(o)) {
          return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
        }
        throw new Error("Unknown type, must be binary type");
      };
      fromString = (str) => new TextEncoder().encode(str);
      toString = (b) => new TextDecoder().decode(b);
    }
  });

  // ../node_modules/multiformats/esm/src/bases/base.js
  var Encoder, Decoder, ComposedDecoder, or, Codec, from, baseX, decode, encode, rfc4648;
  var init_base = __esm({
    "../node_modules/multiformats/esm/src/bases/base.js"() {
      init_base_x();
      init_bytes();
      Encoder = class {
        constructor(name2, prefix, baseEncode) {
          this.name = name2;
          this.prefix = prefix;
          this.baseEncode = baseEncode;
        }
        encode(bytes2) {
          if (bytes2 instanceof Uint8Array) {
            return `${this.prefix}${this.baseEncode(bytes2)}`;
          } else {
            throw Error("Unknown type, must be binary type");
          }
        }
      };
      Decoder = class {
        constructor(name2, prefix, baseDecode) {
          this.name = name2;
          this.prefix = prefix;
          this.baseDecode = baseDecode;
        }
        decode(text) {
          if (typeof text === "string") {
            switch (text[0]) {
              case this.prefix: {
                return this.baseDecode(text.slice(1));
              }
              default: {
                throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
              }
            }
          } else {
            throw Error("Can only multibase decode strings");
          }
        }
        or(decoder) {
          return or(this, decoder);
        }
      };
      ComposedDecoder = class {
        constructor(decoders) {
          this.decoders = decoders;
        }
        or(decoder) {
          return or(this, decoder);
        }
        decode(input) {
          const prefix = input[0];
          const decoder = this.decoders[prefix];
          if (decoder) {
            return decoder.decode(input);
          } else {
            throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
          }
        }
      };
      or = (left, right) => new ComposedDecoder({
        ...left.decoders || { [left.prefix]: left },
        ...right.decoders || { [right.prefix]: right }
      });
      Codec = class {
        constructor(name2, prefix, baseEncode, baseDecode) {
          this.name = name2;
          this.prefix = prefix;
          this.baseEncode = baseEncode;
          this.baseDecode = baseDecode;
          this.encoder = new Encoder(name2, prefix, baseEncode);
          this.decoder = new Decoder(name2, prefix, baseDecode);
        }
        encode(input) {
          return this.encoder.encode(input);
        }
        decode(input) {
          return this.decoder.decode(input);
        }
      };
      from = ({ name: name2, prefix, encode: encode20, decode: decode21 }) => new Codec(name2, prefix, encode20, decode21);
      baseX = ({ prefix, name: name2, alphabet }) => {
        const { encode: encode20, decode: decode21 } = base_x_default(alphabet, name2);
        return from({
          prefix,
          name: name2,
          encode: encode20,
          decode: (text) => coerce(decode21(text))
        });
      };
      decode = (string3, alphabet, bitsPerChar, name2) => {
        const codes = {};
        for (let i = 0; i < alphabet.length; ++i) {
          codes[alphabet[i]] = i;
        }
        let end = string3.length;
        while (string3[end - 1] === "=") {
          --end;
        }
        const out = new Uint8Array(end * bitsPerChar / 8 | 0);
        let bits2 = 0;
        let buffer2 = 0;
        let written = 0;
        for (let i = 0; i < end; ++i) {
          const value = codes[string3[i]];
          if (value === void 0) {
            throw new SyntaxError(`Non-${name2} character`);
          }
          buffer2 = buffer2 << bitsPerChar | value;
          bits2 += bitsPerChar;
          if (bits2 >= 8) {
            bits2 -= 8;
            out[written++] = 255 & buffer2 >> bits2;
          }
        }
        if (bits2 >= bitsPerChar || 255 & buffer2 << 8 - bits2) {
          throw new SyntaxError("Unexpected end of data");
        }
        return out;
      };
      encode = (data, alphabet, bitsPerChar) => {
        const pad = alphabet[alphabet.length - 1] === "=";
        const mask = (1 << bitsPerChar) - 1;
        let out = "";
        let bits2 = 0;
        let buffer2 = 0;
        for (let i = 0; i < data.length; ++i) {
          buffer2 = buffer2 << 8 | data[i];
          bits2 += 8;
          while (bits2 > bitsPerChar) {
            bits2 -= bitsPerChar;
            out += alphabet[mask & buffer2 >> bits2];
          }
        }
        if (bits2) {
          out += alphabet[mask & buffer2 << bitsPerChar - bits2];
        }
        if (pad) {
          while (out.length * bitsPerChar & 7) {
            out += "=";
          }
        }
        return out;
      };
      rfc4648 = ({ name: name2, prefix, bitsPerChar, alphabet }) => {
        return from({
          prefix,
          name: name2,
          encode(input) {
            return encode(input, alphabet, bitsPerChar);
          },
          decode(input) {
            return decode(input, alphabet, bitsPerChar, name2);
          }
        });
      };
    }
  });

  // ../node_modules/multiformats/esm/src/bases/identity.js
  var identity_exports = {};
  __export(identity_exports, {
    identity: () => identity
  });
  var identity;
  var init_identity = __esm({
    "../node_modules/multiformats/esm/src/bases/identity.js"() {
      init_base();
      init_bytes();
      identity = from({
        prefix: "\0",
        name: "identity",
        encode: (buf2) => toString(buf2),
        decode: (str) => fromString(str)
      });
    }
  });

  // ../node_modules/multiformats/esm/src/bases/base2.js
  var base2_exports = {};
  __export(base2_exports, {
    base2: () => base2
  });
  var base2;
  var init_base2 = __esm({
    "../node_modules/multiformats/esm/src/bases/base2.js"() {
      init_base();
      base2 = rfc4648({
        prefix: "0",
        name: "base2",
        alphabet: "01",
        bitsPerChar: 1
      });
    }
  });

  // ../node_modules/multiformats/esm/src/bases/base8.js
  var base8_exports = {};
  __export(base8_exports, {
    base8: () => base8
  });
  var base8;
  var init_base8 = __esm({
    "../node_modules/multiformats/esm/src/bases/base8.js"() {
      init_base();
      base8 = rfc4648({
        prefix: "7",
        name: "base8",
        alphabet: "01234567",
        bitsPerChar: 3
      });
    }
  });

  // ../node_modules/multiformats/esm/src/bases/base10.js
  var base10_exports = {};
  __export(base10_exports, {
    base10: () => base10
  });
  var base10;
  var init_base10 = __esm({
    "../node_modules/multiformats/esm/src/bases/base10.js"() {
      init_base();
      base10 = baseX({
        prefix: "9",
        name: "base10",
        alphabet: "0123456789"
      });
    }
  });

  // ../node_modules/multiformats/esm/src/bases/base16.js
  var base16_exports = {};
  __export(base16_exports, {
    base16: () => base16,
    base16upper: () => base16upper
  });
  var base16, base16upper;
  var init_base16 = __esm({
    "../node_modules/multiformats/esm/src/bases/base16.js"() {
      init_base();
      base16 = rfc4648({
        prefix: "f",
        name: "base16",
        alphabet: "0123456789abcdef",
        bitsPerChar: 4
      });
      base16upper = rfc4648({
        prefix: "F",
        name: "base16upper",
        alphabet: "0123456789ABCDEF",
        bitsPerChar: 4
      });
    }
  });

  // ../node_modules/multiformats/esm/src/bases/base32.js
  var base32_exports = {};
  __export(base32_exports, {
    base32: () => base32,
    base32hex: () => base32hex,
    base32hexpad: () => base32hexpad,
    base32hexpadupper: () => base32hexpadupper,
    base32hexupper: () => base32hexupper,
    base32pad: () => base32pad,
    base32padupper: () => base32padupper,
    base32upper: () => base32upper,
    base32z: () => base32z
  });
  var base32, base32upper, base32pad, base32padupper, base32hex, base32hexupper, base32hexpad, base32hexpadupper, base32z;
  var init_base32 = __esm({
    "../node_modules/multiformats/esm/src/bases/base32.js"() {
      init_base();
      base32 = rfc4648({
        prefix: "b",
        name: "base32",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567",
        bitsPerChar: 5
      });
      base32upper = rfc4648({
        prefix: "B",
        name: "base32upper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        bitsPerChar: 5
      });
      base32pad = rfc4648({
        prefix: "c",
        name: "base32pad",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
        bitsPerChar: 5
      });
      base32padupper = rfc4648({
        prefix: "C",
        name: "base32padupper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
        bitsPerChar: 5
      });
      base32hex = rfc4648({
        prefix: "v",
        name: "base32hex",
        alphabet: "0123456789abcdefghijklmnopqrstuv",
        bitsPerChar: 5
      });
      base32hexupper = rfc4648({
        prefix: "V",
        name: "base32hexupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
        bitsPerChar: 5
      });
      base32hexpad = rfc4648({
        prefix: "t",
        name: "base32hexpad",
        alphabet: "0123456789abcdefghijklmnopqrstuv=",
        bitsPerChar: 5
      });
      base32hexpadupper = rfc4648({
        prefix: "T",
        name: "base32hexpadupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
        bitsPerChar: 5
      });
      base32z = rfc4648({
        prefix: "h",
        name: "base32z",
        alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
        bitsPerChar: 5
      });
    }
  });

  // ../node_modules/multiformats/esm/src/bases/base36.js
  var base36_exports = {};
  __export(base36_exports, {
    base36: () => base36,
    base36upper: () => base36upper
  });
  var base36, base36upper;
  var init_base36 = __esm({
    "../node_modules/multiformats/esm/src/bases/base36.js"() {
      init_base();
      base36 = baseX({
        prefix: "k",
        name: "base36",
        alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
      });
      base36upper = baseX({
        prefix: "K",
        name: "base36upper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      });
    }
  });

  // ../node_modules/multiformats/esm/src/bases/base58.js
  var base58_exports = {};
  __export(base58_exports, {
    base58btc: () => base58btc,
    base58flickr: () => base58flickr
  });
  var base58btc, base58flickr;
  var init_base58 = __esm({
    "../node_modules/multiformats/esm/src/bases/base58.js"() {
      init_base();
      base58btc = baseX({
        name: "base58btc",
        prefix: "z",
        alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
      });
      base58flickr = baseX({
        name: "base58flickr",
        prefix: "Z",
        alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
      });
    }
  });

  // ../node_modules/multiformats/esm/src/bases/base64.js
  var base64_exports = {};
  __export(base64_exports, {
    base64: () => base64,
    base64pad: () => base64pad,
    base64url: () => base64url,
    base64urlpad: () => base64urlpad
  });
  var base64, base64pad, base64url, base64urlpad;
  var init_base64 = __esm({
    "../node_modules/multiformats/esm/src/bases/base64.js"() {
      init_base();
      base64 = rfc4648({
        prefix: "m",
        name: "base64",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        bitsPerChar: 6
      });
      base64pad = rfc4648({
        prefix: "M",
        name: "base64pad",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        bitsPerChar: 6
      });
      base64url = rfc4648({
        prefix: "u",
        name: "base64url",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        bitsPerChar: 6
      });
      base64urlpad = rfc4648({
        prefix: "U",
        name: "base64urlpad",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
        bitsPerChar: 6
      });
    }
  });

  // ../node_modules/multiformats/esm/vendor/varint.js
  function encode2(num, out, offset) {
    out = out || [];
    offset = offset || 0;
    var oldOffset = offset;
    while (num >= INT) {
      out[offset++] = num & 255 | MSB;
      num /= 128;
    }
    while (num & MSBALL) {
      out[offset++] = num & 255 | MSB;
      num >>>= 7;
    }
    out[offset] = num | 0;
    encode2.bytes = offset - oldOffset + 1;
    return out;
  }
  function read(buf2, offset) {
    var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf2.length;
    do {
      if (counter >= l) {
        read.bytes = 0;
        throw new RangeError("Could not decode varint");
      }
      b = buf2[counter++];
      res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
      shift += 7;
    } while (b >= MSB$1);
    read.bytes = counter - offset;
    return res;
  }
  var encode_1, MSB, REST, MSBALL, INT, decode2, MSB$1, REST$1, N1, N2, N3, N4, N5, N6, N7, N8, N9, length, varint, _brrp_varint, varint_default;
  var init_varint = __esm({
    "../node_modules/multiformats/esm/vendor/varint.js"() {
      encode_1 = encode2;
      MSB = 128;
      REST = 127;
      MSBALL = ~REST;
      INT = Math.pow(2, 31);
      decode2 = read;
      MSB$1 = 128;
      REST$1 = 127;
      N1 = Math.pow(2, 7);
      N2 = Math.pow(2, 14);
      N3 = Math.pow(2, 21);
      N4 = Math.pow(2, 28);
      N5 = Math.pow(2, 35);
      N6 = Math.pow(2, 42);
      N7 = Math.pow(2, 49);
      N8 = Math.pow(2, 56);
      N9 = Math.pow(2, 63);
      length = function(value) {
        return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
      };
      varint = {
        encode: encode_1,
        decode: decode2,
        encodingLength: length
      };
      _brrp_varint = varint;
      varint_default = _brrp_varint;
    }
  });

  // ../node_modules/multiformats/esm/src/varint.js
  var decode3, encodeTo, encodingLength;
  var init_varint2 = __esm({
    "../node_modules/multiformats/esm/src/varint.js"() {
      init_varint();
      decode3 = (data) => {
        const code3 = varint_default.decode(data);
        return [
          code3,
          varint_default.decode.bytes
        ];
      };
      encodeTo = (int, target, offset = 0) => {
        varint_default.encode(int, target, offset);
        return target;
      };
      encodingLength = (int) => {
        return varint_default.encodingLength(int);
      };
    }
  });

  // ../node_modules/multiformats/esm/src/hashes/digest.js
  var create, decode4, equals2, Digest;
  var init_digest = __esm({
    "../node_modules/multiformats/esm/src/hashes/digest.js"() {
      init_bytes();
      init_varint2();
      create = (code3, digest2) => {
        const size = digest2.byteLength;
        const sizeOffset = encodingLength(code3);
        const digestOffset = sizeOffset + encodingLength(size);
        const bytes2 = new Uint8Array(digestOffset + size);
        encodeTo(code3, bytes2, 0);
        encodeTo(size, bytes2, sizeOffset);
        bytes2.set(digest2, digestOffset);
        return new Digest(code3, size, digest2, bytes2);
      };
      decode4 = (multihash) => {
        const bytes2 = coerce(multihash);
        const [code3, sizeOffset] = decode3(bytes2);
        const [size, digestOffset] = decode3(bytes2.subarray(sizeOffset));
        const digest2 = bytes2.subarray(sizeOffset + digestOffset);
        if (digest2.byteLength !== size) {
          throw new Error("Incorrect length");
        }
        return new Digest(code3, size, digest2, bytes2);
      };
      equals2 = (a, b) => {
        if (a === b) {
          return true;
        } else {
          return a.code === b.code && a.size === b.size && equals(a.bytes, b.bytes);
        }
      };
      Digest = class {
        constructor(code3, size, digest2, bytes2) {
          this.code = code3;
          this.size = size;
          this.digest = digest2;
          this.bytes = bytes2;
        }
      };
    }
  });

  // ../node_modules/multiformats/esm/src/hashes/hasher.js
  var from2, Hasher;
  var init_hasher = __esm({
    "../node_modules/multiformats/esm/src/hashes/hasher.js"() {
      init_digest();
      from2 = ({ name: name2, code: code3, encode: encode20 }) => new Hasher(name2, code3, encode20);
      Hasher = class {
        constructor(name2, code3, encode20) {
          this.name = name2;
          this.code = code3;
          this.encode = encode20;
        }
        digest(input) {
          if (input instanceof Uint8Array) {
            const result = this.encode(input);
            return result instanceof Uint8Array ? create(this.code, result) : result.then((digest2) => create(this.code, digest2));
          } else {
            throw Error("Unknown type, must be binary type");
          }
        }
      };
    }
  });

  // ../node_modules/multiformats/esm/src/hashes/sha2-browser.js
  var sha2_browser_exports = {};
  __export(sha2_browser_exports, {
    sha256: () => sha256,
    sha512: () => sha512
  });
  var sha, sha256, sha512;
  var init_sha2_browser = __esm({
    "../node_modules/multiformats/esm/src/hashes/sha2-browser.js"() {
      init_hasher();
      sha = (name2) => async (data) => new Uint8Array(await crypto.subtle.digest(name2, data));
      sha256 = from2({
        name: "sha2-256",
        code: 18,
        encode: sha("SHA-256")
      });
      sha512 = from2({
        name: "sha2-512",
        code: 19,
        encode: sha("SHA-512")
      });
    }
  });

  // ../node_modules/multiformats/esm/src/hashes/identity.js
  var identity_exports2 = {};
  __export(identity_exports2, {
    identity: () => identity2
  });
  var code, name, encode3, digest, identity2;
  var init_identity2 = __esm({
    "../node_modules/multiformats/esm/src/hashes/identity.js"() {
      init_bytes();
      init_digest();
      code = 0;
      name = "identity";
      encode3 = coerce;
      digest = (input) => create(code, encode3(input));
      identity2 = {
        code,
        name,
        encode: encode3,
        digest
      };
    }
  });

  // ../node_modules/multiformats/esm/src/codecs/raw.js
  var init_raw = __esm({
    "../node_modules/multiformats/esm/src/codecs/raw.js"() {
      init_bytes();
    }
  });

  // ../node_modules/multiformats/esm/src/codecs/json.js
  var textEncoder, textDecoder;
  var init_json = __esm({
    "../node_modules/multiformats/esm/src/codecs/json.js"() {
      textEncoder = new TextEncoder();
      textDecoder = new TextDecoder();
    }
  });

  // ../node_modules/multiformats/esm/src/cid.js
  var CID, parseCIDtoBytes, toStringV0, toStringV1, DAG_PB_CODE, SHA_256_CODE, encodeCID, cidSymbol, readonly, hidden, version, deprecate, IS_CID_DEPRECATION;
  var init_cid = __esm({
    "../node_modules/multiformats/esm/src/cid.js"() {
      init_varint2();
      init_digest();
      init_base58();
      init_base32();
      init_bytes();
      CID = class {
        constructor(version2, code3, multihash, bytes2) {
          this.code = code3;
          this.version = version2;
          this.multihash = multihash;
          this.bytes = bytes2;
          this.byteOffset = bytes2.byteOffset;
          this.byteLength = bytes2.byteLength;
          this.asCID = this;
          this._baseCache = /* @__PURE__ */ new Map();
          Object.defineProperties(this, {
            byteOffset: hidden,
            byteLength: hidden,
            code: readonly,
            version: readonly,
            multihash: readonly,
            bytes: readonly,
            _baseCache: hidden,
            asCID: hidden
          });
        }
        toV0() {
          switch (this.version) {
            case 0: {
              return this;
            }
            default: {
              const { code: code3, multihash } = this;
              if (code3 !== DAG_PB_CODE) {
                throw new Error("Cannot convert a non dag-pb CID to CIDv0");
              }
              if (multihash.code !== SHA_256_CODE) {
                throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
              }
              return CID.createV0(multihash);
            }
          }
        }
        toV1() {
          switch (this.version) {
            case 0: {
              const { code: code3, digest: digest2 } = this.multihash;
              const multihash = create(code3, digest2);
              return CID.createV1(this.code, multihash);
            }
            case 1: {
              return this;
            }
            default: {
              throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
            }
          }
        }
        equals(other) {
          return other && this.code === other.code && this.version === other.version && equals2(this.multihash, other.multihash);
        }
        toString(base3) {
          const { bytes: bytes2, version: version2, _baseCache } = this;
          switch (version2) {
            case 0:
              return toStringV0(bytes2, _baseCache, base3 || base58btc.encoder);
            default:
              return toStringV1(bytes2, _baseCache, base3 || base32.encoder);
          }
        }
        toJSON() {
          return {
            code: this.code,
            version: this.version,
            hash: this.multihash.bytes
          };
        }
        get [Symbol.toStringTag]() {
          return "CID";
        }
        [Symbol.for("nodejs.util.inspect.custom")]() {
          return "CID(" + this.toString() + ")";
        }
        static isCID(value) {
          deprecate(/^0\.0/, IS_CID_DEPRECATION);
          return !!(value && (value[cidSymbol] || value.asCID === value));
        }
        get toBaseEncodedString() {
          throw new Error("Deprecated, use .toString()");
        }
        get codec() {
          throw new Error('"codec" property is deprecated, use integer "code" property instead');
        }
        get buffer() {
          throw new Error("Deprecated .buffer property, use .bytes to get Uint8Array instead");
        }
        get multibaseName() {
          throw new Error('"multibaseName" property is deprecated');
        }
        get prefix() {
          throw new Error('"prefix" property is deprecated');
        }
        static asCID(value) {
          if (value instanceof CID) {
            return value;
          } else if (value != null && value.asCID === value) {
            const { version: version2, code: code3, multihash, bytes: bytes2 } = value;
            return new CID(version2, code3, multihash, bytes2 || encodeCID(version2, code3, multihash.bytes));
          } else if (value != null && value[cidSymbol] === true) {
            const { version: version2, multihash, code: code3 } = value;
            const digest2 = decode4(multihash);
            return CID.create(version2, code3, digest2);
          } else {
            return null;
          }
        }
        static create(version2, code3, digest2) {
          if (typeof code3 !== "number") {
            throw new Error("String codecs are no longer supported");
          }
          switch (version2) {
            case 0: {
              if (code3 !== DAG_PB_CODE) {
                throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
              } else {
                return new CID(version2, code3, digest2, digest2.bytes);
              }
            }
            case 1: {
              const bytes2 = encodeCID(version2, code3, digest2.bytes);
              return new CID(version2, code3, digest2, bytes2);
            }
            default: {
              throw new Error("Invalid version");
            }
          }
        }
        static createV0(digest2) {
          return CID.create(0, DAG_PB_CODE, digest2);
        }
        static createV1(code3, digest2) {
          return CID.create(1, code3, digest2);
        }
        static decode(bytes2) {
          const [cid, remainder] = CID.decodeFirst(bytes2);
          if (remainder.length) {
            throw new Error("Incorrect length");
          }
          return cid;
        }
        static decodeFirst(bytes2) {
          const specs = CID.inspectBytes(bytes2);
          const prefixSize = specs.size - specs.multihashSize;
          const multihashBytes = coerce(bytes2.subarray(prefixSize, prefixSize + specs.multihashSize));
          if (multihashBytes.byteLength !== specs.multihashSize) {
            throw new Error("Incorrect length");
          }
          const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
          const digest2 = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
          const cid = specs.version === 0 ? CID.createV0(digest2) : CID.createV1(specs.codec, digest2);
          return [
            cid,
            bytes2.subarray(specs.size)
          ];
        }
        static inspectBytes(initialBytes) {
          let offset = 0;
          const next = () => {
            const [i, length2] = decode3(initialBytes.subarray(offset));
            offset += length2;
            return i;
          };
          let version2 = next();
          let codec = DAG_PB_CODE;
          if (version2 === 18) {
            version2 = 0;
            offset = 0;
          } else if (version2 === 1) {
            codec = next();
          }
          if (version2 !== 0 && version2 !== 1) {
            throw new RangeError(`Invalid CID version ${version2}`);
          }
          const prefixSize = offset;
          const multihashCode = next();
          const digestSize = next();
          const size = offset + digestSize;
          const multihashSize = size - prefixSize;
          return {
            version: version2,
            codec,
            multihashCode,
            digestSize,
            multihashSize,
            size
          };
        }
        static parse(source, base3) {
          const [prefix, bytes2] = parseCIDtoBytes(source, base3);
          const cid = CID.decode(bytes2);
          cid._baseCache.set(prefix, source);
          return cid;
        }
      };
      parseCIDtoBytes = (source, base3) => {
        switch (source[0]) {
          case "Q": {
            const decoder = base3 || base58btc;
            return [
              base58btc.prefix,
              decoder.decode(`${base58btc.prefix}${source}`)
            ];
          }
          case base58btc.prefix: {
            const decoder = base3 || base58btc;
            return [
              base58btc.prefix,
              decoder.decode(source)
            ];
          }
          case base32.prefix: {
            const decoder = base3 || base32;
            return [
              base32.prefix,
              decoder.decode(source)
            ];
          }
          default: {
            if (base3 == null) {
              throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
            }
            return [
              source[0],
              base3.decode(source)
            ];
          }
        }
      };
      toStringV0 = (bytes2, cache, base3) => {
        const { prefix } = base3;
        if (prefix !== base58btc.prefix) {
          throw Error(`Cannot string encode V0 in ${base3.name} encoding`);
        }
        const cid = cache.get(prefix);
        if (cid == null) {
          const cid2 = base3.encode(bytes2).slice(1);
          cache.set(prefix, cid2);
          return cid2;
        } else {
          return cid;
        }
      };
      toStringV1 = (bytes2, cache, base3) => {
        const { prefix } = base3;
        const cid = cache.get(prefix);
        if (cid == null) {
          const cid2 = base3.encode(bytes2);
          cache.set(prefix, cid2);
          return cid2;
        } else {
          return cid;
        }
      };
      DAG_PB_CODE = 112;
      SHA_256_CODE = 18;
      encodeCID = (version2, code3, multihash) => {
        const codeOffset = encodingLength(version2);
        const hashOffset = codeOffset + encodingLength(code3);
        const bytes2 = new Uint8Array(hashOffset + multihash.byteLength);
        encodeTo(version2, bytes2, 0);
        encodeTo(code3, bytes2, codeOffset);
        bytes2.set(multihash, hashOffset);
        return bytes2;
      };
      cidSymbol = Symbol.for("@ipld/js-cid/CID");
      readonly = {
        writable: false,
        configurable: false,
        enumerable: true
      };
      hidden = {
        writable: false,
        enumerable: false,
        configurable: false
      };
      version = "0.0.0-dev";
      deprecate = (range, message2) => {
        if (range.test(version)) {
          console.warn(message2);
        } else {
          throw new Error(message2);
        }
      };
      IS_CID_DEPRECATION = `CID.isCID(v) is deprecated and will be removed in the next major release.
Following code pattern:

if (CID.isCID(value)) {
  doSomethingWithCID(value)
}

Is replaced with:

const cid = CID.asCID(value)
if (cid) {
  // Make sure to use cid instead of value
  doSomethingWithCID(cid)
}
`;
    }
  });

  // ../node_modules/multiformats/esm/src/index.js
  var init_src = __esm({
    "../node_modules/multiformats/esm/src/index.js"() {
      init_cid();
      init_varint2();
      init_bytes();
      init_hasher();
      init_digest();
    }
  });

  // ../node_modules/multiformats/esm/src/basics.js
  var bases, hashes;
  var init_basics = __esm({
    "../node_modules/multiformats/esm/src/basics.js"() {
      init_identity();
      init_base2();
      init_base8();
      init_base10();
      init_base16();
      init_base32();
      init_base36();
      init_base58();
      init_base64();
      init_sha2_browser();
      init_identity2();
      init_raw();
      init_json();
      init_src();
      bases = {
        ...identity_exports,
        ...base2_exports,
        ...base8_exports,
        ...base10_exports,
        ...base16_exports,
        ...base32_exports,
        ...base36_exports,
        ...base58_exports,
        ...base64_exports
      };
      hashes = {
        ...sha2_browser_exports,
        ...identity_exports2
      };
    }
  });

  // ../node_modules/uint8arrays/esm/src/util/bases.js
  function createCodec(name2, prefix, encode20, decode21) {
    return {
      name: name2,
      prefix,
      encoder: {
        name: name2,
        prefix,
        encode: encode20
      },
      decoder: { decode: decode21 }
    };
  }
  var string, ascii, BASES, bases_default;
  var init_bases = __esm({
    "../node_modules/uint8arrays/esm/src/util/bases.js"() {
      init_basics();
      string = createCodec("utf8", "u", (buf2) => {
        const decoder = new TextDecoder("utf8");
        return "u" + decoder.decode(buf2);
      }, (str) => {
        const encoder = new TextEncoder();
        return encoder.encode(str.substring(1));
      });
      ascii = createCodec("ascii", "a", (buf2) => {
        let string3 = "a";
        for (let i = 0; i < buf2.length; i++) {
          string3 += String.fromCharCode(buf2[i]);
        }
        return string3;
      }, (str) => {
        str = str.substring(1);
        const buf2 = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
          buf2[i] = str.charCodeAt(i);
        }
        return buf2;
      });
      BASES = {
        utf8: string,
        "utf-8": string,
        hex: bases.base16,
        latin1: ascii,
        ascii,
        binary: ascii,
        ...bases
      };
      bases_default = BASES;
    }
  });

  // ../node_modules/uint8arrays/esm/src/from-string.js
  var from_string_exports = {};
  __export(from_string_exports, {
    fromString: () => fromString2
  });
  function fromString2(string3, encoding = "utf8") {
    const base3 = bases_default[encoding];
    if (!base3) {
      throw new Error(`Unsupported encoding "${encoding}"`);
    }
    return base3.decoder.decode(`${base3.prefix}${string3}`);
  }
  var init_from_string = __esm({
    "../node_modules/uint8arrays/esm/src/from-string.js"() {
      init_bases();
    }
  });

  // ../node_modules/uint8arrays/esm/src/to-string.js
  var to_string_exports = {};
  __export(to_string_exports, {
    toString: () => toString2
  });
  function toString2(array, encoding = "utf8") {
    const base3 = bases_default[encoding];
    if (!base3) {
      throw new Error(`Unsupported encoding "${encoding}"`);
    }
    return base3.encoder.encode(array).substring(1);
  }
  var init_to_string = __esm({
    "../node_modules/uint8arrays/esm/src/to-string.js"() {
      init_bases();
    }
  });

  // ../node_modules/timestamp-nano/timestamp.js
  var require_timestamp = __commonJS({
    "../node_modules/timestamp-nano/timestamp.js"(exports2, module2) {
      var Timestamp = function() {
        if (typeof module2 !== "undefined")
          module2.exports = Timestamp2;
        var SEC_DAY = 24 * 3600;
        var YEAR_SLOT = 3200;
        var DAY_SLOT = (365 * 400 + 97) * YEAR_SLOT / 400;
        var SEC_SLOT = SEC_DAY * DAY_SLOT;
        var MSEC_SLOT = SEC_SLOT * 1e3;
        var MAX_MSEC = 1e3 * 1e4 * 1e4 * SEC_DAY;
        var BIT24 = 16777216;
        var BIT32 = 65536 * 65536;
        var DEC6 = 1e3 * 1e3;
        var DEC9 = 1e3 * 1e3 * 1e3;
        var ZERO9 = "000000000";
        var trunc = Math.trunc || Math_trunc;
        var P = Timestamp2.prototype;
        Timestamp2.fromDate = fromDate;
        Timestamp2.fromInt64BE = buildFromInt64(0, 1, 2, 3, 0, 4);
        Timestamp2.fromInt64LE = buildFromInt64(3, 2, 1, 0, 4, 0);
        Timestamp2.fromString = fromString4;
        Timestamp2.fromTimeT = fromTimeT;
        P.year = 0;
        P.time = 0;
        P.nano = 0;
        P.addNano = addNano;
        P.getNano = getNano;
        P.getTimeT = getTimeT;
        P.getYear = getYear;
        P.toDate = toDate;
        P.toJSON = toJSON;
        P.toString = toString4;
        P.writeInt64BE = buildWriteInt64(0, 1, 2, 3, 0, 4);
        P.writeInt64LE = buildWriteInt64(3, 2, 1, 0, 4, 0);
        var FMT_JSON = "%Y-%m-%dT%H:%M:%S.%NZ";
        var FMT_MONTH = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];
        var FMT_DAY = [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat"
        ];
        var FMT_STRING = {
          "%": "%",
          F: "%Y-%m-%d",
          n: "\n",
          R: "%H:%M",
          T: "%H:%M:%S",
          t: "	",
          X: "%T",
          Z: "GMT",
          z: "+0000"
        };
        return Timestamp2;
        function Timestamp2(time, nano, year) {
          var ts = this;
          if (!(ts instanceof Timestamp2))
            return new Timestamp2(time, nano, year);
          ts.time = +time || 0;
          ts.nano = +nano || 0;
          ts.year = +year || 0;
          normalize(ts);
        }
        function getYear() {
          var year = this.toDate().getUTCFullYear();
          return year + this.year;
        }
        function normalize(ts) {
          var year = ts.year;
          var time = ts.time;
          var nano = ts.nano;
          var changed;
          var slot;
          if (nano < 0 || DEC6 <= nano) {
            var n = Math.floor(nano / DEC6);
            nano -= n * DEC6;
            time += n;
            changed = 1;
          }
          var y = year % YEAR_SLOT;
          if (time < -MAX_MSEC || MAX_MSEC < time || y) {
            slot = trunc(time / MSEC_SLOT);
            if (slot) {
              year += slot * YEAR_SLOT;
              time -= slot * MSEC_SLOT;
            }
            var dt = newDate(time);
            dt.setUTCFullYear(y + dt.getUTCFullYear());
            year -= y;
            time = +dt;
            slot = trunc(year / YEAR_SLOT);
            var total = time + slot * MSEC_SLOT;
            if (slot && -MAX_MSEC <= total && total <= MAX_MSEC) {
              year -= slot * YEAR_SLOT;
              time = total;
            }
            changed = 1;
          }
          if (changed) {
            ts.year = year;
            ts.time = time;
            ts.nano = nano;
          }
          return ts;
        }
        function toDate() {
          var ts = normalize(this);
          return newDate(ts.time);
        }
        function newDate(time) {
          var dt = new Date(0);
          dt.setTime(time);
          return dt;
        }
        function addNano(nano) {
          this.nano += +nano || 0;
          return this;
        }
        function getNano() {
          var ts = normalize(this);
          return (ts.time % 1e3 * DEC6 + +ts.nano + DEC9) % DEC9;
        }
        function fromString4(string3) {
          var time;
          var ts = new Timestamp2();
          string3 += "";
          var array = string3.replace(/^\s*[+\-]?\d+/, function(match) {
            var year = +match;
            var y = 1970 + (year - 1970) % 400;
            ts.year = year - y;
            return y;
          }).replace(/(?:Z|([+\-]\d{2}):?(\d{2}))$/, function(match, hour, min) {
            if (hour < 0)
              min *= -1;
            time = (+hour * 60 + +min) * 6e4;
            return "";
          }).replace(/\.\d+$/, function(match) {
            ts.nano = +(match + ZERO9).substr(1, 9);
            return "";
          }).split(/\D+/);
          if (array.length > 1) {
            array[1]--;
          } else {
            array[1] = 0;
          }
          ts.time = time = Date.UTC.apply(Date, array) - (time || 0);
          if (isNaN(time)) {
            throw new TypeError("Invalid Date");
          }
          return normalize(ts);
        }
        function fromDate(date) {
          return new Timestamp2(+date);
        }
        function fromTimeT(time) {
          return fromTime(time, 0);
        }
        function fromTime(low, high) {
          high |= 0;
          high *= BIT32;
          low = +low || 0;
          var slot = trunc(high / SEC_SLOT) + trunc(low / SEC_SLOT);
          var second = high % SEC_SLOT + low % SEC_SLOT;
          var offset = trunc(second / SEC_SLOT);
          if (offset) {
            slot += offset;
            second -= offset * SEC_SLOT;
          }
          return new Timestamp2(second * 1e3, 0, slot * YEAR_SLOT);
        }
        function getTimeT() {
          var ts = normalize(this);
          var time = Math.floor(ts.time / 1e3);
          var year = ts.year;
          if (year)
            time += year * DAY_SLOT * SEC_DAY / YEAR_SLOT;
          return time;
        }
        function toJSON() {
          return this.toString().replace(/0{1,6}Z$/, "Z");
        }
        function toString4(format) {
          var ts = this;
          var dt = ts.toDate();
          var map = {
            H,
            L,
            M,
            N,
            S,
            Y,
            a,
            b,
            d,
            e,
            m
          };
          return strftime(format || FMT_JSON);
          function strftime(format2) {
            return format2.replace(/%./g, function(match) {
              var m2 = match[1];
              var c = FMT_STRING[m2];
              var f = map[m2];
              return c ? strftime(c) : f ? f() : match;
            });
          }
          function Y() {
            var year = ts.getYear();
            if (year > 999999) {
              return "+" + year;
            } else if (year > 9999) {
              return "+" + pad(year, 6);
            } else if (year >= 0) {
              return pad(year, 4);
            } else if (year >= -999999) {
              return "-" + pad(-year, 6);
            } else {
              return year;
            }
          }
          function m() {
            return pad2(dt.getUTCMonth() + 1);
          }
          function d() {
            return pad2(dt.getUTCDate());
          }
          function e() {
            return padS(dt.getUTCDate());
          }
          function H() {
            return pad2(dt.getUTCHours());
          }
          function M() {
            return pad2(dt.getUTCMinutes());
          }
          function S() {
            return pad2(dt.getUTCSeconds());
          }
          function L() {
            return pad(dt.getUTCMilliseconds(), 3);
          }
          function N() {
            return pad(ts.getNano(), 9);
          }
          function a() {
            return FMT_DAY[dt.getUTCDay()];
          }
          function b() {
            return FMT_MONTH[dt.getUTCMonth()];
          }
        }
        function buildWriteInt64(pos0, pos1, pos2, pos3, posH, posL) {
          return writeInt64;
          function writeInt64(buffer2, offset) {
            var ts = normalize(this);
            if (!buffer2)
              buffer2 = new Array(8);
            checkRange(buffer2, offset |= 0);
            var second = Math.floor(ts.time / 1e3);
            var day = ts.year * (DAY_SLOT * SEC_DAY / YEAR_SLOT);
            var high = trunc(day / BIT32) + trunc(second / BIT32);
            var low = day % BIT32 + second % BIT32;
            var slot = Math.floor(low / BIT32);
            if (slot) {
              high += slot;
              low -= slot * BIT32;
            }
            writeUint32(buffer2, offset + posH, high);
            writeUint32(buffer2, offset + posL, low);
            return buffer2;
          }
          function writeUint32(buffer2, offset, value) {
            buffer2[offset + pos0] = value >> 24 & 255;
            buffer2[offset + pos1] = value >> 16 & 255;
            buffer2[offset + pos2] = value >> 8 & 255;
            buffer2[offset + pos3] = value & 255;
          }
        }
        function buildFromInt64(pos0, pos1, pos2, pos3, posH, posL) {
          return fromInt64;
          function fromInt64(buffer2, offset) {
            checkRange(buffer2, offset |= 0);
            var high = readUint322(buffer2, offset + posH);
            var low = readUint322(buffer2, offset + posL);
            return fromTime(low, high);
          }
          function readUint322(buffer2, offset) {
            return buffer2[offset + pos0] * BIT24 + (buffer2[offset + pos1] << 16 | buffer2[offset + pos2] << 8 | buffer2[offset + pos3]);
          }
        }
        function checkRange(buffer2, offset) {
          var last = buffer2 && buffer2.length;
          if (last == null)
            throw new TypeError("Invalid Buffer");
          if (last < offset + 8)
            throw new RangeError("Out of range");
        }
        function Math_trunc(x) {
          var n = x - x % 1;
          return n === 0 && (x < 0 || x === 0 && 1 / x !== 1 / 0) ? -0 : n;
        }
        function padS(v) {
          return (v > 9 ? "" : " ") + (v | 0);
        }
        function pad2(v) {
          return (v > 9 ? "" : "0") + (v | 0);
        }
        function pad(v, len) {
          return (ZERO9 + (v | 0)).substr(-len);
        }
      }();
    }
  });

  // ../node_modules/uint8arrays/esm/src/concat.js
  var concat_exports = {};
  __export(concat_exports, {
    concat: () => concat
  });
  function concat(arrays, length2) {
    if (!length2) {
      length2 = arrays.reduce((acc, curr) => acc + curr.length, 0);
    }
    const output = new Uint8Array(length2);
    let offset = 0;
    for (const arr of arrays) {
      output.set(arr, offset);
      offset += arr.length;
    }
    return output;
  }
  var init_concat = __esm({
    "../node_modules/uint8arrays/esm/src/concat.js"() {
    }
  });

  // ../node_modules/uint8arrays/esm/src/equals.js
  var equals_exports = {};
  __export(equals_exports, {
    equals: () => equals3
  });
  function equals3(a, b) {
    if (a === b) {
      return true;
    }
    if (a.byteLength !== b.byteLength) {
      return false;
    }
    for (let i = 0; i < a.byteLength; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  var init_equals = __esm({
    "../node_modules/uint8arrays/esm/src/equals.js"() {
    }
  });

  // ../node_modules/node-forge/lib/forge.js
  var require_forge = __commonJS({
    "../node_modules/node-forge/lib/forge.js"(exports2, module2) {
      module2.exports = {
        options: {
          usePureJavaScript: false
        }
      };
    }
  });

  // ../node_modules/node-forge/lib/baseN.js
  var require_baseN = __commonJS({
    "../node_modules/node-forge/lib/baseN.js"(exports2, module2) {
      var api = {};
      module2.exports = api;
      var _reverseAlphabets = {};
      api.encode = function(input, alphabet, maxline) {
        if (typeof alphabet !== "string") {
          throw new TypeError('"alphabet" must be a string.');
        }
        if (maxline !== void 0 && typeof maxline !== "number") {
          throw new TypeError('"maxline" must be a number.');
        }
        var output = "";
        if (!(input instanceof Uint8Array)) {
          output = _encodeWithByteBuffer(input, alphabet);
        } else {
          var i = 0;
          var base3 = alphabet.length;
          var first = alphabet.charAt(0);
          var digits = [0];
          for (i = 0; i < input.length; ++i) {
            for (var j = 0, carry = input[i]; j < digits.length; ++j) {
              carry += digits[j] << 8;
              digits[j] = carry % base3;
              carry = carry / base3 | 0;
            }
            while (carry > 0) {
              digits.push(carry % base3);
              carry = carry / base3 | 0;
            }
          }
          for (i = 0; input[i] === 0 && i < input.length - 1; ++i) {
            output += first;
          }
          for (i = digits.length - 1; i >= 0; --i) {
            output += alphabet[digits[i]];
          }
        }
        if (maxline) {
          var regex = new RegExp(".{1," + maxline + "}", "g");
          output = output.match(regex).join("\r\n");
        }
        return output;
      };
      api.decode = function(input, alphabet) {
        if (typeof input !== "string") {
          throw new TypeError('"input" must be a string.');
        }
        if (typeof alphabet !== "string") {
          throw new TypeError('"alphabet" must be a string.');
        }
        var table = _reverseAlphabets[alphabet];
        if (!table) {
          table = _reverseAlphabets[alphabet] = [];
          for (var i = 0; i < alphabet.length; ++i) {
            table[alphabet.charCodeAt(i)] = i;
          }
        }
        input = input.replace(/\s/g, "");
        var base3 = alphabet.length;
        var first = alphabet.charAt(0);
        var bytes2 = [0];
        for (var i = 0; i < input.length; i++) {
          var value = table[input.charCodeAt(i)];
          if (value === void 0) {
            return;
          }
          for (var j = 0, carry = value; j < bytes2.length; ++j) {
            carry += bytes2[j] * base3;
            bytes2[j] = carry & 255;
            carry >>= 8;
          }
          while (carry > 0) {
            bytes2.push(carry & 255);
            carry >>= 8;
          }
        }
        for (var k = 0; input[k] === first && k < input.length - 1; ++k) {
          bytes2.push(0);
        }
        if (typeof Buffer !== "undefined") {
          return Buffer.from(bytes2.reverse());
        }
        return new Uint8Array(bytes2.reverse());
      };
      function _encodeWithByteBuffer(input, alphabet) {
        var i = 0;
        var base3 = alphabet.length;
        var first = alphabet.charAt(0);
        var digits = [0];
        for (i = 0; i < input.length(); ++i) {
          for (var j = 0, carry = input.at(i); j < digits.length; ++j) {
            carry += digits[j] << 8;
            digits[j] = carry % base3;
            carry = carry / base3 | 0;
          }
          while (carry > 0) {
            digits.push(carry % base3);
            carry = carry / base3 | 0;
          }
        }
        var output = "";
        for (i = 0; input.at(i) === 0 && i < input.length() - 1; ++i) {
          output += first;
        }
        for (i = digits.length - 1; i >= 0; --i) {
          output += alphabet[digits[i]];
        }
        return output;
      }
    }
  });

  // ../node_modules/node-forge/lib/util.js
  var require_util = __commonJS({
    "../node_modules/node-forge/lib/util.js"(exports2, module2) {
      var forge6 = require_forge();
      var baseN = require_baseN();
      var util = module2.exports = forge6.util = forge6.util || {};
      (function() {
        if (typeof process !== "undefined" && process.nextTick && !process.browser) {
          util.nextTick = process.nextTick;
          if (typeof setImmediate === "function") {
            util.setImmediate = setImmediate;
          } else {
            util.setImmediate = util.nextTick;
          }
          return;
        }
        if (typeof setImmediate === "function") {
          util.setImmediate = function() {
            return setImmediate.apply(void 0, arguments);
          };
          util.nextTick = function(callback) {
            return setImmediate(callback);
          };
          return;
        }
        util.setImmediate = function(callback) {
          setTimeout(callback, 0);
        };
        if (typeof window !== "undefined" && typeof window.postMessage === "function") {
          let handler2 = function(event) {
            if (event.source === window && event.data === msg) {
              event.stopPropagation();
              var copy = callbacks.slice();
              callbacks.length = 0;
              copy.forEach(function(callback) {
                callback();
              });
            }
          };
          var handler = handler2;
          var msg = "forge.setImmediate";
          var callbacks = [];
          util.setImmediate = function(callback) {
            callbacks.push(callback);
            if (callbacks.length === 1) {
              window.postMessage(msg, "*");
            }
          };
          window.addEventListener("message", handler2, true);
        }
        if (typeof MutationObserver !== "undefined") {
          var now = Date.now();
          var attr = true;
          var div = document.createElement("div");
          var callbacks = [];
          new MutationObserver(function() {
            var copy = callbacks.slice();
            callbacks.length = 0;
            copy.forEach(function(callback) {
              callback();
            });
          }).observe(div, { attributes: true });
          var oldSetImmediate = util.setImmediate;
          util.setImmediate = function(callback) {
            if (Date.now() - now > 15) {
              now = Date.now();
              oldSetImmediate(callback);
            } else {
              callbacks.push(callback);
              if (callbacks.length === 1) {
                div.setAttribute("a", attr = !attr);
              }
            }
          };
        }
        util.nextTick = util.setImmediate;
      })();
      util.isNodejs = typeof process !== "undefined" && process.versions && process.versions.node;
      util.globalScope = function() {
        if (util.isNodejs) {
          return global;
        }
        return typeof self === "undefined" ? window : self;
      }();
      util.isArray = Array.isArray || function(x) {
        return Object.prototype.toString.call(x) === "[object Array]";
      };
      util.isArrayBuffer = function(x) {
        return typeof ArrayBuffer !== "undefined" && x instanceof ArrayBuffer;
      };
      util.isArrayBufferView = function(x) {
        return x && util.isArrayBuffer(x.buffer) && x.byteLength !== void 0;
      };
      function _checkBitsParam(n) {
        if (!(n === 8 || n === 16 || n === 24 || n === 32)) {
          throw new Error("Only 8, 16, 24, or 32 bits supported: " + n);
        }
      }
      util.ByteBuffer = ByteStringBuffer;
      function ByteStringBuffer(b) {
        this.data = "";
        this.read = 0;
        if (typeof b === "string") {
          this.data = b;
        } else if (util.isArrayBuffer(b) || util.isArrayBufferView(b)) {
          if (typeof Buffer !== "undefined" && b instanceof Buffer) {
            this.data = b.toString("binary");
          } else {
            var arr = new Uint8Array(b);
            try {
              this.data = String.fromCharCode.apply(null, arr);
            } catch (e) {
              for (var i = 0; i < arr.length; ++i) {
                this.putByte(arr[i]);
              }
            }
          }
        } else if (b instanceof ByteStringBuffer || typeof b === "object" && typeof b.data === "string" && typeof b.read === "number") {
          this.data = b.data;
          this.read = b.read;
        }
        this._constructedStringLength = 0;
      }
      util.ByteStringBuffer = ByteStringBuffer;
      var _MAX_CONSTRUCTED_STRING_LENGTH = 4096;
      util.ByteStringBuffer.prototype._optimizeConstructedString = function(x) {
        this._constructedStringLength += x;
        if (this._constructedStringLength > _MAX_CONSTRUCTED_STRING_LENGTH) {
          this.data.substr(0, 1);
          this._constructedStringLength = 0;
        }
      };
      util.ByteStringBuffer.prototype.length = function() {
        return this.data.length - this.read;
      };
      util.ByteStringBuffer.prototype.isEmpty = function() {
        return this.length() <= 0;
      };
      util.ByteStringBuffer.prototype.putByte = function(b) {
        return this.putBytes(String.fromCharCode(b));
      };
      util.ByteStringBuffer.prototype.fillWithByte = function(b, n) {
        b = String.fromCharCode(b);
        var d = this.data;
        while (n > 0) {
          if (n & 1) {
            d += b;
          }
          n >>>= 1;
          if (n > 0) {
            b += b;
          }
        }
        this.data = d;
        this._optimizeConstructedString(n);
        return this;
      };
      util.ByteStringBuffer.prototype.putBytes = function(bytes2) {
        this.data += bytes2;
        this._optimizeConstructedString(bytes2.length);
        return this;
      };
      util.ByteStringBuffer.prototype.putString = function(str) {
        return this.putBytes(util.encodeUtf8(str));
      };
      util.ByteStringBuffer.prototype.putInt16 = function(i) {
        return this.putBytes(String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
      };
      util.ByteStringBuffer.prototype.putInt24 = function(i) {
        return this.putBytes(String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
      };
      util.ByteStringBuffer.prototype.putInt32 = function(i) {
        return this.putBytes(String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
      };
      util.ByteStringBuffer.prototype.putInt16Le = function(i) {
        return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255));
      };
      util.ByteStringBuffer.prototype.putInt24Le = function(i) {
        return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255));
      };
      util.ByteStringBuffer.prototype.putInt32Le = function(i) {
        return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 24 & 255));
      };
      util.ByteStringBuffer.prototype.putInt = function(i, n) {
        _checkBitsParam(n);
        var bytes2 = "";
        do {
          n -= 8;
          bytes2 += String.fromCharCode(i >> n & 255);
        } while (n > 0);
        return this.putBytes(bytes2);
      };
      util.ByteStringBuffer.prototype.putSignedInt = function(i, n) {
        if (i < 0) {
          i += 2 << n - 1;
        }
        return this.putInt(i, n);
      };
      util.ByteStringBuffer.prototype.putBuffer = function(buffer2) {
        return this.putBytes(buffer2.getBytes());
      };
      util.ByteStringBuffer.prototype.getByte = function() {
        return this.data.charCodeAt(this.read++);
      };
      util.ByteStringBuffer.prototype.getInt16 = function() {
        var rval = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
        this.read += 2;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt24 = function() {
        var rval = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
        this.read += 3;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt32 = function() {
        var rval = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
        this.read += 4;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt16Le = function() {
        var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
        this.read += 2;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt24Le = function() {
        var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
        this.read += 3;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt32Le = function() {
        var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
        this.read += 4;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt = function(n) {
        _checkBitsParam(n);
        var rval = 0;
        do {
          rval = (rval << 8) + this.data.charCodeAt(this.read++);
          n -= 8;
        } while (n > 0);
        return rval;
      };
      util.ByteStringBuffer.prototype.getSignedInt = function(n) {
        var x = this.getInt(n);
        var max = 2 << n - 2;
        if (x >= max) {
          x -= max << 1;
        }
        return x;
      };
      util.ByteStringBuffer.prototype.getBytes = function(count) {
        var rval;
        if (count) {
          count = Math.min(this.length(), count);
          rval = this.data.slice(this.read, this.read + count);
          this.read += count;
        } else if (count === 0) {
          rval = "";
        } else {
          rval = this.read === 0 ? this.data : this.data.slice(this.read);
          this.clear();
        }
        return rval;
      };
      util.ByteStringBuffer.prototype.bytes = function(count) {
        return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
      };
      util.ByteStringBuffer.prototype.at = function(i) {
        return this.data.charCodeAt(this.read + i);
      };
      util.ByteStringBuffer.prototype.setAt = function(i, b) {
        this.data = this.data.substr(0, this.read + i) + String.fromCharCode(b) + this.data.substr(this.read + i + 1);
        return this;
      };
      util.ByteStringBuffer.prototype.last = function() {
        return this.data.charCodeAt(this.data.length - 1);
      };
      util.ByteStringBuffer.prototype.copy = function() {
        var c = util.createBuffer(this.data);
        c.read = this.read;
        return c;
      };
      util.ByteStringBuffer.prototype.compact = function() {
        if (this.read > 0) {
          this.data = this.data.slice(this.read);
          this.read = 0;
        }
        return this;
      };
      util.ByteStringBuffer.prototype.clear = function() {
        this.data = "";
        this.read = 0;
        return this;
      };
      util.ByteStringBuffer.prototype.truncate = function(count) {
        var len = Math.max(0, this.length() - count);
        this.data = this.data.substr(this.read, len);
        this.read = 0;
        return this;
      };
      util.ByteStringBuffer.prototype.toHex = function() {
        var rval = "";
        for (var i = this.read; i < this.data.length; ++i) {
          var b = this.data.charCodeAt(i);
          if (b < 16) {
            rval += "0";
          }
          rval += b.toString(16);
        }
        return rval;
      };
      util.ByteStringBuffer.prototype.toString = function() {
        return util.decodeUtf8(this.bytes());
      };
      function DataBuffer(b, options) {
        options = options || {};
        this.read = options.readOffset || 0;
        this.growSize = options.growSize || 1024;
        var isArrayBuffer = util.isArrayBuffer(b);
        var isArrayBufferView = util.isArrayBufferView(b);
        if (isArrayBuffer || isArrayBufferView) {
          if (isArrayBuffer) {
            this.data = new DataView(b);
          } else {
            this.data = new DataView(b.buffer, b.byteOffset, b.byteLength);
          }
          this.write = "writeOffset" in options ? options.writeOffset : this.data.byteLength;
          return;
        }
        this.data = new DataView(new ArrayBuffer(0));
        this.write = 0;
        if (b !== null && b !== void 0) {
          this.putBytes(b);
        }
        if ("writeOffset" in options) {
          this.write = options.writeOffset;
        }
      }
      util.DataBuffer = DataBuffer;
      util.DataBuffer.prototype.length = function() {
        return this.write - this.read;
      };
      util.DataBuffer.prototype.isEmpty = function() {
        return this.length() <= 0;
      };
      util.DataBuffer.prototype.accommodate = function(amount, growSize) {
        if (this.length() >= amount) {
          return this;
        }
        growSize = Math.max(growSize || this.growSize, amount);
        var src2 = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength);
        var dst = new Uint8Array(this.length() + growSize);
        dst.set(src2);
        this.data = new DataView(dst.buffer);
        return this;
      };
      util.DataBuffer.prototype.putByte = function(b) {
        this.accommodate(1);
        this.data.setUint8(this.write++, b);
        return this;
      };
      util.DataBuffer.prototype.fillWithByte = function(b, n) {
        this.accommodate(n);
        for (var i = 0; i < n; ++i) {
          this.data.setUint8(b);
        }
        return this;
      };
      util.DataBuffer.prototype.putBytes = function(bytes2, encoding) {
        if (util.isArrayBufferView(bytes2)) {
          var src2 = new Uint8Array(bytes2.buffer, bytes2.byteOffset, bytes2.byteLength);
          var len = src2.byteLength - src2.byteOffset;
          this.accommodate(len);
          var dst = new Uint8Array(this.data.buffer, this.write);
          dst.set(src2);
          this.write += len;
          return this;
        }
        if (util.isArrayBuffer(bytes2)) {
          var src2 = new Uint8Array(bytes2);
          this.accommodate(src2.byteLength);
          var dst = new Uint8Array(this.data.buffer);
          dst.set(src2, this.write);
          this.write += src2.byteLength;
          return this;
        }
        if (bytes2 instanceof util.DataBuffer || typeof bytes2 === "object" && typeof bytes2.read === "number" && typeof bytes2.write === "number" && util.isArrayBufferView(bytes2.data)) {
          var src2 = new Uint8Array(bytes2.data.byteLength, bytes2.read, bytes2.length());
          this.accommodate(src2.byteLength);
          var dst = new Uint8Array(bytes2.data.byteLength, this.write);
          dst.set(src2);
          this.write += src2.byteLength;
          return this;
        }
        if (bytes2 instanceof util.ByteStringBuffer) {
          bytes2 = bytes2.data;
          encoding = "binary";
        }
        encoding = encoding || "binary";
        if (typeof bytes2 === "string") {
          var view;
          if (encoding === "hex") {
            this.accommodate(Math.ceil(bytes2.length / 2));
            view = new Uint8Array(this.data.buffer, this.write);
            this.write += util.binary.hex.decode(bytes2, view, this.write);
            return this;
          }
          if (encoding === "base64") {
            this.accommodate(Math.ceil(bytes2.length / 4) * 3);
            view = new Uint8Array(this.data.buffer, this.write);
            this.write += util.binary.base64.decode(bytes2, view, this.write);
            return this;
          }
          if (encoding === "utf8") {
            bytes2 = util.encodeUtf8(bytes2);
            encoding = "binary";
          }
          if (encoding === "binary" || encoding === "raw") {
            this.accommodate(bytes2.length);
            view = new Uint8Array(this.data.buffer, this.write);
            this.write += util.binary.raw.decode(view);
            return this;
          }
          if (encoding === "utf16") {
            this.accommodate(bytes2.length * 2);
            view = new Uint16Array(this.data.buffer, this.write);
            this.write += util.text.utf16.encode(view);
            return this;
          }
          throw new Error("Invalid encoding: " + encoding);
        }
        throw Error("Invalid parameter: " + bytes2);
      };
      util.DataBuffer.prototype.putBuffer = function(buffer2) {
        this.putBytes(buffer2);
        buffer2.clear();
        return this;
      };
      util.DataBuffer.prototype.putString = function(str) {
        return this.putBytes(str, "utf16");
      };
      util.DataBuffer.prototype.putInt16 = function(i) {
        this.accommodate(2);
        this.data.setInt16(this.write, i);
        this.write += 2;
        return this;
      };
      util.DataBuffer.prototype.putInt24 = function(i) {
        this.accommodate(3);
        this.data.setInt16(this.write, i >> 8 & 65535);
        this.data.setInt8(this.write, i >> 16 & 255);
        this.write += 3;
        return this;
      };
      util.DataBuffer.prototype.putInt32 = function(i) {
        this.accommodate(4);
        this.data.setInt32(this.write, i);
        this.write += 4;
        return this;
      };
      util.DataBuffer.prototype.putInt16Le = function(i) {
        this.accommodate(2);
        this.data.setInt16(this.write, i, true);
        this.write += 2;
        return this;
      };
      util.DataBuffer.prototype.putInt24Le = function(i) {
        this.accommodate(3);
        this.data.setInt8(this.write, i >> 16 & 255);
        this.data.setInt16(this.write, i >> 8 & 65535, true);
        this.write += 3;
        return this;
      };
      util.DataBuffer.prototype.putInt32Le = function(i) {
        this.accommodate(4);
        this.data.setInt32(this.write, i, true);
        this.write += 4;
        return this;
      };
      util.DataBuffer.prototype.putInt = function(i, n) {
        _checkBitsParam(n);
        this.accommodate(n / 8);
        do {
          n -= 8;
          this.data.setInt8(this.write++, i >> n & 255);
        } while (n > 0);
        return this;
      };
      util.DataBuffer.prototype.putSignedInt = function(i, n) {
        _checkBitsParam(n);
        this.accommodate(n / 8);
        if (i < 0) {
          i += 2 << n - 1;
        }
        return this.putInt(i, n);
      };
      util.DataBuffer.prototype.getByte = function() {
        return this.data.getInt8(this.read++);
      };
      util.DataBuffer.prototype.getInt16 = function() {
        var rval = this.data.getInt16(this.read);
        this.read += 2;
        return rval;
      };
      util.DataBuffer.prototype.getInt24 = function() {
        var rval = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2);
        this.read += 3;
        return rval;
      };
      util.DataBuffer.prototype.getInt32 = function() {
        var rval = this.data.getInt32(this.read);
        this.read += 4;
        return rval;
      };
      util.DataBuffer.prototype.getInt16Le = function() {
        var rval = this.data.getInt16(this.read, true);
        this.read += 2;
        return rval;
      };
      util.DataBuffer.prototype.getInt24Le = function() {
        var rval = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, true) << 8;
        this.read += 3;
        return rval;
      };
      util.DataBuffer.prototype.getInt32Le = function() {
        var rval = this.data.getInt32(this.read, true);
        this.read += 4;
        return rval;
      };
      util.DataBuffer.prototype.getInt = function(n) {
        _checkBitsParam(n);
        var rval = 0;
        do {
          rval = (rval << 8) + this.data.getInt8(this.read++);
          n -= 8;
        } while (n > 0);
        return rval;
      };
      util.DataBuffer.prototype.getSignedInt = function(n) {
        var x = this.getInt(n);
        var max = 2 << n - 2;
        if (x >= max) {
          x -= max << 1;
        }
        return x;
      };
      util.DataBuffer.prototype.getBytes = function(count) {
        var rval;
        if (count) {
          count = Math.min(this.length(), count);
          rval = this.data.slice(this.read, this.read + count);
          this.read += count;
        } else if (count === 0) {
          rval = "";
        } else {
          rval = this.read === 0 ? this.data : this.data.slice(this.read);
          this.clear();
        }
        return rval;
      };
      util.DataBuffer.prototype.bytes = function(count) {
        return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
      };
      util.DataBuffer.prototype.at = function(i) {
        return this.data.getUint8(this.read + i);
      };
      util.DataBuffer.prototype.setAt = function(i, b) {
        this.data.setUint8(i, b);
        return this;
      };
      util.DataBuffer.prototype.last = function() {
        return this.data.getUint8(this.write - 1);
      };
      util.DataBuffer.prototype.copy = function() {
        return new util.DataBuffer(this);
      };
      util.DataBuffer.prototype.compact = function() {
        if (this.read > 0) {
          var src2 = new Uint8Array(this.data.buffer, this.read);
          var dst = new Uint8Array(src2.byteLength);
          dst.set(src2);
          this.data = new DataView(dst);
          this.write -= this.read;
          this.read = 0;
        }
        return this;
      };
      util.DataBuffer.prototype.clear = function() {
        this.data = new DataView(new ArrayBuffer(0));
        this.read = this.write = 0;
        return this;
      };
      util.DataBuffer.prototype.truncate = function(count) {
        this.write = Math.max(0, this.length() - count);
        this.read = Math.min(this.read, this.write);
        return this;
      };
      util.DataBuffer.prototype.toHex = function() {
        var rval = "";
        for (var i = this.read; i < this.data.byteLength; ++i) {
          var b = this.data.getUint8(i);
          if (b < 16) {
            rval += "0";
          }
          rval += b.toString(16);
        }
        return rval;
      };
      util.DataBuffer.prototype.toString = function(encoding) {
        var view = new Uint8Array(this.data, this.read, this.length());
        encoding = encoding || "utf8";
        if (encoding === "binary" || encoding === "raw") {
          return util.binary.raw.encode(view);
        }
        if (encoding === "hex") {
          return util.binary.hex.encode(view);
        }
        if (encoding === "base64") {
          return util.binary.base64.encode(view);
        }
        if (encoding === "utf8") {
          return util.text.utf8.decode(view);
        }
        if (encoding === "utf16") {
          return util.text.utf16.decode(view);
        }
        throw new Error("Invalid encoding: " + encoding);
      };
      util.createBuffer = function(input, encoding) {
        encoding = encoding || "raw";
        if (input !== void 0 && encoding === "utf8") {
          input = util.encodeUtf8(input);
        }
        return new util.ByteBuffer(input);
      };
      util.fillString = function(c, n) {
        var s = "";
        while (n > 0) {
          if (n & 1) {
            s += c;
          }
          n >>>= 1;
          if (n > 0) {
            c += c;
          }
        }
        return s;
      };
      util.xorBytes = function(s1, s2, n) {
        var s3 = "";
        var b = "";
        var t = "";
        var i = 0;
        var c = 0;
        for (; n > 0; --n, ++i) {
          b = s1.charCodeAt(i) ^ s2.charCodeAt(i);
          if (c >= 10) {
            s3 += t;
            t = "";
            c = 0;
          }
          t += String.fromCharCode(b);
          ++c;
        }
        s3 += t;
        return s3;
      };
      util.hexToBytes = function(hex) {
        var rval = "";
        var i = 0;
        if (hex.length & true) {
          i = 1;
          rval += String.fromCharCode(parseInt(hex[0], 16));
        }
        for (; i < hex.length; i += 2) {
          rval += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return rval;
      };
      util.bytesToHex = function(bytes2) {
        return util.createBuffer(bytes2).toHex();
      };
      util.int32ToBytes = function(i) {
        return String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255);
      };
      var _base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var _base64Idx = [
        62,
        -1,
        -1,
        -1,
        63,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        -1,
        -1,
        -1,
        64,
        -1,
        -1,
        -1,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51
      ];
      var _base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      util.encode64 = function(input, maxline) {
        var line = "";
        var output = "";
        var chr1, chr2, chr3;
        var i = 0;
        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          line += _base64.charAt(chr1 >> 2);
          line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
          if (isNaN(chr2)) {
            line += "==";
          } else {
            line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
            line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
          }
          if (maxline && line.length > maxline) {
            output += line.substr(0, maxline) + "\r\n";
            line = line.substr(maxline);
          }
        }
        output += line;
        return output;
      };
      util.decode64 = function(input) {
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var output = "";
        var enc1, enc2, enc3, enc4;
        var i = 0;
        while (i < input.length) {
          enc1 = _base64Idx[input.charCodeAt(i++) - 43];
          enc2 = _base64Idx[input.charCodeAt(i++) - 43];
          enc3 = _base64Idx[input.charCodeAt(i++) - 43];
          enc4 = _base64Idx[input.charCodeAt(i++) - 43];
          output += String.fromCharCode(enc1 << 2 | enc2 >> 4);
          if (enc3 !== 64) {
            output += String.fromCharCode((enc2 & 15) << 4 | enc3 >> 2);
            if (enc4 !== 64) {
              output += String.fromCharCode((enc3 & 3) << 6 | enc4);
            }
          }
        }
        return output;
      };
      util.encodeUtf8 = function(str) {
        return unescape(encodeURIComponent(str));
      };
      util.decodeUtf8 = function(str) {
        return decodeURIComponent(escape(str));
      };
      util.binary = {
        raw: {},
        hex: {},
        base64: {},
        base58: {},
        baseN: {
          encode: baseN.encode,
          decode: baseN.decode
        }
      };
      util.binary.raw.encode = function(bytes2) {
        return String.fromCharCode.apply(null, bytes2);
      };
      util.binary.raw.decode = function(str, output, offset) {
        var out = output;
        if (!out) {
          out = new Uint8Array(str.length);
        }
        offset = offset || 0;
        var j = offset;
        for (var i = 0; i < str.length; ++i) {
          out[j++] = str.charCodeAt(i);
        }
        return output ? j - offset : out;
      };
      util.binary.hex.encode = util.bytesToHex;
      util.binary.hex.decode = function(hex, output, offset) {
        var out = output;
        if (!out) {
          out = new Uint8Array(Math.ceil(hex.length / 2));
        }
        offset = offset || 0;
        var i = 0, j = offset;
        if (hex.length & 1) {
          i = 1;
          out[j++] = parseInt(hex[0], 16);
        }
        for (; i < hex.length; i += 2) {
          out[j++] = parseInt(hex.substr(i, 2), 16);
        }
        return output ? j - offset : out;
      };
      util.binary.base64.encode = function(input, maxline) {
        var line = "";
        var output = "";
        var chr1, chr2, chr3;
        var i = 0;
        while (i < input.byteLength) {
          chr1 = input[i++];
          chr2 = input[i++];
          chr3 = input[i++];
          line += _base64.charAt(chr1 >> 2);
          line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
          if (isNaN(chr2)) {
            line += "==";
          } else {
            line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
            line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
          }
          if (maxline && line.length > maxline) {
            output += line.substr(0, maxline) + "\r\n";
            line = line.substr(maxline);
          }
        }
        output += line;
        return output;
      };
      util.binary.base64.decode = function(input, output, offset) {
        var out = output;
        if (!out) {
          out = new Uint8Array(Math.ceil(input.length / 4) * 3);
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        offset = offset || 0;
        var enc1, enc2, enc3, enc4;
        var i = 0, j = offset;
        while (i < input.length) {
          enc1 = _base64Idx[input.charCodeAt(i++) - 43];
          enc2 = _base64Idx[input.charCodeAt(i++) - 43];
          enc3 = _base64Idx[input.charCodeAt(i++) - 43];
          enc4 = _base64Idx[input.charCodeAt(i++) - 43];
          out[j++] = enc1 << 2 | enc2 >> 4;
          if (enc3 !== 64) {
            out[j++] = (enc2 & 15) << 4 | enc3 >> 2;
            if (enc4 !== 64) {
              out[j++] = (enc3 & 3) << 6 | enc4;
            }
          }
        }
        return output ? j - offset : out.subarray(0, j);
      };
      util.binary.base58.encode = function(input, maxline) {
        return util.binary.baseN.encode(input, _base58, maxline);
      };
      util.binary.base58.decode = function(input, maxline) {
        return util.binary.baseN.decode(input, _base58, maxline);
      };
      util.text = {
        utf8: {},
        utf16: {}
      };
      util.text.utf8.encode = function(str, output, offset) {
        str = util.encodeUtf8(str);
        var out = output;
        if (!out) {
          out = new Uint8Array(str.length);
        }
        offset = offset || 0;
        var j = offset;
        for (var i = 0; i < str.length; ++i) {
          out[j++] = str.charCodeAt(i);
        }
        return output ? j - offset : out;
      };
      util.text.utf8.decode = function(bytes2) {
        return util.decodeUtf8(String.fromCharCode.apply(null, bytes2));
      };
      util.text.utf16.encode = function(str, output, offset) {
        var out = output;
        if (!out) {
          out = new Uint8Array(str.length * 2);
        }
        var view = new Uint16Array(out.buffer);
        offset = offset || 0;
        var j = offset;
        var k = offset;
        for (var i = 0; i < str.length; ++i) {
          view[k++] = str.charCodeAt(i);
          j += 2;
        }
        return output ? j - offset : out;
      };
      util.text.utf16.decode = function(bytes2) {
        return String.fromCharCode.apply(null, new Uint16Array(bytes2.buffer));
      };
      util.deflate = function(api, bytes2, raw) {
        bytes2 = util.decode64(api.deflate(util.encode64(bytes2)).rval);
        if (raw) {
          var start = 2;
          var flg = bytes2.charCodeAt(1);
          if (flg & 32) {
            start = 6;
          }
          bytes2 = bytes2.substring(start, bytes2.length - 4);
        }
        return bytes2;
      };
      util.inflate = function(api, bytes2, raw) {
        var rval = api.inflate(util.encode64(bytes2)).rval;
        return rval === null ? null : util.decode64(rval);
      };
      var _setStorageObject = function(api, id, obj) {
        if (!api) {
          throw new Error("WebStorage not available.");
        }
        var rval;
        if (obj === null) {
          rval = api.removeItem(id);
        } else {
          obj = util.encode64(JSON.stringify(obj));
          rval = api.setItem(id, obj);
        }
        if (typeof rval !== "undefined" && rval.rval !== true) {
          var error = new Error(rval.error.message);
          error.id = rval.error.id;
          error.name = rval.error.name;
          throw error;
        }
      };
      var _getStorageObject = function(api, id) {
        if (!api) {
          throw new Error("WebStorage not available.");
        }
        var rval = api.getItem(id);
        if (api.init) {
          if (rval.rval === null) {
            if (rval.error) {
              var error = new Error(rval.error.message);
              error.id = rval.error.id;
              error.name = rval.error.name;
              throw error;
            }
            rval = null;
          } else {
            rval = rval.rval;
          }
        }
        if (rval !== null) {
          rval = JSON.parse(util.decode64(rval));
        }
        return rval;
      };
      var _setItem = function(api, id, key, data) {
        var obj = _getStorageObject(api, id);
        if (obj === null) {
          obj = {};
        }
        obj[key] = data;
        _setStorageObject(api, id, obj);
      };
      var _getItem = function(api, id, key) {
        var rval = _getStorageObject(api, id);
        if (rval !== null) {
          rval = key in rval ? rval[key] : null;
        }
        return rval;
      };
      var _removeItem = function(api, id, key) {
        var obj = _getStorageObject(api, id);
        if (obj !== null && key in obj) {
          delete obj[key];
          var empty2 = true;
          for (var prop in obj) {
            empty2 = false;
            break;
          }
          if (empty2) {
            obj = null;
          }
          _setStorageObject(api, id, obj);
        }
      };
      var _clearItems = function(api, id) {
        _setStorageObject(api, id, null);
      };
      var _callStorageFunction = function(func, args, location) {
        var rval = null;
        if (typeof location === "undefined") {
          location = ["web", "flash"];
        }
        var type;
        var done = false;
        var exception = null;
        for (var idx in location) {
          type = location[idx];
          try {
            if (type === "flash" || type === "both") {
              if (args[0] === null) {
                throw new Error("Flash local storage not available.");
              }
              rval = func.apply(this, args);
              done = type === "flash";
            }
            if (type === "web" || type === "both") {
              args[0] = localStorage;
              rval = func.apply(this, args);
              done = true;
            }
          } catch (ex) {
            exception = ex;
          }
          if (done) {
            break;
          }
        }
        if (!done) {
          throw exception;
        }
        return rval;
      };
      util.setItem = function(api, id, key, data, location) {
        _callStorageFunction(_setItem, arguments, location);
      };
      util.getItem = function(api, id, key, location) {
        return _callStorageFunction(_getItem, arguments, location);
      };
      util.removeItem = function(api, id, key, location) {
        _callStorageFunction(_removeItem, arguments, location);
      };
      util.clearItems = function(api, id, location) {
        _callStorageFunction(_clearItems, arguments, location);
      };
      util.isEmpty = function(obj) {
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            return false;
          }
        }
        return true;
      };
      util.format = function(format) {
        var re = /%./g;
        var match;
        var part;
        var argi = 0;
        var parts = [];
        var last = 0;
        while (match = re.exec(format)) {
          part = format.substring(last, re.lastIndex - 2);
          if (part.length > 0) {
            parts.push(part);
          }
          last = re.lastIndex;
          var code3 = match[0][1];
          switch (code3) {
            case "s":
            case "o":
              if (argi < arguments.length) {
                parts.push(arguments[argi++ + 1]);
              } else {
                parts.push("<?>");
              }
              break;
            case "%":
              parts.push("%");
              break;
            default:
              parts.push("<%" + code3 + "?>");
          }
        }
        parts.push(format.substring(last));
        return parts.join("");
      };
      util.formatNumber = function(number, decimals, dec_point, thousands_sep) {
        var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
        var d = dec_point === void 0 ? "," : dec_point;
        var t = thousands_sep === void 0 ? "." : thousands_sep, s = n < 0 ? "-" : "";
        var i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + "";
        var j = i.length > 3 ? i.length % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
      };
      util.formatSize = function(size) {
        if (size >= 1073741824) {
          size = util.formatNumber(size / 1073741824, 2, ".", "") + " GiB";
        } else if (size >= 1048576) {
          size = util.formatNumber(size / 1048576, 2, ".", "") + " MiB";
        } else if (size >= 1024) {
          size = util.formatNumber(size / 1024, 0) + " KiB";
        } else {
          size = util.formatNumber(size, 0) + " bytes";
        }
        return size;
      };
      util.bytesFromIP = function(ip) {
        if (ip.indexOf(".") !== -1) {
          return util.bytesFromIPv4(ip);
        }
        if (ip.indexOf(":") !== -1) {
          return util.bytesFromIPv6(ip);
        }
        return null;
      };
      util.bytesFromIPv4 = function(ip) {
        ip = ip.split(".");
        if (ip.length !== 4) {
          return null;
        }
        var b = util.createBuffer();
        for (var i = 0; i < ip.length; ++i) {
          var num = parseInt(ip[i], 10);
          if (isNaN(num)) {
            return null;
          }
          b.putByte(num);
        }
        return b.getBytes();
      };
      util.bytesFromIPv6 = function(ip) {
        var blanks = 0;
        ip = ip.split(":").filter(function(e) {
          if (e.length === 0)
            ++blanks;
          return true;
        });
        var zeros = (8 - ip.length + blanks) * 2;
        var b = util.createBuffer();
        for (var i = 0; i < 8; ++i) {
          if (!ip[i] || ip[i].length === 0) {
            b.fillWithByte(0, zeros);
            zeros = 0;
            continue;
          }
          var bytes2 = util.hexToBytes(ip[i]);
          if (bytes2.length < 2) {
            b.putByte(0);
          }
          b.putBytes(bytes2);
        }
        return b.getBytes();
      };
      util.bytesToIP = function(bytes2) {
        if (bytes2.length === 4) {
          return util.bytesToIPv4(bytes2);
        }
        if (bytes2.length === 16) {
          return util.bytesToIPv6(bytes2);
        }
        return null;
      };
      util.bytesToIPv4 = function(bytes2) {
        if (bytes2.length !== 4) {
          return null;
        }
        var ip = [];
        for (var i = 0; i < bytes2.length; ++i) {
          ip.push(bytes2.charCodeAt(i));
        }
        return ip.join(".");
      };
      util.bytesToIPv6 = function(bytes2) {
        if (bytes2.length !== 16) {
          return null;
        }
        var ip = [];
        var zeroGroups = [];
        var zeroMaxGroup = 0;
        for (var i = 0; i < bytes2.length; i += 2) {
          var hex = util.bytesToHex(bytes2[i] + bytes2[i + 1]);
          while (hex[0] === "0" && hex !== "0") {
            hex = hex.substr(1);
          }
          if (hex === "0") {
            var last = zeroGroups[zeroGroups.length - 1];
            var idx = ip.length;
            if (!last || idx !== last.end + 1) {
              zeroGroups.push({ start: idx, end: idx });
            } else {
              last.end = idx;
              if (last.end - last.start > zeroGroups[zeroMaxGroup].end - zeroGroups[zeroMaxGroup].start) {
                zeroMaxGroup = zeroGroups.length - 1;
              }
            }
          }
          ip.push(hex);
        }
        if (zeroGroups.length > 0) {
          var group = zeroGroups[zeroMaxGroup];
          if (group.end - group.start > 0) {
            ip.splice(group.start, group.end - group.start + 1, "");
            if (group.start === 0) {
              ip.unshift("");
            }
            if (group.end === 7) {
              ip.push("");
            }
          }
        }
        return ip.join(":");
      };
      util.estimateCores = function(options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        options = options || {};
        if ("cores" in util && !options.update) {
          return callback(null, util.cores);
        }
        if (typeof navigator !== "undefined" && "hardwareConcurrency" in navigator && navigator.hardwareConcurrency > 0) {
          util.cores = navigator.hardwareConcurrency;
          return callback(null, util.cores);
        }
        if (typeof Worker === "undefined") {
          util.cores = 1;
          return callback(null, util.cores);
        }
        if (typeof Blob === "undefined") {
          util.cores = 2;
          return callback(null, util.cores);
        }
        var blobUrl = URL.createObjectURL(new Blob([
          "(",
          function() {
            self.addEventListener("message", function(e) {
              var st = Date.now();
              var et = st + 4;
              while (Date.now() < et)
                ;
              self.postMessage({ st, et });
            });
          }.toString(),
          ")()"
        ], { type: "application/javascript" }));
        sample([], 5, 16);
        function sample(max, samples, numWorkers) {
          if (samples === 0) {
            var avg = Math.floor(max.reduce(function(avg2, x) {
              return avg2 + x;
            }, 0) / max.length);
            util.cores = Math.max(1, avg);
            URL.revokeObjectURL(blobUrl);
            return callback(null, util.cores);
          }
          map(numWorkers, function(err, results) {
            max.push(reduce(numWorkers, results));
            sample(max, samples - 1, numWorkers);
          });
        }
        function map(numWorkers, callback2) {
          var workers = [];
          var results = [];
          for (var i = 0; i < numWorkers; ++i) {
            var worker = new Worker(blobUrl);
            worker.addEventListener("message", function(e) {
              results.push(e.data);
              if (results.length === numWorkers) {
                for (var i2 = 0; i2 < numWorkers; ++i2) {
                  workers[i2].terminate();
                }
                callback2(null, results);
              }
            });
            workers.push(worker);
          }
          for (var i = 0; i < numWorkers; ++i) {
            workers[i].postMessage(i);
          }
        }
        function reduce(numWorkers, results) {
          var overlaps = [];
          for (var n = 0; n < numWorkers; ++n) {
            var r1 = results[n];
            var overlap = overlaps[n] = [];
            for (var i = 0; i < numWorkers; ++i) {
              if (n === i) {
                continue;
              }
              var r2 = results[i];
              if (r1.st > r2.st && r1.st < r2.et || r2.st > r1.st && r2.st < r1.et) {
                overlap.push(i);
              }
            }
          }
          return overlaps.reduce(function(max, overlap2) {
            return Math.max(max, overlap2.length);
          }, 0);
        }
      };
    }
  });

  // ../node_modules/node-forge/lib/oids.js
  var require_oids = __commonJS({
    "../node_modules/node-forge/lib/oids.js"(exports2, module2) {
      var forge6 = require_forge();
      forge6.pki = forge6.pki || {};
      var oids = module2.exports = forge6.pki.oids = forge6.oids = forge6.oids || {};
      function _IN(id, name2) {
        oids[id] = name2;
        oids[name2] = id;
      }
      function _I_(id, name2) {
        oids[id] = name2;
      }
      _IN("1.2.840.113549.1.1.1", "rsaEncryption");
      _IN("1.2.840.113549.1.1.4", "md5WithRSAEncryption");
      _IN("1.2.840.113549.1.1.5", "sha1WithRSAEncryption");
      _IN("1.2.840.113549.1.1.7", "RSAES-OAEP");
      _IN("1.2.840.113549.1.1.8", "mgf1");
      _IN("1.2.840.113549.1.1.9", "pSpecified");
      _IN("1.2.840.113549.1.1.10", "RSASSA-PSS");
      _IN("1.2.840.113549.1.1.11", "sha256WithRSAEncryption");
      _IN("1.2.840.113549.1.1.12", "sha384WithRSAEncryption");
      _IN("1.2.840.113549.1.1.13", "sha512WithRSAEncryption");
      _IN("1.3.101.112", "EdDSA25519");
      _IN("1.2.840.10040.4.3", "dsa-with-sha1");
      _IN("1.3.14.3.2.7", "desCBC");
      _IN("1.3.14.3.2.26", "sha1");
      _IN("1.3.14.3.2.29", "sha1WithRSASignature");
      _IN("2.16.840.1.101.3.4.2.1", "sha256");
      _IN("2.16.840.1.101.3.4.2.2", "sha384");
      _IN("2.16.840.1.101.3.4.2.3", "sha512");
      _IN("2.16.840.1.101.3.4.2.4", "sha224");
      _IN("2.16.840.1.101.3.4.2.5", "sha512-224");
      _IN("2.16.840.1.101.3.4.2.6", "sha512-256");
      _IN("1.2.840.113549.2.2", "md2");
      _IN("1.2.840.113549.2.5", "md5");
      _IN("1.2.840.113549.1.7.1", "data");
      _IN("1.2.840.113549.1.7.2", "signedData");
      _IN("1.2.840.113549.1.7.3", "envelopedData");
      _IN("1.2.840.113549.1.7.4", "signedAndEnvelopedData");
      _IN("1.2.840.113549.1.7.5", "digestedData");
      _IN("1.2.840.113549.1.7.6", "encryptedData");
      _IN("1.2.840.113549.1.9.1", "emailAddress");
      _IN("1.2.840.113549.1.9.2", "unstructuredName");
      _IN("1.2.840.113549.1.9.3", "contentType");
      _IN("1.2.840.113549.1.9.4", "messageDigest");
      _IN("1.2.840.113549.1.9.5", "signingTime");
      _IN("1.2.840.113549.1.9.6", "counterSignature");
      _IN("1.2.840.113549.1.9.7", "challengePassword");
      _IN("1.2.840.113549.1.9.8", "unstructuredAddress");
      _IN("1.2.840.113549.1.9.14", "extensionRequest");
      _IN("1.2.840.113549.1.9.20", "friendlyName");
      _IN("1.2.840.113549.1.9.21", "localKeyId");
      _IN("1.2.840.113549.1.9.22.1", "x509Certificate");
      _IN("1.2.840.113549.1.12.10.1.1", "keyBag");
      _IN("1.2.840.113549.1.12.10.1.2", "pkcs8ShroudedKeyBag");
      _IN("1.2.840.113549.1.12.10.1.3", "certBag");
      _IN("1.2.840.113549.1.12.10.1.4", "crlBag");
      _IN("1.2.840.113549.1.12.10.1.5", "secretBag");
      _IN("1.2.840.113549.1.12.10.1.6", "safeContentsBag");
      _IN("1.2.840.113549.1.5.13", "pkcs5PBES2");
      _IN("1.2.840.113549.1.5.12", "pkcs5PBKDF2");
      _IN("1.2.840.113549.1.12.1.1", "pbeWithSHAAnd128BitRC4");
      _IN("1.2.840.113549.1.12.1.2", "pbeWithSHAAnd40BitRC4");
      _IN("1.2.840.113549.1.12.1.3", "pbeWithSHAAnd3-KeyTripleDES-CBC");
      _IN("1.2.840.113549.1.12.1.4", "pbeWithSHAAnd2-KeyTripleDES-CBC");
      _IN("1.2.840.113549.1.12.1.5", "pbeWithSHAAnd128BitRC2-CBC");
      _IN("1.2.840.113549.1.12.1.6", "pbewithSHAAnd40BitRC2-CBC");
      _IN("1.2.840.113549.2.7", "hmacWithSHA1");
      _IN("1.2.840.113549.2.8", "hmacWithSHA224");
      _IN("1.2.840.113549.2.9", "hmacWithSHA256");
      _IN("1.2.840.113549.2.10", "hmacWithSHA384");
      _IN("1.2.840.113549.2.11", "hmacWithSHA512");
      _IN("1.2.840.113549.3.7", "des-EDE3-CBC");
      _IN("2.16.840.1.101.3.4.1.2", "aes128-CBC");
      _IN("2.16.840.1.101.3.4.1.22", "aes192-CBC");
      _IN("2.16.840.1.101.3.4.1.42", "aes256-CBC");
      _IN("2.5.4.3", "commonName");
      _IN("2.5.4.4", "surname");
      _IN("2.5.4.5", "serialNumber");
      _IN("2.5.4.6", "countryName");
      _IN("2.5.4.7", "localityName");
      _IN("2.5.4.8", "stateOrProvinceName");
      _IN("2.5.4.9", "streetAddress");
      _IN("2.5.4.10", "organizationName");
      _IN("2.5.4.11", "organizationalUnitName");
      _IN("2.5.4.12", "title");
      _IN("2.5.4.13", "description");
      _IN("2.5.4.15", "businessCategory");
      _IN("2.5.4.17", "postalCode");
      _IN("2.5.4.42", "givenName");
      _IN("1.3.6.1.4.1.311.60.2.1.2", "jurisdictionOfIncorporationStateOrProvinceName");
      _IN("1.3.6.1.4.1.311.60.2.1.3", "jurisdictionOfIncorporationCountryName");
      _IN("2.16.840.1.113730.1.1", "nsCertType");
      _IN("2.16.840.1.113730.1.13", "nsComment");
      _I_("2.5.29.1", "authorityKeyIdentifier");
      _I_("2.5.29.2", "keyAttributes");
      _I_("2.5.29.3", "certificatePolicies");
      _I_("2.5.29.4", "keyUsageRestriction");
      _I_("2.5.29.5", "policyMapping");
      _I_("2.5.29.6", "subtreesConstraint");
      _I_("2.5.29.7", "subjectAltName");
      _I_("2.5.29.8", "issuerAltName");
      _I_("2.5.29.9", "subjectDirectoryAttributes");
      _I_("2.5.29.10", "basicConstraints");
      _I_("2.5.29.11", "nameConstraints");
      _I_("2.5.29.12", "policyConstraints");
      _I_("2.5.29.13", "basicConstraints");
      _IN("2.5.29.14", "subjectKeyIdentifier");
      _IN("2.5.29.15", "keyUsage");
      _I_("2.5.29.16", "privateKeyUsagePeriod");
      _IN("2.5.29.17", "subjectAltName");
      _IN("2.5.29.18", "issuerAltName");
      _IN("2.5.29.19", "basicConstraints");
      _I_("2.5.29.20", "cRLNumber");
      _I_("2.5.29.21", "cRLReason");
      _I_("2.5.29.22", "expirationDate");
      _I_("2.5.29.23", "instructionCode");
      _I_("2.5.29.24", "invalidityDate");
      _I_("2.5.29.25", "cRLDistributionPoints");
      _I_("2.5.29.26", "issuingDistributionPoint");
      _I_("2.5.29.27", "deltaCRLIndicator");
      _I_("2.5.29.28", "issuingDistributionPoint");
      _I_("2.5.29.29", "certificateIssuer");
      _I_("2.5.29.30", "nameConstraints");
      _IN("2.5.29.31", "cRLDistributionPoints");
      _IN("2.5.29.32", "certificatePolicies");
      _I_("2.5.29.33", "policyMappings");
      _I_("2.5.29.34", "policyConstraints");
      _IN("2.5.29.35", "authorityKeyIdentifier");
      _I_("2.5.29.36", "policyConstraints");
      _IN("2.5.29.37", "extKeyUsage");
      _I_("2.5.29.46", "freshestCRL");
      _I_("2.5.29.54", "inhibitAnyPolicy");
      _IN("1.3.6.1.4.1.11129.2.4.2", "timestampList");
      _IN("1.3.6.1.5.5.7.1.1", "authorityInfoAccess");
      _IN("1.3.6.1.5.5.7.3.1", "serverAuth");
      _IN("1.3.6.1.5.5.7.3.2", "clientAuth");
      _IN("1.3.6.1.5.5.7.3.3", "codeSigning");
      _IN("1.3.6.1.5.5.7.3.4", "emailProtection");
      _IN("1.3.6.1.5.5.7.3.8", "timeStamping");
    }
  });

  // ../node_modules/node-forge/lib/asn1.js
  var require_asn1 = __commonJS({
    "../node_modules/node-forge/lib/asn1.js"(exports2, module2) {
      var forge6 = require_forge();
      require_util();
      require_oids();
      var asn1 = module2.exports = forge6.asn1 = forge6.asn1 || {};
      asn1.Class = {
        UNIVERSAL: 0,
        APPLICATION: 64,
        CONTEXT_SPECIFIC: 128,
        PRIVATE: 192
      };
      asn1.Type = {
        NONE: 0,
        BOOLEAN: 1,
        INTEGER: 2,
        BITSTRING: 3,
        OCTETSTRING: 4,
        NULL: 5,
        OID: 6,
        ODESC: 7,
        EXTERNAL: 8,
        REAL: 9,
        ENUMERATED: 10,
        EMBEDDED: 11,
        UTF8: 12,
        ROID: 13,
        SEQUENCE: 16,
        SET: 17,
        PRINTABLESTRING: 19,
        IA5STRING: 22,
        UTCTIME: 23,
        GENERALIZEDTIME: 24,
        BMPSTRING: 30
      };
      asn1.create = function(tagClass, type, constructed, value, options) {
        if (forge6.util.isArray(value)) {
          var tmp = [];
          for (var i = 0; i < value.length; ++i) {
            if (value[i] !== void 0) {
              tmp.push(value[i]);
            }
          }
          value = tmp;
        }
        var obj = {
          tagClass,
          type,
          constructed,
          composed: constructed || forge6.util.isArray(value),
          value
        };
        if (options && "bitStringContents" in options) {
          obj.bitStringContents = options.bitStringContents;
          obj.original = asn1.copy(obj);
        }
        return obj;
      };
      asn1.copy = function(obj, options) {
        var copy;
        if (forge6.util.isArray(obj)) {
          copy = [];
          for (var i = 0; i < obj.length; ++i) {
            copy.push(asn1.copy(obj[i], options));
          }
          return copy;
        }
        if (typeof obj === "string") {
          return obj;
        }
        copy = {
          tagClass: obj.tagClass,
          type: obj.type,
          constructed: obj.constructed,
          composed: obj.composed,
          value: asn1.copy(obj.value, options)
        };
        if (options && !options.excludeBitStringContents) {
          copy.bitStringContents = obj.bitStringContents;
        }
        return copy;
      };
      asn1.equals = function(obj1, obj2, options) {
        if (forge6.util.isArray(obj1)) {
          if (!forge6.util.isArray(obj2)) {
            return false;
          }
          if (obj1.length !== obj2.length) {
            return false;
          }
          for (var i = 0; i < obj1.length; ++i) {
            if (!asn1.equals(obj1[i], obj2[i])) {
              return false;
            }
          }
          return true;
        }
        if (typeof obj1 !== typeof obj2) {
          return false;
        }
        if (typeof obj1 === "string") {
          return obj1 === obj2;
        }
        var equal = obj1.tagClass === obj2.tagClass && obj1.type === obj2.type && obj1.constructed === obj2.constructed && obj1.composed === obj2.composed && asn1.equals(obj1.value, obj2.value);
        if (options && options.includeBitStringContents) {
          equal = equal && obj1.bitStringContents === obj2.bitStringContents;
        }
        return equal;
      };
      asn1.getBerValueLength = function(b) {
        var b2 = b.getByte();
        if (b2 === 128) {
          return void 0;
        }
        var length2;
        var longForm = b2 & 128;
        if (!longForm) {
          length2 = b2;
        } else {
          length2 = b.getInt((b2 & 127) << 3);
        }
        return length2;
      };
      function _checkBufferLength(bytes2, remaining, n) {
        if (n > remaining) {
          var error = new Error("Too few bytes to parse DER.");
          error.available = bytes2.length();
          error.remaining = remaining;
          error.requested = n;
          throw error;
        }
      }
      var _getValueLength = function(bytes2, remaining) {
        var b2 = bytes2.getByte();
        remaining--;
        if (b2 === 128) {
          return void 0;
        }
        var length2;
        var longForm = b2 & 128;
        if (!longForm) {
          length2 = b2;
        } else {
          var longFormBytes = b2 & 127;
          _checkBufferLength(bytes2, remaining, longFormBytes);
          length2 = bytes2.getInt(longFormBytes << 3);
        }
        if (length2 < 0) {
          throw new Error("Negative length: " + length2);
        }
        return length2;
      };
      asn1.fromDer = function(bytes2, options) {
        if (options === void 0) {
          options = {
            strict: true,
            parseAllBytes: true,
            decodeBitStrings: true
          };
        }
        if (typeof options === "boolean") {
          options = {
            strict: options,
            parseAllBytes: true,
            decodeBitStrings: true
          };
        }
        if (!("strict" in options)) {
          options.strict = true;
        }
        if (!("parseAllBytes" in options)) {
          options.parseAllBytes = true;
        }
        if (!("decodeBitStrings" in options)) {
          options.decodeBitStrings = true;
        }
        if (typeof bytes2 === "string") {
          bytes2 = forge6.util.createBuffer(bytes2);
        }
        var byteCount = bytes2.length();
        var value = _fromDer(bytes2, bytes2.length(), 0, options);
        if (options.parseAllBytes && bytes2.length() !== 0) {
          var error = new Error("Unparsed DER bytes remain after ASN.1 parsing.");
          error.byteCount = byteCount;
          error.remaining = bytes2.length();
          throw error;
        }
        return value;
      };
      function _fromDer(bytes2, remaining, depth, options) {
        var start;
        _checkBufferLength(bytes2, remaining, 2);
        var b1 = bytes2.getByte();
        remaining--;
        var tagClass = b1 & 192;
        var type = b1 & 31;
        start = bytes2.length();
        var length2 = _getValueLength(bytes2, remaining);
        remaining -= start - bytes2.length();
        if (length2 !== void 0 && length2 > remaining) {
          if (options.strict) {
            var error = new Error("Too few bytes to read ASN.1 value.");
            error.available = bytes2.length();
            error.remaining = remaining;
            error.requested = length2;
            throw error;
          }
          length2 = remaining;
        }
        var value;
        var bitStringContents;
        var constructed = (b1 & 32) === 32;
        if (constructed) {
          value = [];
          if (length2 === void 0) {
            for (; ; ) {
              _checkBufferLength(bytes2, remaining, 2);
              if (bytes2.bytes(2) === String.fromCharCode(0, 0)) {
                bytes2.getBytes(2);
                remaining -= 2;
                break;
              }
              start = bytes2.length();
              value.push(_fromDer(bytes2, remaining, depth + 1, options));
              remaining -= start - bytes2.length();
            }
          } else {
            while (length2 > 0) {
              start = bytes2.length();
              value.push(_fromDer(bytes2, length2, depth + 1, options));
              remaining -= start - bytes2.length();
              length2 -= start - bytes2.length();
            }
          }
        }
        if (value === void 0 && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING) {
          bitStringContents = bytes2.bytes(length2);
        }
        if (value === void 0 && options.decodeBitStrings && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING && length2 > 1) {
          var savedRead = bytes2.read;
          var savedRemaining = remaining;
          var unused = 0;
          if (type === asn1.Type.BITSTRING) {
            _checkBufferLength(bytes2, remaining, 1);
            unused = bytes2.getByte();
            remaining--;
          }
          if (unused === 0) {
            try {
              start = bytes2.length();
              var subOptions = {
                strict: true,
                decodeBitStrings: true
              };
              var composed = _fromDer(bytes2, remaining, depth + 1, subOptions);
              var used = start - bytes2.length();
              remaining -= used;
              if (type == asn1.Type.BITSTRING) {
                used++;
              }
              var tc = composed.tagClass;
              if (used === length2 && (tc === asn1.Class.UNIVERSAL || tc === asn1.Class.CONTEXT_SPECIFIC)) {
                value = [composed];
              }
            } catch (ex) {
            }
          }
          if (value === void 0) {
            bytes2.read = savedRead;
            remaining = savedRemaining;
          }
        }
        if (value === void 0) {
          if (length2 === void 0) {
            if (options.strict) {
              throw new Error("Non-constructed ASN.1 object of indefinite length.");
            }
            length2 = remaining;
          }
          if (type === asn1.Type.BMPSTRING) {
            value = "";
            for (; length2 > 0; length2 -= 2) {
              _checkBufferLength(bytes2, remaining, 2);
              value += String.fromCharCode(bytes2.getInt16());
              remaining -= 2;
            }
          } else {
            value = bytes2.getBytes(length2);
            remaining -= length2;
          }
        }
        var asn1Options = bitStringContents === void 0 ? null : {
          bitStringContents
        };
        return asn1.create(tagClass, type, constructed, value, asn1Options);
      }
      asn1.toDer = function(obj) {
        var bytes2 = forge6.util.createBuffer();
        var b1 = obj.tagClass | obj.type;
        var value = forge6.util.createBuffer();
        var useBitStringContents = false;
        if ("bitStringContents" in obj) {
          useBitStringContents = true;
          if (obj.original) {
            useBitStringContents = asn1.equals(obj, obj.original);
          }
        }
        if (useBitStringContents) {
          value.putBytes(obj.bitStringContents);
        } else if (obj.composed) {
          if (obj.constructed) {
            b1 |= 32;
          } else {
            value.putByte(0);
          }
          for (var i = 0; i < obj.value.length; ++i) {
            if (obj.value[i] !== void 0) {
              value.putBuffer(asn1.toDer(obj.value[i]));
            }
          }
        } else {
          if (obj.type === asn1.Type.BMPSTRING) {
            for (var i = 0; i < obj.value.length; ++i) {
              value.putInt16(obj.value.charCodeAt(i));
            }
          } else {
            if (obj.type === asn1.Type.INTEGER && obj.value.length > 1 && (obj.value.charCodeAt(0) === 0 && (obj.value.charCodeAt(1) & 128) === 0 || obj.value.charCodeAt(0) === 255 && (obj.value.charCodeAt(1) & 128) === 128)) {
              value.putBytes(obj.value.substr(1));
            } else {
              value.putBytes(obj.value);
            }
          }
        }
        bytes2.putByte(b1);
        if (value.length() <= 127) {
          bytes2.putByte(value.length() & 127);
        } else {
          var len = value.length();
          var lenBytes = "";
          do {
            lenBytes += String.fromCharCode(len & 255);
            len = len >>> 8;
          } while (len > 0);
          bytes2.putByte(lenBytes.length | 128);
          for (var i = lenBytes.length - 1; i >= 0; --i) {
            bytes2.putByte(lenBytes.charCodeAt(i));
          }
        }
        bytes2.putBuffer(value);
        return bytes2;
      };
      asn1.oidToDer = function(oid) {
        var values = oid.split(".");
        var bytes2 = forge6.util.createBuffer();
        bytes2.putByte(40 * parseInt(values[0], 10) + parseInt(values[1], 10));
        var last, valueBytes, value, b;
        for (var i = 2; i < values.length; ++i) {
          last = true;
          valueBytes = [];
          value = parseInt(values[i], 10);
          do {
            b = value & 127;
            value = value >>> 7;
            if (!last) {
              b |= 128;
            }
            valueBytes.push(b);
            last = false;
          } while (value > 0);
          for (var n = valueBytes.length - 1; n >= 0; --n) {
            bytes2.putByte(valueBytes[n]);
          }
        }
        return bytes2;
      };
      asn1.derToOid = function(bytes2) {
        var oid;
        if (typeof bytes2 === "string") {
          bytes2 = forge6.util.createBuffer(bytes2);
        }
        var b = bytes2.getByte();
        oid = Math.floor(b / 40) + "." + b % 40;
        var value = 0;
        while (bytes2.length() > 0) {
          b = bytes2.getByte();
          value = value << 7;
          if (b & 128) {
            value += b & 127;
          } else {
            oid += "." + (value + b);
            value = 0;
          }
        }
        return oid;
      };
      asn1.utcTimeToDate = function(utc) {
        var date = new Date();
        var year = parseInt(utc.substr(0, 2), 10);
        year = year >= 50 ? 1900 + year : 2e3 + year;
        var MM = parseInt(utc.substr(2, 2), 10) - 1;
        var DD = parseInt(utc.substr(4, 2), 10);
        var hh = parseInt(utc.substr(6, 2), 10);
        var mm = parseInt(utc.substr(8, 2), 10);
        var ss = 0;
        if (utc.length > 11) {
          var c = utc.charAt(10);
          var end = 10;
          if (c !== "+" && c !== "-") {
            ss = parseInt(utc.substr(10, 2), 10);
            end += 2;
          }
        }
        date.setUTCFullYear(year, MM, DD);
        date.setUTCHours(hh, mm, ss, 0);
        if (end) {
          c = utc.charAt(end);
          if (c === "+" || c === "-") {
            var hhoffset = parseInt(utc.substr(end + 1, 2), 10);
            var mmoffset = parseInt(utc.substr(end + 4, 2), 10);
            var offset = hhoffset * 60 + mmoffset;
            offset *= 6e4;
            if (c === "+") {
              date.setTime(+date - offset);
            } else {
              date.setTime(+date + offset);
            }
          }
        }
        return date;
      };
      asn1.generalizedTimeToDate = function(gentime) {
        var date = new Date();
        var YYYY = parseInt(gentime.substr(0, 4), 10);
        var MM = parseInt(gentime.substr(4, 2), 10) - 1;
        var DD = parseInt(gentime.substr(6, 2), 10);
        var hh = parseInt(gentime.substr(8, 2), 10);
        var mm = parseInt(gentime.substr(10, 2), 10);
        var ss = parseInt(gentime.substr(12, 2), 10);
        var fff = 0;
        var offset = 0;
        var isUTC = false;
        if (gentime.charAt(gentime.length - 1) === "Z") {
          isUTC = true;
        }
        var end = gentime.length - 5, c = gentime.charAt(end);
        if (c === "+" || c === "-") {
          var hhoffset = parseInt(gentime.substr(end + 1, 2), 10);
          var mmoffset = parseInt(gentime.substr(end + 4, 2), 10);
          offset = hhoffset * 60 + mmoffset;
          offset *= 6e4;
          if (c === "+") {
            offset *= -1;
          }
          isUTC = true;
        }
        if (gentime.charAt(14) === ".") {
          fff = parseFloat(gentime.substr(14), 10) * 1e3;
        }
        if (isUTC) {
          date.setUTCFullYear(YYYY, MM, DD);
          date.setUTCHours(hh, mm, ss, fff);
          date.setTime(+date + offset);
        } else {
          date.setFullYear(YYYY, MM, DD);
          date.setHours(hh, mm, ss, fff);
        }
        return date;
      };
      asn1.dateToUtcTime = function(date) {
        if (typeof date === "string") {
          return date;
        }
        var rval = "";
        var format = [];
        format.push(("" + date.getUTCFullYear()).substr(2));
        format.push("" + (date.getUTCMonth() + 1));
        format.push("" + date.getUTCDate());
        format.push("" + date.getUTCHours());
        format.push("" + date.getUTCMinutes());
        format.push("" + date.getUTCSeconds());
        for (var i = 0; i < format.length; ++i) {
          if (format[i].length < 2) {
            rval += "0";
          }
          rval += format[i];
        }
        rval += "Z";
        return rval;
      };
      asn1.dateToGeneralizedTime = function(date) {
        if (typeof date === "string") {
          return date;
        }
        var rval = "";
        var format = [];
        format.push("" + date.getUTCFullYear());
        format.push("" + (date.getUTCMonth() + 1));
        format.push("" + date.getUTCDate());
        format.push("" + date.getUTCHours());
        format.push("" + date.getUTCMinutes());
        format.push("" + date.getUTCSeconds());
        for (var i = 0; i < format.length; ++i) {
          if (format[i].length < 2) {
            rval += "0";
          }
          rval += format[i];
        }
        rval += "Z";
        return rval;
      };
      asn1.integerToDer = function(x) {
        var rval = forge6.util.createBuffer();
        if (x >= -128 && x < 128) {
          return rval.putSignedInt(x, 8);
        }
        if (x >= -32768 && x < 32768) {
          return rval.putSignedInt(x, 16);
        }
        if (x >= -8388608 && x < 8388608) {
          return rval.putSignedInt(x, 24);
        }
        if (x >= -2147483648 && x < 2147483648) {
          return rval.putSignedInt(x, 32);
        }
        var error = new Error("Integer too large; max is 32-bits.");
        error.integer = x;
        throw error;
      };
      asn1.derToInteger = function(bytes2) {
        if (typeof bytes2 === "string") {
          bytes2 = forge6.util.createBuffer(bytes2);
        }
        var n = bytes2.length() * 8;
        if (n > 32) {
          throw new Error("Integer too large; max is 32-bits.");
        }
        return bytes2.getSignedInt(n);
      };
      asn1.validate = function(obj, v, capture, errors) {
        var rval = false;
        if ((obj.tagClass === v.tagClass || typeof v.tagClass === "undefined") && (obj.type === v.type || typeof v.type === "undefined")) {
          if (obj.constructed === v.constructed || typeof v.constructed === "undefined") {
            rval = true;
            if (v.value && forge6.util.isArray(v.value)) {
              var j = 0;
              for (var i = 0; rval && i < v.value.length; ++i) {
                rval = v.value[i].optional || false;
                if (obj.value[j]) {
                  rval = asn1.validate(obj.value[j], v.value[i], capture, errors);
                  if (rval) {
                    ++j;
                  } else if (v.value[i].optional) {
                    rval = true;
                  }
                }
                if (!rval && errors) {
                  errors.push("[" + v.name + '] Tag class "' + v.tagClass + '", type "' + v.type + '" expected value length "' + v.value.length + '", got "' + obj.value.length + '"');
                }
              }
            }
            if (rval && capture) {
              if (v.capture) {
                capture[v.capture] = obj.value;
              }
              if (v.captureAsn1) {
                capture[v.captureAsn1] = obj;
              }
              if (v.captureBitStringContents && "bitStringContents" in obj) {
                capture[v.captureBitStringContents] = obj.bitStringContents;
              }
              if (v.captureBitStringValue && "bitStringContents" in obj) {
                var value;
                if (obj.bitStringContents.length < 2) {
                  capture[v.captureBitStringValue] = "";
                } else {
                  var unused = obj.bitStringContents.charCodeAt(0);
                  if (unused !== 0) {
                    throw new Error("captureBitStringValue only supported for zero unused bits");
                  }
                  capture[v.captureBitStringValue] = obj.bitStringContents.slice(1);
                }
              }
            }
          } else if (errors) {
            errors.push("[" + v.name + '] Expected constructed "' + v.constructed + '", got "' + obj.constructed + '"');
          }
        } else if (errors) {
          if (obj.tagClass !== v.tagClass) {
            errors.push("[" + v.name + '] Expected tag class "' + v.tagClass + '", got "' + obj.tagClass + '"');
          }
          if (obj.type !== v.type) {
            errors.push("[" + v.name + '] Expected type "' + v.type + '", got "' + obj.type + '"');
          }
        }
        return rval;
      };
      var _nonLatinRegex = /[^\\u0000-\\u00ff]/;
      asn1.prettyPrint = function(obj, level, indentation) {
        var rval = "";
        level = level || 0;
        indentation = indentation || 2;
        if (level > 0) {
          rval += "\n";
        }
        var indent = "";
        for (var i = 0; i < level * indentation; ++i) {
          indent += " ";
        }
        rval += indent + "Tag: ";
        switch (obj.tagClass) {
          case asn1.Class.UNIVERSAL:
            rval += "Universal:";
            break;
          case asn1.Class.APPLICATION:
            rval += "Application:";
            break;
          case asn1.Class.CONTEXT_SPECIFIC:
            rval += "Context-Specific:";
            break;
          case asn1.Class.PRIVATE:
            rval += "Private:";
            break;
        }
        if (obj.tagClass === asn1.Class.UNIVERSAL) {
          rval += obj.type;
          switch (obj.type) {
            case asn1.Type.NONE:
              rval += " (None)";
              break;
            case asn1.Type.BOOLEAN:
              rval += " (Boolean)";
              break;
            case asn1.Type.INTEGER:
              rval += " (Integer)";
              break;
            case asn1.Type.BITSTRING:
              rval += " (Bit string)";
              break;
            case asn1.Type.OCTETSTRING:
              rval += " (Octet string)";
              break;
            case asn1.Type.NULL:
              rval += " (Null)";
              break;
            case asn1.Type.OID:
              rval += " (Object Identifier)";
              break;
            case asn1.Type.ODESC:
              rval += " (Object Descriptor)";
              break;
            case asn1.Type.EXTERNAL:
              rval += " (External or Instance of)";
              break;
            case asn1.Type.REAL:
              rval += " (Real)";
              break;
            case asn1.Type.ENUMERATED:
              rval += " (Enumerated)";
              break;
            case asn1.Type.EMBEDDED:
              rval += " (Embedded PDV)";
              break;
            case asn1.Type.UTF8:
              rval += " (UTF8)";
              break;
            case asn1.Type.ROID:
              rval += " (Relative Object Identifier)";
              break;
            case asn1.Type.SEQUENCE:
              rval += " (Sequence)";
              break;
            case asn1.Type.SET:
              rval += " (Set)";
              break;
            case asn1.Type.PRINTABLESTRING:
              rval += " (Printable String)";
              break;
            case asn1.Type.IA5String:
              rval += " (IA5String (ASCII))";
              break;
            case asn1.Type.UTCTIME:
              rval += " (UTC time)";
              break;
            case asn1.Type.GENERALIZEDTIME:
              rval += " (Generalized time)";
              break;
            case asn1.Type.BMPSTRING:
              rval += " (BMP String)";
              break;
          }
        } else {
          rval += obj.type;
        }
        rval += "\n";
        rval += indent + "Constructed: " + obj.constructed + "\n";
        if (obj.composed) {
          var subvalues = 0;
          var sub = "";
          for (var i = 0; i < obj.value.length; ++i) {
            if (obj.value[i] !== void 0) {
              subvalues += 1;
              sub += asn1.prettyPrint(obj.value[i], level + 1, indentation);
              if (i + 1 < obj.value.length) {
                sub += ",";
              }
            }
          }
          rval += indent + "Sub values: " + subvalues + sub;
        } else {
          rval += indent + "Value: ";
          if (obj.type === asn1.Type.OID) {
            var oid = asn1.derToOid(obj.value);
            rval += oid;
            if (forge6.pki && forge6.pki.oids) {
              if (oid in forge6.pki.oids) {
                rval += " (" + forge6.pki.oids[oid] + ") ";
              }
            }
          }
          if (obj.type === asn1.Type.INTEGER) {
            try {
              rval += asn1.derToInteger(obj.value);
            } catch (ex) {
              rval += "0x" + forge6.util.bytesToHex(obj.value);
            }
          } else if (obj.type === asn1.Type.BITSTRING) {
            if (obj.value.length > 1) {
              rval += "0x" + forge6.util.bytesToHex(obj.value.slice(1));
            } else {
              rval += "(none)";
            }
            if (obj.value.length > 0) {
              var unused = obj.value.charCodeAt(0);
              if (unused == 1) {
                rval += " (1 unused bit shown)";
              } else if (unused > 1) {
                rval += " (" + unused + " unused bits shown)";
              }
            }
          } else if (obj.type === asn1.Type.OCTETSTRING) {
            if (!_nonLatinRegex.test(obj.value)) {
              rval += "(" + obj.value + ") ";
            }
            rval += "0x" + forge6.util.bytesToHex(obj.value);
          } else if (obj.type === asn1.Type.UTF8) {
            try {
              rval += forge6.util.decodeUtf8(obj.value);
            } catch (e) {
              if (e.message === "URI malformed") {
                rval += "0x" + forge6.util.bytesToHex(obj.value) + " (malformed UTF8)";
              } else {
                throw e;
              }
            }
          } else if (obj.type === asn1.Type.PRINTABLESTRING || obj.type === asn1.Type.IA5String) {
            rval += obj.value;
          } else if (_nonLatinRegex.test(obj.value)) {
            rval += "0x" + forge6.util.bytesToHex(obj.value);
          } else if (obj.value.length === 0) {
            rval += "[null]";
          } else {
            rval += obj.value;
          }
        }
        return rval;
      };
    }
  });

  // ../node_modules/node-forge/lib/cipher.js
  var require_cipher = __commonJS({
    "../node_modules/node-forge/lib/cipher.js"(exports2, module2) {
      var forge6 = require_forge();
      require_util();
      module2.exports = forge6.cipher = forge6.cipher || {};
      forge6.cipher.algorithms = forge6.cipher.algorithms || {};
      forge6.cipher.createCipher = function(algorithm, key) {
        var api = algorithm;
        if (typeof api === "string") {
          api = forge6.cipher.getAlgorithm(api);
          if (api) {
            api = api();
          }
        }
        if (!api) {
          throw new Error("Unsupported algorithm: " + algorithm);
        }
        return new forge6.cipher.BlockCipher({
          algorithm: api,
          key,
          decrypt: false
        });
      };
      forge6.cipher.createDecipher = function(algorithm, key) {
        var api = algorithm;
        if (typeof api === "string") {
          api = forge6.cipher.getAlgorithm(api);
          if (api) {
            api = api();
          }
        }
        if (!api) {
          throw new Error("Unsupported algorithm: " + algorithm);
        }
        return new forge6.cipher.BlockCipher({
          algorithm: api,
          key,
          decrypt: true
        });
      };
      forge6.cipher.registerAlgorithm = function(name2, algorithm) {
        name2 = name2.toUpperCase();
        forge6.cipher.algorithms[name2] = algorithm;
      };
      forge6.cipher.getAlgorithm = function(name2) {
        name2 = name2.toUpperCase();
        if (name2 in forge6.cipher.algorithms) {
          return forge6.cipher.algorithms[name2];
        }
        return null;
      };
      var BlockCipher = forge6.cipher.BlockCipher = function(options) {
        this.algorithm = options.algorithm;
        this.mode = this.algorithm.mode;
        this.blockSize = this.mode.blockSize;
        this._finish = false;
        this._input = null;
        this.output = null;
        this._op = options.decrypt ? this.mode.decrypt : this.mode.encrypt;
        this._decrypt = options.decrypt;
        this.algorithm.initialize(options);
      };
      BlockCipher.prototype.start = function(options) {
        options = options || {};
        var opts = {};
        for (var key in options) {
          opts[key] = options[key];
        }
        opts.decrypt = this._decrypt;
        this._finish = false;
        this._input = forge6.util.createBuffer();
        this.output = options.output || forge6.util.createBuffer();
        this.mode.start(opts);
      };
      BlockCipher.prototype.update = function(input) {
        if (input) {
          this._input.putBuffer(input);
        }
        while (!this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish) {
        }
        this._input.compact();
      };
      BlockCipher.prototype.finish = function(pad) {
        if (pad && (this.mode.name === "ECB" || this.mode.name === "CBC")) {
          this.mode.pad = function(input) {
            return pad(this.blockSize, input, false);
          };
          this.mode.unpad = function(output) {
            return pad(this.blockSize, output, true);
          };
        }
        var options = {};
        options.decrypt = this._decrypt;
        options.overflow = this._input.length() % this.blockSize;
        if (!this._decrypt && this.mode.pad) {
          if (!this.mode.pad(this._input, options)) {
            return false;
          }
        }
        this._finish = true;
        this.update();
        if (this._decrypt && this.mode.unpad) {
          if (!this.mode.unpad(this.output, options)) {
            return false;
          }
        }
        if (this.mode.afterFinish) {
          if (!this.mode.afterFinish(this.output, options)) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // ../node_modules/node-forge/lib/cipherModes.js
  var require_cipherModes = __commonJS({
    "../node_modules/node-forge/lib/cipherModes.js"(exports2, module2) {
      var forge6 = require_forge();
      require_util();
      forge6.cipher = forge6.cipher || {};
      var modes = module2.exports = forge6.cipher.modes = forge6.cipher.modes || {};
      modes.ecb = function(options) {
        options = options || {};
        this.name = "ECB";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = new Array(this._ints);
        this._outBlock = new Array(this._ints);
      };
      modes.ecb.prototype.start = function(options) {
      };
      modes.ecb.prototype.encrypt = function(input, output, finish) {
        if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
          return true;
        }
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = input.getInt32();
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._outBlock[i]);
        }
      };
      modes.ecb.prototype.decrypt = function(input, output, finish) {
        if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
          return true;
        }
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = input.getInt32();
        }
        this.cipher.decrypt(this._inBlock, this._outBlock);
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._outBlock[i]);
        }
      };
      modes.ecb.prototype.pad = function(input, options) {
        var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
        input.fillWithByte(padding, padding);
        return true;
      };
      modes.ecb.prototype.unpad = function(output, options) {
        if (options.overflow > 0) {
          return false;
        }
        var len = output.length();
        var count = output.at(len - 1);
        if (count > this.blockSize << 2) {
          return false;
        }
        output.truncate(count);
        return true;
      };
      modes.cbc = function(options) {
        options = options || {};
        this.name = "CBC";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = new Array(this._ints);
        this._outBlock = new Array(this._ints);
      };
      modes.cbc.prototype.start = function(options) {
        if (options.iv === null) {
          if (!this._prev) {
            throw new Error("Invalid IV parameter.");
          }
          this._iv = this._prev.slice(0);
        } else if (!("iv" in options)) {
          throw new Error("Invalid IV parameter.");
        } else {
          this._iv = transformIV(options.iv, this.blockSize);
          this._prev = this._iv.slice(0);
        }
      };
      modes.cbc.prototype.encrypt = function(input, output, finish) {
        if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
          return true;
        }
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = this._prev[i] ^ input.getInt32();
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._outBlock[i]);
        }
        this._prev = this._outBlock;
      };
      modes.cbc.prototype.decrypt = function(input, output, finish) {
        if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
          return true;
        }
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = input.getInt32();
        }
        this.cipher.decrypt(this._inBlock, this._outBlock);
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._prev[i] ^ this._outBlock[i]);
        }
        this._prev = this._inBlock.slice(0);
      };
      modes.cbc.prototype.pad = function(input, options) {
        var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
        input.fillWithByte(padding, padding);
        return true;
      };
      modes.cbc.prototype.unpad = function(output, options) {
        if (options.overflow > 0) {
          return false;
        }
        var len = output.length();
        var count = output.at(len - 1);
        if (count > this.blockSize << 2) {
          return false;
        }
        output.truncate(count);
        return true;
      };
      modes.cfb = function(options) {
        options = options || {};
        this.name = "CFB";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = null;
        this._outBlock = new Array(this._ints);
        this._partialBlock = new Array(this._ints);
        this._partialOutput = forge6.util.createBuffer();
        this._partialBytes = 0;
      };
      modes.cfb.prototype.start = function(options) {
        if (!("iv" in options)) {
          throw new Error("Invalid IV parameter.");
        }
        this._iv = transformIV(options.iv, this.blockSize);
        this._inBlock = this._iv.slice(0);
        this._partialBytes = 0;
      };
      modes.cfb.prototype.encrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (inputLength === 0) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        if (this._partialBytes === 0 && inputLength >= this.blockSize) {
          for (var i = 0; i < this._ints; ++i) {
            this._inBlock[i] = input.getInt32() ^ this._outBlock[i];
            output.putInt32(this._inBlock[i]);
          }
          return;
        }
        var partialBytes = (this.blockSize - inputLength) % this.blockSize;
        if (partialBytes > 0) {
          partialBytes = this.blockSize - partialBytes;
        }
        this._partialOutput.clear();
        for (var i = 0; i < this._ints; ++i) {
          this._partialBlock[i] = input.getInt32() ^ this._outBlock[i];
          this._partialOutput.putInt32(this._partialBlock[i]);
        }
        if (partialBytes > 0) {
          input.read -= this.blockSize;
        } else {
          for (var i = 0; i < this._ints; ++i) {
            this._inBlock[i] = this._partialBlock[i];
          }
        }
        if (this._partialBytes > 0) {
          this._partialOutput.getBytes(this._partialBytes);
        }
        if (partialBytes > 0 && !finish) {
          output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
          this._partialBytes = partialBytes;
          return true;
        }
        output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
        this._partialBytes = 0;
      };
      modes.cfb.prototype.decrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (inputLength === 0) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        if (this._partialBytes === 0 && inputLength >= this.blockSize) {
          for (var i = 0; i < this._ints; ++i) {
            this._inBlock[i] = input.getInt32();
            output.putInt32(this._inBlock[i] ^ this._outBlock[i]);
          }
          return;
        }
        var partialBytes = (this.blockSize - inputLength) % this.blockSize;
        if (partialBytes > 0) {
          partialBytes = this.blockSize - partialBytes;
        }
        this._partialOutput.clear();
        for (var i = 0; i < this._ints; ++i) {
          this._partialBlock[i] = input.getInt32();
          this._partialOutput.putInt32(this._partialBlock[i] ^ this._outBlock[i]);
        }
        if (partialBytes > 0) {
          input.read -= this.blockSize;
        } else {
          for (var i = 0; i < this._ints; ++i) {
            this._inBlock[i] = this._partialBlock[i];
          }
        }
        if (this._partialBytes > 0) {
          this._partialOutput.getBytes(this._partialBytes);
        }
        if (partialBytes > 0 && !finish) {
          output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
          this._partialBytes = partialBytes;
          return true;
        }
        output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
        this._partialBytes = 0;
      };
      modes.ofb = function(options) {
        options = options || {};
        this.name = "OFB";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = null;
        this._outBlock = new Array(this._ints);
        this._partialOutput = forge6.util.createBuffer();
        this._partialBytes = 0;
      };
      modes.ofb.prototype.start = function(options) {
        if (!("iv" in options)) {
          throw new Error("Invalid IV parameter.");
        }
        this._iv = transformIV(options.iv, this.blockSize);
        this._inBlock = this._iv.slice(0);
        this._partialBytes = 0;
      };
      modes.ofb.prototype.encrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (input.length() === 0) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        if (this._partialBytes === 0 && inputLength >= this.blockSize) {
          for (var i = 0; i < this._ints; ++i) {
            output.putInt32(input.getInt32() ^ this._outBlock[i]);
            this._inBlock[i] = this._outBlock[i];
          }
          return;
        }
        var partialBytes = (this.blockSize - inputLength) % this.blockSize;
        if (partialBytes > 0) {
          partialBytes = this.blockSize - partialBytes;
        }
        this._partialOutput.clear();
        for (var i = 0; i < this._ints; ++i) {
          this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
        }
        if (partialBytes > 0) {
          input.read -= this.blockSize;
        } else {
          for (var i = 0; i < this._ints; ++i) {
            this._inBlock[i] = this._outBlock[i];
          }
        }
        if (this._partialBytes > 0) {
          this._partialOutput.getBytes(this._partialBytes);
        }
        if (partialBytes > 0 && !finish) {
          output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
          this._partialBytes = partialBytes;
          return true;
        }
        output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
        this._partialBytes = 0;
      };
      modes.ofb.prototype.decrypt = modes.ofb.prototype.encrypt;
      modes.ctr = function(options) {
        options = options || {};
        this.name = "CTR";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = null;
        this._outBlock = new Array(this._ints);
        this._partialOutput = forge6.util.createBuffer();
        this._partialBytes = 0;
      };
      modes.ctr.prototype.start = function(options) {
        if (!("iv" in options)) {
          throw new Error("Invalid IV parameter.");
        }
        this._iv = transformIV(options.iv, this.blockSize);
        this._inBlock = this._iv.slice(0);
        this._partialBytes = 0;
      };
      modes.ctr.prototype.encrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (inputLength === 0) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        if (this._partialBytes === 0 && inputLength >= this.blockSize) {
          for (var i = 0; i < this._ints; ++i) {
            output.putInt32(input.getInt32() ^ this._outBlock[i]);
          }
        } else {
          var partialBytes = (this.blockSize - inputLength) % this.blockSize;
          if (partialBytes > 0) {
            partialBytes = this.blockSize - partialBytes;
          }
          this._partialOutput.clear();
          for (var i = 0; i < this._ints; ++i) {
            this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
          }
          if (partialBytes > 0) {
            input.read -= this.blockSize;
          }
          if (this._partialBytes > 0) {
            this._partialOutput.getBytes(this._partialBytes);
          }
          if (partialBytes > 0 && !finish) {
            output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
            this._partialBytes = partialBytes;
            return true;
          }
          output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
          this._partialBytes = 0;
        }
        inc32(this._inBlock);
      };
      modes.ctr.prototype.decrypt = modes.ctr.prototype.encrypt;
      modes.gcm = function(options) {
        options = options || {};
        this.name = "GCM";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = new Array(this._ints);
        this._outBlock = new Array(this._ints);
        this._partialOutput = forge6.util.createBuffer();
        this._partialBytes = 0;
        this._R = 3774873600;
      };
      modes.gcm.prototype.start = function(options) {
        if (!("iv" in options)) {
          throw new Error("Invalid IV parameter.");
        }
        var iv = forge6.util.createBuffer(options.iv);
        this._cipherLength = 0;
        var additionalData;
        if ("additionalData" in options) {
          additionalData = forge6.util.createBuffer(options.additionalData);
        } else {
          additionalData = forge6.util.createBuffer();
        }
        if ("tagLength" in options) {
          this._tagLength = options.tagLength;
        } else {
          this._tagLength = 128;
        }
        this._tag = null;
        if (options.decrypt) {
          this._tag = forge6.util.createBuffer(options.tag).getBytes();
          if (this._tag.length !== this._tagLength / 8) {
            throw new Error("Authentication tag does not match tag length.");
          }
        }
        this._hashBlock = new Array(this._ints);
        this.tag = null;
        this._hashSubkey = new Array(this._ints);
        this.cipher.encrypt([0, 0, 0, 0], this._hashSubkey);
        this.componentBits = 4;
        this._m = this.generateHashTable(this._hashSubkey, this.componentBits);
        var ivLength = iv.length();
        if (ivLength === 12) {
          this._j0 = [iv.getInt32(), iv.getInt32(), iv.getInt32(), 1];
        } else {
          this._j0 = [0, 0, 0, 0];
          while (iv.length() > 0) {
            this._j0 = this.ghash(this._hashSubkey, this._j0, [iv.getInt32(), iv.getInt32(), iv.getInt32(), iv.getInt32()]);
          }
          this._j0 = this.ghash(this._hashSubkey, this._j0, [0, 0].concat(from64To32(ivLength * 8)));
        }
        this._inBlock = this._j0.slice(0);
        inc32(this._inBlock);
        this._partialBytes = 0;
        additionalData = forge6.util.createBuffer(additionalData);
        this._aDataLength = from64To32(additionalData.length() * 8);
        var overflow = additionalData.length() % this.blockSize;
        if (overflow) {
          additionalData.fillWithByte(0, this.blockSize - overflow);
        }
        this._s = [0, 0, 0, 0];
        while (additionalData.length() > 0) {
          this._s = this.ghash(this._hashSubkey, this._s, [
            additionalData.getInt32(),
            additionalData.getInt32(),
            additionalData.getInt32(),
            additionalData.getInt32()
          ]);
        }
      };
      modes.gcm.prototype.encrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (inputLength === 0) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        if (this._partialBytes === 0 && inputLength >= this.blockSize) {
          for (var i = 0; i < this._ints; ++i) {
            output.putInt32(this._outBlock[i] ^= input.getInt32());
          }
          this._cipherLength += this.blockSize;
        } else {
          var partialBytes = (this.blockSize - inputLength) % this.blockSize;
          if (partialBytes > 0) {
            partialBytes = this.blockSize - partialBytes;
          }
          this._partialOutput.clear();
          for (var i = 0; i < this._ints; ++i) {
            this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
          }
          if (partialBytes <= 0 || finish) {
            if (finish) {
              var overflow = inputLength % this.blockSize;
              this._cipherLength += overflow;
              this._partialOutput.truncate(this.blockSize - overflow);
            } else {
              this._cipherLength += this.blockSize;
            }
            for (var i = 0; i < this._ints; ++i) {
              this._outBlock[i] = this._partialOutput.getInt32();
            }
            this._partialOutput.read -= this.blockSize;
          }
          if (this._partialBytes > 0) {
            this._partialOutput.getBytes(this._partialBytes);
          }
          if (partialBytes > 0 && !finish) {
            input.read -= this.blockSize;
            output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
            this._partialBytes = partialBytes;
            return true;
          }
          output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
          this._partialBytes = 0;
        }
        this._s = this.ghash(this._hashSubkey, this._s, this._outBlock);
        inc32(this._inBlock);
      };
      modes.gcm.prototype.decrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (inputLength < this.blockSize && !(finish && inputLength > 0)) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        inc32(this._inBlock);
        this._hashBlock[0] = input.getInt32();
        this._hashBlock[1] = input.getInt32();
        this._hashBlock[2] = input.getInt32();
        this._hashBlock[3] = input.getInt32();
        this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock);
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._outBlock[i] ^ this._hashBlock[i]);
        }
        if (inputLength < this.blockSize) {
          this._cipherLength += inputLength % this.blockSize;
        } else {
          this._cipherLength += this.blockSize;
        }
      };
      modes.gcm.prototype.afterFinish = function(output, options) {
        var rval = true;
        if (options.decrypt && options.overflow) {
          output.truncate(this.blockSize - options.overflow);
        }
        this.tag = forge6.util.createBuffer();
        var lengths = this._aDataLength.concat(from64To32(this._cipherLength * 8));
        this._s = this.ghash(this._hashSubkey, this._s, lengths);
        var tag = [];
        this.cipher.encrypt(this._j0, tag);
        for (var i = 0; i < this._ints; ++i) {
          this.tag.putInt32(this._s[i] ^ tag[i]);
        }
        this.tag.truncate(this.tag.length() % (this._tagLength / 8));
        if (options.decrypt && this.tag.bytes() !== this._tag) {
          rval = false;
        }
        return rval;
      };
      modes.gcm.prototype.multiply = function(x, y) {
        var z_i = [0, 0, 0, 0];
        var v_i = y.slice(0);
        for (var i = 0; i < 128; ++i) {
          var x_i = x[i / 32 | 0] & 1 << 31 - i % 32;
          if (x_i) {
            z_i[0] ^= v_i[0];
            z_i[1] ^= v_i[1];
            z_i[2] ^= v_i[2];
            z_i[3] ^= v_i[3];
          }
          this.pow(v_i, v_i);
        }
        return z_i;
      };
      modes.gcm.prototype.pow = function(x, out) {
        var lsb = x[3] & 1;
        for (var i = 3; i > 0; --i) {
          out[i] = x[i] >>> 1 | (x[i - 1] & 1) << 31;
        }
        out[0] = x[0] >>> 1;
        if (lsb) {
          out[0] ^= this._R;
        }
      };
      modes.gcm.prototype.tableMultiply = function(x) {
        var z = [0, 0, 0, 0];
        for (var i = 0; i < 32; ++i) {
          var idx = i / 8 | 0;
          var x_i = x[idx] >>> (7 - i % 8) * 4 & 15;
          var ah = this._m[i][x_i];
          z[0] ^= ah[0];
          z[1] ^= ah[1];
          z[2] ^= ah[2];
          z[3] ^= ah[3];
        }
        return z;
      };
      modes.gcm.prototype.ghash = function(h, y, x) {
        y[0] ^= x[0];
        y[1] ^= x[1];
        y[2] ^= x[2];
        y[3] ^= x[3];
        return this.tableMultiply(y);
      };
      modes.gcm.prototype.generateHashTable = function(h, bits2) {
        var multiplier = 8 / bits2;
        var perInt = 4 * multiplier;
        var size = 16 * multiplier;
        var m = new Array(size);
        for (var i = 0; i < size; ++i) {
          var tmp = [0, 0, 0, 0];
          var idx = i / perInt | 0;
          var shft = (perInt - 1 - i % perInt) * bits2;
          tmp[idx] = 1 << bits2 - 1 << shft;
          m[i] = this.generateSubHashTable(this.multiply(tmp, h), bits2);
        }
        return m;
      };
      modes.gcm.prototype.generateSubHashTable = function(mid, bits2) {
        var size = 1 << bits2;
        var half = size >>> 1;
        var m = new Array(size);
        m[half] = mid.slice(0);
        var i = half >>> 1;
        while (i > 0) {
          this.pow(m[2 * i], m[i] = []);
          i >>= 1;
        }
        i = 2;
        while (i < half) {
          for (var j = 1; j < i; ++j) {
            var m_i = m[i];
            var m_j = m[j];
            m[i + j] = [
              m_i[0] ^ m_j[0],
              m_i[1] ^ m_j[1],
              m_i[2] ^ m_j[2],
              m_i[3] ^ m_j[3]
            ];
          }
          i *= 2;
        }
        m[0] = [0, 0, 0, 0];
        for (i = half + 1; i < size; ++i) {
          var c = m[i ^ half];
          m[i] = [mid[0] ^ c[0], mid[1] ^ c[1], mid[2] ^ c[2], mid[3] ^ c[3]];
        }
        return m;
      };
      function transformIV(iv, blockSize) {
        if (typeof iv === "string") {
          iv = forge6.util.createBuffer(iv);
        }
        if (forge6.util.isArray(iv) && iv.length > 4) {
          var tmp = iv;
          iv = forge6.util.createBuffer();
          for (var i = 0; i < tmp.length; ++i) {
            iv.putByte(tmp[i]);
          }
        }
        if (iv.length() < blockSize) {
          throw new Error("Invalid IV length; got " + iv.length() + " bytes and expected " + blockSize + " bytes.");
        }
        if (!forge6.util.isArray(iv)) {
          var ints = [];
          var blocks = blockSize / 4;
          for (var i = 0; i < blocks; ++i) {
            ints.push(iv.getInt32());
          }
          iv = ints;
        }
        return iv;
      }
      function inc32(block) {
        block[block.length - 1] = block[block.length - 1] + 1 & 4294967295;
      }
      function from64To32(num) {
        return [num / 4294967296 | 0, num & 4294967295];
      }
    }
  });

  // ../node_modules/node-forge/lib/aes.js
  var require_aes = __commonJS({
    "../node_modules/node-forge/lib/aes.js"(exports2, module2) {
      var forge6 = require_forge();
      require_cipher();
      require_cipherModes();
      require_util();
      module2.exports = forge6.aes = forge6.aes || {};
      forge6.aes.startEncrypting = function(key, iv, output, mode) {
        var cipher = _createCipher({
          key,
          output,
          decrypt: false,
          mode
        });
        cipher.start(iv);
        return cipher;
      };
      forge6.aes.createEncryptionCipher = function(key, mode) {
        return _createCipher({
          key,
          output: null,
          decrypt: false,
          mode
        });
      };
      forge6.aes.startDecrypting = function(key, iv, output, mode) {
        var cipher = _createCipher({
          key,
          output,
          decrypt: true,
          mode
        });
        cipher.start(iv);
        return cipher;
      };
      forge6.aes.createDecryptionCipher = function(key, mode) {
        return _createCipher({
          key,
          output: null,
          decrypt: true,
          mode
        });
      };
      forge6.aes.Algorithm = function(name2, mode) {
        if (!init) {
          initialize();
        }
        var self2 = this;
        self2.name = name2;
        self2.mode = new mode({
          blockSize: 16,
          cipher: {
            encrypt: function(inBlock, outBlock) {
              return _updateBlock(self2._w, inBlock, outBlock, false);
            },
            decrypt: function(inBlock, outBlock) {
              return _updateBlock(self2._w, inBlock, outBlock, true);
            }
          }
        });
        self2._init = false;
      };
      forge6.aes.Algorithm.prototype.initialize = function(options) {
        if (this._init) {
          return;
        }
        var key = options.key;
        var tmp;
        if (typeof key === "string" && (key.length === 16 || key.length === 24 || key.length === 32)) {
          key = forge6.util.createBuffer(key);
        } else if (forge6.util.isArray(key) && (key.length === 16 || key.length === 24 || key.length === 32)) {
          tmp = key;
          key = forge6.util.createBuffer();
          for (var i = 0; i < tmp.length; ++i) {
            key.putByte(tmp[i]);
          }
        }
        if (!forge6.util.isArray(key)) {
          tmp = key;
          key = [];
          var len = tmp.length();
          if (len === 16 || len === 24 || len === 32) {
            len = len >>> 2;
            for (var i = 0; i < len; ++i) {
              key.push(tmp.getInt32());
            }
          }
        }
        if (!forge6.util.isArray(key) || !(key.length === 4 || key.length === 6 || key.length === 8)) {
          throw new Error("Invalid key parameter.");
        }
        var mode = this.mode.name;
        var encryptOp = ["CFB", "OFB", "CTR", "GCM"].indexOf(mode) !== -1;
        this._w = _expandKey(key, options.decrypt && !encryptOp);
        this._init = true;
      };
      forge6.aes._expandKey = function(key, decrypt2) {
        if (!init) {
          initialize();
        }
        return _expandKey(key, decrypt2);
      };
      forge6.aes._updateBlock = _updateBlock;
      registerAlgorithm("AES-ECB", forge6.cipher.modes.ecb);
      registerAlgorithm("AES-CBC", forge6.cipher.modes.cbc);
      registerAlgorithm("AES-CFB", forge6.cipher.modes.cfb);
      registerAlgorithm("AES-OFB", forge6.cipher.modes.ofb);
      registerAlgorithm("AES-CTR", forge6.cipher.modes.ctr);
      registerAlgorithm("AES-GCM", forge6.cipher.modes.gcm);
      function registerAlgorithm(name2, mode) {
        var factory = function() {
          return new forge6.aes.Algorithm(name2, mode);
        };
        forge6.cipher.registerAlgorithm(name2, factory);
      }
      var init = false;
      var Nb = 4;
      var sbox;
      var isbox;
      var rcon;
      var mix;
      var imix;
      function initialize() {
        init = true;
        rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
        var xtime = new Array(256);
        for (var i = 0; i < 128; ++i) {
          xtime[i] = i << 1;
          xtime[i + 128] = i + 128 << 1 ^ 283;
        }
        sbox = new Array(256);
        isbox = new Array(256);
        mix = new Array(4);
        imix = new Array(4);
        for (var i = 0; i < 4; ++i) {
          mix[i] = new Array(256);
          imix[i] = new Array(256);
        }
        var e = 0, ei = 0, e2, e4, e8, sx, sx2, me, ime;
        for (var i = 0; i < 256; ++i) {
          sx = ei ^ ei << 1 ^ ei << 2 ^ ei << 3 ^ ei << 4;
          sx = sx >> 8 ^ sx & 255 ^ 99;
          sbox[e] = sx;
          isbox[sx] = e;
          sx2 = xtime[sx];
          e2 = xtime[e];
          e4 = xtime[e2];
          e8 = xtime[e4];
          me = sx2 << 24 ^ sx << 16 ^ sx << 8 ^ (sx ^ sx2);
          ime = (e2 ^ e4 ^ e8) << 24 ^ (e ^ e8) << 16 ^ (e ^ e4 ^ e8) << 8 ^ (e ^ e2 ^ e8);
          for (var n = 0; n < 4; ++n) {
            mix[n][e] = me;
            imix[n][sx] = ime;
            me = me << 24 | me >>> 8;
            ime = ime << 24 | ime >>> 8;
          }
          if (e === 0) {
            e = ei = 1;
          } else {
            e = e2 ^ xtime[xtime[xtime[e2 ^ e8]]];
            ei ^= xtime[xtime[ei]];
          }
        }
      }
      function _expandKey(key, decrypt2) {
        var w = key.slice(0);
        var temp, iNk = 1;
        var Nk = w.length;
        var Nr1 = Nk + 6 + 1;
        var end = Nb * Nr1;
        for (var i = Nk; i < end; ++i) {
          temp = w[i - 1];
          if (i % Nk === 0) {
            temp = sbox[temp >>> 16 & 255] << 24 ^ sbox[temp >>> 8 & 255] << 16 ^ sbox[temp & 255] << 8 ^ sbox[temp >>> 24] ^ rcon[iNk] << 24;
            iNk++;
          } else if (Nk > 6 && i % Nk === 4) {
            temp = sbox[temp >>> 24] << 24 ^ sbox[temp >>> 16 & 255] << 16 ^ sbox[temp >>> 8 & 255] << 8 ^ sbox[temp & 255];
          }
          w[i] = w[i - Nk] ^ temp;
        }
        if (decrypt2) {
          var tmp;
          var m0 = imix[0];
          var m1 = imix[1];
          var m2 = imix[2];
          var m3 = imix[3];
          var wnew = w.slice(0);
          end = w.length;
          for (var i = 0, wi = end - Nb; i < end; i += Nb, wi -= Nb) {
            if (i === 0 || i === end - Nb) {
              wnew[i] = w[wi];
              wnew[i + 1] = w[wi + 3];
              wnew[i + 2] = w[wi + 2];
              wnew[i + 3] = w[wi + 1];
            } else {
              for (var n = 0; n < Nb; ++n) {
                tmp = w[wi + n];
                wnew[i + (3 & -n)] = m0[sbox[tmp >>> 24]] ^ m1[sbox[tmp >>> 16 & 255]] ^ m2[sbox[tmp >>> 8 & 255]] ^ m3[sbox[tmp & 255]];
              }
            }
          }
          w = wnew;
        }
        return w;
      }
      function _updateBlock(w, input, output, decrypt2) {
        var Nr = w.length / 4 - 1;
        var m0, m1, m2, m3, sub;
        if (decrypt2) {
          m0 = imix[0];
          m1 = imix[1];
          m2 = imix[2];
          m3 = imix[3];
          sub = isbox;
        } else {
          m0 = mix[0];
          m1 = mix[1];
          m2 = mix[2];
          m3 = mix[3];
          sub = sbox;
        }
        var a, b, c, d, a2, b2, c2;
        a = input[0] ^ w[0];
        b = input[decrypt2 ? 3 : 1] ^ w[1];
        c = input[2] ^ w[2];
        d = input[decrypt2 ? 1 : 3] ^ w[3];
        var i = 3;
        for (var round = 1; round < Nr; ++round) {
          a2 = m0[a >>> 24] ^ m1[b >>> 16 & 255] ^ m2[c >>> 8 & 255] ^ m3[d & 255] ^ w[++i];
          b2 = m0[b >>> 24] ^ m1[c >>> 16 & 255] ^ m2[d >>> 8 & 255] ^ m3[a & 255] ^ w[++i];
          c2 = m0[c >>> 24] ^ m1[d >>> 16 & 255] ^ m2[a >>> 8 & 255] ^ m3[b & 255] ^ w[++i];
          d = m0[d >>> 24] ^ m1[a >>> 16 & 255] ^ m2[b >>> 8 & 255] ^ m3[c & 255] ^ w[++i];
          a = a2;
          b = b2;
          c = c2;
        }
        output[0] = sub[a >>> 24] << 24 ^ sub[b >>> 16 & 255] << 16 ^ sub[c >>> 8 & 255] << 8 ^ sub[d & 255] ^ w[++i];
        output[decrypt2 ? 3 : 1] = sub[b >>> 24] << 24 ^ sub[c >>> 16 & 255] << 16 ^ sub[d >>> 8 & 255] << 8 ^ sub[a & 255] ^ w[++i];
        output[2] = sub[c >>> 24] << 24 ^ sub[d >>> 16 & 255] << 16 ^ sub[a >>> 8 & 255] << 8 ^ sub[b & 255] ^ w[++i];
        output[decrypt2 ? 1 : 3] = sub[d >>> 24] << 24 ^ sub[a >>> 16 & 255] << 16 ^ sub[b >>> 8 & 255] << 8 ^ sub[c & 255] ^ w[++i];
      }
      function _createCipher(options) {
        options = options || {};
        var mode = (options.mode || "CBC").toUpperCase();
        var algorithm = "AES-" + mode;
        var cipher;
        if (options.decrypt) {
          cipher = forge6.cipher.createDecipher(algorithm, options.key);
        } else {
          cipher = forge6.cipher.createCipher(algorithm, options.key);
        }
        var start = cipher.start;
        cipher.start = function(iv, options2) {
          var output = null;
          if (options2 instanceof forge6.util.ByteBuffer) {
            output = options2;
            options2 = {};
          }
          options2 = options2 || {};
          options2.output = output;
          options2.iv = iv;
          start.call(cipher, options2);
        };
        return cipher;
      }
    }
  });

  // ../node_modules/node-forge/lib/des.js
  var require_des = __commonJS({
    "../node_modules/node-forge/lib/des.js"(exports2, module2) {
      var forge6 = require_forge();
      require_cipher();
      require_cipherModes();
      require_util();
      module2.exports = forge6.des = forge6.des || {};
      forge6.des.startEncrypting = function(key, iv, output, mode) {
        var cipher = _createCipher({
          key,
          output,
          decrypt: false,
          mode: mode || (iv === null ? "ECB" : "CBC")
        });
        cipher.start(iv);
        return cipher;
      };
      forge6.des.createEncryptionCipher = function(key, mode) {
        return _createCipher({
          key,
          output: null,
          decrypt: false,
          mode
        });
      };
      forge6.des.startDecrypting = function(key, iv, output, mode) {
        var cipher = _createCipher({
          key,
          output,
          decrypt: true,
          mode: mode || (iv === null ? "ECB" : "CBC")
        });
        cipher.start(iv);
        return cipher;
      };
      forge6.des.createDecryptionCipher = function(key, mode) {
        return _createCipher({
          key,
          output: null,
          decrypt: true,
          mode
        });
      };
      forge6.des.Algorithm = function(name2, mode) {
        var self2 = this;
        self2.name = name2;
        self2.mode = new mode({
          blockSize: 8,
          cipher: {
            encrypt: function(inBlock, outBlock) {
              return _updateBlock(self2._keys, inBlock, outBlock, false);
            },
            decrypt: function(inBlock, outBlock) {
              return _updateBlock(self2._keys, inBlock, outBlock, true);
            }
          }
        });
        self2._init = false;
      };
      forge6.des.Algorithm.prototype.initialize = function(options) {
        if (this._init) {
          return;
        }
        var key = forge6.util.createBuffer(options.key);
        if (this.name.indexOf("3DES") === 0) {
          if (key.length() !== 24) {
            throw new Error("Invalid Triple-DES key size: " + key.length() * 8);
          }
        }
        this._keys = _createKeys(key);
        this._init = true;
      };
      registerAlgorithm("DES-ECB", forge6.cipher.modes.ecb);
      registerAlgorithm("DES-CBC", forge6.cipher.modes.cbc);
      registerAlgorithm("DES-CFB", forge6.cipher.modes.cfb);
      registerAlgorithm("DES-OFB", forge6.cipher.modes.ofb);
      registerAlgorithm("DES-CTR", forge6.cipher.modes.ctr);
      registerAlgorithm("3DES-ECB", forge6.cipher.modes.ecb);
      registerAlgorithm("3DES-CBC", forge6.cipher.modes.cbc);
      registerAlgorithm("3DES-CFB", forge6.cipher.modes.cfb);
      registerAlgorithm("3DES-OFB", forge6.cipher.modes.ofb);
      registerAlgorithm("3DES-CTR", forge6.cipher.modes.ctr);
      function registerAlgorithm(name2, mode) {
        var factory = function() {
          return new forge6.des.Algorithm(name2, mode);
        };
        forge6.cipher.registerAlgorithm(name2, factory);
      }
      var spfunction1 = [16843776, 0, 65536, 16843780, 16842756, 66564, 4, 65536, 1024, 16843776, 16843780, 1024, 16778244, 16842756, 16777216, 4, 1028, 16778240, 16778240, 66560, 66560, 16842752, 16842752, 16778244, 65540, 16777220, 16777220, 65540, 0, 1028, 66564, 16777216, 65536, 16843780, 4, 16842752, 16843776, 16777216, 16777216, 1024, 16842756, 65536, 66560, 16777220, 1024, 4, 16778244, 66564, 16843780, 65540, 16842752, 16778244, 16777220, 1028, 66564, 16843776, 1028, 16778240, 16778240, 0, 65540, 66560, 0, 16842756];
      var spfunction2 = [-2146402272, -2147450880, 32768, 1081376, 1048576, 32, -2146435040, -2147450848, -2147483616, -2146402272, -2146402304, -2147483648, -2147450880, 1048576, 32, -2146435040, 1081344, 1048608, -2147450848, 0, -2147483648, 32768, 1081376, -2146435072, 1048608, -2147483616, 0, 1081344, 32800, -2146402304, -2146435072, 32800, 0, 1081376, -2146435040, 1048576, -2147450848, -2146435072, -2146402304, 32768, -2146435072, -2147450880, 32, -2146402272, 1081376, 32, 32768, -2147483648, 32800, -2146402304, 1048576, -2147483616, 1048608, -2147450848, -2147483616, 1048608, 1081344, 0, -2147450880, 32800, -2147483648, -2146435040, -2146402272, 1081344];
      var spfunction3 = [520, 134349312, 0, 134348808, 134218240, 0, 131592, 134218240, 131080, 134217736, 134217736, 131072, 134349320, 131080, 134348800, 520, 134217728, 8, 134349312, 512, 131584, 134348800, 134348808, 131592, 134218248, 131584, 131072, 134218248, 8, 134349320, 512, 134217728, 134349312, 134217728, 131080, 520, 131072, 134349312, 134218240, 0, 512, 131080, 134349320, 134218240, 134217736, 512, 0, 134348808, 134218248, 131072, 134217728, 134349320, 8, 131592, 131584, 134217736, 134348800, 134218248, 520, 134348800, 131592, 8, 134348808, 131584];
      var spfunction4 = [8396801, 8321, 8321, 128, 8396928, 8388737, 8388609, 8193, 0, 8396800, 8396800, 8396929, 129, 0, 8388736, 8388609, 1, 8192, 8388608, 8396801, 128, 8388608, 8193, 8320, 8388737, 1, 8320, 8388736, 8192, 8396928, 8396929, 129, 8388736, 8388609, 8396800, 8396929, 129, 0, 0, 8396800, 8320, 8388736, 8388737, 1, 8396801, 8321, 8321, 128, 8396929, 129, 1, 8192, 8388609, 8193, 8396928, 8388737, 8193, 8320, 8388608, 8396801, 128, 8388608, 8192, 8396928];
      var spfunction5 = [256, 34078976, 34078720, 1107296512, 524288, 256, 1073741824, 34078720, 1074266368, 524288, 33554688, 1074266368, 1107296512, 1107820544, 524544, 1073741824, 33554432, 1074266112, 1074266112, 0, 1073742080, 1107820800, 1107820800, 33554688, 1107820544, 1073742080, 0, 1107296256, 34078976, 33554432, 1107296256, 524544, 524288, 1107296512, 256, 33554432, 1073741824, 34078720, 1107296512, 1074266368, 33554688, 1073741824, 1107820544, 34078976, 1074266368, 256, 33554432, 1107820544, 1107820800, 524544, 1107296256, 1107820800, 34078720, 0, 1074266112, 1107296256, 524544, 33554688, 1073742080, 524288, 0, 1074266112, 34078976, 1073742080];
      var spfunction6 = [536870928, 541065216, 16384, 541081616, 541065216, 16, 541081616, 4194304, 536887296, 4210704, 4194304, 536870928, 4194320, 536887296, 536870912, 16400, 0, 4194320, 536887312, 16384, 4210688, 536887312, 16, 541065232, 541065232, 0, 4210704, 541081600, 16400, 4210688, 541081600, 536870912, 536887296, 16, 541065232, 4210688, 541081616, 4194304, 16400, 536870928, 4194304, 536887296, 536870912, 16400, 536870928, 541081616, 4210688, 541065216, 4210704, 541081600, 0, 541065232, 16, 16384, 541065216, 4210704, 16384, 4194320, 536887312, 0, 541081600, 536870912, 4194320, 536887312];
      var spfunction7 = [2097152, 69206018, 67110914, 0, 2048, 67110914, 2099202, 69208064, 69208066, 2097152, 0, 67108866, 2, 67108864, 69206018, 2050, 67110912, 2099202, 2097154, 67110912, 67108866, 69206016, 69208064, 2097154, 69206016, 2048, 2050, 69208066, 2099200, 2, 67108864, 2099200, 67108864, 2099200, 2097152, 67110914, 67110914, 69206018, 69206018, 2, 2097154, 67108864, 67110912, 2097152, 69208064, 2050, 2099202, 69208064, 2050, 67108866, 69208066, 69206016, 2099200, 0, 2, 69208066, 0, 2099202, 69206016, 2048, 67108866, 67110912, 2048, 2097154];
      var spfunction8 = [268439616, 4096, 262144, 268701760, 268435456, 268439616, 64, 268435456, 262208, 268697600, 268701760, 266240, 268701696, 266304, 4096, 64, 268697600, 268435520, 268439552, 4160, 266240, 262208, 268697664, 268701696, 4160, 0, 0, 268697664, 268435520, 268439552, 266304, 262144, 266304, 262144, 268701696, 4096, 64, 268697664, 4096, 266304, 268439552, 64, 268435520, 268697600, 268697664, 268435456, 262144, 268439616, 0, 268701760, 262208, 268435520, 268697600, 268439552, 268439616, 0, 268701760, 266240, 266240, 4160, 4160, 262208, 268435456, 268701696];
      function _createKeys(key) {
        var pc2bytes0 = [0, 4, 536870912, 536870916, 65536, 65540, 536936448, 536936452, 512, 516, 536871424, 536871428, 66048, 66052, 536936960, 536936964], pc2bytes1 = [0, 1, 1048576, 1048577, 67108864, 67108865, 68157440, 68157441, 256, 257, 1048832, 1048833, 67109120, 67109121, 68157696, 68157697], pc2bytes2 = [0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272, 0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272], pc2bytes3 = [0, 2097152, 134217728, 136314880, 8192, 2105344, 134225920, 136323072, 131072, 2228224, 134348800, 136445952, 139264, 2236416, 134356992, 136454144], pc2bytes4 = [0, 262144, 16, 262160, 0, 262144, 16, 262160, 4096, 266240, 4112, 266256, 4096, 266240, 4112, 266256], pc2bytes5 = [0, 1024, 32, 1056, 0, 1024, 32, 1056, 33554432, 33555456, 33554464, 33555488, 33554432, 33555456, 33554464, 33555488], pc2bytes6 = [0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746, 0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746], pc2bytes7 = [0, 65536, 2048, 67584, 536870912, 536936448, 536872960, 536938496, 131072, 196608, 133120, 198656, 537001984, 537067520, 537004032, 537069568], pc2bytes8 = [0, 262144, 0, 262144, 2, 262146, 2, 262146, 33554432, 33816576, 33554432, 33816576, 33554434, 33816578, 33554434, 33816578], pc2bytes9 = [0, 268435456, 8, 268435464, 0, 268435456, 8, 268435464, 1024, 268436480, 1032, 268436488, 1024, 268436480, 1032, 268436488], pc2bytes10 = [0, 32, 0, 32, 1048576, 1048608, 1048576, 1048608, 8192, 8224, 8192, 8224, 1056768, 1056800, 1056768, 1056800], pc2bytes11 = [0, 16777216, 512, 16777728, 2097152, 18874368, 2097664, 18874880, 67108864, 83886080, 67109376, 83886592, 69206016, 85983232, 69206528, 85983744], pc2bytes12 = [0, 4096, 134217728, 134221824, 524288, 528384, 134742016, 134746112, 16, 4112, 134217744, 134221840, 524304, 528400, 134742032, 134746128], pc2bytes13 = [0, 4, 256, 260, 0, 4, 256, 260, 1, 5, 257, 261, 1, 5, 257, 261];
        var iterations = key.length() > 8 ? 3 : 1;
        var keys2 = [];
        var shifts = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0];
        var n = 0, tmp;
        for (var j = 0; j < iterations; j++) {
          var left = key.getInt32();
          var right = key.getInt32();
          tmp = (left >>> 4 ^ right) & 252645135;
          right ^= tmp;
          left ^= tmp << 4;
          tmp = (right >>> -16 ^ left) & 65535;
          left ^= tmp;
          right ^= tmp << -16;
          tmp = (left >>> 2 ^ right) & 858993459;
          right ^= tmp;
          left ^= tmp << 2;
          tmp = (right >>> -16 ^ left) & 65535;
          left ^= tmp;
          right ^= tmp << -16;
          tmp = (left >>> 1 ^ right) & 1431655765;
          right ^= tmp;
          left ^= tmp << 1;
          tmp = (right >>> 8 ^ left) & 16711935;
          left ^= tmp;
          right ^= tmp << 8;
          tmp = (left >>> 1 ^ right) & 1431655765;
          right ^= tmp;
          left ^= tmp << 1;
          tmp = left << 8 | right >>> 20 & 240;
          left = right << 24 | right << 8 & 16711680 | right >>> 8 & 65280 | right >>> 24 & 240;
          right = tmp;
          for (var i = 0; i < shifts.length; ++i) {
            if (shifts[i]) {
              left = left << 2 | left >>> 26;
              right = right << 2 | right >>> 26;
            } else {
              left = left << 1 | left >>> 27;
              right = right << 1 | right >>> 27;
            }
            left &= -15;
            right &= -15;
            var lefttmp = pc2bytes0[left >>> 28] | pc2bytes1[left >>> 24 & 15] | pc2bytes2[left >>> 20 & 15] | pc2bytes3[left >>> 16 & 15] | pc2bytes4[left >>> 12 & 15] | pc2bytes5[left >>> 8 & 15] | pc2bytes6[left >>> 4 & 15];
            var righttmp = pc2bytes7[right >>> 28] | pc2bytes8[right >>> 24 & 15] | pc2bytes9[right >>> 20 & 15] | pc2bytes10[right >>> 16 & 15] | pc2bytes11[right >>> 12 & 15] | pc2bytes12[right >>> 8 & 15] | pc2bytes13[right >>> 4 & 15];
            tmp = (righttmp >>> 16 ^ lefttmp) & 65535;
            keys2[n++] = lefttmp ^ tmp;
            keys2[n++] = righttmp ^ tmp << 16;
          }
        }
        return keys2;
      }
      function _updateBlock(keys2, input, output, decrypt2) {
        var iterations = keys2.length === 32 ? 3 : 9;
        var looping;
        if (iterations === 3) {
          looping = decrypt2 ? [30, -2, -2] : [0, 32, 2];
        } else {
          looping = decrypt2 ? [94, 62, -2, 32, 64, 2, 30, -2, -2] : [0, 32, 2, 62, 30, -2, 64, 96, 2];
        }
        var tmp;
        var left = input[0];
        var right = input[1];
        tmp = (left >>> 4 ^ right) & 252645135;
        right ^= tmp;
        left ^= tmp << 4;
        tmp = (left >>> 16 ^ right) & 65535;
        right ^= tmp;
        left ^= tmp << 16;
        tmp = (right >>> 2 ^ left) & 858993459;
        left ^= tmp;
        right ^= tmp << 2;
        tmp = (right >>> 8 ^ left) & 16711935;
        left ^= tmp;
        right ^= tmp << 8;
        tmp = (left >>> 1 ^ right) & 1431655765;
        right ^= tmp;
        left ^= tmp << 1;
        left = left << 1 | left >>> 31;
        right = right << 1 | right >>> 31;
        for (var j = 0; j < iterations; j += 3) {
          var endloop = looping[j + 1];
          var loopinc = looping[j + 2];
          for (var i = looping[j]; i != endloop; i += loopinc) {
            var right1 = right ^ keys2[i];
            var right2 = (right >>> 4 | right << 28) ^ keys2[i + 1];
            tmp = left;
            left = right;
            right = tmp ^ (spfunction2[right1 >>> 24 & 63] | spfunction4[right1 >>> 16 & 63] | spfunction6[right1 >>> 8 & 63] | spfunction8[right1 & 63] | spfunction1[right2 >>> 24 & 63] | spfunction3[right2 >>> 16 & 63] | spfunction5[right2 >>> 8 & 63] | spfunction7[right2 & 63]);
          }
          tmp = left;
          left = right;
          right = tmp;
        }
        left = left >>> 1 | left << 31;
        right = right >>> 1 | right << 31;
        tmp = (left >>> 1 ^ right) & 1431655765;
        right ^= tmp;
        left ^= tmp << 1;
        tmp = (right >>> 8 ^ left) & 16711935;
        left ^= tmp;
        right ^= tmp << 8;
        tmp = (right >>> 2 ^ left) & 858993459;
        left ^= tmp;
        right ^= tmp << 2;
        tmp = (left >>> 16 ^ right) & 65535;
        right ^= tmp;
        left ^= tmp << 16;
        tmp = (left >>> 4 ^ right) & 252645135;
        right ^= tmp;
        left ^= tmp << 4;
        output[0] = left;
        output[1] = right;
      }
      function _createCipher(options) {
        options = options || {};
        var mode = (options.mode || "CBC").toUpperCase();
        var algorithm = "DES-" + mode;
        var cipher;
        if (options.decrypt) {
          cipher = forge6.cipher.createDecipher(algorithm, options.key);
        } else {
          cipher = forge6.cipher.createCipher(algorithm, options.key);
        }
        var start = cipher.start;
        cipher.start = function(iv, options2) {
          var output = null;
          if (options2 instanceof forge6.util.ByteBuffer) {
            output = options2;
            options2 = {};
          }
          options2 = options2 || {};
          options2.output = output;
          options2.iv = iv;
          start.call(cipher, options2);
        };
        return cipher;
      }
    }
  });

  // ../node_modules/node-forge/lib/md.js
  var require_md = __commonJS({
    "../node_modules/node-forge/lib/md.js"(exports2, module2) {
      var forge6 = require_forge();
      module2.exports = forge6.md = forge6.md || {};
      forge6.md.algorithms = forge6.md.algorithms || {};
    }
  });

  // ../node_modules/node-forge/lib/hmac.js
  var require_hmac = __commonJS({
    "../node_modules/node-forge/lib/hmac.js"(exports2, module2) {
      var forge6 = require_forge();
      require_md();
      require_util();
      var hmac = module2.exports = forge6.hmac = forge6.hmac || {};
      hmac.create = function() {
        var _key = null;
        var _md = null;
        var _ipadding = null;
        var _opadding = null;
        var ctx = {};
        ctx.start = function(md, key) {
          if (md !== null) {
            if (typeof md === "string") {
              md = md.toLowerCase();
              if (md in forge6.md.algorithms) {
                _md = forge6.md.algorithms[md].create();
              } else {
                throw new Error('Unknown hash algorithm "' + md + '"');
              }
            } else {
              _md = md;
            }
          }
          if (key === null) {
            key = _key;
          } else {
            if (typeof key === "string") {
              key = forge6.util.createBuffer(key);
            } else if (forge6.util.isArray(key)) {
              var tmp = key;
              key = forge6.util.createBuffer();
              for (var i = 0; i < tmp.length; ++i) {
                key.putByte(tmp[i]);
              }
            }
            var keylen = key.length();
            if (keylen > _md.blockLength) {
              _md.start();
              _md.update(key.bytes());
              key = _md.digest();
            }
            _ipadding = forge6.util.createBuffer();
            _opadding = forge6.util.createBuffer();
            keylen = key.length();
            for (var i = 0; i < keylen; ++i) {
              var tmp = key.at(i);
              _ipadding.putByte(54 ^ tmp);
              _opadding.putByte(92 ^ tmp);
            }
            if (keylen < _md.blockLength) {
              var tmp = _md.blockLength - keylen;
              for (var i = 0; i < tmp; ++i) {
                _ipadding.putByte(54);
                _opadding.putByte(92);
              }
            }
            _key = key;
            _ipadding = _ipadding.bytes();
            _opadding = _opadding.bytes();
          }
          _md.start();
          _md.update(_ipadding);
        };
        ctx.update = function(bytes2) {
          _md.update(bytes2);
        };
        ctx.getMac = function() {
          var inner = _md.digest().bytes();
          _md.start();
          _md.update(_opadding);
          _md.update(inner);
          return _md.digest();
        };
        ctx.digest = ctx.getMac;
        return ctx;
      };
    }
  });

  // (disabled):crypto
  var require_crypto = __commonJS({
    "(disabled):crypto"() {
    }
  });

  // ../node_modules/node-forge/lib/pbkdf2.js
  var require_pbkdf2 = __commonJS({
    "../node_modules/node-forge/lib/pbkdf2.js"(exports2, module2) {
      var forge6 = require_forge();
      require_hmac();
      require_md();
      require_util();
      var pkcs5 = forge6.pkcs5 = forge6.pkcs5 || {};
      var crypto4;
      if (forge6.util.isNodejs && !forge6.options.usePureJavaScript) {
        crypto4 = require_crypto();
      }
      module2.exports = forge6.pbkdf2 = pkcs5.pbkdf2 = function(p, s, c, dkLen, md, callback) {
        if (typeof md === "function") {
          callback = md;
          md = null;
        }
        if (forge6.util.isNodejs && !forge6.options.usePureJavaScript && crypto4.pbkdf2 && (md === null || typeof md !== "object") && (crypto4.pbkdf2Sync.length > 4 || (!md || md === "sha1"))) {
          if (typeof md !== "string") {
            md = "sha1";
          }
          p = Buffer.from(p, "binary");
          s = Buffer.from(s, "binary");
          if (!callback) {
            if (crypto4.pbkdf2Sync.length === 4) {
              return crypto4.pbkdf2Sync(p, s, c, dkLen).toString("binary");
            }
            return crypto4.pbkdf2Sync(p, s, c, dkLen, md).toString("binary");
          }
          if (crypto4.pbkdf2Sync.length === 4) {
            return crypto4.pbkdf2(p, s, c, dkLen, function(err2, key) {
              if (err2) {
                return callback(err2);
              }
              callback(null, key.toString("binary"));
            });
          }
          return crypto4.pbkdf2(p, s, c, dkLen, md, function(err2, key) {
            if (err2) {
              return callback(err2);
            }
            callback(null, key.toString("binary"));
          });
        }
        if (typeof md === "undefined" || md === null) {
          md = "sha1";
        }
        if (typeof md === "string") {
          if (!(md in forge6.md.algorithms)) {
            throw new Error("Unknown hash algorithm: " + md);
          }
          md = forge6.md[md].create();
        }
        var hLen = md.digestLength;
        if (dkLen > 4294967295 * hLen) {
          var err = new Error("Derived key is too long.");
          if (callback) {
            return callback(err);
          }
          throw err;
        }
        var len = Math.ceil(dkLen / hLen);
        var r = dkLen - (len - 1) * hLen;
        var prf = forge6.hmac.create();
        prf.start(md, p);
        var dk = "";
        var xor2, u_c, u_c1;
        if (!callback) {
          for (var i = 1; i <= len; ++i) {
            prf.start(null, null);
            prf.update(s);
            prf.update(forge6.util.int32ToBytes(i));
            xor2 = u_c1 = prf.digest().getBytes();
            for (var j = 2; j <= c; ++j) {
              prf.start(null, null);
              prf.update(u_c1);
              u_c = prf.digest().getBytes();
              xor2 = forge6.util.xorBytes(xor2, u_c, hLen);
              u_c1 = u_c;
            }
            dk += i < len ? xor2 : xor2.substr(0, r);
          }
          return dk;
        }
        var i = 1, j;
        function outer() {
          if (i > len) {
            return callback(null, dk);
          }
          prf.start(null, null);
          prf.update(s);
          prf.update(forge6.util.int32ToBytes(i));
          xor2 = u_c1 = prf.digest().getBytes();
          j = 2;
          inner();
        }
        function inner() {
          if (j <= c) {
            prf.start(null, null);
            prf.update(u_c1);
            u_c = prf.digest().getBytes();
            xor2 = forge6.util.xorBytes(xor2, u_c, hLen);
            u_c1 = u_c;
            ++j;
            return forge6.util.setImmediate(inner);
          }
          dk += i < len ? xor2 : xor2.substr(0, r);
          ++i;
          outer();
        }
        outer();
      };
    }
  });

  // ../node_modules/node-forge/lib/pem.js
  var require_pem = __commonJS({
    "../node_modules/node-forge/lib/pem.js"(exports2, module2) {
      var forge6 = require_forge();
      require_util();
      var pem = module2.exports = forge6.pem = forge6.pem || {};
      pem.encode = function(msg, options) {
        options = options || {};
        var rval = "-----BEGIN " + msg.type + "-----\r\n";
        var header;
        if (msg.procType) {
          header = {
            name: "Proc-Type",
            values: [String(msg.procType.version), msg.procType.type]
          };
          rval += foldHeader(header);
        }
        if (msg.contentDomain) {
          header = { name: "Content-Domain", values: [msg.contentDomain] };
          rval += foldHeader(header);
        }
        if (msg.dekInfo) {
          header = { name: "DEK-Info", values: [msg.dekInfo.algorithm] };
          if (msg.dekInfo.parameters) {
            header.values.push(msg.dekInfo.parameters);
          }
          rval += foldHeader(header);
        }
        if (msg.headers) {
          for (var i = 0; i < msg.headers.length; ++i) {
            rval += foldHeader(msg.headers[i]);
          }
        }
        if (msg.procType) {
          rval += "\r\n";
        }
        rval += forge6.util.encode64(msg.body, options.maxline || 64) + "\r\n";
        rval += "-----END " + msg.type + "-----\r\n";
        return rval;
      };
      pem.decode = function(str) {
        var rval = [];
        var rMessage = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g;
        var rHeader = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/;
        var rCRLF = /\r?\n/;
        var match;
        while (true) {
          match = rMessage.exec(str);
          if (!match) {
            break;
          }
          var type = match[1];
          if (type === "NEW CERTIFICATE REQUEST") {
            type = "CERTIFICATE REQUEST";
          }
          var msg = {
            type,
            procType: null,
            contentDomain: null,
            dekInfo: null,
            headers: [],
            body: forge6.util.decode64(match[3])
          };
          rval.push(msg);
          if (!match[2]) {
            continue;
          }
          var lines = match[2].split(rCRLF);
          var li = 0;
          while (match && li < lines.length) {
            var line = lines[li].replace(/\s+$/, "");
            for (var nl = li + 1; nl < lines.length; ++nl) {
              var next = lines[nl];
              if (!/\s/.test(next[0])) {
                break;
              }
              line += next;
              li = nl;
            }
            match = line.match(rHeader);
            if (match) {
              var header = { name: match[1], values: [] };
              var values = match[2].split(",");
              for (var vi = 0; vi < values.length; ++vi) {
                header.values.push(ltrim(values[vi]));
              }
              if (!msg.procType) {
                if (header.name !== "Proc-Type") {
                  throw new Error('Invalid PEM formatted message. The first encapsulated header must be "Proc-Type".');
                } else if (header.values.length !== 2) {
                  throw new Error('Invalid PEM formatted message. The "Proc-Type" header must have two subfields.');
                }
                msg.procType = { version: values[0], type: values[1] };
              } else if (!msg.contentDomain && header.name === "Content-Domain") {
                msg.contentDomain = values[0] || "";
              } else if (!msg.dekInfo && header.name === "DEK-Info") {
                if (header.values.length === 0) {
                  throw new Error('Invalid PEM formatted message. The "DEK-Info" header must have at least one subfield.');
                }
                msg.dekInfo = { algorithm: values[0], parameters: values[1] || null };
              } else {
                msg.headers.push(header);
              }
            }
            ++li;
          }
          if (msg.procType === "ENCRYPTED" && !msg.dekInfo) {
            throw new Error('Invalid PEM formatted message. The "DEK-Info" header must be present if "Proc-Type" is "ENCRYPTED".');
          }
        }
        if (rval.length === 0) {
          throw new Error("Invalid PEM formatted message.");
        }
        return rval;
      };
      function foldHeader(header) {
        var rval = header.name + ": ";
        var values = [];
        var insertSpace = function(match, $1) {
          return " " + $1;
        };
        for (var i = 0; i < header.values.length; ++i) {
          values.push(header.values[i].replace(/^(\S+\r\n)/, insertSpace));
        }
        rval += values.join(",") + "\r\n";
        var length2 = 0;
        var candidate = -1;
        for (var i = 0; i < rval.length; ++i, ++length2) {
          if (length2 > 65 && candidate !== -1) {
            var insert = rval[candidate];
            if (insert === ",") {
              ++candidate;
              rval = rval.substr(0, candidate) + "\r\n " + rval.substr(candidate);
            } else {
              rval = rval.substr(0, candidate) + "\r\n" + insert + rval.substr(candidate + 1);
            }
            length2 = i - candidate - 1;
            candidate = -1;
            ++i;
          } else if (rval[i] === " " || rval[i] === "	" || rval[i] === ",") {
            candidate = i;
          }
        }
        return rval;
      }
      function ltrim(str) {
        return str.replace(/^\s+/, "");
      }
    }
  });

  // ../node_modules/node-forge/lib/sha256.js
  var require_sha256 = __commonJS({
    "../node_modules/node-forge/lib/sha256.js"(exports2, module2) {
      var forge6 = require_forge();
      require_md();
      require_util();
      var sha2562 = module2.exports = forge6.sha256 = forge6.sha256 || {};
      forge6.md.sha256 = forge6.md.algorithms.sha256 = sha2562;
      sha2562.create = function() {
        if (!_initialized) {
          _init();
        }
        var _state = null;
        var _input = forge6.util.createBuffer();
        var _w = new Array(64);
        var md = {
          algorithm: "sha256",
          blockLength: 64,
          digestLength: 32,
          messageLength: 0,
          fullMessageLength: null,
          messageLengthSize: 8
        };
        md.start = function() {
          md.messageLength = 0;
          md.fullMessageLength = md.messageLength64 = [];
          var int32s = md.messageLengthSize / 4;
          for (var i = 0; i < int32s; ++i) {
            md.fullMessageLength.push(0);
          }
          _input = forge6.util.createBuffer();
          _state = {
            h0: 1779033703,
            h1: 3144134277,
            h2: 1013904242,
            h3: 2773480762,
            h4: 1359893119,
            h5: 2600822924,
            h6: 528734635,
            h7: 1541459225
          };
          return md;
        };
        md.start();
        md.update = function(msg, encoding) {
          if (encoding === "utf8") {
            msg = forge6.util.encodeUtf8(msg);
          }
          var len = msg.length;
          md.messageLength += len;
          len = [len / 4294967296 >>> 0, len >>> 0];
          for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
            md.fullMessageLength[i] += len[1];
            len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
            md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
            len[0] = len[1] / 4294967296 >>> 0;
          }
          _input.putBytes(msg);
          _update(_state, _w, _input);
          if (_input.read > 2048 || _input.length() === 0) {
            _input.compact();
          }
          return md;
        };
        md.digest = function() {
          var finalBlock = forge6.util.createBuffer();
          finalBlock.putBytes(_input.bytes());
          var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
          var overflow = remaining & md.blockLength - 1;
          finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
          var next, carry;
          var bits2 = md.fullMessageLength[0] * 8;
          for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
            next = md.fullMessageLength[i + 1] * 8;
            carry = next / 4294967296 >>> 0;
            bits2 += carry;
            finalBlock.putInt32(bits2 >>> 0);
            bits2 = next >>> 0;
          }
          finalBlock.putInt32(bits2);
          var s2 = {
            h0: _state.h0,
            h1: _state.h1,
            h2: _state.h2,
            h3: _state.h3,
            h4: _state.h4,
            h5: _state.h5,
            h6: _state.h6,
            h7: _state.h7
          };
          _update(s2, _w, finalBlock);
          var rval = forge6.util.createBuffer();
          rval.putInt32(s2.h0);
          rval.putInt32(s2.h1);
          rval.putInt32(s2.h2);
          rval.putInt32(s2.h3);
          rval.putInt32(s2.h4);
          rval.putInt32(s2.h5);
          rval.putInt32(s2.h6);
          rval.putInt32(s2.h7);
          return rval;
        };
        return md;
      };
      var _padding = null;
      var _initialized = false;
      var _k = null;
      function _init() {
        _padding = String.fromCharCode(128);
        _padding += forge6.util.fillString(String.fromCharCode(0), 64);
        _k = [
          1116352408,
          1899447441,
          3049323471,
          3921009573,
          961987163,
          1508970993,
          2453635748,
          2870763221,
          3624381080,
          310598401,
          607225278,
          1426881987,
          1925078388,
          2162078206,
          2614888103,
          3248222580,
          3835390401,
          4022224774,
          264347078,
          604807628,
          770255983,
          1249150122,
          1555081692,
          1996064986,
          2554220882,
          2821834349,
          2952996808,
          3210313671,
          3336571891,
          3584528711,
          113926993,
          338241895,
          666307205,
          773529912,
          1294757372,
          1396182291,
          1695183700,
          1986661051,
          2177026350,
          2456956037,
          2730485921,
          2820302411,
          3259730800,
          3345764771,
          3516065817,
          3600352804,
          4094571909,
          275423344,
          430227734,
          506948616,
          659060556,
          883997877,
          958139571,
          1322822218,
          1537002063,
          1747873779,
          1955562222,
          2024104815,
          2227730452,
          2361852424,
          2428436474,
          2756734187,
          3204031479,
          3329325298
        ];
        _initialized = true;
      }
      function _update(s, w, bytes2) {
        var t1, t2, s0, s1, ch, maj, i, a, b, c, d, e, f, g, h;
        var len = bytes2.length();
        while (len >= 64) {
          for (i = 0; i < 16; ++i) {
            w[i] = bytes2.getInt32();
          }
          for (; i < 64; ++i) {
            t1 = w[i - 2];
            t1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
            t2 = w[i - 15];
            t2 = (t2 >>> 7 | t2 << 25) ^ (t2 >>> 18 | t2 << 14) ^ t2 >>> 3;
            w[i] = t1 + w[i - 7] + t2 + w[i - 16] | 0;
          }
          a = s.h0;
          b = s.h1;
          c = s.h2;
          d = s.h3;
          e = s.h4;
          f = s.h5;
          g = s.h6;
          h = s.h7;
          for (i = 0; i < 64; ++i) {
            s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
            ch = g ^ e & (f ^ g);
            s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
            maj = a & b | c & (a ^ b);
            t1 = h + s1 + ch + _k[i] + w[i];
            t2 = s0 + maj;
            h = g;
            g = f;
            f = e;
            e = d + t1 >>> 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 >>> 0;
          }
          s.h0 = s.h0 + a | 0;
          s.h1 = s.h1 + b | 0;
          s.h2 = s.h2 + c | 0;
          s.h3 = s.h3 + d | 0;
          s.h4 = s.h4 + e | 0;
          s.h5 = s.h5 + f | 0;
          s.h6 = s.h6 + g | 0;
          s.h7 = s.h7 + h | 0;
          len -= 64;
        }
      }
    }
  });

  // ../node_modules/node-forge/lib/prng.js
  var require_prng = __commonJS({
    "../node_modules/node-forge/lib/prng.js"(exports2, module2) {
      var forge6 = require_forge();
      require_util();
      var _crypto = null;
      if (forge6.util.isNodejs && !forge6.options.usePureJavaScript && !process.versions["node-webkit"]) {
        _crypto = require_crypto();
      }
      var prng = module2.exports = forge6.prng = forge6.prng || {};
      prng.create = function(plugin) {
        var ctx = {
          plugin,
          key: null,
          seed: null,
          time: null,
          reseeds: 0,
          generated: 0,
          keyBytes: ""
        };
        var md = plugin.md;
        var pools = new Array(32);
        for (var i = 0; i < 32; ++i) {
          pools[i] = md.create();
        }
        ctx.pools = pools;
        ctx.pool = 0;
        ctx.generate = function(count, callback) {
          if (!callback) {
            return ctx.generateSync(count);
          }
          var cipher = ctx.plugin.cipher;
          var increment2 = ctx.plugin.increment;
          var formatKey = ctx.plugin.formatKey;
          var formatSeed = ctx.plugin.formatSeed;
          var b = forge6.util.createBuffer();
          ctx.key = null;
          generate();
          function generate(err) {
            if (err) {
              return callback(err);
            }
            if (b.length() >= count) {
              return callback(null, b.getBytes(count));
            }
            if (ctx.generated > 1048575) {
              ctx.key = null;
            }
            if (ctx.key === null) {
              return forge6.util.nextTick(function() {
                _reseed(generate);
              });
            }
            var bytes2 = cipher(ctx.key, ctx.seed);
            ctx.generated += bytes2.length;
            b.putBytes(bytes2);
            ctx.key = formatKey(cipher(ctx.key, increment2(ctx.seed)));
            ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
            forge6.util.setImmediate(generate);
          }
        };
        ctx.generateSync = function(count) {
          var cipher = ctx.plugin.cipher;
          var increment2 = ctx.plugin.increment;
          var formatKey = ctx.plugin.formatKey;
          var formatSeed = ctx.plugin.formatSeed;
          ctx.key = null;
          var b = forge6.util.createBuffer();
          while (b.length() < count) {
            if (ctx.generated > 1048575) {
              ctx.key = null;
            }
            if (ctx.key === null) {
              _reseedSync();
            }
            var bytes2 = cipher(ctx.key, ctx.seed);
            ctx.generated += bytes2.length;
            b.putBytes(bytes2);
            ctx.key = formatKey(cipher(ctx.key, increment2(ctx.seed)));
            ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
          }
          return b.getBytes(count);
        };
        function _reseed(callback) {
          if (ctx.pools[0].messageLength >= 32) {
            _seed();
            return callback();
          }
          var needed = 32 - ctx.pools[0].messageLength << 5;
          ctx.seedFile(needed, function(err, bytes2) {
            if (err) {
              return callback(err);
            }
            ctx.collect(bytes2);
            _seed();
            callback();
          });
        }
        function _reseedSync() {
          if (ctx.pools[0].messageLength >= 32) {
            return _seed();
          }
          var needed = 32 - ctx.pools[0].messageLength << 5;
          ctx.collect(ctx.seedFileSync(needed));
          _seed();
        }
        function _seed() {
          ctx.reseeds = ctx.reseeds === 4294967295 ? 0 : ctx.reseeds + 1;
          var md2 = ctx.plugin.md.create();
          md2.update(ctx.keyBytes);
          var _2powK = 1;
          for (var k = 0; k < 32; ++k) {
            if (ctx.reseeds % _2powK === 0) {
              md2.update(ctx.pools[k].digest().getBytes());
              ctx.pools[k].start();
            }
            _2powK = _2powK << 1;
          }
          ctx.keyBytes = md2.digest().getBytes();
          md2.start();
          md2.update(ctx.keyBytes);
          var seedBytes = md2.digest().getBytes();
          ctx.key = ctx.plugin.formatKey(ctx.keyBytes);
          ctx.seed = ctx.plugin.formatSeed(seedBytes);
          ctx.generated = 0;
        }
        function defaultSeedFile(needed) {
          var getRandomValues = null;
          var globalScope = forge6.util.globalScope;
          var _crypto2 = globalScope.crypto || globalScope.msCrypto;
          if (_crypto2 && _crypto2.getRandomValues) {
            getRandomValues = function(arr) {
              return _crypto2.getRandomValues(arr);
            };
          }
          var b = forge6.util.createBuffer();
          if (getRandomValues) {
            while (b.length() < needed) {
              var count = Math.max(1, Math.min(needed - b.length(), 65536) / 4);
              var entropy = new Uint32Array(Math.floor(count));
              try {
                getRandomValues(entropy);
                for (var i2 = 0; i2 < entropy.length; ++i2) {
                  b.putInt32(entropy[i2]);
                }
              } catch (e) {
                if (!(typeof QuotaExceededError !== "undefined" && e instanceof QuotaExceededError)) {
                  throw e;
                }
              }
            }
          }
          if (b.length() < needed) {
            var hi, lo, next;
            var seed = Math.floor(Math.random() * 65536);
            while (b.length() < needed) {
              lo = 16807 * (seed & 65535);
              hi = 16807 * (seed >> 16);
              lo += (hi & 32767) << 16;
              lo += hi >> 15;
              lo = (lo & 2147483647) + (lo >> 31);
              seed = lo & 4294967295;
              for (var i2 = 0; i2 < 3; ++i2) {
                next = seed >>> (i2 << 3);
                next ^= Math.floor(Math.random() * 256);
                b.putByte(next & 255);
              }
            }
          }
          return b.getBytes(needed);
        }
        if (_crypto) {
          ctx.seedFile = function(needed, callback) {
            _crypto.randomBytes(needed, function(err, bytes2) {
              if (err) {
                return callback(err);
              }
              callback(null, bytes2.toString());
            });
          };
          ctx.seedFileSync = function(needed) {
            return _crypto.randomBytes(needed).toString();
          };
        } else {
          ctx.seedFile = function(needed, callback) {
            try {
              callback(null, defaultSeedFile(needed));
            } catch (e) {
              callback(e);
            }
          };
          ctx.seedFileSync = defaultSeedFile;
        }
        ctx.collect = function(bytes2) {
          var count = bytes2.length;
          for (var i2 = 0; i2 < count; ++i2) {
            ctx.pools[ctx.pool].update(bytes2.substr(i2, 1));
            ctx.pool = ctx.pool === 31 ? 0 : ctx.pool + 1;
          }
        };
        ctx.collectInt = function(i2, n) {
          var bytes2 = "";
          for (var x = 0; x < n; x += 8) {
            bytes2 += String.fromCharCode(i2 >> x & 255);
          }
          ctx.collect(bytes2);
        };
        ctx.registerWorker = function(worker) {
          if (worker === self) {
            ctx.seedFile = function(needed, callback) {
              function listener2(e) {
                var data = e.data;
                if (data.forge && data.forge.prng) {
                  self.removeEventListener("message", listener2);
                  callback(data.forge.prng.err, data.forge.prng.bytes);
                }
              }
              self.addEventListener("message", listener2);
              self.postMessage({ forge: { prng: { needed } } });
            };
          } else {
            var listener = function(e) {
              var data = e.data;
              if (data.forge && data.forge.prng) {
                ctx.seedFile(data.forge.prng.needed, function(err, bytes2) {
                  worker.postMessage({ forge: { prng: { err, bytes: bytes2 } } });
                });
              }
            };
            worker.addEventListener("message", listener);
          }
        };
        return ctx;
      };
    }
  });

  // ../node_modules/node-forge/lib/random.js
  var require_random = __commonJS({
    "../node_modules/node-forge/lib/random.js"(exports2, module2) {
      var forge6 = require_forge();
      require_aes();
      require_sha256();
      require_prng();
      require_util();
      (function() {
        if (forge6.random && forge6.random.getBytes) {
          module2.exports = forge6.random;
          return;
        }
        (function(jQuery2) {
          var prng_aes = {};
          var _prng_aes_output = new Array(4);
          var _prng_aes_buffer = forge6.util.createBuffer();
          prng_aes.formatKey = function(key2) {
            var tmp = forge6.util.createBuffer(key2);
            key2 = new Array(4);
            key2[0] = tmp.getInt32();
            key2[1] = tmp.getInt32();
            key2[2] = tmp.getInt32();
            key2[3] = tmp.getInt32();
            return forge6.aes._expandKey(key2, false);
          };
          prng_aes.formatSeed = function(seed) {
            var tmp = forge6.util.createBuffer(seed);
            seed = new Array(4);
            seed[0] = tmp.getInt32();
            seed[1] = tmp.getInt32();
            seed[2] = tmp.getInt32();
            seed[3] = tmp.getInt32();
            return seed;
          };
          prng_aes.cipher = function(key2, seed) {
            forge6.aes._updateBlock(key2, seed, _prng_aes_output, false);
            _prng_aes_buffer.putInt32(_prng_aes_output[0]);
            _prng_aes_buffer.putInt32(_prng_aes_output[1]);
            _prng_aes_buffer.putInt32(_prng_aes_output[2]);
            _prng_aes_buffer.putInt32(_prng_aes_output[3]);
            return _prng_aes_buffer.getBytes();
          };
          prng_aes.increment = function(seed) {
            ++seed[3];
            return seed;
          };
          prng_aes.md = forge6.md.sha256;
          function spawnPrng() {
            var ctx = forge6.prng.create(prng_aes);
            ctx.getBytes = function(count, callback) {
              return ctx.generate(count, callback);
            };
            ctx.getBytesSync = function(count) {
              return ctx.generate(count);
            };
            return ctx;
          }
          var _ctx = spawnPrng();
          var getRandomValues = null;
          var globalScope = forge6.util.globalScope;
          var _crypto = globalScope.crypto || globalScope.msCrypto;
          if (_crypto && _crypto.getRandomValues) {
            getRandomValues = function(arr) {
              return _crypto.getRandomValues(arr);
            };
          }
          if (forge6.options.usePureJavaScript || !forge6.util.isNodejs && !getRandomValues) {
            if (typeof window === "undefined" || window.document === void 0) {
            }
            _ctx.collectInt(+new Date(), 32);
            if (typeof navigator !== "undefined") {
              var _navBytes = "";
              for (var key in navigator) {
                try {
                  if (typeof navigator[key] == "string") {
                    _navBytes += navigator[key];
                  }
                } catch (e) {
                }
              }
              _ctx.collect(_navBytes);
              _navBytes = null;
            }
            if (jQuery2) {
              jQuery2().mousemove(function(e) {
                _ctx.collectInt(e.clientX, 16);
                _ctx.collectInt(e.clientY, 16);
              });
              jQuery2().keypress(function(e) {
                _ctx.collectInt(e.charCode, 8);
              });
            }
          }
          if (!forge6.random) {
            forge6.random = _ctx;
          } else {
            for (var key in _ctx) {
              forge6.random[key] = _ctx[key];
            }
          }
          forge6.random.createInstance = spawnPrng;
          module2.exports = forge6.random;
        })(typeof jQuery !== "undefined" ? jQuery : null);
      })();
    }
  });

  // ../node_modules/node-forge/lib/rc2.js
  var require_rc2 = __commonJS({
    "../node_modules/node-forge/lib/rc2.js"(exports2, module2) {
      var forge6 = require_forge();
      require_util();
      var piTable = [
        217,
        120,
        249,
        196,
        25,
        221,
        181,
        237,
        40,
        233,
        253,
        121,
        74,
        160,
        216,
        157,
        198,
        126,
        55,
        131,
        43,
        118,
        83,
        142,
        98,
        76,
        100,
        136,
        68,
        139,
        251,
        162,
        23,
        154,
        89,
        245,
        135,
        179,
        79,
        19,
        97,
        69,
        109,
        141,
        9,
        129,
        125,
        50,
        189,
        143,
        64,
        235,
        134,
        183,
        123,
        11,
        240,
        149,
        33,
        34,
        92,
        107,
        78,
        130,
        84,
        214,
        101,
        147,
        206,
        96,
        178,
        28,
        115,
        86,
        192,
        20,
        167,
        140,
        241,
        220,
        18,
        117,
        202,
        31,
        59,
        190,
        228,
        209,
        66,
        61,
        212,
        48,
        163,
        60,
        182,
        38,
        111,
        191,
        14,
        218,
        70,
        105,
        7,
        87,
        39,
        242,
        29,
        155,
        188,
        148,
        67,
        3,
        248,
        17,
        199,
        246,
        144,
        239,
        62,
        231,
        6,
        195,
        213,
        47,
        200,
        102,
        30,
        215,
        8,
        232,
        234,
        222,
        128,
        82,
        238,
        247,
        132,
        170,
        114,
        172,
        53,
        77,
        106,
        42,
        150,
        26,
        210,
        113,
        90,
        21,
        73,
        116,
        75,
        159,
        208,
        94,
        4,
        24,
        164,
        236,
        194,
        224,
        65,
        110,
        15,
        81,
        203,
        204,
        36,
        145,
        175,
        80,
        161,
        244,
        112,
        57,
        153,
        124,
        58,
        133,
        35,
        184,
        180,
        122,
        252,
        2,
        54,
        91,
        37,
        85,
        151,
        49,
        45,
        93,
        250,
        152,
        227,
        138,
        146,
        174,
        5,
        223,
        41,
        16,
        103,
        108,
        186,
        201,
        211,
        0,
        230,
        207,
        225,
        158,
        168,
        44,
        99,
        22,
        1,
        63,
        88,
        226,
        137,
        169,
        13,
        56,
        52,
        27,
        171,
        51,
        255,
        176,
        187,
        72,
        12,
        95,
        185,
        177,
        205,
        46,
        197,
        243,
        219,
        71,
        229,
        165,
        156,
        119,
        10,
        166,
        32,
        104,
        254,
        127,
        193,
        173
      ];
      var s = [1, 2, 3, 5];
      var rol = function(word, bits2) {
        return word << bits2 & 65535 | (word & 65535) >> 16 - bits2;
      };
      var ror = function(word, bits2) {
        return (word & 65535) >> bits2 | word << 16 - bits2 & 65535;
      };
      module2.exports = forge6.rc2 = forge6.rc2 || {};
      forge6.rc2.expandKey = function(key, effKeyBits) {
        if (typeof key === "string") {
          key = forge6.util.createBuffer(key);
        }
        effKeyBits = effKeyBits || 128;
        var L = key;
        var T = key.length();
        var T1 = effKeyBits;
        var T8 = Math.ceil(T1 / 8);
        var TM = 255 >> (T1 & 7);
        var i;
        for (i = T; i < 128; i++) {
          L.putByte(piTable[L.at(i - 1) + L.at(i - T) & 255]);
        }
        L.setAt(128 - T8, piTable[L.at(128 - T8) & TM]);
        for (i = 127 - T8; i >= 0; i--) {
          L.setAt(i, piTable[L.at(i + 1) ^ L.at(i + T8)]);
        }
        return L;
      };
      var createCipher = function(key, bits2, encrypt2) {
        var _finish = false, _input = null, _output = null, _iv = null;
        var mixRound, mashRound;
        var i, j, K = [];
        key = forge6.rc2.expandKey(key, bits2);
        for (i = 0; i < 64; i++) {
          K.push(key.getInt16Le());
        }
        if (encrypt2) {
          mixRound = function(R) {
            for (i = 0; i < 4; i++) {
              R[i] += K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
              R[i] = rol(R[i], s[i]);
              j++;
            }
          };
          mashRound = function(R) {
            for (i = 0; i < 4; i++) {
              R[i] += K[R[(i + 3) % 4] & 63];
            }
          };
        } else {
          mixRound = function(R) {
            for (i = 3; i >= 0; i--) {
              R[i] = ror(R[i], s[i]);
              R[i] -= K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
              j--;
            }
          };
          mashRound = function(R) {
            for (i = 3; i >= 0; i--) {
              R[i] -= K[R[(i + 3) % 4] & 63];
            }
          };
        }
        var runPlan = function(plan) {
          var R = [];
          for (i = 0; i < 4; i++) {
            var val = _input.getInt16Le();
            if (_iv !== null) {
              if (encrypt2) {
                val ^= _iv.getInt16Le();
              } else {
                _iv.putInt16Le(val);
              }
            }
            R.push(val & 65535);
          }
          j = encrypt2 ? 0 : 63;
          for (var ptr = 0; ptr < plan.length; ptr++) {
            for (var ctr = 0; ctr < plan[ptr][0]; ctr++) {
              plan[ptr][1](R);
            }
          }
          for (i = 0; i < 4; i++) {
            if (_iv !== null) {
              if (encrypt2) {
                _iv.putInt16Le(R[i]);
              } else {
                R[i] ^= _iv.getInt16Le();
              }
            }
            _output.putInt16Le(R[i]);
          }
        };
        var cipher = null;
        cipher = {
          start: function(iv, output) {
            if (iv) {
              if (typeof iv === "string") {
                iv = forge6.util.createBuffer(iv);
              }
            }
            _finish = false;
            _input = forge6.util.createBuffer();
            _output = output || new forge6.util.createBuffer();
            _iv = iv;
            cipher.output = _output;
          },
          update: function(input) {
            if (!_finish) {
              _input.putBuffer(input);
            }
            while (_input.length() >= 8) {
              runPlan([
                [5, mixRound],
                [1, mashRound],
                [6, mixRound],
                [1, mashRound],
                [5, mixRound]
              ]);
            }
          },
          finish: function(pad) {
            var rval = true;
            if (encrypt2) {
              if (pad) {
                rval = pad(8, _input, !encrypt2);
              } else {
                var padding = _input.length() === 8 ? 8 : 8 - _input.length();
                _input.fillWithByte(padding, padding);
              }
            }
            if (rval) {
              _finish = true;
              cipher.update();
            }
            if (!encrypt2) {
              rval = _input.length() === 0;
              if (rval) {
                if (pad) {
                  rval = pad(8, _output, !encrypt2);
                } else {
                  var len = _output.length();
                  var count = _output.at(len - 1);
                  if (count > len) {
                    rval = false;
                  } else {
                    _output.truncate(count);
                  }
                }
              }
            }
            return rval;
          }
        };
        return cipher;
      };
      forge6.rc2.startEncrypting = function(key, iv, output) {
        var cipher = forge6.rc2.createEncryptionCipher(key, 128);
        cipher.start(iv, output);
        return cipher;
      };
      forge6.rc2.createEncryptionCipher = function(key, bits2) {
        return createCipher(key, bits2, true);
      };
      forge6.rc2.startDecrypting = function(key, iv, output) {
        var cipher = forge6.rc2.createDecryptionCipher(key, 128);
        cipher.start(iv, output);
        return cipher;
      };
      forge6.rc2.createDecryptionCipher = function(key, bits2) {
        return createCipher(key, bits2, false);
      };
    }
  });

  // ../node_modules/node-forge/lib/jsbn.js
  var require_jsbn = __commonJS({
    "../node_modules/node-forge/lib/jsbn.js"(exports2, module2) {
      var forge6 = require_forge();
      module2.exports = forge6.jsbn = forge6.jsbn || {};
      var dbits;
      var canary = 244837814094590;
      var j_lm = (canary & 16777215) == 15715070;
      function BigInteger(a, b, c) {
        this.data = [];
        if (a != null)
          if (typeof a == "number")
            this.fromNumber(a, b, c);
          else if (b == null && typeof a != "string")
            this.fromString(a, 256);
          else
            this.fromString(a, b);
      }
      forge6.jsbn.BigInteger = BigInteger;
      function nbi() {
        return new BigInteger(null);
      }
      function am1(i, x, w, j, c, n) {
        while (--n >= 0) {
          var v = x * this.data[i++] + w.data[j] + c;
          c = Math.floor(v / 67108864);
          w.data[j++] = v & 67108863;
        }
        return c;
      }
      function am2(i, x, w, j, c, n) {
        var xl = x & 32767, xh = x >> 15;
        while (--n >= 0) {
          var l = this.data[i] & 32767;
          var h = this.data[i++] >> 15;
          var m = xh * l + h * xl;
          l = xl * l + ((m & 32767) << 15) + w.data[j] + (c & 1073741823);
          c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
          w.data[j++] = l & 1073741823;
        }
        return c;
      }
      function am3(i, x, w, j, c, n) {
        var xl = x & 16383, xh = x >> 14;
        while (--n >= 0) {
          var l = this.data[i] & 16383;
          var h = this.data[i++] >> 14;
          var m = xh * l + h * xl;
          l = xl * l + ((m & 16383) << 14) + w.data[j] + c;
          c = (l >> 28) + (m >> 14) + xh * h;
          w.data[j++] = l & 268435455;
        }
        return c;
      }
      if (typeof navigator === "undefined") {
        BigInteger.prototype.am = am3;
        dbits = 28;
      } else if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
        BigInteger.prototype.am = am2;
        dbits = 30;
      } else if (j_lm && navigator.appName != "Netscape") {
        BigInteger.prototype.am = am1;
        dbits = 26;
      } else {
        BigInteger.prototype.am = am3;
        dbits = 28;
      }
      BigInteger.prototype.DB = dbits;
      BigInteger.prototype.DM = (1 << dbits) - 1;
      BigInteger.prototype.DV = 1 << dbits;
      var BI_FP = 52;
      BigInteger.prototype.FV = Math.pow(2, BI_FP);
      BigInteger.prototype.F1 = BI_FP - dbits;
      BigInteger.prototype.F2 = 2 * dbits - BI_FP;
      var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
      var BI_RC = new Array();
      var rr;
      var vv;
      rr = "0".charCodeAt(0);
      for (vv = 0; vv <= 9; ++vv)
        BI_RC[rr++] = vv;
      rr = "a".charCodeAt(0);
      for (vv = 10; vv < 36; ++vv)
        BI_RC[rr++] = vv;
      rr = "A".charCodeAt(0);
      for (vv = 10; vv < 36; ++vv)
        BI_RC[rr++] = vv;
      function int2char(n) {
        return BI_RM.charAt(n);
      }
      function intAt(s, i) {
        var c = BI_RC[s.charCodeAt(i)];
        return c == null ? -1 : c;
      }
      function bnpCopyTo(r) {
        for (var i = this.t - 1; i >= 0; --i)
          r.data[i] = this.data[i];
        r.t = this.t;
        r.s = this.s;
      }
      function bnpFromInt(x) {
        this.t = 1;
        this.s = x < 0 ? -1 : 0;
        if (x > 0)
          this.data[0] = x;
        else if (x < -1)
          this.data[0] = x + this.DV;
        else
          this.t = 0;
      }
      function nbv(i) {
        var r = nbi();
        r.fromInt(i);
        return r;
      }
      function bnpFromString(s, b) {
        var k;
        if (b == 16)
          k = 4;
        else if (b == 8)
          k = 3;
        else if (b == 256)
          k = 8;
        else if (b == 2)
          k = 1;
        else if (b == 32)
          k = 5;
        else if (b == 4)
          k = 2;
        else {
          this.fromRadix(s, b);
          return;
        }
        this.t = 0;
        this.s = 0;
        var i = s.length, mi = false, sh = 0;
        while (--i >= 0) {
          var x = k == 8 ? s[i] & 255 : intAt(s, i);
          if (x < 0) {
            if (s.charAt(i) == "-")
              mi = true;
            continue;
          }
          mi = false;
          if (sh == 0)
            this.data[this.t++] = x;
          else if (sh + k > this.DB) {
            this.data[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
            this.data[this.t++] = x >> this.DB - sh;
          } else
            this.data[this.t - 1] |= x << sh;
          sh += k;
          if (sh >= this.DB)
            sh -= this.DB;
        }
        if (k == 8 && (s[0] & 128) != 0) {
          this.s = -1;
          if (sh > 0)
            this.data[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
        }
        this.clamp();
        if (mi)
          BigInteger.ZERO.subTo(this, this);
      }
      function bnpClamp() {
        var c = this.s & this.DM;
        while (this.t > 0 && this.data[this.t - 1] == c)
          --this.t;
      }
      function bnToString(b) {
        if (this.s < 0)
          return "-" + this.negate().toString(b);
        var k;
        if (b == 16)
          k = 4;
        else if (b == 8)
          k = 3;
        else if (b == 2)
          k = 1;
        else if (b == 32)
          k = 5;
        else if (b == 4)
          k = 2;
        else
          return this.toRadix(b);
        var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
        var p = this.DB - i * this.DB % k;
        if (i-- > 0) {
          if (p < this.DB && (d = this.data[i] >> p) > 0) {
            m = true;
            r = int2char(d);
          }
          while (i >= 0) {
            if (p < k) {
              d = (this.data[i] & (1 << p) - 1) << k - p;
              d |= this.data[--i] >> (p += this.DB - k);
            } else {
              d = this.data[i] >> (p -= k) & km;
              if (p <= 0) {
                p += this.DB;
                --i;
              }
            }
            if (d > 0)
              m = true;
            if (m)
              r += int2char(d);
          }
        }
        return m ? r : "0";
      }
      function bnNegate() {
        var r = nbi();
        BigInteger.ZERO.subTo(this, r);
        return r;
      }
      function bnAbs() {
        return this.s < 0 ? this.negate() : this;
      }
      function bnCompareTo(a) {
        var r = this.s - a.s;
        if (r != 0)
          return r;
        var i = this.t;
        r = i - a.t;
        if (r != 0)
          return this.s < 0 ? -r : r;
        while (--i >= 0)
          if ((r = this.data[i] - a.data[i]) != 0)
            return r;
        return 0;
      }
      function nbits(x) {
        var r = 1, t;
        if ((t = x >>> 16) != 0) {
          x = t;
          r += 16;
        }
        if ((t = x >> 8) != 0) {
          x = t;
          r += 8;
        }
        if ((t = x >> 4) != 0) {
          x = t;
          r += 4;
        }
        if ((t = x >> 2) != 0) {
          x = t;
          r += 2;
        }
        if ((t = x >> 1) != 0) {
          x = t;
          r += 1;
        }
        return r;
      }
      function bnBitLength() {
        if (this.t <= 0)
          return 0;
        return this.DB * (this.t - 1) + nbits(this.data[this.t - 1] ^ this.s & this.DM);
      }
      function bnpDLShiftTo(n, r) {
        var i;
        for (i = this.t - 1; i >= 0; --i)
          r.data[i + n] = this.data[i];
        for (i = n - 1; i >= 0; --i)
          r.data[i] = 0;
        r.t = this.t + n;
        r.s = this.s;
      }
      function bnpDRShiftTo(n, r) {
        for (var i = n; i < this.t; ++i)
          r.data[i - n] = this.data[i];
        r.t = Math.max(this.t - n, 0);
        r.s = this.s;
      }
      function bnpLShiftTo(n, r) {
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n / this.DB), c = this.s << bs & this.DM, i;
        for (i = this.t - 1; i >= 0; --i) {
          r.data[i + ds + 1] = this.data[i] >> cbs | c;
          c = (this.data[i] & bm) << bs;
        }
        for (i = ds - 1; i >= 0; --i)
          r.data[i] = 0;
        r.data[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
      }
      function bnpRShiftTo(n, r) {
        r.s = this.s;
        var ds = Math.floor(n / this.DB);
        if (ds >= this.t) {
          r.t = 0;
          return;
        }
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << bs) - 1;
        r.data[0] = this.data[ds] >> bs;
        for (var i = ds + 1; i < this.t; ++i) {
          r.data[i - ds - 1] |= (this.data[i] & bm) << cbs;
          r.data[i - ds] = this.data[i] >> bs;
        }
        if (bs > 0)
          r.data[this.t - ds - 1] |= (this.s & bm) << cbs;
        r.t = this.t - ds;
        r.clamp();
      }
      function bnpSubTo(a, r) {
        var i = 0, c = 0, m = Math.min(a.t, this.t);
        while (i < m) {
          c += this.data[i] - a.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        if (a.t < this.t) {
          c -= a.s;
          while (i < this.t) {
            c += this.data[i];
            r.data[i++] = c & this.DM;
            c >>= this.DB;
          }
          c += this.s;
        } else {
          c += this.s;
          while (i < a.t) {
            c -= a.data[i];
            r.data[i++] = c & this.DM;
            c >>= this.DB;
          }
          c -= a.s;
        }
        r.s = c < 0 ? -1 : 0;
        if (c < -1)
          r.data[i++] = this.DV + c;
        else if (c > 0)
          r.data[i++] = c;
        r.t = i;
        r.clamp();
      }
      function bnpMultiplyTo(a, r) {
        var x = this.abs(), y = a.abs();
        var i = x.t;
        r.t = i + y.t;
        while (--i >= 0)
          r.data[i] = 0;
        for (i = 0; i < y.t; ++i)
          r.data[i + x.t] = x.am(0, y.data[i], r, i, 0, x.t);
        r.s = 0;
        r.clamp();
        if (this.s != a.s)
          BigInteger.ZERO.subTo(r, r);
      }
      function bnpSquareTo(r) {
        var x = this.abs();
        var i = r.t = 2 * x.t;
        while (--i >= 0)
          r.data[i] = 0;
        for (i = 0; i < x.t - 1; ++i) {
          var c = x.am(i, x.data[i], r, 2 * i, 0, 1);
          if ((r.data[i + x.t] += x.am(i + 1, 2 * x.data[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
            r.data[i + x.t] -= x.DV;
            r.data[i + x.t + 1] = 1;
          }
        }
        if (r.t > 0)
          r.data[r.t - 1] += x.am(i, x.data[i], r, 2 * i, 0, 1);
        r.s = 0;
        r.clamp();
      }
      function bnpDivRemTo(m, q, r) {
        var pm = m.abs();
        if (pm.t <= 0)
          return;
        var pt = this.abs();
        if (pt.t < pm.t) {
          if (q != null)
            q.fromInt(0);
          if (r != null)
            this.copyTo(r);
          return;
        }
        if (r == null)
          r = nbi();
        var y = nbi(), ts = this.s, ms = m.s;
        var nsh = this.DB - nbits(pm.data[pm.t - 1]);
        if (nsh > 0) {
          pm.lShiftTo(nsh, y);
          pt.lShiftTo(nsh, r);
        } else {
          pm.copyTo(y);
          pt.copyTo(r);
        }
        var ys = y.t;
        var y0 = y.data[ys - 1];
        if (y0 == 0)
          return;
        var yt = y0 * (1 << this.F1) + (ys > 1 ? y.data[ys - 2] >> this.F2 : 0);
        var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
        var i = r.t, j = i - ys, t = q == null ? nbi() : q;
        y.dlShiftTo(j, t);
        if (r.compareTo(t) >= 0) {
          r.data[r.t++] = 1;
          r.subTo(t, r);
        }
        BigInteger.ONE.dlShiftTo(ys, t);
        t.subTo(y, y);
        while (y.t < ys)
          y.data[y.t++] = 0;
        while (--j >= 0) {
          var qd = r.data[--i] == y0 ? this.DM : Math.floor(r.data[i] * d1 + (r.data[i - 1] + e) * d2);
          if ((r.data[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
            y.dlShiftTo(j, t);
            r.subTo(t, r);
            while (r.data[i] < --qd)
              r.subTo(t, r);
          }
        }
        if (q != null) {
          r.drShiftTo(ys, q);
          if (ts != ms)
            BigInteger.ZERO.subTo(q, q);
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0)
          r.rShiftTo(nsh, r);
        if (ts < 0)
          BigInteger.ZERO.subTo(r, r);
      }
      function bnMod(a) {
        var r = nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
          a.subTo(r, r);
        return r;
      }
      function Classic(m) {
        this.m = m;
      }
      function cConvert(x) {
        if (x.s < 0 || x.compareTo(this.m) >= 0)
          return x.mod(this.m);
        else
          return x;
      }
      function cRevert(x) {
        return x;
      }
      function cReduce(x) {
        x.divRemTo(this.m, null, x);
      }
      function cMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
      }
      function cSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
      }
      Classic.prototype.convert = cConvert;
      Classic.prototype.revert = cRevert;
      Classic.prototype.reduce = cReduce;
      Classic.prototype.mulTo = cMulTo;
      Classic.prototype.sqrTo = cSqrTo;
      function bnpInvDigit() {
        if (this.t < 1)
          return 0;
        var x = this.data[0];
        if ((x & 1) == 0)
          return 0;
        var y = x & 3;
        y = y * (2 - (x & 15) * y) & 15;
        y = y * (2 - (x & 255) * y) & 255;
        y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
        y = y * (2 - x * y % this.DV) % this.DV;
        return y > 0 ? this.DV - y : -y;
      }
      function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp & 32767;
        this.mph = this.mp >> 15;
        this.um = (1 << m.DB - 15) - 1;
        this.mt2 = 2 * m.t;
      }
      function montConvert(x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
          this.m.subTo(r, r);
        return r;
      }
      function montRevert(x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
      }
      function montReduce(x) {
        while (x.t <= this.mt2)
          x.data[x.t++] = 0;
        for (var i = 0; i < this.m.t; ++i) {
          var j = x.data[i] & 32767;
          var u0 = j * this.mpl + ((j * this.mph + (x.data[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
          j = i + this.m.t;
          x.data[j] += this.m.am(0, u0, x, i, 0, this.m.t);
          while (x.data[j] >= x.DV) {
            x.data[j] -= x.DV;
            x.data[++j]++;
          }
        }
        x.clamp();
        x.drShiftTo(this.m.t, x);
        if (x.compareTo(this.m) >= 0)
          x.subTo(this.m, x);
      }
      function montSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
      }
      function montMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
      }
      Montgomery.prototype.convert = montConvert;
      Montgomery.prototype.revert = montRevert;
      Montgomery.prototype.reduce = montReduce;
      Montgomery.prototype.mulTo = montMulTo;
      Montgomery.prototype.sqrTo = montSqrTo;
      function bnpIsEven() {
        return (this.t > 0 ? this.data[0] & 1 : this.s) == 0;
      }
      function bnpExp(e, z) {
        if (e > 4294967295 || e < 1)
          return BigInteger.ONE;
        var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e) - 1;
        g.copyTo(r);
        while (--i >= 0) {
          z.sqrTo(r, r2);
          if ((e & 1 << i) > 0)
            z.mulTo(r2, g, r);
          else {
            var t = r;
            r = r2;
            r2 = t;
          }
        }
        return z.revert(r);
      }
      function bnModPowInt(e, m) {
        var z;
        if (e < 256 || m.isEven())
          z = new Classic(m);
        else
          z = new Montgomery(m);
        return this.exp(e, z);
      }
      BigInteger.prototype.copyTo = bnpCopyTo;
      BigInteger.prototype.fromInt = bnpFromInt;
      BigInteger.prototype.fromString = bnpFromString;
      BigInteger.prototype.clamp = bnpClamp;
      BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
      BigInteger.prototype.drShiftTo = bnpDRShiftTo;
      BigInteger.prototype.lShiftTo = bnpLShiftTo;
      BigInteger.prototype.rShiftTo = bnpRShiftTo;
      BigInteger.prototype.subTo = bnpSubTo;
      BigInteger.prototype.multiplyTo = bnpMultiplyTo;
      BigInteger.prototype.squareTo = bnpSquareTo;
      BigInteger.prototype.divRemTo = bnpDivRemTo;
      BigInteger.prototype.invDigit = bnpInvDigit;
      BigInteger.prototype.isEven = bnpIsEven;
      BigInteger.prototype.exp = bnpExp;
      BigInteger.prototype.toString = bnToString;
      BigInteger.prototype.negate = bnNegate;
      BigInteger.prototype.abs = bnAbs;
      BigInteger.prototype.compareTo = bnCompareTo;
      BigInteger.prototype.bitLength = bnBitLength;
      BigInteger.prototype.mod = bnMod;
      BigInteger.prototype.modPowInt = bnModPowInt;
      BigInteger.ZERO = nbv(0);
      BigInteger.ONE = nbv(1);
      function bnClone() {
        var r = nbi();
        this.copyTo(r);
        return r;
      }
      function bnIntValue() {
        if (this.s < 0) {
          if (this.t == 1)
            return this.data[0] - this.DV;
          else if (this.t == 0)
            return -1;
        } else if (this.t == 1)
          return this.data[0];
        else if (this.t == 0)
          return 0;
        return (this.data[1] & (1 << 32 - this.DB) - 1) << this.DB | this.data[0];
      }
      function bnByteValue() {
        return this.t == 0 ? this.s : this.data[0] << 24 >> 24;
      }
      function bnShortValue() {
        return this.t == 0 ? this.s : this.data[0] << 16 >> 16;
      }
      function bnpChunkSize(r) {
        return Math.floor(Math.LN2 * this.DB / Math.log(r));
      }
      function bnSigNum() {
        if (this.s < 0)
          return -1;
        else if (this.t <= 0 || this.t == 1 && this.data[0] <= 0)
          return 0;
        else
          return 1;
      }
      function bnpToRadix(b) {
        if (b == null)
          b = 10;
        if (this.signum() == 0 || b < 2 || b > 36)
          return "0";
        var cs = this.chunkSize(b);
        var a = Math.pow(b, cs);
        var d = nbv(a), y = nbi(), z = nbi(), r = "";
        this.divRemTo(d, y, z);
        while (y.signum() > 0) {
          r = (a + z.intValue()).toString(b).substr(1) + r;
          y.divRemTo(d, y, z);
        }
        return z.intValue().toString(b) + r;
      }
      function bnpFromRadix(s, b) {
        this.fromInt(0);
        if (b == null)
          b = 10;
        var cs = this.chunkSize(b);
        var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
        for (var i = 0; i < s.length; ++i) {
          var x = intAt(s, i);
          if (x < 0) {
            if (s.charAt(i) == "-" && this.signum() == 0)
              mi = true;
            continue;
          }
          w = b * w + x;
          if (++j >= cs) {
            this.dMultiply(d);
            this.dAddOffset(w, 0);
            j = 0;
            w = 0;
          }
        }
        if (j > 0) {
          this.dMultiply(Math.pow(b, j));
          this.dAddOffset(w, 0);
        }
        if (mi)
          BigInteger.ZERO.subTo(this, this);
      }
      function bnpFromNumber(a, b, c) {
        if (typeof b == "number") {
          if (a < 2)
            this.fromInt(1);
          else {
            this.fromNumber(a, c);
            if (!this.testBit(a - 1))
              this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
            if (this.isEven())
              this.dAddOffset(1, 0);
            while (!this.isProbablePrime(b)) {
              this.dAddOffset(2, 0);
              if (this.bitLength() > a)
                this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
            }
          }
        } else {
          var x = new Array(), t = a & 7;
          x.length = (a >> 3) + 1;
          b.nextBytes(x);
          if (t > 0)
            x[0] &= (1 << t) - 1;
          else
            x[0] = 0;
          this.fromString(x, 256);
        }
      }
      function bnToByteArray() {
        var i = this.t, r = new Array();
        r[0] = this.s;
        var p = this.DB - i * this.DB % 8, d, k = 0;
        if (i-- > 0) {
          if (p < this.DB && (d = this.data[i] >> p) != (this.s & this.DM) >> p)
            r[k++] = d | this.s << this.DB - p;
          while (i >= 0) {
            if (p < 8) {
              d = (this.data[i] & (1 << p) - 1) << 8 - p;
              d |= this.data[--i] >> (p += this.DB - 8);
            } else {
              d = this.data[i] >> (p -= 8) & 255;
              if (p <= 0) {
                p += this.DB;
                --i;
              }
            }
            if ((d & 128) != 0)
              d |= -256;
            if (k == 0 && (this.s & 128) != (d & 128))
              ++k;
            if (k > 0 || d != this.s)
              r[k++] = d;
          }
        }
        return r;
      }
      function bnEquals(a) {
        return this.compareTo(a) == 0;
      }
      function bnMin(a) {
        return this.compareTo(a) < 0 ? this : a;
      }
      function bnMax(a) {
        return this.compareTo(a) > 0 ? this : a;
      }
      function bnpBitwiseTo(a, op, r) {
        var i, f, m = Math.min(a.t, this.t);
        for (i = 0; i < m; ++i)
          r.data[i] = op(this.data[i], a.data[i]);
        if (a.t < this.t) {
          f = a.s & this.DM;
          for (i = m; i < this.t; ++i)
            r.data[i] = op(this.data[i], f);
          r.t = this.t;
        } else {
          f = this.s & this.DM;
          for (i = m; i < a.t; ++i)
            r.data[i] = op(f, a.data[i]);
          r.t = a.t;
        }
        r.s = op(this.s, a.s);
        r.clamp();
      }
      function op_and(x, y) {
        return x & y;
      }
      function bnAnd(a) {
        var r = nbi();
        this.bitwiseTo(a, op_and, r);
        return r;
      }
      function op_or(x, y) {
        return x | y;
      }
      function bnOr(a) {
        var r = nbi();
        this.bitwiseTo(a, op_or, r);
        return r;
      }
      function op_xor(x, y) {
        return x ^ y;
      }
      function bnXor(a) {
        var r = nbi();
        this.bitwiseTo(a, op_xor, r);
        return r;
      }
      function op_andnot(x, y) {
        return x & ~y;
      }
      function bnAndNot(a) {
        var r = nbi();
        this.bitwiseTo(a, op_andnot, r);
        return r;
      }
      function bnNot() {
        var r = nbi();
        for (var i = 0; i < this.t; ++i)
          r.data[i] = this.DM & ~this.data[i];
        r.t = this.t;
        r.s = ~this.s;
        return r;
      }
      function bnShiftLeft(n) {
        var r = nbi();
        if (n < 0)
          this.rShiftTo(-n, r);
        else
          this.lShiftTo(n, r);
        return r;
      }
      function bnShiftRight(n) {
        var r = nbi();
        if (n < 0)
          this.lShiftTo(-n, r);
        else
          this.rShiftTo(n, r);
        return r;
      }
      function lbit(x) {
        if (x == 0)
          return -1;
        var r = 0;
        if ((x & 65535) == 0) {
          x >>= 16;
          r += 16;
        }
        if ((x & 255) == 0) {
          x >>= 8;
          r += 8;
        }
        if ((x & 15) == 0) {
          x >>= 4;
          r += 4;
        }
        if ((x & 3) == 0) {
          x >>= 2;
          r += 2;
        }
        if ((x & 1) == 0)
          ++r;
        return r;
      }
      function bnGetLowestSetBit() {
        for (var i = 0; i < this.t; ++i)
          if (this.data[i] != 0)
            return i * this.DB + lbit(this.data[i]);
        if (this.s < 0)
          return this.t * this.DB;
        return -1;
      }
      function cbit(x) {
        var r = 0;
        while (x != 0) {
          x &= x - 1;
          ++r;
        }
        return r;
      }
      function bnBitCount() {
        var r = 0, x = this.s & this.DM;
        for (var i = 0; i < this.t; ++i)
          r += cbit(this.data[i] ^ x);
        return r;
      }
      function bnTestBit(n) {
        var j = Math.floor(n / this.DB);
        if (j >= this.t)
          return this.s != 0;
        return (this.data[j] & 1 << n % this.DB) != 0;
      }
      function bnpChangeBit(n, op) {
        var r = BigInteger.ONE.shiftLeft(n);
        this.bitwiseTo(r, op, r);
        return r;
      }
      function bnSetBit(n) {
        return this.changeBit(n, op_or);
      }
      function bnClearBit(n) {
        return this.changeBit(n, op_andnot);
      }
      function bnFlipBit(n) {
        return this.changeBit(n, op_xor);
      }
      function bnpAddTo(a, r) {
        var i = 0, c = 0, m = Math.min(a.t, this.t);
        while (i < m) {
          c += this.data[i] + a.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        if (a.t < this.t) {
          c += a.s;
          while (i < this.t) {
            c += this.data[i];
            r.data[i++] = c & this.DM;
            c >>= this.DB;
          }
          c += this.s;
        } else {
          c += this.s;
          while (i < a.t) {
            c += a.data[i];
            r.data[i++] = c & this.DM;
            c >>= this.DB;
          }
          c += a.s;
        }
        r.s = c < 0 ? -1 : 0;
        if (c > 0)
          r.data[i++] = c;
        else if (c < -1)
          r.data[i++] = this.DV + c;
        r.t = i;
        r.clamp();
      }
      function bnAdd(a) {
        var r = nbi();
        this.addTo(a, r);
        return r;
      }
      function bnSubtract(a) {
        var r = nbi();
        this.subTo(a, r);
        return r;
      }
      function bnMultiply(a) {
        var r = nbi();
        this.multiplyTo(a, r);
        return r;
      }
      function bnDivide(a) {
        var r = nbi();
        this.divRemTo(a, r, null);
        return r;
      }
      function bnRemainder(a) {
        var r = nbi();
        this.divRemTo(a, null, r);
        return r;
      }
      function bnDivideAndRemainder(a) {
        var q = nbi(), r = nbi();
        this.divRemTo(a, q, r);
        return new Array(q, r);
      }
      function bnpDMultiply(n) {
        this.data[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp();
      }
      function bnpDAddOffset(n, w) {
        if (n == 0)
          return;
        while (this.t <= w)
          this.data[this.t++] = 0;
        this.data[w] += n;
        while (this.data[w] >= this.DV) {
          this.data[w] -= this.DV;
          if (++w >= this.t)
            this.data[this.t++] = 0;
          ++this.data[w];
        }
      }
      function NullExp() {
      }
      function nNop(x) {
        return x;
      }
      function nMulTo(x, y, r) {
        x.multiplyTo(y, r);
      }
      function nSqrTo(x, r) {
        x.squareTo(r);
      }
      NullExp.prototype.convert = nNop;
      NullExp.prototype.revert = nNop;
      NullExp.prototype.mulTo = nMulTo;
      NullExp.prototype.sqrTo = nSqrTo;
      function bnPow(e) {
        return this.exp(e, new NullExp());
      }
      function bnpMultiplyLowerTo(a, n, r) {
        var i = Math.min(this.t + a.t, n);
        r.s = 0;
        r.t = i;
        while (i > 0)
          r.data[--i] = 0;
        var j;
        for (j = r.t - this.t; i < j; ++i)
          r.data[i + this.t] = this.am(0, a.data[i], r, i, 0, this.t);
        for (j = Math.min(a.t, n); i < j; ++i)
          this.am(0, a.data[i], r, i, 0, n - i);
        r.clamp();
      }
      function bnpMultiplyUpperTo(a, n, r) {
        --n;
        var i = r.t = this.t + a.t - n;
        r.s = 0;
        while (--i >= 0)
          r.data[i] = 0;
        for (i = Math.max(n - this.t, 0); i < a.t; ++i)
          r.data[this.t + i - n] = this.am(n - i, a.data[i], r, 0, 0, this.t + i - n);
        r.clamp();
        r.drShiftTo(1, r);
      }
      function Barrett(m) {
        this.r2 = nbi();
        this.q3 = nbi();
        BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
        this.mu = this.r2.divide(m);
        this.m = m;
      }
      function barrettConvert(x) {
        if (x.s < 0 || x.t > 2 * this.m.t)
          return x.mod(this.m);
        else if (x.compareTo(this.m) < 0)
          return x;
        else {
          var r = nbi();
          x.copyTo(r);
          this.reduce(r);
          return r;
        }
      }
      function barrettRevert(x) {
        return x;
      }
      function barrettReduce(x) {
        x.drShiftTo(this.m.t - 1, this.r2);
        if (x.t > this.m.t + 1) {
          x.t = this.m.t + 1;
          x.clamp();
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (x.compareTo(this.r2) < 0)
          x.dAddOffset(1, this.m.t + 1);
        x.subTo(this.r2, x);
        while (x.compareTo(this.m) >= 0)
          x.subTo(this.m, x);
      }
      function barrettSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
      }
      function barrettMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
      }
      Barrett.prototype.convert = barrettConvert;
      Barrett.prototype.revert = barrettRevert;
      Barrett.prototype.reduce = barrettReduce;
      Barrett.prototype.mulTo = barrettMulTo;
      Barrett.prototype.sqrTo = barrettSqrTo;
      function bnModPow(e, m) {
        var i = e.bitLength(), k, r = nbv(1), z;
        if (i <= 0)
          return r;
        else if (i < 18)
          k = 1;
        else if (i < 48)
          k = 3;
        else if (i < 144)
          k = 4;
        else if (i < 768)
          k = 5;
        else
          k = 6;
        if (i < 8)
          z = new Classic(m);
        else if (m.isEven())
          z = new Barrett(m);
        else
          z = new Montgomery(m);
        var g = new Array(), n = 3, k1 = k - 1, km = (1 << k) - 1;
        g[1] = z.convert(this);
        if (k > 1) {
          var g2 = nbi();
          z.sqrTo(g[1], g2);
          while (n <= km) {
            g[n] = nbi();
            z.mulTo(g2, g[n - 2], g[n]);
            n += 2;
          }
        }
        var j = e.t - 1, w, is1 = true, r2 = nbi(), t;
        i = nbits(e.data[j]) - 1;
        while (j >= 0) {
          if (i >= k1)
            w = e.data[j] >> i - k1 & km;
          else {
            w = (e.data[j] & (1 << i + 1) - 1) << k1 - i;
            if (j > 0)
              w |= e.data[j - 1] >> this.DB + i - k1;
          }
          n = k;
          while ((w & 1) == 0) {
            w >>= 1;
            --n;
          }
          if ((i -= n) < 0) {
            i += this.DB;
            --j;
          }
          if (is1) {
            g[w].copyTo(r);
            is1 = false;
          } else {
            while (n > 1) {
              z.sqrTo(r, r2);
              z.sqrTo(r2, r);
              n -= 2;
            }
            if (n > 0)
              z.sqrTo(r, r2);
            else {
              t = r;
              r = r2;
              r2 = t;
            }
            z.mulTo(r2, g[w], r);
          }
          while (j >= 0 && (e.data[j] & 1 << i) == 0) {
            z.sqrTo(r, r2);
            t = r;
            r = r2;
            r2 = t;
            if (--i < 0) {
              i = this.DB - 1;
              --j;
            }
          }
        }
        return z.revert(r);
      }
      function bnGCD(a) {
        var x = this.s < 0 ? this.negate() : this.clone();
        var y = a.s < 0 ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
          var t = x;
          x = y;
          y = t;
        }
        var i = x.getLowestSetBit(), g = y.getLowestSetBit();
        if (g < 0)
          return x;
        if (i < g)
          g = i;
        if (g > 0) {
          x.rShiftTo(g, x);
          y.rShiftTo(g, y);
        }
        while (x.signum() > 0) {
          if ((i = x.getLowestSetBit()) > 0)
            x.rShiftTo(i, x);
          if ((i = y.getLowestSetBit()) > 0)
            y.rShiftTo(i, y);
          if (x.compareTo(y) >= 0) {
            x.subTo(y, x);
            x.rShiftTo(1, x);
          } else {
            y.subTo(x, y);
            y.rShiftTo(1, y);
          }
        }
        if (g > 0)
          y.lShiftTo(g, y);
        return y;
      }
      function bnpModInt(n) {
        if (n <= 0)
          return 0;
        var d = this.DV % n, r = this.s < 0 ? n - 1 : 0;
        if (this.t > 0)
          if (d == 0)
            r = this.data[0] % n;
          else
            for (var i = this.t - 1; i >= 0; --i)
              r = (d * r + this.data[i]) % n;
        return r;
      }
      function bnModInverse(m) {
        var ac = m.isEven();
        if (this.isEven() && ac || m.signum() == 0)
          return BigInteger.ZERO;
        var u = m.clone(), v = this.clone();
        var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
        while (u.signum() != 0) {
          while (u.isEven()) {
            u.rShiftTo(1, u);
            if (ac) {
              if (!a.isEven() || !b.isEven()) {
                a.addTo(this, a);
                b.subTo(m, b);
              }
              a.rShiftTo(1, a);
            } else if (!b.isEven())
              b.subTo(m, b);
            b.rShiftTo(1, b);
          }
          while (v.isEven()) {
            v.rShiftTo(1, v);
            if (ac) {
              if (!c.isEven() || !d.isEven()) {
                c.addTo(this, c);
                d.subTo(m, d);
              }
              c.rShiftTo(1, c);
            } else if (!d.isEven())
              d.subTo(m, d);
            d.rShiftTo(1, d);
          }
          if (u.compareTo(v) >= 0) {
            u.subTo(v, u);
            if (ac)
              a.subTo(c, a);
            b.subTo(d, b);
          } else {
            v.subTo(u, v);
            if (ac)
              c.subTo(a, c);
            d.subTo(b, d);
          }
        }
        if (v.compareTo(BigInteger.ONE) != 0)
          return BigInteger.ZERO;
        if (d.compareTo(m) >= 0)
          return d.subtract(m);
        if (d.signum() < 0)
          d.addTo(m, d);
        else
          return d;
        if (d.signum() < 0)
          return d.add(m);
        else
          return d;
      }
      var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509];
      var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
      function bnIsProbablePrime(t) {
        var i, x = this.abs();
        if (x.t == 1 && x.data[0] <= lowprimes[lowprimes.length - 1]) {
          for (i = 0; i < lowprimes.length; ++i)
            if (x.data[0] == lowprimes[i])
              return true;
          return false;
        }
        if (x.isEven())
          return false;
        i = 1;
        while (i < lowprimes.length) {
          var m = lowprimes[i], j = i + 1;
          while (j < lowprimes.length && m < lplim)
            m *= lowprimes[j++];
          m = x.modInt(m);
          while (i < j)
            if (m % lowprimes[i++] == 0)
              return false;
        }
        return x.millerRabin(t);
      }
      function bnpMillerRabin(t) {
        var n1 = this.subtract(BigInteger.ONE);
        var k = n1.getLowestSetBit();
        if (k <= 0)
          return false;
        var r = n1.shiftRight(k);
        var prng = bnGetPrng();
        var a;
        for (var i = 0; i < t; ++i) {
          do {
            a = new BigInteger(this.bitLength(), prng);
          } while (a.compareTo(BigInteger.ONE) <= 0 || a.compareTo(n1) >= 0);
          var y = a.modPow(r, this);
          if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
            var j = 1;
            while (j++ < k && y.compareTo(n1) != 0) {
              y = y.modPowInt(2, this);
              if (y.compareTo(BigInteger.ONE) == 0)
                return false;
            }
            if (y.compareTo(n1) != 0)
              return false;
          }
        }
        return true;
      }
      function bnGetPrng() {
        return {
          nextBytes: function(x) {
            for (var i = 0; i < x.length; ++i) {
              x[i] = Math.floor(Math.random() * 256);
            }
          }
        };
      }
      BigInteger.prototype.chunkSize = bnpChunkSize;
      BigInteger.prototype.toRadix = bnpToRadix;
      BigInteger.prototype.fromRadix = bnpFromRadix;
      BigInteger.prototype.fromNumber = bnpFromNumber;
      BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
      BigInteger.prototype.changeBit = bnpChangeBit;
      BigInteger.prototype.addTo = bnpAddTo;
      BigInteger.prototype.dMultiply = bnpDMultiply;
      BigInteger.prototype.dAddOffset = bnpDAddOffset;
      BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
      BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
      BigInteger.prototype.modInt = bnpModInt;
      BigInteger.prototype.millerRabin = bnpMillerRabin;
      BigInteger.prototype.clone = bnClone;
      BigInteger.prototype.intValue = bnIntValue;
      BigInteger.prototype.byteValue = bnByteValue;
      BigInteger.prototype.shortValue = bnShortValue;
      BigInteger.prototype.signum = bnSigNum;
      BigInteger.prototype.toByteArray = bnToByteArray;
      BigInteger.prototype.equals = bnEquals;
      BigInteger.prototype.min = bnMin;
      BigInteger.prototype.max = bnMax;
      BigInteger.prototype.and = bnAnd;
      BigInteger.prototype.or = bnOr;
      BigInteger.prototype.xor = bnXor;
      BigInteger.prototype.andNot = bnAndNot;
      BigInteger.prototype.not = bnNot;
      BigInteger.prototype.shiftLeft = bnShiftLeft;
      BigInteger.prototype.shiftRight = bnShiftRight;
      BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
      BigInteger.prototype.bitCount = bnBitCount;
      BigInteger.prototype.testBit = bnTestBit;
      BigInteger.prototype.setBit = bnSetBit;
      BigInteger.prototype.clearBit = bnClearBit;
      BigInteger.prototype.flipBit = bnFlipBit;
      BigInteger.prototype.add = bnAdd;
      BigInteger.prototype.subtract = bnSubtract;
      BigInteger.prototype.multiply = bnMultiply;
      BigInteger.prototype.divide = bnDivide;
      BigInteger.prototype.remainder = bnRemainder;
      BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
      BigInteger.prototype.modPow = bnModPow;
      BigInteger.prototype.modInverse = bnModInverse;
      BigInteger.prototype.pow = bnPow;
      BigInteger.prototype.gcd = bnGCD;
      BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
    }
  });

  // ../node_modules/node-forge/lib/sha1.js
  var require_sha1 = __commonJS({
    "../node_modules/node-forge/lib/sha1.js"(exports2, module2) {
      var forge6 = require_forge();
      require_md();
      require_util();
      var sha1 = module2.exports = forge6.sha1 = forge6.sha1 || {};
      forge6.md.sha1 = forge6.md.algorithms.sha1 = sha1;
      sha1.create = function() {
        if (!_initialized) {
          _init();
        }
        var _state = null;
        var _input = forge6.util.createBuffer();
        var _w = new Array(80);
        var md = {
          algorithm: "sha1",
          blockLength: 64,
          digestLength: 20,
          messageLength: 0,
          fullMessageLength: null,
          messageLengthSize: 8
        };
        md.start = function() {
          md.messageLength = 0;
          md.fullMessageLength = md.messageLength64 = [];
          var int32s = md.messageLengthSize / 4;
          for (var i = 0; i < int32s; ++i) {
            md.fullMessageLength.push(0);
          }
          _input = forge6.util.createBuffer();
          _state = {
            h0: 1732584193,
            h1: 4023233417,
            h2: 2562383102,
            h3: 271733878,
            h4: 3285377520
          };
          return md;
        };
        md.start();
        md.update = function(msg, encoding) {
          if (encoding === "utf8") {
            msg = forge6.util.encodeUtf8(msg);
          }
          var len = msg.length;
          md.messageLength += len;
          len = [len / 4294967296 >>> 0, len >>> 0];
          for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
            md.fullMessageLength[i] += len[1];
            len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
            md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
            len[0] = len[1] / 4294967296 >>> 0;
          }
          _input.putBytes(msg);
          _update(_state, _w, _input);
          if (_input.read > 2048 || _input.length() === 0) {
            _input.compact();
          }
          return md;
        };
        md.digest = function() {
          var finalBlock = forge6.util.createBuffer();
          finalBlock.putBytes(_input.bytes());
          var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
          var overflow = remaining & md.blockLength - 1;
          finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
          var next, carry;
          var bits2 = md.fullMessageLength[0] * 8;
          for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
            next = md.fullMessageLength[i + 1] * 8;
            carry = next / 4294967296 >>> 0;
            bits2 += carry;
            finalBlock.putInt32(bits2 >>> 0);
            bits2 = next >>> 0;
          }
          finalBlock.putInt32(bits2);
          var s2 = {
            h0: _state.h0,
            h1: _state.h1,
            h2: _state.h2,
            h3: _state.h3,
            h4: _state.h4
          };
          _update(s2, _w, finalBlock);
          var rval = forge6.util.createBuffer();
          rval.putInt32(s2.h0);
          rval.putInt32(s2.h1);
          rval.putInt32(s2.h2);
          rval.putInt32(s2.h3);
          rval.putInt32(s2.h4);
          return rval;
        };
        return md;
      };
      var _padding = null;
      var _initialized = false;
      function _init() {
        _padding = String.fromCharCode(128);
        _padding += forge6.util.fillString(String.fromCharCode(0), 64);
        _initialized = true;
      }
      function _update(s, w, bytes2) {
        var t, a, b, c, d, e, f, i;
        var len = bytes2.length();
        while (len >= 64) {
          a = s.h0;
          b = s.h1;
          c = s.h2;
          d = s.h3;
          e = s.h4;
          for (i = 0; i < 16; ++i) {
            t = bytes2.getInt32();
            w[i] = t;
            f = d ^ b & (c ^ d);
            t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          for (; i < 20; ++i) {
            t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
            t = t << 1 | t >>> 31;
            w[i] = t;
            f = d ^ b & (c ^ d);
            t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          for (; i < 32; ++i) {
            t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
            t = t << 1 | t >>> 31;
            w[i] = t;
            f = b ^ c ^ d;
            t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          for (; i < 40; ++i) {
            t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
            t = t << 2 | t >>> 30;
            w[i] = t;
            f = b ^ c ^ d;
            t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          for (; i < 60; ++i) {
            t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
            t = t << 2 | t >>> 30;
            w[i] = t;
            f = b & c | d & (b ^ c);
            t = (a << 5 | a >>> 27) + f + e + 2400959708 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          for (; i < 80; ++i) {
            t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
            t = t << 2 | t >>> 30;
            w[i] = t;
            f = b ^ c ^ d;
            t = (a << 5 | a >>> 27) + f + e + 3395469782 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          s.h0 = s.h0 + a | 0;
          s.h1 = s.h1 + b | 0;
          s.h2 = s.h2 + c | 0;
          s.h3 = s.h3 + d | 0;
          s.h4 = s.h4 + e | 0;
          len -= 64;
        }
      }
    }
  });

  // ../node_modules/node-forge/lib/pkcs1.js
  var require_pkcs1 = __commonJS({
    "../node_modules/node-forge/lib/pkcs1.js"(exports2, module2) {
      var forge6 = require_forge();
      require_util();
      require_random();
      require_sha1();
      var pkcs1 = module2.exports = forge6.pkcs1 = forge6.pkcs1 || {};
      pkcs1.encode_rsa_oaep = function(key, message2, options) {
        var label;
        var seed;
        var md;
        var mgf1Md;
        if (typeof options === "string") {
          label = options;
          seed = arguments[3] || void 0;
          md = arguments[4] || void 0;
        } else if (options) {
          label = options.label || void 0;
          seed = options.seed || void 0;
          md = options.md || void 0;
          if (options.mgf1 && options.mgf1.md) {
            mgf1Md = options.mgf1.md;
          }
        }
        if (!md) {
          md = forge6.md.sha1.create();
        } else {
          md.start();
        }
        if (!mgf1Md) {
          mgf1Md = md;
        }
        var keyLength = Math.ceil(key.n.bitLength() / 8);
        var maxLength = keyLength - 2 * md.digestLength - 2;
        if (message2.length > maxLength) {
          var error = new Error("RSAES-OAEP input message length is too long.");
          error.length = message2.length;
          error.maxLength = maxLength;
          throw error;
        }
        if (!label) {
          label = "";
        }
        md.update(label, "raw");
        var lHash = md.digest();
        var PS = "";
        var PS_length = maxLength - message2.length;
        for (var i = 0; i < PS_length; i++) {
          PS += "\0";
        }
        var DB = lHash.getBytes() + PS + "" + message2;
        if (!seed) {
          seed = forge6.random.getBytes(md.digestLength);
        } else if (seed.length !== md.digestLength) {
          var error = new Error("Invalid RSAES-OAEP seed. The seed length must match the digest length.");
          error.seedLength = seed.length;
          error.digestLength = md.digestLength;
          throw error;
        }
        var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
        var maskedDB = forge6.util.xorBytes(DB, dbMask, DB.length);
        var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
        var maskedSeed = forge6.util.xorBytes(seed, seedMask, seed.length);
        return "\0" + maskedSeed + maskedDB;
      };
      pkcs1.decode_rsa_oaep = function(key, em, options) {
        var label;
        var md;
        var mgf1Md;
        if (typeof options === "string") {
          label = options;
          md = arguments[3] || void 0;
        } else if (options) {
          label = options.label || void 0;
          md = options.md || void 0;
          if (options.mgf1 && options.mgf1.md) {
            mgf1Md = options.mgf1.md;
          }
        }
        var keyLength = Math.ceil(key.n.bitLength() / 8);
        if (em.length !== keyLength) {
          var error = new Error("RSAES-OAEP encoded message length is invalid.");
          error.length = em.length;
          error.expectedLength = keyLength;
          throw error;
        }
        if (md === void 0) {
          md = forge6.md.sha1.create();
        } else {
          md.start();
        }
        if (!mgf1Md) {
          mgf1Md = md;
        }
        if (keyLength < 2 * md.digestLength + 2) {
          throw new Error("RSAES-OAEP key is too short for the hash function.");
        }
        if (!label) {
          label = "";
        }
        md.update(label, "raw");
        var lHash = md.digest().getBytes();
        var y = em.charAt(0);
        var maskedSeed = em.substring(1, md.digestLength + 1);
        var maskedDB = em.substring(1 + md.digestLength);
        var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
        var seed = forge6.util.xorBytes(maskedSeed, seedMask, maskedSeed.length);
        var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
        var db = forge6.util.xorBytes(maskedDB, dbMask, maskedDB.length);
        var lHashPrime = db.substring(0, md.digestLength);
        var error = y !== "\0";
        for (var i = 0; i < md.digestLength; ++i) {
          error |= lHash.charAt(i) !== lHashPrime.charAt(i);
        }
        var in_ps = 1;
        var index = md.digestLength;
        for (var j = md.digestLength; j < db.length; j++) {
          var code3 = db.charCodeAt(j);
          var is_0 = code3 & 1 ^ 1;
          var error_mask = in_ps ? 65534 : 0;
          error |= code3 & error_mask;
          in_ps = in_ps & is_0;
          index += in_ps;
        }
        if (error || db.charCodeAt(index) !== 1) {
          throw new Error("Invalid RSAES-OAEP padding.");
        }
        return db.substring(index + 1);
      };
      function rsa_mgf1(seed, maskLength, hash) {
        if (!hash) {
          hash = forge6.md.sha1.create();
        }
        var t = "";
        var count = Math.ceil(maskLength / hash.digestLength);
        for (var i = 0; i < count; ++i) {
          var c = String.fromCharCode(i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, i & 255);
          hash.start();
          hash.update(seed + c);
          t += hash.digest().getBytes();
        }
        return t.substring(0, maskLength);
      }
    }
  });

  // ../node_modules/node-forge/lib/prime.js
  var require_prime = __commonJS({
    "../node_modules/node-forge/lib/prime.js"(exports2, module2) {
      var forge6 = require_forge();
      require_util();
      require_jsbn();
      require_random();
      (function() {
        if (forge6.prime) {
          module2.exports = forge6.prime;
          return;
        }
        var prime = module2.exports = forge6.prime = forge6.prime || {};
        var BigInteger = forge6.jsbn.BigInteger;
        var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
        var THIRTY = new BigInteger(null);
        THIRTY.fromInt(30);
        var op_or = function(x, y) {
          return x | y;
        };
        prime.generateProbablePrime = function(bits2, options, callback) {
          if (typeof options === "function") {
            callback = options;
            options = {};
          }
          options = options || {};
          var algorithm = options.algorithm || "PRIMEINC";
          if (typeof algorithm === "string") {
            algorithm = { name: algorithm };
          }
          algorithm.options = algorithm.options || {};
          var prng = options.prng || forge6.random;
          var rng = {
            nextBytes: function(x) {
              var b = prng.getBytesSync(x.length);
              for (var i = 0; i < x.length; ++i) {
                x[i] = b.charCodeAt(i);
              }
            }
          };
          if (algorithm.name === "PRIMEINC") {
            return primeincFindPrime(bits2, rng, algorithm.options, callback);
          }
          throw new Error("Invalid prime generation algorithm: " + algorithm.name);
        };
        function primeincFindPrime(bits2, rng, options, callback) {
          if ("workers" in options) {
            return primeincFindPrimeWithWorkers(bits2, rng, options, callback);
          }
          return primeincFindPrimeWithoutWorkers(bits2, rng, options, callback);
        }
        function primeincFindPrimeWithoutWorkers(bits2, rng, options, callback) {
          var num = generateRandom(bits2, rng);
          var deltaIdx = 0;
          var mrTests = getMillerRabinTests(num.bitLength());
          if ("millerRabinTests" in options) {
            mrTests = options.millerRabinTests;
          }
          var maxBlockTime = 10;
          if ("maxBlockTime" in options) {
            maxBlockTime = options.maxBlockTime;
          }
          _primeinc(num, bits2, rng, deltaIdx, mrTests, maxBlockTime, callback);
        }
        function _primeinc(num, bits2, rng, deltaIdx, mrTests, maxBlockTime, callback) {
          var start = +new Date();
          do {
            if (num.bitLength() > bits2) {
              num = generateRandom(bits2, rng);
            }
            if (num.isProbablePrime(mrTests)) {
              return callback(null, num);
            }
            num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
          } while (maxBlockTime < 0 || +new Date() - start < maxBlockTime);
          forge6.util.setImmediate(function() {
            _primeinc(num, bits2, rng, deltaIdx, mrTests, maxBlockTime, callback);
          });
        }
        function primeincFindPrimeWithWorkers(bits2, rng, options, callback) {
          if (typeof Worker === "undefined") {
            return primeincFindPrimeWithoutWorkers(bits2, rng, options, callback);
          }
          var num = generateRandom(bits2, rng);
          var numWorkers = options.workers;
          var workLoad = options.workLoad || 100;
          var range = workLoad * 30 / 8;
          var workerScript = options.workerScript || "forge/prime.worker.js";
          if (numWorkers === -1) {
            return forge6.util.estimateCores(function(err, cores) {
              if (err) {
                cores = 2;
              }
              numWorkers = cores - 1;
              generate();
            });
          }
          generate();
          function generate() {
            numWorkers = Math.max(1, numWorkers);
            var workers = [];
            for (var i = 0; i < numWorkers; ++i) {
              workers[i] = new Worker(workerScript);
            }
            var running = numWorkers;
            for (var i = 0; i < numWorkers; ++i) {
              workers[i].addEventListener("message", workerMessage);
            }
            var found = false;
            function workerMessage(e) {
              if (found) {
                return;
              }
              --running;
              var data = e.data;
              if (data.found) {
                for (var i2 = 0; i2 < workers.length; ++i2) {
                  workers[i2].terminate();
                }
                found = true;
                return callback(null, new BigInteger(data.prime, 16));
              }
              if (num.bitLength() > bits2) {
                num = generateRandom(bits2, rng);
              }
              var hex = num.toString(16);
              e.target.postMessage({
                hex,
                workLoad
              });
              num.dAddOffset(range, 0);
            }
          }
        }
        function generateRandom(bits2, rng) {
          var num = new BigInteger(bits2, rng);
          var bits1 = bits2 - 1;
          if (!num.testBit(bits1)) {
            num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, num);
          }
          num.dAddOffset(31 - num.mod(THIRTY).byteValue(), 0);
          return num;
        }
        function getMillerRabinTests(bits2) {
          if (bits2 <= 100)
            return 27;
          if (bits2 <= 150)
            return 18;
          if (bits2 <= 200)
            return 15;
          if (bits2 <= 250)
            return 12;
          if (bits2 <= 300)
            return 9;
          if (bits2 <= 350)
            return 8;
          if (bits2 <= 400)
            return 7;
          if (bits2 <= 500)
            return 6;
          if (bits2 <= 600)
            return 5;
          if (bits2 <= 800)
            return 4;
          if (bits2 <= 1250)
            return 3;
          return 2;
        }
      })();
    }
  });

  // ../node_modules/node-forge/lib/rsa.js
  var require_rsa = __commonJS({
    "../node_modules/node-forge/lib/rsa.js"(exports2, module2) {
      var forge6 = require_forge();
      require_asn1();
      require_jsbn();
      require_oids();
      require_pkcs1();
      require_prime();
      require_random();
      require_util();
      if (typeof BigInteger === "undefined") {
        BigInteger = forge6.jsbn.BigInteger;
      }
      var BigInteger;
      var _crypto = forge6.util.isNodejs ? require_crypto() : null;
      var asn1 = forge6.asn1;
      var util = forge6.util;
      forge6.pki = forge6.pki || {};
      module2.exports = forge6.pki.rsa = forge6.rsa = forge6.rsa || {};
      var pki = forge6.pki;
      var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
      var privateKeyValidator = {
        name: "PrivateKeyInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "PrivateKeyInfo.version",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyVersion"
        }, {
          name: "PrivateKeyInfo.privateKeyAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "AlgorithmIdentifier.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "privateKeyOid"
          }]
        }, {
          name: "PrivateKeyInfo",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "privateKey"
        }]
      };
      var rsaPrivateKeyValidator = {
        name: "RSAPrivateKey",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "RSAPrivateKey.version",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyVersion"
        }, {
          name: "RSAPrivateKey.modulus",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyModulus"
        }, {
          name: "RSAPrivateKey.publicExponent",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyPublicExponent"
        }, {
          name: "RSAPrivateKey.privateExponent",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyPrivateExponent"
        }, {
          name: "RSAPrivateKey.prime1",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyPrime1"
        }, {
          name: "RSAPrivateKey.prime2",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyPrime2"
        }, {
          name: "RSAPrivateKey.exponent1",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyExponent1"
        }, {
          name: "RSAPrivateKey.exponent2",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyExponent2"
        }, {
          name: "RSAPrivateKey.coefficient",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyCoefficient"
        }]
      };
      var rsaPublicKeyValidator = {
        name: "RSAPublicKey",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "RSAPublicKey.modulus",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "publicKeyModulus"
        }, {
          name: "RSAPublicKey.exponent",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "publicKeyExponent"
        }]
      };
      var publicKeyValidator = forge6.pki.rsa.publicKeyValidator = {
        name: "SubjectPublicKeyInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "subjectPublicKeyInfo",
        value: [{
          name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "AlgorithmIdentifier.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "publicKeyOid"
          }]
        }, {
          name: "SubjectPublicKeyInfo.subjectPublicKey",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.BITSTRING,
          constructed: false,
          value: [{
            name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            optional: true,
            captureAsn1: "rsaPublicKey"
          }]
        }]
      };
      var digestInfoValidator = {
        name: "DigestInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "DigestInfo.DigestAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "algorithmIdentifier"
          }, {
            name: "DigestInfo.DigestAlgorithm.parameters",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.NULL,
            capture: "parameters",
            optional: true,
            constructed: false
          }]
        }, {
          name: "DigestInfo.digest",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "digest"
        }]
      };
      var emsaPkcs1v15encode = function(md) {
        var oid;
        if (md.algorithm in pki.oids) {
          oid = pki.oids[md.algorithm];
        } else {
          var error = new Error("Unknown message digest algorithm.");
          error.algorithm = md.algorithm;
          throw error;
        }
        var oidBytes = asn1.oidToDer(oid).getBytes();
        var digestInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
        var digestAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
        digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, oidBytes));
        digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, ""));
        var digest2 = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, md.digest().getBytes());
        digestInfo.value.push(digestAlgorithm);
        digestInfo.value.push(digest2);
        return asn1.toDer(digestInfo).getBytes();
      };
      var _modPow = function(x, key, pub) {
        if (pub) {
          return x.modPow(key.e, key.n);
        }
        if (!key.p || !key.q) {
          return x.modPow(key.d, key.n);
        }
        if (!key.dP) {
          key.dP = key.d.mod(key.p.subtract(BigInteger.ONE));
        }
        if (!key.dQ) {
          key.dQ = key.d.mod(key.q.subtract(BigInteger.ONE));
        }
        if (!key.qInv) {
          key.qInv = key.q.modInverse(key.p);
        }
        var r;
        do {
          r = new BigInteger(forge6.util.bytesToHex(forge6.random.getBytes(key.n.bitLength() / 8)), 16);
        } while (r.compareTo(key.n) >= 0 || !r.gcd(key.n).equals(BigInteger.ONE));
        x = x.multiply(r.modPow(key.e, key.n)).mod(key.n);
        var xp = x.mod(key.p).modPow(key.dP, key.p);
        var xq = x.mod(key.q).modPow(key.dQ, key.q);
        while (xp.compareTo(xq) < 0) {
          xp = xp.add(key.p);
        }
        var y = xp.subtract(xq).multiply(key.qInv).mod(key.p).multiply(key.q).add(xq);
        y = y.multiply(r.modInverse(key.n)).mod(key.n);
        return y;
      };
      pki.rsa.encrypt = function(m, key, bt) {
        var pub = bt;
        var eb;
        var k = Math.ceil(key.n.bitLength() / 8);
        if (bt !== false && bt !== true) {
          pub = bt === 2;
          eb = _encodePkcs1_v1_5(m, key, bt);
        } else {
          eb = forge6.util.createBuffer();
          eb.putBytes(m);
        }
        var x = new BigInteger(eb.toHex(), 16);
        var y = _modPow(x, key, pub);
        var yhex = y.toString(16);
        var ed = forge6.util.createBuffer();
        var zeros = k - Math.ceil(yhex.length / 2);
        while (zeros > 0) {
          ed.putByte(0);
          --zeros;
        }
        ed.putBytes(forge6.util.hexToBytes(yhex));
        return ed.getBytes();
      };
      pki.rsa.decrypt = function(ed, key, pub, ml) {
        var k = Math.ceil(key.n.bitLength() / 8);
        if (ed.length !== k) {
          var error = new Error("Encrypted message length is invalid.");
          error.length = ed.length;
          error.expected = k;
          throw error;
        }
        var y = new BigInteger(forge6.util.createBuffer(ed).toHex(), 16);
        if (y.compareTo(key.n) >= 0) {
          throw new Error("Encrypted message is invalid.");
        }
        var x = _modPow(y, key, pub);
        var xhex = x.toString(16);
        var eb = forge6.util.createBuffer();
        var zeros = k - Math.ceil(xhex.length / 2);
        while (zeros > 0) {
          eb.putByte(0);
          --zeros;
        }
        eb.putBytes(forge6.util.hexToBytes(xhex));
        if (ml !== false) {
          return _decodePkcs1_v1_5(eb.getBytes(), key, pub);
        }
        return eb.getBytes();
      };
      pki.rsa.createKeyPairGenerationState = function(bits2, e, options) {
        if (typeof bits2 === "string") {
          bits2 = parseInt(bits2, 10);
        }
        bits2 = bits2 || 2048;
        options = options || {};
        var prng = options.prng || forge6.random;
        var rng = {
          nextBytes: function(x) {
            var b = prng.getBytesSync(x.length);
            for (var i = 0; i < x.length; ++i) {
              x[i] = b.charCodeAt(i);
            }
          }
        };
        var algorithm = options.algorithm || "PRIMEINC";
        var rval;
        if (algorithm === "PRIMEINC") {
          rval = {
            algorithm,
            state: 0,
            bits: bits2,
            rng,
            eInt: e || 65537,
            e: new BigInteger(null),
            p: null,
            q: null,
            qBits: bits2 >> 1,
            pBits: bits2 - (bits2 >> 1),
            pqState: 0,
            num: null,
            keys: null
          };
          rval.e.fromInt(rval.eInt);
        } else {
          throw new Error("Invalid key generation algorithm: " + algorithm);
        }
        return rval;
      };
      pki.rsa.stepKeyPairGenerationState = function(state, n) {
        if (!("algorithm" in state)) {
          state.algorithm = "PRIMEINC";
        }
        var THIRTY = new BigInteger(null);
        THIRTY.fromInt(30);
        var deltaIdx = 0;
        var op_or = function(x, y) {
          return x | y;
        };
        var t1 = +new Date();
        var t2;
        var total = 0;
        while (state.keys === null && (n <= 0 || total < n)) {
          if (state.state === 0) {
            var bits2 = state.p === null ? state.pBits : state.qBits;
            var bits1 = bits2 - 1;
            if (state.pqState === 0) {
              state.num = new BigInteger(bits2, state.rng);
              if (!state.num.testBit(bits1)) {
                state.num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, state.num);
              }
              state.num.dAddOffset(31 - state.num.mod(THIRTY).byteValue(), 0);
              deltaIdx = 0;
              ++state.pqState;
            } else if (state.pqState === 1) {
              if (state.num.bitLength() > bits2) {
                state.pqState = 0;
              } else if (state.num.isProbablePrime(_getMillerRabinTests(state.num.bitLength()))) {
                ++state.pqState;
              } else {
                state.num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
              }
            } else if (state.pqState === 2) {
              state.pqState = state.num.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) === 0 ? 3 : 0;
            } else if (state.pqState === 3) {
              state.pqState = 0;
              if (state.p === null) {
                state.p = state.num;
              } else {
                state.q = state.num;
              }
              if (state.p !== null && state.q !== null) {
                ++state.state;
              }
              state.num = null;
            }
          } else if (state.state === 1) {
            if (state.p.compareTo(state.q) < 0) {
              state.num = state.p;
              state.p = state.q;
              state.q = state.num;
            }
            ++state.state;
          } else if (state.state === 2) {
            state.p1 = state.p.subtract(BigInteger.ONE);
            state.q1 = state.q.subtract(BigInteger.ONE);
            state.phi = state.p1.multiply(state.q1);
            ++state.state;
          } else if (state.state === 3) {
            if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) === 0) {
              ++state.state;
            } else {
              state.p = null;
              state.q = null;
              state.state = 0;
            }
          } else if (state.state === 4) {
            state.n = state.p.multiply(state.q);
            if (state.n.bitLength() === state.bits) {
              ++state.state;
            } else {
              state.q = null;
              state.state = 0;
            }
          } else if (state.state === 5) {
            var d = state.e.modInverse(state.phi);
            state.keys = {
              privateKey: pki.rsa.setPrivateKey(state.n, state.e, d, state.p, state.q, d.mod(state.p1), d.mod(state.q1), state.q.modInverse(state.p)),
              publicKey: pki.rsa.setPublicKey(state.n, state.e)
            };
          }
          t2 = +new Date();
          total += t2 - t1;
          t1 = t2;
        }
        return state.keys !== null;
      };
      pki.rsa.generateKeyPair = function(bits2, e, options, callback) {
        if (arguments.length === 1) {
          if (typeof bits2 === "object") {
            options = bits2;
            bits2 = void 0;
          } else if (typeof bits2 === "function") {
            callback = bits2;
            bits2 = void 0;
          }
        } else if (arguments.length === 2) {
          if (typeof bits2 === "number") {
            if (typeof e === "function") {
              callback = e;
              e = void 0;
            } else if (typeof e !== "number") {
              options = e;
              e = void 0;
            }
          } else {
            options = bits2;
            callback = e;
            bits2 = void 0;
            e = void 0;
          }
        } else if (arguments.length === 3) {
          if (typeof e === "number") {
            if (typeof options === "function") {
              callback = options;
              options = void 0;
            }
          } else {
            callback = options;
            options = e;
            e = void 0;
          }
        }
        options = options || {};
        if (bits2 === void 0) {
          bits2 = options.bits || 2048;
        }
        if (e === void 0) {
          e = options.e || 65537;
        }
        if (!forge6.options.usePureJavaScript && !options.prng && bits2 >= 256 && bits2 <= 16384 && (e === 65537 || e === 3)) {
          if (callback) {
            if (_detectNodeCrypto("generateKeyPair")) {
              return _crypto.generateKeyPair("rsa", {
                modulusLength: bits2,
                publicExponent: e,
                publicKeyEncoding: {
                  type: "spki",
                  format: "pem"
                },
                privateKeyEncoding: {
                  type: "pkcs8",
                  format: "pem"
                }
              }, function(err, pub, priv) {
                if (err) {
                  return callback(err);
                }
                callback(null, {
                  privateKey: pki.privateKeyFromPem(priv),
                  publicKey: pki.publicKeyFromPem(pub)
                });
              });
            }
            if (_detectSubtleCrypto("generateKey") && _detectSubtleCrypto("exportKey")) {
              return util.globalScope.crypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: bits2,
                publicExponent: _intToUint8Array(e),
                hash: { name: "SHA-256" }
              }, true, ["sign", "verify"]).then(function(pair) {
                return util.globalScope.crypto.subtle.exportKey("pkcs8", pair.privateKey);
              }).then(void 0, function(err) {
                callback(err);
              }).then(function(pkcs8) {
                if (pkcs8) {
                  var privateKey = pki.privateKeyFromAsn1(asn1.fromDer(forge6.util.createBuffer(pkcs8)));
                  callback(null, {
                    privateKey,
                    publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
                  });
                }
              });
            }
            if (_detectSubtleMsCrypto("generateKey") && _detectSubtleMsCrypto("exportKey")) {
              var genOp = util.globalScope.msCrypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: bits2,
                publicExponent: _intToUint8Array(e),
                hash: { name: "SHA-256" }
              }, true, ["sign", "verify"]);
              genOp.oncomplete = function(e2) {
                var pair = e2.target.result;
                var exportOp = util.globalScope.msCrypto.subtle.exportKey("pkcs8", pair.privateKey);
                exportOp.oncomplete = function(e3) {
                  var pkcs8 = e3.target.result;
                  var privateKey = pki.privateKeyFromAsn1(asn1.fromDer(forge6.util.createBuffer(pkcs8)));
                  callback(null, {
                    privateKey,
                    publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
                  });
                };
                exportOp.onerror = function(err) {
                  callback(err);
                };
              };
              genOp.onerror = function(err) {
                callback(err);
              };
              return;
            }
          } else {
            if (_detectNodeCrypto("generateKeyPairSync")) {
              var keypair = _crypto.generateKeyPairSync("rsa", {
                modulusLength: bits2,
                publicExponent: e,
                publicKeyEncoding: {
                  type: "spki",
                  format: "pem"
                },
                privateKeyEncoding: {
                  type: "pkcs8",
                  format: "pem"
                }
              });
              return {
                privateKey: pki.privateKeyFromPem(keypair.privateKey),
                publicKey: pki.publicKeyFromPem(keypair.publicKey)
              };
            }
          }
        }
        var state = pki.rsa.createKeyPairGenerationState(bits2, e, options);
        if (!callback) {
          pki.rsa.stepKeyPairGenerationState(state, 0);
          return state.keys;
        }
        _generateKeyPair(state, options, callback);
      };
      pki.setRsaPublicKey = pki.rsa.setPublicKey = function(n, e) {
        var key = {
          n,
          e
        };
        key.encrypt = function(data, scheme, schemeOptions) {
          if (typeof scheme === "string") {
            scheme = scheme.toUpperCase();
          } else if (scheme === void 0) {
            scheme = "RSAES-PKCS1-V1_5";
          }
          if (scheme === "RSAES-PKCS1-V1_5") {
            scheme = {
              encode: function(m, key2, pub) {
                return _encodePkcs1_v1_5(m, key2, 2).getBytes();
              }
            };
          } else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") {
            scheme = {
              encode: function(m, key2) {
                return forge6.pkcs1.encode_rsa_oaep(key2, m, schemeOptions);
              }
            };
          } else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1) {
            scheme = { encode: function(e3) {
              return e3;
            } };
          } else if (typeof scheme === "string") {
            throw new Error('Unsupported encryption scheme: "' + scheme + '".');
          }
          var e2 = scheme.encode(data, key, true);
          return pki.rsa.encrypt(e2, key, true);
        };
        key.verify = function(digest2, signature, scheme, options) {
          if (typeof scheme === "string") {
            scheme = scheme.toUpperCase();
          } else if (scheme === void 0) {
            scheme = "RSASSA-PKCS1-V1_5";
          }
          if (options === void 0) {
            options = {
              _parseAllDigestBytes: true
            };
          }
          if (!("_parseAllDigestBytes" in options)) {
            options._parseAllDigestBytes = true;
          }
          if (scheme === "RSASSA-PKCS1-V1_5") {
            scheme = {
              verify: function(digest3, d2) {
                d2 = _decodePkcs1_v1_5(d2, key, true);
                var obj = asn1.fromDer(d2, {
                  parseAllBytes: options._parseAllDigestBytes
                });
                var capture = {};
                var errors = [];
                if (!asn1.validate(obj, digestInfoValidator, capture, errors)) {
                  var error = new Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value.");
                  error.errors = errors;
                  throw error;
                }
                var oid = asn1.derToOid(capture.algorithmIdentifier);
                if (!(oid === forge6.oids.md2 || oid === forge6.oids.md5 || oid === forge6.oids.sha1 || oid === forge6.oids.sha224 || oid === forge6.oids.sha256 || oid === forge6.oids.sha384 || oid === forge6.oids.sha512 || oid === forge6.oids["sha512-224"] || oid === forge6.oids["sha512-256"])) {
                  var error = new Error("Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.");
                  error.oid = oid;
                  throw error;
                }
                if (oid === forge6.oids.md2 || oid === forge6.oids.md5) {
                  if (!("parameters" in capture)) {
                    throw new Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifer NULL parameters.");
                  }
                }
                return digest3 === capture.digest;
              }
            };
          } else if (scheme === "NONE" || scheme === "NULL" || scheme === null) {
            scheme = {
              verify: function(digest3, d2) {
                d2 = _decodePkcs1_v1_5(d2, key, true);
                return digest3 === d2;
              }
            };
          }
          var d = pki.rsa.decrypt(signature, key, true, false);
          return scheme.verify(digest2, d, key.n.bitLength());
        };
        return key;
      };
      pki.setRsaPrivateKey = pki.rsa.setPrivateKey = function(n, e, d, p, q, dP, dQ, qInv) {
        var key = {
          n,
          e,
          d,
          p,
          q,
          dP,
          dQ,
          qInv
        };
        key.decrypt = function(data, scheme, schemeOptions) {
          if (typeof scheme === "string") {
            scheme = scheme.toUpperCase();
          } else if (scheme === void 0) {
            scheme = "RSAES-PKCS1-V1_5";
          }
          var d2 = pki.rsa.decrypt(data, key, false, false);
          if (scheme === "RSAES-PKCS1-V1_5") {
            scheme = { decode: _decodePkcs1_v1_5 };
          } else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") {
            scheme = {
              decode: function(d3, key2) {
                return forge6.pkcs1.decode_rsa_oaep(key2, d3, schemeOptions);
              }
            };
          } else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1) {
            scheme = { decode: function(d3) {
              return d3;
            } };
          } else {
            throw new Error('Unsupported encryption scheme: "' + scheme + '".');
          }
          return scheme.decode(d2, key, false);
        };
        key.sign = function(md, scheme) {
          var bt = false;
          if (typeof scheme === "string") {
            scheme = scheme.toUpperCase();
          }
          if (scheme === void 0 || scheme === "RSASSA-PKCS1-V1_5") {
            scheme = { encode: emsaPkcs1v15encode };
            bt = 1;
          } else if (scheme === "NONE" || scheme === "NULL" || scheme === null) {
            scheme = { encode: function() {
              return md;
            } };
            bt = 1;
          }
          var d2 = scheme.encode(md, key.n.bitLength());
          return pki.rsa.encrypt(d2, key, bt);
        };
        return key;
      };
      pki.wrapRsaPrivateKey = function(rsaKey) {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes()),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.rsaEncryption).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
          ]),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(rsaKey).getBytes())
        ]);
      };
      pki.privateKeyFromAsn1 = function(obj) {
        var capture = {};
        var errors = [];
        if (asn1.validate(obj, privateKeyValidator, capture, errors)) {
          obj = asn1.fromDer(forge6.util.createBuffer(capture.privateKey));
        }
        capture = {};
        errors = [];
        if (!asn1.validate(obj, rsaPrivateKeyValidator, capture, errors)) {
          var error = new Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
          error.errors = errors;
          throw error;
        }
        var n, e, d, p, q, dP, dQ, qInv;
        n = forge6.util.createBuffer(capture.privateKeyModulus).toHex();
        e = forge6.util.createBuffer(capture.privateKeyPublicExponent).toHex();
        d = forge6.util.createBuffer(capture.privateKeyPrivateExponent).toHex();
        p = forge6.util.createBuffer(capture.privateKeyPrime1).toHex();
        q = forge6.util.createBuffer(capture.privateKeyPrime2).toHex();
        dP = forge6.util.createBuffer(capture.privateKeyExponent1).toHex();
        dQ = forge6.util.createBuffer(capture.privateKeyExponent2).toHex();
        qInv = forge6.util.createBuffer(capture.privateKeyCoefficient).toHex();
        return pki.setRsaPrivateKey(new BigInteger(n, 16), new BigInteger(e, 16), new BigInteger(d, 16), new BigInteger(p, 16), new BigInteger(q, 16), new BigInteger(dP, 16), new BigInteger(dQ, 16), new BigInteger(qInv, 16));
      };
      pki.privateKeyToAsn1 = pki.privateKeyToRSAPrivateKey = function(key) {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes()),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.n)),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.e)),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.d)),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.p)),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.q)),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.dP)),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.dQ)),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.qInv))
        ]);
      };
      pki.publicKeyFromAsn1 = function(obj) {
        var capture = {};
        var errors = [];
        if (asn1.validate(obj, publicKeyValidator, capture, errors)) {
          var oid = asn1.derToOid(capture.publicKeyOid);
          if (oid !== pki.oids.rsaEncryption) {
            var error = new Error("Cannot read public key. Unknown OID.");
            error.oid = oid;
            throw error;
          }
          obj = capture.rsaPublicKey;
        }
        errors = [];
        if (!asn1.validate(obj, rsaPublicKeyValidator, capture, errors)) {
          var error = new Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.");
          error.errors = errors;
          throw error;
        }
        var n = forge6.util.createBuffer(capture.publicKeyModulus).toHex();
        var e = forge6.util.createBuffer(capture.publicKeyExponent).toHex();
        return pki.setRsaPublicKey(new BigInteger(n, 16), new BigInteger(e, 16));
      };
      pki.publicKeyToAsn1 = pki.publicKeyToSubjectPublicKeyInfo = function(key) {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.rsaEncryption).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
          ]),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, [
            pki.publicKeyToRSAPublicKey(key)
          ])
        ]);
      };
      pki.publicKeyToRSAPublicKey = function(key) {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.n)),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.e))
        ]);
      };
      function _encodePkcs1_v1_5(m, key, bt) {
        var eb = forge6.util.createBuffer();
        var k = Math.ceil(key.n.bitLength() / 8);
        if (m.length > k - 11) {
          var error = new Error("Message is too long for PKCS#1 v1.5 padding.");
          error.length = m.length;
          error.max = k - 11;
          throw error;
        }
        eb.putByte(0);
        eb.putByte(bt);
        var padNum = k - 3 - m.length;
        var padByte;
        if (bt === 0 || bt === 1) {
          padByte = bt === 0 ? 0 : 255;
          for (var i = 0; i < padNum; ++i) {
            eb.putByte(padByte);
          }
        } else {
          while (padNum > 0) {
            var numZeros = 0;
            var padBytes = forge6.random.getBytes(padNum);
            for (var i = 0; i < padNum; ++i) {
              padByte = padBytes.charCodeAt(i);
              if (padByte === 0) {
                ++numZeros;
              } else {
                eb.putByte(padByte);
              }
            }
            padNum = numZeros;
          }
        }
        eb.putByte(0);
        eb.putBytes(m);
        return eb;
      }
      function _decodePkcs1_v1_5(em, key, pub, ml) {
        var k = Math.ceil(key.n.bitLength() / 8);
        var eb = forge6.util.createBuffer(em);
        var first = eb.getByte();
        var bt = eb.getByte();
        if (first !== 0 || pub && bt !== 0 && bt !== 1 || !pub && bt != 2 || pub && bt === 0 && typeof ml === "undefined") {
          throw new Error("Encryption block is invalid.");
        }
        var padNum = 0;
        if (bt === 0) {
          padNum = k - 3 - ml;
          for (var i = 0; i < padNum; ++i) {
            if (eb.getByte() !== 0) {
              throw new Error("Encryption block is invalid.");
            }
          }
        } else if (bt === 1) {
          padNum = 0;
          while (eb.length() > 1) {
            if (eb.getByte() !== 255) {
              --eb.read;
              break;
            }
            ++padNum;
          }
        } else if (bt === 2) {
          padNum = 0;
          while (eb.length() > 1) {
            if (eb.getByte() === 0) {
              --eb.read;
              break;
            }
            ++padNum;
          }
        }
        var zero = eb.getByte();
        if (zero !== 0 || padNum !== k - 3 - eb.length()) {
          throw new Error("Encryption block is invalid.");
        }
        return eb.getBytes();
      }
      function _generateKeyPair(state, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        options = options || {};
        var opts = {
          algorithm: {
            name: options.algorithm || "PRIMEINC",
            options: {
              workers: options.workers || 2,
              workLoad: options.workLoad || 100,
              workerScript: options.workerScript
            }
          }
        };
        if ("prng" in options) {
          opts.prng = options.prng;
        }
        generate();
        function generate() {
          getPrime(state.pBits, function(err, num) {
            if (err) {
              return callback(err);
            }
            state.p = num;
            if (state.q !== null) {
              return finish(err, state.q);
            }
            getPrime(state.qBits, finish);
          });
        }
        function getPrime(bits2, callback2) {
          forge6.prime.generateProbablePrime(bits2, opts, callback2);
        }
        function finish(err, num) {
          if (err) {
            return callback(err);
          }
          state.q = num;
          if (state.p.compareTo(state.q) < 0) {
            var tmp = state.p;
            state.p = state.q;
            state.q = tmp;
          }
          if (state.p.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
            state.p = null;
            generate();
            return;
          }
          if (state.q.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
            state.q = null;
            getPrime(state.qBits, finish);
            return;
          }
          state.p1 = state.p.subtract(BigInteger.ONE);
          state.q1 = state.q.subtract(BigInteger.ONE);
          state.phi = state.p1.multiply(state.q1);
          if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
            state.p = state.q = null;
            generate();
            return;
          }
          state.n = state.p.multiply(state.q);
          if (state.n.bitLength() !== state.bits) {
            state.q = null;
            getPrime(state.qBits, finish);
            return;
          }
          var d = state.e.modInverse(state.phi);
          state.keys = {
            privateKey: pki.rsa.setPrivateKey(state.n, state.e, d, state.p, state.q, d.mod(state.p1), d.mod(state.q1), state.q.modInverse(state.p)),
            publicKey: pki.rsa.setPublicKey(state.n, state.e)
          };
          callback(null, state.keys);
        }
      }
      function _bnToBytes(b) {
        var hex = b.toString(16);
        if (hex[0] >= "8") {
          hex = "00" + hex;
        }
        var bytes2 = forge6.util.hexToBytes(hex);
        if (bytes2.length > 1 && (bytes2.charCodeAt(0) === 0 && (bytes2.charCodeAt(1) & 128) === 0 || bytes2.charCodeAt(0) === 255 && (bytes2.charCodeAt(1) & 128) === 128)) {
          return bytes2.substr(1);
        }
        return bytes2;
      }
      function _getMillerRabinTests(bits2) {
        if (bits2 <= 100)
          return 27;
        if (bits2 <= 150)
          return 18;
        if (bits2 <= 200)
          return 15;
        if (bits2 <= 250)
          return 12;
        if (bits2 <= 300)
          return 9;
        if (bits2 <= 350)
          return 8;
        if (bits2 <= 400)
          return 7;
        if (bits2 <= 500)
          return 6;
        if (bits2 <= 600)
          return 5;
        if (bits2 <= 800)
          return 4;
        if (bits2 <= 1250)
          return 3;
        return 2;
      }
      function _detectNodeCrypto(fn) {
        return forge6.util.isNodejs && typeof _crypto[fn] === "function";
      }
      function _detectSubtleCrypto(fn) {
        return typeof util.globalScope !== "undefined" && typeof util.globalScope.crypto === "object" && typeof util.globalScope.crypto.subtle === "object" && typeof util.globalScope.crypto.subtle[fn] === "function";
      }
      function _detectSubtleMsCrypto(fn) {
        return typeof util.globalScope !== "undefined" && typeof util.globalScope.msCrypto === "object" && typeof util.globalScope.msCrypto.subtle === "object" && typeof util.globalScope.msCrypto.subtle[fn] === "function";
      }
      function _intToUint8Array(x) {
        var bytes2 = forge6.util.hexToBytes(x.toString(16));
        var buffer2 = new Uint8Array(bytes2.length);
        for (var i = 0; i < bytes2.length; ++i) {
          buffer2[i] = bytes2.charCodeAt(i);
        }
        return buffer2;
      }
    }
  });

  // ../node_modules/node-forge/lib/pbe.js
  var require_pbe = __commonJS({
    "../node_modules/node-forge/lib/pbe.js"(exports2, module2) {
      var forge6 = require_forge();
      require_aes();
      require_asn1();
      require_des();
      require_md();
      require_oids();
      require_pbkdf2();
      require_pem();
      require_random();
      require_rc2();
      require_rsa();
      require_util();
      if (typeof BigInteger === "undefined") {
        BigInteger = forge6.jsbn.BigInteger;
      }
      var BigInteger;
      var asn1 = forge6.asn1;
      var pki = forge6.pki = forge6.pki || {};
      module2.exports = pki.pbe = forge6.pbe = forge6.pbe || {};
      var oids = pki.oids;
      var encryptedPrivateKeyValidator = {
        name: "EncryptedPrivateKeyInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "AlgorithmIdentifier.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "encryptionOid"
          }, {
            name: "AlgorithmIdentifier.parameters",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            captureAsn1: "encryptionParams"
          }]
        }, {
          name: "EncryptedPrivateKeyInfo.encryptedData",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "encryptedData"
        }]
      };
      var PBES2AlgorithmsValidator = {
        name: "PBES2Algorithms",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "PBES2Algorithms.keyDerivationFunc",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "PBES2Algorithms.keyDerivationFunc.oid",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "kdfOid"
          }, {
            name: "PBES2Algorithms.params",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            value: [{
              name: "PBES2Algorithms.params.salt",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OCTETSTRING,
              constructed: false,
              capture: "kdfSalt"
            }, {
              name: "PBES2Algorithms.params.iterationCount",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.INTEGER,
              constructed: false,
              capture: "kdfIterationCount"
            }, {
              name: "PBES2Algorithms.params.keyLength",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.INTEGER,
              constructed: false,
              optional: true,
              capture: "keyLength"
            }, {
              name: "PBES2Algorithms.params.prf",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.SEQUENCE,
              constructed: true,
              optional: true,
              value: [{
                name: "PBES2Algorithms.params.prf.algorithm",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.OID,
                constructed: false,
                capture: "prfOid"
              }]
            }]
          }]
        }, {
          name: "PBES2Algorithms.encryptionScheme",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "PBES2Algorithms.encryptionScheme.oid",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "encOid"
          }, {
            name: "PBES2Algorithms.encryptionScheme.iv",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OCTETSTRING,
            constructed: false,
            capture: "encIv"
          }]
        }]
      };
      var pkcs12PbeParamsValidator = {
        name: "pkcs-12PbeParams",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "pkcs-12PbeParams.salt",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "salt"
        }, {
          name: "pkcs-12PbeParams.iterations",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "iterations"
        }]
      };
      pki.encryptPrivateKeyInfo = function(obj, password, options) {
        options = options || {};
        options.saltSize = options.saltSize || 8;
        options.count = options.count || 2048;
        options.algorithm = options.algorithm || "aes128";
        options.prfAlgorithm = options.prfAlgorithm || "sha1";
        var salt = forge6.random.getBytesSync(options.saltSize);
        var count = options.count;
        var countBytes = asn1.integerToDer(count);
        var dkLen;
        var encryptionAlgorithm;
        var encryptedData;
        if (options.algorithm.indexOf("aes") === 0 || options.algorithm === "des") {
          var ivLen, encOid, cipherFn;
          switch (options.algorithm) {
            case "aes128":
              dkLen = 16;
              ivLen = 16;
              encOid = oids["aes128-CBC"];
              cipherFn = forge6.aes.createEncryptionCipher;
              break;
            case "aes192":
              dkLen = 24;
              ivLen = 16;
              encOid = oids["aes192-CBC"];
              cipherFn = forge6.aes.createEncryptionCipher;
              break;
            case "aes256":
              dkLen = 32;
              ivLen = 16;
              encOid = oids["aes256-CBC"];
              cipherFn = forge6.aes.createEncryptionCipher;
              break;
            case "des":
              dkLen = 8;
              ivLen = 8;
              encOid = oids["desCBC"];
              cipherFn = forge6.des.createEncryptionCipher;
              break;
            default:
              var error = new Error("Cannot encrypt private key. Unknown encryption algorithm.");
              error.algorithm = options.algorithm;
              throw error;
          }
          var prfAlgorithm = "hmacWith" + options.prfAlgorithm.toUpperCase();
          var md = prfAlgorithmToMessageDigest(prfAlgorithm);
          var dk = forge6.pkcs5.pbkdf2(password, salt, count, dkLen, md);
          var iv = forge6.random.getBytesSync(ivLen);
          var cipher = cipherFn(dk);
          cipher.start(iv);
          cipher.update(asn1.toDer(obj));
          cipher.finish();
          encryptedData = cipher.output.getBytes();
          var params = createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm);
          encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pkcs5PBES2"]).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pkcs5PBKDF2"]).getBytes()),
                params
              ]),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(encOid).getBytes()),
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, iv)
              ])
            ])
          ]);
        } else if (options.algorithm === "3des") {
          dkLen = 24;
          var saltBytes = new forge6.util.ByteBuffer(salt);
          var dk = pki.pbe.generatePkcs12Key(password, saltBytes, 1, count, dkLen);
          var iv = pki.pbe.generatePkcs12Key(password, saltBytes, 2, count, dkLen);
          var cipher = forge6.des.createEncryptionCipher(dk);
          cipher.start(iv);
          cipher.update(asn1.toDer(obj));
          cipher.finish();
          encryptedData = cipher.output.getBytes();
          encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, countBytes.getBytes())
            ])
          ]);
        } else {
          var error = new Error("Cannot encrypt private key. Unknown encryption algorithm.");
          error.algorithm = options.algorithm;
          throw error;
        }
        var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          encryptionAlgorithm,
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, encryptedData)
        ]);
        return rval;
      };
      pki.decryptPrivateKeyInfo = function(obj, password) {
        var rval = null;
        var capture = {};
        var errors = [];
        if (!asn1.validate(obj, encryptedPrivateKeyValidator, capture, errors)) {
          var error = new Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
          error.errors = errors;
          throw error;
        }
        var oid = asn1.derToOid(capture.encryptionOid);
        var cipher = pki.pbe.getCipher(oid, capture.encryptionParams, password);
        var encrypted = forge6.util.createBuffer(capture.encryptedData);
        cipher.update(encrypted);
        if (cipher.finish()) {
          rval = asn1.fromDer(cipher.output);
        }
        return rval;
      };
      pki.encryptedPrivateKeyToPem = function(epki, maxline) {
        var msg = {
          type: "ENCRYPTED PRIVATE KEY",
          body: asn1.toDer(epki).getBytes()
        };
        return forge6.pem.encode(msg, { maxline });
      };
      pki.encryptedPrivateKeyFromPem = function(pem) {
        var msg = forge6.pem.decode(pem)[0];
        if (msg.type !== "ENCRYPTED PRIVATE KEY") {
          var error = new Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".');
          error.headerType = msg.type;
          throw error;
        }
        if (msg.procType && msg.procType.type === "ENCRYPTED") {
          throw new Error("Could not convert encrypted private key from PEM; PEM is encrypted.");
        }
        return asn1.fromDer(msg.body);
      };
      pki.encryptRsaPrivateKey = function(rsaKey, password, options) {
        options = options || {};
        if (!options.legacy) {
          var rval = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(rsaKey));
          rval = pki.encryptPrivateKeyInfo(rval, password, options);
          return pki.encryptedPrivateKeyToPem(rval);
        }
        var algorithm;
        var iv;
        var dkLen;
        var cipherFn;
        switch (options.algorithm) {
          case "aes128":
            algorithm = "AES-128-CBC";
            dkLen = 16;
            iv = forge6.random.getBytesSync(16);
            cipherFn = forge6.aes.createEncryptionCipher;
            break;
          case "aes192":
            algorithm = "AES-192-CBC";
            dkLen = 24;
            iv = forge6.random.getBytesSync(16);
            cipherFn = forge6.aes.createEncryptionCipher;
            break;
          case "aes256":
            algorithm = "AES-256-CBC";
            dkLen = 32;
            iv = forge6.random.getBytesSync(16);
            cipherFn = forge6.aes.createEncryptionCipher;
            break;
          case "3des":
            algorithm = "DES-EDE3-CBC";
            dkLen = 24;
            iv = forge6.random.getBytesSync(8);
            cipherFn = forge6.des.createEncryptionCipher;
            break;
          case "des":
            algorithm = "DES-CBC";
            dkLen = 8;
            iv = forge6.random.getBytesSync(8);
            cipherFn = forge6.des.createEncryptionCipher;
            break;
          default:
            var error = new Error('Could not encrypt RSA private key; unsupported encryption algorithm "' + options.algorithm + '".');
            error.algorithm = options.algorithm;
            throw error;
        }
        var dk = forge6.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
        var cipher = cipherFn(dk);
        cipher.start(iv);
        cipher.update(asn1.toDer(pki.privateKeyToAsn1(rsaKey)));
        cipher.finish();
        var msg = {
          type: "RSA PRIVATE KEY",
          procType: {
            version: "4",
            type: "ENCRYPTED"
          },
          dekInfo: {
            algorithm,
            parameters: forge6.util.bytesToHex(iv).toUpperCase()
          },
          body: cipher.output.getBytes()
        };
        return forge6.pem.encode(msg);
      };
      pki.decryptRsaPrivateKey = function(pem, password) {
        var rval = null;
        var msg = forge6.pem.decode(pem)[0];
        if (msg.type !== "ENCRYPTED PRIVATE KEY" && msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
          var error = new Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".');
          error.headerType = error;
          throw error;
        }
        if (msg.procType && msg.procType.type === "ENCRYPTED") {
          var dkLen;
          var cipherFn;
          switch (msg.dekInfo.algorithm) {
            case "DES-CBC":
              dkLen = 8;
              cipherFn = forge6.des.createDecryptionCipher;
              break;
            case "DES-EDE3-CBC":
              dkLen = 24;
              cipherFn = forge6.des.createDecryptionCipher;
              break;
            case "AES-128-CBC":
              dkLen = 16;
              cipherFn = forge6.aes.createDecryptionCipher;
              break;
            case "AES-192-CBC":
              dkLen = 24;
              cipherFn = forge6.aes.createDecryptionCipher;
              break;
            case "AES-256-CBC":
              dkLen = 32;
              cipherFn = forge6.aes.createDecryptionCipher;
              break;
            case "RC2-40-CBC":
              dkLen = 5;
              cipherFn = function(key) {
                return forge6.rc2.createDecryptionCipher(key, 40);
              };
              break;
            case "RC2-64-CBC":
              dkLen = 8;
              cipherFn = function(key) {
                return forge6.rc2.createDecryptionCipher(key, 64);
              };
              break;
            case "RC2-128-CBC":
              dkLen = 16;
              cipherFn = function(key) {
                return forge6.rc2.createDecryptionCipher(key, 128);
              };
              break;
            default:
              var error = new Error('Could not decrypt private key; unsupported encryption algorithm "' + msg.dekInfo.algorithm + '".');
              error.algorithm = msg.dekInfo.algorithm;
              throw error;
          }
          var iv = forge6.util.hexToBytes(msg.dekInfo.parameters);
          var dk = forge6.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
          var cipher = cipherFn(dk);
          cipher.start(iv);
          cipher.update(forge6.util.createBuffer(msg.body));
          if (cipher.finish()) {
            rval = cipher.output.getBytes();
          } else {
            return rval;
          }
        } else {
          rval = msg.body;
        }
        if (msg.type === "ENCRYPTED PRIVATE KEY") {
          rval = pki.decryptPrivateKeyInfo(asn1.fromDer(rval), password);
        } else {
          rval = asn1.fromDer(rval);
        }
        if (rval !== null) {
          rval = pki.privateKeyFromAsn1(rval);
        }
        return rval;
      };
      pki.pbe.generatePkcs12Key = function(password, salt, id, iter, n, md) {
        var j, l;
        if (typeof md === "undefined" || md === null) {
          if (!("sha1" in forge6.md)) {
            throw new Error('"sha1" hash algorithm unavailable.');
          }
          md = forge6.md.sha1.create();
        }
        var u = md.digestLength;
        var v = md.blockLength;
        var result = new forge6.util.ByteBuffer();
        var passBuf = new forge6.util.ByteBuffer();
        if (password !== null && password !== void 0) {
          for (l = 0; l < password.length; l++) {
            passBuf.putInt16(password.charCodeAt(l));
          }
          passBuf.putInt16(0);
        }
        var p = passBuf.length();
        var s = salt.length();
        var D = new forge6.util.ByteBuffer();
        D.fillWithByte(id, v);
        var Slen = v * Math.ceil(s / v);
        var S = new forge6.util.ByteBuffer();
        for (l = 0; l < Slen; l++) {
          S.putByte(salt.at(l % s));
        }
        var Plen = v * Math.ceil(p / v);
        var P = new forge6.util.ByteBuffer();
        for (l = 0; l < Plen; l++) {
          P.putByte(passBuf.at(l % p));
        }
        var I = S;
        I.putBuffer(P);
        var c = Math.ceil(n / u);
        for (var i = 1; i <= c; i++) {
          var buf2 = new forge6.util.ByteBuffer();
          buf2.putBytes(D.bytes());
          buf2.putBytes(I.bytes());
          for (var round = 0; round < iter; round++) {
            md.start();
            md.update(buf2.getBytes());
            buf2 = md.digest();
          }
          var B = new forge6.util.ByteBuffer();
          for (l = 0; l < v; l++) {
            B.putByte(buf2.at(l % u));
          }
          var k = Math.ceil(s / v) + Math.ceil(p / v);
          var Inew = new forge6.util.ByteBuffer();
          for (j = 0; j < k; j++) {
            var chunk = new forge6.util.ByteBuffer(I.getBytes(v));
            var x = 511;
            for (l = B.length() - 1; l >= 0; l--) {
              x = x >> 8;
              x += B.at(l) + chunk.at(l);
              chunk.setAt(l, x & 255);
            }
            Inew.putBuffer(chunk);
          }
          I = Inew;
          result.putBuffer(buf2);
        }
        result.truncate(result.length() - n);
        return result;
      };
      pki.pbe.getCipher = function(oid, params, password) {
        switch (oid) {
          case pki.oids["pkcs5PBES2"]:
            return pki.pbe.getCipherForPBES2(oid, params, password);
          case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
          case pki.oids["pbewithSHAAnd40BitRC2-CBC"]:
            return pki.pbe.getCipherForPKCS12PBE(oid, params, password);
          default:
            var error = new Error("Cannot read encrypted PBE data block. Unsupported OID.");
            error.oid = oid;
            error.supportedOids = [
              "pkcs5PBES2",
              "pbeWithSHAAnd3-KeyTripleDES-CBC",
              "pbewithSHAAnd40BitRC2-CBC"
            ];
            throw error;
        }
      };
      pki.pbe.getCipherForPBES2 = function(oid, params, password) {
        var capture = {};
        var errors = [];
        if (!asn1.validate(params, PBES2AlgorithmsValidator, capture, errors)) {
          var error = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
          error.errors = errors;
          throw error;
        }
        oid = asn1.derToOid(capture.kdfOid);
        if (oid !== pki.oids["pkcs5PBKDF2"]) {
          var error = new Error("Cannot read encrypted private key. Unsupported key derivation function OID.");
          error.oid = oid;
          error.supportedOids = ["pkcs5PBKDF2"];
          throw error;
        }
        oid = asn1.derToOid(capture.encOid);
        if (oid !== pki.oids["aes128-CBC"] && oid !== pki.oids["aes192-CBC"] && oid !== pki.oids["aes256-CBC"] && oid !== pki.oids["des-EDE3-CBC"] && oid !== pki.oids["desCBC"]) {
          var error = new Error("Cannot read encrypted private key. Unsupported encryption scheme OID.");
          error.oid = oid;
          error.supportedOids = [
            "aes128-CBC",
            "aes192-CBC",
            "aes256-CBC",
            "des-EDE3-CBC",
            "desCBC"
          ];
          throw error;
        }
        var salt = capture.kdfSalt;
        var count = forge6.util.createBuffer(capture.kdfIterationCount);
        count = count.getInt(count.length() << 3);
        var dkLen;
        var cipherFn;
        switch (pki.oids[oid]) {
          case "aes128-CBC":
            dkLen = 16;
            cipherFn = forge6.aes.createDecryptionCipher;
            break;
          case "aes192-CBC":
            dkLen = 24;
            cipherFn = forge6.aes.createDecryptionCipher;
            break;
          case "aes256-CBC":
            dkLen = 32;
            cipherFn = forge6.aes.createDecryptionCipher;
            break;
          case "des-EDE3-CBC":
            dkLen = 24;
            cipherFn = forge6.des.createDecryptionCipher;
            break;
          case "desCBC":
            dkLen = 8;
            cipherFn = forge6.des.createDecryptionCipher;
            break;
        }
        var md = prfOidToMessageDigest(capture.prfOid);
        var dk = forge6.pkcs5.pbkdf2(password, salt, count, dkLen, md);
        var iv = capture.encIv;
        var cipher = cipherFn(dk);
        cipher.start(iv);
        return cipher;
      };
      pki.pbe.getCipherForPKCS12PBE = function(oid, params, password) {
        var capture = {};
        var errors = [];
        if (!asn1.validate(params, pkcs12PbeParamsValidator, capture, errors)) {
          var error = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
          error.errors = errors;
          throw error;
        }
        var salt = forge6.util.createBuffer(capture.salt);
        var count = forge6.util.createBuffer(capture.iterations);
        count = count.getInt(count.length() << 3);
        var dkLen, dIvLen, cipherFn;
        switch (oid) {
          case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
            dkLen = 24;
            dIvLen = 8;
            cipherFn = forge6.des.startDecrypting;
            break;
          case pki.oids["pbewithSHAAnd40BitRC2-CBC"]:
            dkLen = 5;
            dIvLen = 8;
            cipherFn = function(key2, iv2) {
              var cipher = forge6.rc2.createDecryptionCipher(key2, 40);
              cipher.start(iv2, null);
              return cipher;
            };
            break;
          default:
            var error = new Error("Cannot read PKCS #12 PBE data block. Unsupported OID.");
            error.oid = oid;
            throw error;
        }
        var md = prfOidToMessageDigest(capture.prfOid);
        var key = pki.pbe.generatePkcs12Key(password, salt, 1, count, dkLen, md);
        md.start();
        var iv = pki.pbe.generatePkcs12Key(password, salt, 2, count, dIvLen, md);
        return cipherFn(key, iv);
      };
      pki.pbe.opensslDeriveBytes = function(password, salt, dkLen, md) {
        if (typeof md === "undefined" || md === null) {
          if (!("md5" in forge6.md)) {
            throw new Error('"md5" hash algorithm unavailable.');
          }
          md = forge6.md.md5.create();
        }
        if (salt === null) {
          salt = "";
        }
        var digests = [hash(md, password + salt)];
        for (var length2 = 16, i = 1; length2 < dkLen; ++i, length2 += 16) {
          digests.push(hash(md, digests[i - 1] + password + salt));
        }
        return digests.join("").substr(0, dkLen);
      };
      function hash(md, bytes2) {
        return md.start().update(bytes2).digest().getBytes();
      }
      function prfOidToMessageDigest(prfOid) {
        var prfAlgorithm;
        if (!prfOid) {
          prfAlgorithm = "hmacWithSHA1";
        } else {
          prfAlgorithm = pki.oids[asn1.derToOid(prfOid)];
          if (!prfAlgorithm) {
            var error = new Error("Unsupported PRF OID.");
            error.oid = prfOid;
            error.supported = [
              "hmacWithSHA1",
              "hmacWithSHA224",
              "hmacWithSHA256",
              "hmacWithSHA384",
              "hmacWithSHA512"
            ];
            throw error;
          }
        }
        return prfAlgorithmToMessageDigest(prfAlgorithm);
      }
      function prfAlgorithmToMessageDigest(prfAlgorithm) {
        var factory = forge6.md;
        switch (prfAlgorithm) {
          case "hmacWithSHA224":
            factory = forge6.md.sha512;
          case "hmacWithSHA1":
          case "hmacWithSHA256":
          case "hmacWithSHA384":
          case "hmacWithSHA512":
            prfAlgorithm = prfAlgorithm.substr(8).toLowerCase();
            break;
          default:
            var error = new Error("Unsupported PRF algorithm.");
            error.algorithm = prfAlgorithm;
            error.supported = [
              "hmacWithSHA1",
              "hmacWithSHA224",
              "hmacWithSHA256",
              "hmacWithSHA384",
              "hmacWithSHA512"
            ];
            throw error;
        }
        if (!factory || !(prfAlgorithm in factory)) {
          throw new Error("Unknown hash algorithm: " + prfAlgorithm);
        }
        return factory[prfAlgorithm].create();
      }
      function createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm) {
        var params = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, countBytes.getBytes())
        ]);
        if (prfAlgorithm !== "hmacWithSHA1") {
          params.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge6.util.hexToBytes(dkLen.toString(16))), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids[prfAlgorithm]).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
          ]));
        }
        return params;
      }
    }
  });

  // ../node_modules/err-code/index.js
  var require_err_code = __commonJS({
    "../node_modules/err-code/index.js"(exports2, module2) {
      "use strict";
      function assign(obj, props) {
        for (const key in props) {
          Object.defineProperty(obj, key, {
            value: props[key],
            enumerable: true,
            configurable: true
          });
        }
        return obj;
      }
      function createError(err, code3, props) {
        if (!err || typeof err === "string") {
          throw new TypeError("Please pass an Error to err-code");
        }
        if (!props) {
          props = {};
        }
        if (typeof code3 === "object") {
          props = code3;
          code3 = "";
        }
        if (code3) {
          props.code = code3;
        }
        try {
          return assign(err, props);
        } catch (_) {
          props.message = err.message;
          props.stack = err.stack;
          const ErrClass = function() {
          };
          ErrClass.prototype = Object.create(Object.getPrototypeOf(err));
          const output = assign(new ErrClass(), props);
          return output;
        }
      }
      module2.exports = createError;
    }
  });

  // ../node_modules/node-forge/lib/sha512.js
  var require_sha512 = __commonJS({
    "../node_modules/node-forge/lib/sha512.js"(exports2, module2) {
      var forge6 = require_forge();
      require_md();
      require_util();
      var sha5122 = module2.exports = forge6.sha512 = forge6.sha512 || {};
      forge6.md.sha512 = forge6.md.algorithms.sha512 = sha5122;
      var sha384 = forge6.sha384 = forge6.sha512.sha384 = forge6.sha512.sha384 || {};
      sha384.create = function() {
        return sha5122.create("SHA-384");
      };
      forge6.md.sha384 = forge6.md.algorithms.sha384 = sha384;
      forge6.sha512.sha256 = forge6.sha512.sha256 || {
        create: function() {
          return sha5122.create("SHA-512/256");
        }
      };
      forge6.md["sha512/256"] = forge6.md.algorithms["sha512/256"] = forge6.sha512.sha256;
      forge6.sha512.sha224 = forge6.sha512.sha224 || {
        create: function() {
          return sha5122.create("SHA-512/224");
        }
      };
      forge6.md["sha512/224"] = forge6.md.algorithms["sha512/224"] = forge6.sha512.sha224;
      sha5122.create = function(algorithm) {
        if (!_initialized) {
          _init();
        }
        if (typeof algorithm === "undefined") {
          algorithm = "SHA-512";
        }
        if (!(algorithm in _states)) {
          throw new Error("Invalid SHA-512 algorithm: " + algorithm);
        }
        var _state = _states[algorithm];
        var _h = null;
        var _input = forge6.util.createBuffer();
        var _w = new Array(80);
        for (var wi = 0; wi < 80; ++wi) {
          _w[wi] = new Array(2);
        }
        var digestLength = 64;
        switch (algorithm) {
          case "SHA-384":
            digestLength = 48;
            break;
          case "SHA-512/256":
            digestLength = 32;
            break;
          case "SHA-512/224":
            digestLength = 28;
            break;
        }
        var md = {
          algorithm: algorithm.replace("-", "").toLowerCase(),
          blockLength: 128,
          digestLength,
          messageLength: 0,
          fullMessageLength: null,
          messageLengthSize: 16
        };
        md.start = function() {
          md.messageLength = 0;
          md.fullMessageLength = md.messageLength128 = [];
          var int32s = md.messageLengthSize / 4;
          for (var i = 0; i < int32s; ++i) {
            md.fullMessageLength.push(0);
          }
          _input = forge6.util.createBuffer();
          _h = new Array(_state.length);
          for (var i = 0; i < _state.length; ++i) {
            _h[i] = _state[i].slice(0);
          }
          return md;
        };
        md.start();
        md.update = function(msg, encoding) {
          if (encoding === "utf8") {
            msg = forge6.util.encodeUtf8(msg);
          }
          var len = msg.length;
          md.messageLength += len;
          len = [len / 4294967296 >>> 0, len >>> 0];
          for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
            md.fullMessageLength[i] += len[1];
            len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
            md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
            len[0] = len[1] / 4294967296 >>> 0;
          }
          _input.putBytes(msg);
          _update(_h, _w, _input);
          if (_input.read > 2048 || _input.length() === 0) {
            _input.compact();
          }
          return md;
        };
        md.digest = function() {
          var finalBlock = forge6.util.createBuffer();
          finalBlock.putBytes(_input.bytes());
          var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
          var overflow = remaining & md.blockLength - 1;
          finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
          var next, carry;
          var bits2 = md.fullMessageLength[0] * 8;
          for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
            next = md.fullMessageLength[i + 1] * 8;
            carry = next / 4294967296 >>> 0;
            bits2 += carry;
            finalBlock.putInt32(bits2 >>> 0);
            bits2 = next >>> 0;
          }
          finalBlock.putInt32(bits2);
          var h = new Array(_h.length);
          for (var i = 0; i < _h.length; ++i) {
            h[i] = _h[i].slice(0);
          }
          _update(h, _w, finalBlock);
          var rval = forge6.util.createBuffer();
          var hlen;
          if (algorithm === "SHA-512") {
            hlen = h.length;
          } else if (algorithm === "SHA-384") {
            hlen = h.length - 2;
          } else {
            hlen = h.length - 4;
          }
          for (var i = 0; i < hlen; ++i) {
            rval.putInt32(h[i][0]);
            if (i !== hlen - 1 || algorithm !== "SHA-512/224") {
              rval.putInt32(h[i][1]);
            }
          }
          return rval;
        };
        return md;
      };
      var _padding = null;
      var _initialized = false;
      var _k = null;
      var _states = null;
      function _init() {
        _padding = String.fromCharCode(128);
        _padding += forge6.util.fillString(String.fromCharCode(0), 128);
        _k = [
          [1116352408, 3609767458],
          [1899447441, 602891725],
          [3049323471, 3964484399],
          [3921009573, 2173295548],
          [961987163, 4081628472],
          [1508970993, 3053834265],
          [2453635748, 2937671579],
          [2870763221, 3664609560],
          [3624381080, 2734883394],
          [310598401, 1164996542],
          [607225278, 1323610764],
          [1426881987, 3590304994],
          [1925078388, 4068182383],
          [2162078206, 991336113],
          [2614888103, 633803317],
          [3248222580, 3479774868],
          [3835390401, 2666613458],
          [4022224774, 944711139],
          [264347078, 2341262773],
          [604807628, 2007800933],
          [770255983, 1495990901],
          [1249150122, 1856431235],
          [1555081692, 3175218132],
          [1996064986, 2198950837],
          [2554220882, 3999719339],
          [2821834349, 766784016],
          [2952996808, 2566594879],
          [3210313671, 3203337956],
          [3336571891, 1034457026],
          [3584528711, 2466948901],
          [113926993, 3758326383],
          [338241895, 168717936],
          [666307205, 1188179964],
          [773529912, 1546045734],
          [1294757372, 1522805485],
          [1396182291, 2643833823],
          [1695183700, 2343527390],
          [1986661051, 1014477480],
          [2177026350, 1206759142],
          [2456956037, 344077627],
          [2730485921, 1290863460],
          [2820302411, 3158454273],
          [3259730800, 3505952657],
          [3345764771, 106217008],
          [3516065817, 3606008344],
          [3600352804, 1432725776],
          [4094571909, 1467031594],
          [275423344, 851169720],
          [430227734, 3100823752],
          [506948616, 1363258195],
          [659060556, 3750685593],
          [883997877, 3785050280],
          [958139571, 3318307427],
          [1322822218, 3812723403],
          [1537002063, 2003034995],
          [1747873779, 3602036899],
          [1955562222, 1575990012],
          [2024104815, 1125592928],
          [2227730452, 2716904306],
          [2361852424, 442776044],
          [2428436474, 593698344],
          [2756734187, 3733110249],
          [3204031479, 2999351573],
          [3329325298, 3815920427],
          [3391569614, 3928383900],
          [3515267271, 566280711],
          [3940187606, 3454069534],
          [4118630271, 4000239992],
          [116418474, 1914138554],
          [174292421, 2731055270],
          [289380356, 3203993006],
          [460393269, 320620315],
          [685471733, 587496836],
          [852142971, 1086792851],
          [1017036298, 365543100],
          [1126000580, 2618297676],
          [1288033470, 3409855158],
          [1501505948, 4234509866],
          [1607167915, 987167468],
          [1816402316, 1246189591]
        ];
        _states = {};
        _states["SHA-512"] = [
          [1779033703, 4089235720],
          [3144134277, 2227873595],
          [1013904242, 4271175723],
          [2773480762, 1595750129],
          [1359893119, 2917565137],
          [2600822924, 725511199],
          [528734635, 4215389547],
          [1541459225, 327033209]
        ];
        _states["SHA-384"] = [
          [3418070365, 3238371032],
          [1654270250, 914150663],
          [2438529370, 812702999],
          [355462360, 4144912697],
          [1731405415, 4290775857],
          [2394180231, 1750603025],
          [3675008525, 1694076839],
          [1203062813, 3204075428]
        ];
        _states["SHA-512/256"] = [
          [573645204, 4230739756],
          [2673172387, 3360449730],
          [596883563, 1867755857],
          [2520282905, 1497426621],
          [2519219938, 2827943907],
          [3193839141, 1401305490],
          [721525244, 746961066],
          [246885852, 2177182882]
        ];
        _states["SHA-512/224"] = [
          [2352822216, 424955298],
          [1944164710, 2312950998],
          [502970286, 855612546],
          [1738396948, 1479516111],
          [258812777, 2077511080],
          [2011393907, 79989058],
          [1067287976, 1780299464],
          [286451373, 2446758561]
        ];
        _initialized = true;
      }
      function _update(s, w, bytes2) {
        var t1_hi, t1_lo;
        var t2_hi, t2_lo;
        var s0_hi, s0_lo;
        var s1_hi, s1_lo;
        var ch_hi, ch_lo;
        var maj_hi, maj_lo;
        var a_hi, a_lo;
        var b_hi, b_lo;
        var c_hi, c_lo;
        var d_hi, d_lo;
        var e_hi, e_lo;
        var f_hi, f_lo;
        var g_hi, g_lo;
        var h_hi, h_lo;
        var i, hi, lo, w2, w7, w15, w16;
        var len = bytes2.length();
        while (len >= 128) {
          for (i = 0; i < 16; ++i) {
            w[i][0] = bytes2.getInt32() >>> 0;
            w[i][1] = bytes2.getInt32() >>> 0;
          }
          for (; i < 80; ++i) {
            w2 = w[i - 2];
            hi = w2[0];
            lo = w2[1];
            t1_hi = ((hi >>> 19 | lo << 13) ^ (lo >>> 29 | hi << 3) ^ hi >>> 6) >>> 0;
            t1_lo = ((hi << 13 | lo >>> 19) ^ (lo << 3 | hi >>> 29) ^ (hi << 26 | lo >>> 6)) >>> 0;
            w15 = w[i - 15];
            hi = w15[0];
            lo = w15[1];
            t2_hi = ((hi >>> 1 | lo << 31) ^ (hi >>> 8 | lo << 24) ^ hi >>> 7) >>> 0;
            t2_lo = ((hi << 31 | lo >>> 1) ^ (hi << 24 | lo >>> 8) ^ (hi << 25 | lo >>> 7)) >>> 0;
            w7 = w[i - 7];
            w16 = w[i - 16];
            lo = t1_lo + w7[1] + t2_lo + w16[1];
            w[i][0] = t1_hi + w7[0] + t2_hi + w16[0] + (lo / 4294967296 >>> 0) >>> 0;
            w[i][1] = lo >>> 0;
          }
          a_hi = s[0][0];
          a_lo = s[0][1];
          b_hi = s[1][0];
          b_lo = s[1][1];
          c_hi = s[2][0];
          c_lo = s[2][1];
          d_hi = s[3][0];
          d_lo = s[3][1];
          e_hi = s[4][0];
          e_lo = s[4][1];
          f_hi = s[5][0];
          f_lo = s[5][1];
          g_hi = s[6][0];
          g_lo = s[6][1];
          h_hi = s[7][0];
          h_lo = s[7][1];
          for (i = 0; i < 80; ++i) {
            s1_hi = ((e_hi >>> 14 | e_lo << 18) ^ (e_hi >>> 18 | e_lo << 14) ^ (e_lo >>> 9 | e_hi << 23)) >>> 0;
            s1_lo = ((e_hi << 18 | e_lo >>> 14) ^ (e_hi << 14 | e_lo >>> 18) ^ (e_lo << 23 | e_hi >>> 9)) >>> 0;
            ch_hi = (g_hi ^ e_hi & (f_hi ^ g_hi)) >>> 0;
            ch_lo = (g_lo ^ e_lo & (f_lo ^ g_lo)) >>> 0;
            s0_hi = ((a_hi >>> 28 | a_lo << 4) ^ (a_lo >>> 2 | a_hi << 30) ^ (a_lo >>> 7 | a_hi << 25)) >>> 0;
            s0_lo = ((a_hi << 4 | a_lo >>> 28) ^ (a_lo << 30 | a_hi >>> 2) ^ (a_lo << 25 | a_hi >>> 7)) >>> 0;
            maj_hi = (a_hi & b_hi | c_hi & (a_hi ^ b_hi)) >>> 0;
            maj_lo = (a_lo & b_lo | c_lo & (a_lo ^ b_lo)) >>> 0;
            lo = h_lo + s1_lo + ch_lo + _k[i][1] + w[i][1];
            t1_hi = h_hi + s1_hi + ch_hi + _k[i][0] + w[i][0] + (lo / 4294967296 >>> 0) >>> 0;
            t1_lo = lo >>> 0;
            lo = s0_lo + maj_lo;
            t2_hi = s0_hi + maj_hi + (lo / 4294967296 >>> 0) >>> 0;
            t2_lo = lo >>> 0;
            h_hi = g_hi;
            h_lo = g_lo;
            g_hi = f_hi;
            g_lo = f_lo;
            f_hi = e_hi;
            f_lo = e_lo;
            lo = d_lo + t1_lo;
            e_hi = d_hi + t1_hi + (lo / 4294967296 >>> 0) >>> 0;
            e_lo = lo >>> 0;
            d_hi = c_hi;
            d_lo = c_lo;
            c_hi = b_hi;
            c_lo = b_lo;
            b_hi = a_hi;
            b_lo = a_lo;
            lo = t1_lo + t2_lo;
            a_hi = t1_hi + t2_hi + (lo / 4294967296 >>> 0) >>> 0;
            a_lo = lo >>> 0;
          }
          lo = s[0][1] + a_lo;
          s[0][0] = s[0][0] + a_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[0][1] = lo >>> 0;
          lo = s[1][1] + b_lo;
          s[1][0] = s[1][0] + b_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[1][1] = lo >>> 0;
          lo = s[2][1] + c_lo;
          s[2][0] = s[2][0] + c_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[2][1] = lo >>> 0;
          lo = s[3][1] + d_lo;
          s[3][0] = s[3][0] + d_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[3][1] = lo >>> 0;
          lo = s[4][1] + e_lo;
          s[4][0] = s[4][0] + e_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[4][1] = lo >>> 0;
          lo = s[5][1] + f_lo;
          s[5][0] = s[5][0] + f_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[5][1] = lo >>> 0;
          lo = s[6][1] + g_lo;
          s[6][0] = s[6][0] + g_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[6][1] = lo >>> 0;
          lo = s[7][1] + h_lo;
          s[7][0] = s[7][0] + h_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[7][1] = lo >>> 0;
          len -= 128;
        }
      }
    }
  });

  // ../node_modules/iso-random-stream/src/random.browser.js
  var require_random_browser = __commonJS({
    "../node_modules/iso-random-stream/src/random.browser.js"(exports2, module2) {
      "use strict";
      var MAX_BYTES = 65536;
      function randomBytes2(size) {
        const bytes2 = new Uint8Array(size);
        let generated = 0;
        if (size > 0) {
          if (size > MAX_BYTES) {
            while (generated < size) {
              if (generated + MAX_BYTES > size) {
                crypto.getRandomValues(bytes2.subarray(generated, generated + (size - generated)));
                generated += size - generated;
              } else {
                crypto.getRandomValues(bytes2.subarray(generated, generated + MAX_BYTES));
                generated += MAX_BYTES;
              }
            }
          } else {
            crypto.getRandomValues(bytes2);
          }
        }
        return bytes2;
      }
      module2.exports = randomBytes2;
    }
  });

  // ../node_modules/debug/node_modules/ms/index.js
  var require_ms = __commonJS({
    "../node_modules/debug/node_modules/ms/index.js"(exports2, module2) {
      var s = 1e3;
      var m = s * 60;
      var h = m * 60;
      var d = h * 24;
      var w = d * 7;
      var y = d * 365.25;
      module2.exports = function(val, options) {
        options = options || {};
        var type = typeof val;
        if (type === "string" && val.length > 0) {
          return parse2(val);
        } else if (type === "number" && isFinite(val)) {
          return options.long ? fmtLong(val) : fmtShort(val);
        }
        throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
      };
      function parse2(str) {
        str = String(str);
        if (str.length > 100) {
          return;
        }
        var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
        if (!match) {
          return;
        }
        var n = parseFloat(match[1]);
        var type = (match[2] || "ms").toLowerCase();
        switch (type) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return n * y;
          case "weeks":
          case "week":
          case "w":
            return n * w;
          case "days":
          case "day":
          case "d":
            return n * d;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return n * h;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return n * m;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return n * s;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return n;
          default:
            return void 0;
        }
      }
      function fmtShort(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return Math.round(ms / d) + "d";
        }
        if (msAbs >= h) {
          return Math.round(ms / h) + "h";
        }
        if (msAbs >= m) {
          return Math.round(ms / m) + "m";
        }
        if (msAbs >= s) {
          return Math.round(ms / s) + "s";
        }
        return ms + "ms";
      }
      function fmtLong(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return plural(ms, msAbs, d, "day");
        }
        if (msAbs >= h) {
          return plural(ms, msAbs, h, "hour");
        }
        if (msAbs >= m) {
          return plural(ms, msAbs, m, "minute");
        }
        if (msAbs >= s) {
          return plural(ms, msAbs, s, "second");
        }
        return ms + " ms";
      }
      function plural(ms, msAbs, n, name2) {
        var isPlural = msAbs >= n * 1.5;
        return Math.round(ms / n) + " " + name2 + (isPlural ? "s" : "");
      }
    }
  });

  // ../node_modules/debug/src/common.js
  var require_common = __commonJS({
    "../node_modules/debug/src/common.js"(exports2, module2) {
      function setup(env) {
        createDebug.debug = createDebug;
        createDebug.default = createDebug;
        createDebug.coerce = coerce2;
        createDebug.disable = disable;
        createDebug.enable = enable;
        createDebug.enabled = enabled;
        createDebug.humanize = require_ms();
        createDebug.destroy = destroy;
        Object.keys(env).forEach((key) => {
          createDebug[key] = env[key];
        });
        createDebug.names = [];
        createDebug.skips = [];
        createDebug.formatters = {};
        function selectColor(namespace2) {
          let hash = 0;
          for (let i = 0; i < namespace2.length; i++) {
            hash = (hash << 5) - hash + namespace2.charCodeAt(i);
            hash |= 0;
          }
          return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
        }
        createDebug.selectColor = selectColor;
        function createDebug(namespace2) {
          let prevTime;
          let enableOverride = null;
          let namespacesCache;
          let enabledCache;
          function debug2(...args) {
            if (!debug2.enabled) {
              return;
            }
            const self2 = debug2;
            const curr = Number(new Date());
            const ms = curr - (prevTime || curr);
            self2.diff = ms;
            self2.prev = prevTime;
            self2.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);
            if (typeof args[0] !== "string") {
              args.unshift("%O");
            }
            let index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
              if (match === "%%") {
                return "%";
              }
              index++;
              const formatter = createDebug.formatters[format];
              if (typeof formatter === "function") {
                const val = args[index];
                match = formatter.call(self2, val);
                args.splice(index, 1);
                index--;
              }
              return match;
            });
            createDebug.formatArgs.call(self2, args);
            const logFn = self2.log || createDebug.log;
            logFn.apply(self2, args);
          }
          debug2.namespace = namespace2;
          debug2.useColors = createDebug.useColors();
          debug2.color = createDebug.selectColor(namespace2);
          debug2.extend = extend;
          debug2.destroy = createDebug.destroy;
          Object.defineProperty(debug2, "enabled", {
            enumerable: true,
            configurable: false,
            get: () => {
              if (enableOverride !== null) {
                return enableOverride;
              }
              if (namespacesCache !== createDebug.namespaces) {
                namespacesCache = createDebug.namespaces;
                enabledCache = createDebug.enabled(namespace2);
              }
              return enabledCache;
            },
            set: (v) => {
              enableOverride = v;
            }
          });
          if (typeof createDebug.init === "function") {
            createDebug.init(debug2);
          }
          return debug2;
        }
        function extend(namespace2, delimiter) {
          const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace2);
          newDebug.log = this.log;
          return newDebug;
        }
        function enable(namespaces) {
          createDebug.save(namespaces);
          createDebug.namespaces = namespaces;
          createDebug.names = [];
          createDebug.skips = [];
          let i;
          const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
          const len = split.length;
          for (i = 0; i < len; i++) {
            if (!split[i]) {
              continue;
            }
            namespaces = split[i].replace(/\*/g, ".*?");
            if (namespaces[0] === "-") {
              createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
            } else {
              createDebug.names.push(new RegExp("^" + namespaces + "$"));
            }
          }
        }
        function disable() {
          const namespaces = [
            ...createDebug.names.map(toNamespace),
            ...createDebug.skips.map(toNamespace).map((namespace2) => "-" + namespace2)
          ].join(",");
          createDebug.enable("");
          return namespaces;
        }
        function enabled(name2) {
          if (name2[name2.length - 1] === "*") {
            return true;
          }
          let i;
          let len;
          for (i = 0, len = createDebug.skips.length; i < len; i++) {
            if (createDebug.skips[i].test(name2)) {
              return false;
            }
          }
          for (i = 0, len = createDebug.names.length; i < len; i++) {
            if (createDebug.names[i].test(name2)) {
              return true;
            }
          }
          return false;
        }
        function toNamespace(regexp) {
          return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
        }
        function coerce2(val) {
          if (val instanceof Error) {
            return val.stack || val.message;
          }
          return val;
        }
        function destroy() {
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
        createDebug.enable(createDebug.load());
        return createDebug;
      }
      module2.exports = setup;
    }
  });

  // ../node_modules/debug/src/browser.js
  var require_browser = __commonJS({
    "../node_modules/debug/src/browser.js"(exports2, module2) {
      exports2.formatArgs = formatArgs;
      exports2.save = save;
      exports2.load = load;
      exports2.useColors = useColors;
      exports2.storage = localstorage();
      exports2.destroy = (() => {
        let warned = false;
        return () => {
          if (!warned) {
            warned = true;
            console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
          }
        };
      })();
      exports2.colors = [
        "#0000CC",
        "#0000FF",
        "#0033CC",
        "#0033FF",
        "#0066CC",
        "#0066FF",
        "#0099CC",
        "#0099FF",
        "#00CC00",
        "#00CC33",
        "#00CC66",
        "#00CC99",
        "#00CCCC",
        "#00CCFF",
        "#3300CC",
        "#3300FF",
        "#3333CC",
        "#3333FF",
        "#3366CC",
        "#3366FF",
        "#3399CC",
        "#3399FF",
        "#33CC00",
        "#33CC33",
        "#33CC66",
        "#33CC99",
        "#33CCCC",
        "#33CCFF",
        "#6600CC",
        "#6600FF",
        "#6633CC",
        "#6633FF",
        "#66CC00",
        "#66CC33",
        "#9900CC",
        "#9900FF",
        "#9933CC",
        "#9933FF",
        "#99CC00",
        "#99CC33",
        "#CC0000",
        "#CC0033",
        "#CC0066",
        "#CC0099",
        "#CC00CC",
        "#CC00FF",
        "#CC3300",
        "#CC3333",
        "#CC3366",
        "#CC3399",
        "#CC33CC",
        "#CC33FF",
        "#CC6600",
        "#CC6633",
        "#CC9900",
        "#CC9933",
        "#CCCC00",
        "#CCCC33",
        "#FF0000",
        "#FF0033",
        "#FF0066",
        "#FF0099",
        "#FF00CC",
        "#FF00FF",
        "#FF3300",
        "#FF3333",
        "#FF3366",
        "#FF3399",
        "#FF33CC",
        "#FF33FF",
        "#FF6600",
        "#FF6633",
        "#FF9900",
        "#FF9933",
        "#FFCC00",
        "#FFCC33"
      ];
      function useColors() {
        if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
          return true;
        }
        if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
          return false;
        }
        return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
      }
      function formatArgs(args) {
        args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
        if (!this.useColors) {
          return;
        }
        const c = "color: " + this.color;
        args.splice(1, 0, c, "color: inherit");
        let index = 0;
        let lastC = 0;
        args[0].replace(/%[a-zA-Z%]/g, (match) => {
          if (match === "%%") {
            return;
          }
          index++;
          if (match === "%c") {
            lastC = index;
          }
        });
        args.splice(lastC, 0, c);
      }
      exports2.log = console.debug || console.log || (() => {
      });
      function save(namespaces) {
        try {
          if (namespaces) {
            exports2.storage.setItem("debug", namespaces);
          } else {
            exports2.storage.removeItem("debug");
          }
        } catch (error) {
        }
      }
      function load() {
        let r;
        try {
          r = exports2.storage.getItem("debug");
        } catch (error) {
        }
        if (!r && typeof process !== "undefined" && "env" in process) {
          r = process.env.DEBUG;
        }
        return r;
      }
      function localstorage() {
        try {
          return localStorage;
        } catch (error) {
        }
      }
      module2.exports = require_common()(exports2);
      var { formatters } = module2.exports;
      formatters.j = function(v) {
        try {
          return JSON.stringify(v);
        } catch (error) {
          return "[UnexpectedJSONParseError]: " + error.message;
        }
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/webcrypto.js
  var require_webcrypto = __commonJS({
    "../node_modules/libp2p-crypto/src/webcrypto.js"(exports2) {
      "use strict";
      exports2.get = (win = globalThis) => {
        const nativeCrypto = win.crypto;
        if (!nativeCrypto || !nativeCrypto.subtle) {
          throw Object.assign(new Error("Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure context (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p-crypto/blob/master/README.md#web-crypto-api"), { code: "ERR_MISSING_WEB_CRYPTO" });
        }
        return nativeCrypto;
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/hmac/lengths.js
  var require_lengths = __commonJS({
    "../node_modules/libp2p-crypto/src/hmac/lengths.js"(exports2, module2) {
      "use strict";
      module2.exports = {
        SHA1: 20,
        SHA256: 32,
        SHA512: 64
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/hmac/index-browser.js
  var require_index_browser = __commonJS({
    "../node_modules/libp2p-crypto/src/hmac/index-browser.js"(exports2) {
      "use strict";
      var webcrypto = require_webcrypto();
      var lengths = require_lengths();
      var hashTypes = {
        SHA1: "SHA-1",
        SHA256: "SHA-256",
        SHA512: "SHA-512"
      };
      var sign4 = async (key, data) => {
        const buf2 = await webcrypto.get().subtle.sign({ name: "HMAC" }, key, data);
        return new Uint8Array(buf2, buf2.byteOffset, buf2.byteLength);
      };
      exports2.create = async function(hashType, secret) {
        const hash = hashTypes[hashType];
        const key = await webcrypto.get().subtle.importKey("raw", secret, {
          name: "HMAC",
          hash: { name: hash }
        }, false, ["sign"]);
        return {
          async digest(data) {
            return sign4(key, data);
          },
          length: lengths[hashType]
        };
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/aes/ciphers-browser.js
  var require_ciphers_browser = __commonJS({
    "../node_modules/libp2p-crypto/src/aes/ciphers-browser.js"(exports2, module2) {
      "use strict";
      require_aes();
      var forge6 = require_forge();
      var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
      var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
      module2.exports = {
        createCipheriv: (mode, key, iv) => {
          const cipher2 = forge6.cipher.createCipher("AES-CTR", uint8ArrayToString(key, "ascii"));
          cipher2.start({ iv: uint8ArrayToString(iv, "ascii") });
          return {
            update: (data) => {
              cipher2.update(forge6.util.createBuffer(uint8ArrayToString(data, "ascii")));
              return uint8ArrayFromString(cipher2.output.getBytes(), "ascii");
            }
          };
        },
        createDecipheriv: (mode, key, iv) => {
          const cipher2 = forge6.cipher.createDecipher("AES-CTR", uint8ArrayToString(key, "ascii"));
          cipher2.start({ iv: uint8ArrayToString(iv, "ascii") });
          return {
            update: (data) => {
              cipher2.update(forge6.util.createBuffer(uint8ArrayToString(data, "ascii")));
              return uint8ArrayFromString(cipher2.output.getBytes(), "ascii");
            }
          };
        }
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/aes/cipher-mode.js
  var require_cipher_mode = __commonJS({
    "../node_modules/libp2p-crypto/src/aes/cipher-mode.js"(exports2, module2) {
      "use strict";
      var errcode12 = require_err_code();
      var CIPHER_MODES = {
        16: "aes-128-ctr",
        32: "aes-256-ctr"
      };
      module2.exports = function(key) {
        const mode = CIPHER_MODES[key.length];
        if (!mode) {
          const modes = Object.entries(CIPHER_MODES).map(([k, v]) => `${k} (${v})`).join(" / ");
          throw errcode12(new Error(`Invalid key length ${key.length} bytes. Must be ${modes}`), "ERR_INVALID_KEY_LENGTH");
        }
        return mode;
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/aes/index.js
  var require_aes2 = __commonJS({
    "../node_modules/libp2p-crypto/src/aes/index.js"(exports2) {
      "use strict";
      var ciphers = require_ciphers_browser();
      var cipherMode = require_cipher_mode();
      exports2.create = async function(key, iv) {
        const mode = cipherMode(key);
        const cipher = ciphers.createCipheriv(mode, key, iv);
        const decipher = ciphers.createDecipheriv(mode, key, iv);
        const res = {
          async encrypt(data) {
            return cipher.update(data);
          },
          async decrypt(data) {
            return decipher.update(data);
          }
        };
        return res;
      };
    }
  });

  // ../node_modules/@protobufjs/aspromise/index.js
  var require_aspromise = __commonJS({
    "../node_modules/@protobufjs/aspromise/index.js"(exports2, module2) {
      "use strict";
      module2.exports = asPromise;
      function asPromise(fn, ctx) {
        var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
        while (index < arguments.length)
          params[offset++] = arguments[index++];
        return new Promise(function executor(resolve2, reject) {
          params[offset] = function callback(err) {
            if (pending) {
              pending = false;
              if (err)
                reject(err);
              else {
                var params2 = new Array(arguments.length - 1), offset2 = 0;
                while (offset2 < params2.length)
                  params2[offset2++] = arguments[offset2];
                resolve2.apply(null, params2);
              }
            }
          };
          try {
            fn.apply(ctx || null, params);
          } catch (err) {
            if (pending) {
              pending = false;
              reject(err);
            }
          }
        });
      }
    }
  });

  // ../node_modules/@protobufjs/base64/index.js
  var require_base64 = __commonJS({
    "../node_modules/@protobufjs/base64/index.js"(exports2) {
      "use strict";
      var base642 = exports2;
      base642.length = function length2(string3) {
        var p = string3.length;
        if (!p)
          return 0;
        var n = 0;
        while (--p % 4 > 1 && string3.charAt(p) === "=")
          ++n;
        return Math.ceil(string3.length * 3) / 4 - n;
      };
      var b64 = new Array(64);
      var s64 = new Array(123);
      for (i = 0; i < 64; )
        s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
      var i;
      base642.encode = function encode20(buffer2, start, end) {
        var parts = null, chunk = [];
        var i2 = 0, j = 0, t;
        while (start < end) {
          var b = buffer2[start++];
          switch (j) {
            case 0:
              chunk[i2++] = b64[b >> 2];
              t = (b & 3) << 4;
              j = 1;
              break;
            case 1:
              chunk[i2++] = b64[t | b >> 4];
              t = (b & 15) << 2;
              j = 2;
              break;
            case 2:
              chunk[i2++] = b64[t | b >> 6];
              chunk[i2++] = b64[b & 63];
              j = 0;
              break;
          }
          if (i2 > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i2 = 0;
          }
        }
        if (j) {
          chunk[i2++] = b64[t];
          chunk[i2++] = 61;
          if (j === 1)
            chunk[i2++] = 61;
        }
        if (parts) {
          if (i2)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
          return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i2));
      };
      var invalidEncoding = "invalid encoding";
      base642.decode = function decode21(string3, buffer2, offset) {
        var start = offset;
        var j = 0, t;
        for (var i2 = 0; i2 < string3.length; ) {
          var c = string3.charCodeAt(i2++);
          if (c === 61 && j > 1)
            break;
          if ((c = s64[c]) === void 0)
            throw Error(invalidEncoding);
          switch (j) {
            case 0:
              t = c;
              j = 1;
              break;
            case 1:
              buffer2[offset++] = t << 2 | (c & 48) >> 4;
              t = c;
              j = 2;
              break;
            case 2:
              buffer2[offset++] = (t & 15) << 4 | (c & 60) >> 2;
              t = c;
              j = 3;
              break;
            case 3:
              buffer2[offset++] = (t & 3) << 6 | c;
              j = 0;
              break;
          }
        }
        if (j === 1)
          throw Error(invalidEncoding);
        return offset - start;
      };
      base642.test = function test(string3) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string3);
      };
    }
  });

  // ../node_modules/@protobufjs/eventemitter/index.js
  var require_eventemitter = __commonJS({
    "../node_modules/@protobufjs/eventemitter/index.js"(exports2, module2) {
      "use strict";
      module2.exports = EventEmitter;
      function EventEmitter() {
        this._listeners = {};
      }
      EventEmitter.prototype.on = function on(evt, fn, ctx) {
        (this._listeners[evt] || (this._listeners[evt] = [])).push({
          fn,
          ctx: ctx || this
        });
        return this;
      };
      EventEmitter.prototype.off = function off(evt, fn) {
        if (evt === void 0)
          this._listeners = {};
        else {
          if (fn === void 0)
            this._listeners[evt] = [];
          else {
            var listeners = this._listeners[evt];
            for (var i = 0; i < listeners.length; )
              if (listeners[i].fn === fn)
                listeners.splice(i, 1);
              else
                ++i;
          }
        }
        return this;
      };
      EventEmitter.prototype.emit = function emit(evt) {
        var listeners = this._listeners[evt];
        if (listeners) {
          var args = [], i = 1;
          for (; i < arguments.length; )
            args.push(arguments[i++]);
          for (i = 0; i < listeners.length; )
            listeners[i].fn.apply(listeners[i++].ctx, args);
        }
        return this;
      };
    }
  });

  // ../node_modules/@protobufjs/float/index.js
  var require_float = __commonJS({
    "../node_modules/@protobufjs/float/index.js"(exports2, module2) {
      "use strict";
      module2.exports = factory(factory);
      function factory(exports3) {
        if (typeof Float32Array !== "undefined")
          (function() {
            var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
            function writeFloat_f32_cpy(val, buf2, pos) {
              f32[0] = val;
              buf2[pos] = f8b[0];
              buf2[pos + 1] = f8b[1];
              buf2[pos + 2] = f8b[2];
              buf2[pos + 3] = f8b[3];
            }
            function writeFloat_f32_rev(val, buf2, pos) {
              f32[0] = val;
              buf2[pos] = f8b[3];
              buf2[pos + 1] = f8b[2];
              buf2[pos + 2] = f8b[1];
              buf2[pos + 3] = f8b[0];
            }
            exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
            exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
            function readFloat_f32_cpy(buf2, pos) {
              f8b[0] = buf2[pos];
              f8b[1] = buf2[pos + 1];
              f8b[2] = buf2[pos + 2];
              f8b[3] = buf2[pos + 3];
              return f32[0];
            }
            function readFloat_f32_rev(buf2, pos) {
              f8b[3] = buf2[pos];
              f8b[2] = buf2[pos + 1];
              f8b[1] = buf2[pos + 2];
              f8b[0] = buf2[pos + 3];
              return f32[0];
            }
            exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
            exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
          })();
        else
          (function() {
            function writeFloat_ieee754(writeUint, val, buf2, pos) {
              var sign4 = val < 0 ? 1 : 0;
              if (sign4)
                val = -val;
              if (val === 0)
                writeUint(1 / val > 0 ? 0 : 2147483648, buf2, pos);
              else if (isNaN(val))
                writeUint(2143289344, buf2, pos);
              else if (val > 34028234663852886e22)
                writeUint((sign4 << 31 | 2139095040) >>> 0, buf2, pos);
              else if (val < 11754943508222875e-54)
                writeUint((sign4 << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf2, pos);
              else {
                var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign4 << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf2, pos);
              }
            }
            exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
            exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
            function readFloat_ieee754(readUint, buf2, pos) {
              var uint = readUint(buf2, pos), sign4 = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
              return exponent === 255 ? mantissa ? NaN : sign4 * Infinity : exponent === 0 ? sign4 * 1401298464324817e-60 * mantissa : sign4 * Math.pow(2, exponent - 150) * (mantissa + 8388608);
            }
            exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
            exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
          })();
        if (typeof Float64Array !== "undefined")
          (function() {
            var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
            function writeDouble_f64_cpy(val, buf2, pos) {
              f64[0] = val;
              buf2[pos] = f8b[0];
              buf2[pos + 1] = f8b[1];
              buf2[pos + 2] = f8b[2];
              buf2[pos + 3] = f8b[3];
              buf2[pos + 4] = f8b[4];
              buf2[pos + 5] = f8b[5];
              buf2[pos + 6] = f8b[6];
              buf2[pos + 7] = f8b[7];
            }
            function writeDouble_f64_rev(val, buf2, pos) {
              f64[0] = val;
              buf2[pos] = f8b[7];
              buf2[pos + 1] = f8b[6];
              buf2[pos + 2] = f8b[5];
              buf2[pos + 3] = f8b[4];
              buf2[pos + 4] = f8b[3];
              buf2[pos + 5] = f8b[2];
              buf2[pos + 6] = f8b[1];
              buf2[pos + 7] = f8b[0];
            }
            exports3.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
            exports3.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
            function readDouble_f64_cpy(buf2, pos) {
              f8b[0] = buf2[pos];
              f8b[1] = buf2[pos + 1];
              f8b[2] = buf2[pos + 2];
              f8b[3] = buf2[pos + 3];
              f8b[4] = buf2[pos + 4];
              f8b[5] = buf2[pos + 5];
              f8b[6] = buf2[pos + 6];
              f8b[7] = buf2[pos + 7];
              return f64[0];
            }
            function readDouble_f64_rev(buf2, pos) {
              f8b[7] = buf2[pos];
              f8b[6] = buf2[pos + 1];
              f8b[5] = buf2[pos + 2];
              f8b[4] = buf2[pos + 3];
              f8b[3] = buf2[pos + 4];
              f8b[2] = buf2[pos + 5];
              f8b[1] = buf2[pos + 6];
              f8b[0] = buf2[pos + 7];
              return f64[0];
            }
            exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
            exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
          })();
        else
          (function() {
            function writeDouble_ieee754(writeUint, off0, off1, val, buf2, pos) {
              var sign4 = val < 0 ? 1 : 0;
              if (sign4)
                val = -val;
              if (val === 0) {
                writeUint(0, buf2, pos + off0);
                writeUint(1 / val > 0 ? 0 : 2147483648, buf2, pos + off1);
              } else if (isNaN(val)) {
                writeUint(0, buf2, pos + off0);
                writeUint(2146959360, buf2, pos + off1);
              } else if (val > 17976931348623157e292) {
                writeUint(0, buf2, pos + off0);
                writeUint((sign4 << 31 | 2146435072) >>> 0, buf2, pos + off1);
              } else {
                var mantissa;
                if (val < 22250738585072014e-324) {
                  mantissa = val / 5e-324;
                  writeUint(mantissa >>> 0, buf2, pos + off0);
                  writeUint((sign4 << 31 | mantissa / 4294967296) >>> 0, buf2, pos + off1);
                } else {
                  var exponent = Math.floor(Math.log(val) / Math.LN2);
                  if (exponent === 1024)
                    exponent = 1023;
                  mantissa = val * Math.pow(2, -exponent);
                  writeUint(mantissa * 4503599627370496 >>> 0, buf2, pos + off0);
                  writeUint((sign4 << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf2, pos + off1);
                }
              }
            }
            exports3.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
            exports3.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
            function readDouble_ieee754(readUint, off0, off1, buf2, pos) {
              var lo = readUint(buf2, pos + off0), hi = readUint(buf2, pos + off1);
              var sign4 = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
              return exponent === 2047 ? mantissa ? NaN : sign4 * Infinity : exponent === 0 ? sign4 * 5e-324 * mantissa : sign4 * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
            }
            exports3.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
            exports3.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
          })();
        return exports3;
      }
      function writeUintLE(val, buf2, pos) {
        buf2[pos] = val & 255;
        buf2[pos + 1] = val >>> 8 & 255;
        buf2[pos + 2] = val >>> 16 & 255;
        buf2[pos + 3] = val >>> 24;
      }
      function writeUintBE(val, buf2, pos) {
        buf2[pos] = val >>> 24;
        buf2[pos + 1] = val >>> 16 & 255;
        buf2[pos + 2] = val >>> 8 & 255;
        buf2[pos + 3] = val & 255;
      }
      function readUintLE(buf2, pos) {
        return (buf2[pos] | buf2[pos + 1] << 8 | buf2[pos + 2] << 16 | buf2[pos + 3] << 24) >>> 0;
      }
      function readUintBE(buf2, pos) {
        return (buf2[pos] << 24 | buf2[pos + 1] << 16 | buf2[pos + 2] << 8 | buf2[pos + 3]) >>> 0;
      }
    }
  });

  // ../node_modules/@protobufjs/inquire/index.js
  var require_inquire = __commonJS({
    "../node_modules/@protobufjs/inquire/index.js"(exports, module) {
      "use strict";
      module.exports = inquire;
      function inquire(moduleName) {
        try {
          var mod = eval("quire".replace(/^/, "re"))(moduleName);
          if (mod && (mod.length || Object.keys(mod).length))
            return mod;
        } catch (e) {
        }
        return null;
      }
    }
  });

  // ../node_modules/@protobufjs/utf8/index.js
  var require_utf8 = __commonJS({
    "../node_modules/@protobufjs/utf8/index.js"(exports2) {
      "use strict";
      var utf8 = exports2;
      utf8.length = function utf8_length(string3) {
        var len = 0, c = 0;
        for (var i = 0; i < string3.length; ++i) {
          c = string3.charCodeAt(i);
          if (c < 128)
            len += 1;
          else if (c < 2048)
            len += 2;
          else if ((c & 64512) === 55296 && (string3.charCodeAt(i + 1) & 64512) === 56320) {
            ++i;
            len += 4;
          } else
            len += 3;
        }
        return len;
      };
      utf8.read = function utf8_read(buffer2, start, end) {
        var len = end - start;
        if (len < 1)
          return "";
        var parts = null, chunk = [], i = 0, t;
        while (start < end) {
          t = buffer2[start++];
          if (t < 128)
            chunk[i++] = t;
          else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer2[start++] & 63;
          else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer2[start++] & 63) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63) - 65536;
            chunk[i++] = 55296 + (t >> 10);
            chunk[i++] = 56320 + (t & 1023);
          } else
            chunk[i++] = (t & 15) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63;
          if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
          }
        }
        if (parts) {
          if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
          return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i));
      };
      utf8.write = function utf8_write(string3, buffer2, offset) {
        var start = offset, c1, c2;
        for (var i = 0; i < string3.length; ++i) {
          c1 = string3.charCodeAt(i);
          if (c1 < 128) {
            buffer2[offset++] = c1;
          } else if (c1 < 2048) {
            buffer2[offset++] = c1 >> 6 | 192;
            buffer2[offset++] = c1 & 63 | 128;
          } else if ((c1 & 64512) === 55296 && ((c2 = string3.charCodeAt(i + 1)) & 64512) === 56320) {
            c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
            ++i;
            buffer2[offset++] = c1 >> 18 | 240;
            buffer2[offset++] = c1 >> 12 & 63 | 128;
            buffer2[offset++] = c1 >> 6 & 63 | 128;
            buffer2[offset++] = c1 & 63 | 128;
          } else {
            buffer2[offset++] = c1 >> 12 | 224;
            buffer2[offset++] = c1 >> 6 & 63 | 128;
            buffer2[offset++] = c1 & 63 | 128;
          }
        }
        return offset - start;
      };
    }
  });

  // ../node_modules/@protobufjs/pool/index.js
  var require_pool = __commonJS({
    "../node_modules/@protobufjs/pool/index.js"(exports2, module2) {
      "use strict";
      module2.exports = pool;
      function pool(alloc2, slice2, size) {
        var SIZE = size || 8192;
        var MAX = SIZE >>> 1;
        var slab = null;
        var offset = SIZE;
        return function pool_alloc(size2) {
          if (size2 < 1 || size2 > MAX)
            return alloc2(size2);
          if (offset + size2 > SIZE) {
            slab = alloc2(SIZE);
            offset = 0;
          }
          var buf2 = slice2.call(slab, offset, offset += size2);
          if (offset & 7)
            offset = (offset | 7) + 1;
          return buf2;
        };
      }
    }
  });

  // ../node_modules/protobufjs/src/util/longbits.js
  var require_longbits = __commonJS({
    "../node_modules/protobufjs/src/util/longbits.js"(exports2, module2) {
      "use strict";
      module2.exports = LongBits2;
      var util = require_minimal();
      function LongBits2(lo, hi) {
        this.lo = lo >>> 0;
        this.hi = hi >>> 0;
      }
      var zero = LongBits2.zero = new LongBits2(0, 0);
      zero.toNumber = function() {
        return 0;
      };
      zero.zzEncode = zero.zzDecode = function() {
        return this;
      };
      zero.length = function() {
        return 1;
      };
      var zeroHash = LongBits2.zeroHash = "\0\0\0\0\0\0\0\0";
      LongBits2.fromNumber = function fromNumber(value) {
        if (value === 0)
          return zero;
        var sign4 = value < 0;
        if (sign4)
          value = -value;
        var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
        if (sign4) {
          hi = ~hi >>> 0;
          lo = ~lo >>> 0;
          if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
              hi = 0;
          }
        }
        return new LongBits2(lo, hi);
      };
      LongBits2.from = function from4(value) {
        if (typeof value === "number")
          return LongBits2.fromNumber(value);
        if (util.isString(value)) {
          if (util.Long)
            value = util.Long.fromString(value);
          else
            return LongBits2.fromNumber(parseInt(value, 10));
        }
        return value.low || value.high ? new LongBits2(value.low >>> 0, value.high >>> 0) : zero;
      };
      LongBits2.prototype.toNumber = function toNumber(unsigned3) {
        if (!unsigned3 && this.hi >>> 31) {
          var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
          if (!lo)
            hi = hi + 1 >>> 0;
          return -(lo + hi * 4294967296);
        }
        return this.lo + this.hi * 4294967296;
      };
      LongBits2.prototype.toLong = function toLong(unsigned3) {
        return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned3)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned3) };
      };
      var charCodeAt = String.prototype.charCodeAt;
      LongBits2.fromHash = function fromHash(hash) {
        if (hash === zeroHash)
          return zero;
        return new LongBits2((charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0, (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0);
      };
      LongBits2.prototype.toHash = function toHash() {
        return String.fromCharCode(this.lo & 255, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, this.hi & 255, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24);
      };
      LongBits2.prototype.zzEncode = function zzEncode() {
        var mask = this.hi >> 31;
        this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
        this.lo = (this.lo << 1 ^ mask) >>> 0;
        return this;
      };
      LongBits2.prototype.zzDecode = function zzDecode() {
        var mask = -(this.lo & 1);
        this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
        this.hi = (this.hi >>> 1 ^ mask) >>> 0;
        return this;
      };
      LongBits2.prototype.length = function length2() {
        var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
        return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
      };
    }
  });

  // ../node_modules/protobufjs/src/util/minimal.js
  var require_minimal = __commonJS({
    "../node_modules/protobufjs/src/util/minimal.js"(exports2) {
      "use strict";
      var util = exports2;
      util.asPromise = require_aspromise();
      util.base64 = require_base64();
      util.EventEmitter = require_eventemitter();
      util.float = require_float();
      util.inquire = require_inquire();
      util.utf8 = require_utf8();
      util.pool = require_pool();
      util.LongBits = require_longbits();
      util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
      util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports2;
      util.emptyArray = Object.freeze ? Object.freeze([]) : [];
      util.emptyObject = Object.freeze ? Object.freeze({}) : {};
      util.isInteger = Number.isInteger || function isInteger(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
      };
      util.isString = function isString(value) {
        return typeof value === "string" || value instanceof String;
      };
      util.isObject = function isObject(value) {
        return value && typeof value === "object";
      };
      util.isset = util.isSet = function isSet(obj, prop) {
        var value = obj[prop];
        if (value != null && obj.hasOwnProperty(prop))
          return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
        return false;
      };
      util.Buffer = function() {
        try {
          var Buffer2 = util.inquire("buffer").Buffer;
          return Buffer2.prototype.utf8Write ? Buffer2 : null;
        } catch (e) {
          return null;
        }
      }();
      util._Buffer_from = null;
      util._Buffer_allocUnsafe = null;
      util.newBuffer = function newBuffer(sizeOrArray) {
        return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
      };
      util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      util.Long = util.global.dcodeIO && util.global.dcodeIO.Long || util.global.Long || util.inquire("long");
      util.key2Re = /^true|false|0|1$/;
      util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
      util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
      util.longToHash = function longToHash(value) {
        return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
      };
      util.longFromHash = function longFromHash(hash, unsigned3) {
        var bits2 = util.LongBits.fromHash(hash);
        if (util.Long)
          return util.Long.fromBits(bits2.lo, bits2.hi, unsigned3);
        return bits2.toNumber(Boolean(unsigned3));
      };
      function merge(dst, src2, ifNotSet) {
        for (var keys2 = Object.keys(src2), i = 0; i < keys2.length; ++i)
          if (dst[keys2[i]] === void 0 || !ifNotSet)
            dst[keys2[i]] = src2[keys2[i]];
        return dst;
      }
      util.merge = merge;
      util.lcFirst = function lcFirst(str) {
        return str.charAt(0).toLowerCase() + str.substring(1);
      };
      function newError(name2) {
        function CustomError(message2, properties) {
          if (!(this instanceof CustomError))
            return new CustomError(message2, properties);
          Object.defineProperty(this, "message", { get: function() {
            return message2;
          } });
          if (Error.captureStackTrace)
            Error.captureStackTrace(this, CustomError);
          else
            Object.defineProperty(this, "stack", { value: new Error().stack || "" });
          if (properties)
            merge(this, properties);
        }
        (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;
        Object.defineProperty(CustomError.prototype, "name", { get: function() {
          return name2;
        } });
        CustomError.prototype.toString = function toString4() {
          return this.name + ": " + this.message;
        };
        return CustomError;
      }
      util.newError = newError;
      util.ProtocolError = newError("ProtocolError");
      util.oneOfGetter = function getOneOf(fieldNames) {
        var fieldMap = {};
        for (var i = 0; i < fieldNames.length; ++i)
          fieldMap[fieldNames[i]] = 1;
        return function() {
          for (var keys2 = Object.keys(this), i2 = keys2.length - 1; i2 > -1; --i2)
            if (fieldMap[keys2[i2]] === 1 && this[keys2[i2]] !== void 0 && this[keys2[i2]] !== null)
              return keys2[i2];
        };
      };
      util.oneOfSetter = function setOneOf(fieldNames) {
        return function(name2) {
          for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name2)
              delete this[fieldNames[i]];
        };
      };
      util.toJSONOptions = {
        longs: String,
        enums: String,
        bytes: String,
        json: true
      };
      util._configure = function() {
        var Buffer2 = util.Buffer;
        if (!Buffer2) {
          util._Buffer_from = util._Buffer_allocUnsafe = null;
          return;
        }
        util._Buffer_from = Buffer2.from !== Uint8Array.from && Buffer2.from || function Buffer_from(value, encoding) {
          return new Buffer2(value, encoding);
        };
        util._Buffer_allocUnsafe = Buffer2.allocUnsafe || function Buffer_allocUnsafe(size) {
          return new Buffer2(size);
        };
      };
    }
  });

  // ../node_modules/protobufjs/src/writer.js
  var require_writer = __commonJS({
    "../node_modules/protobufjs/src/writer.js"(exports2, module2) {
      "use strict";
      module2.exports = Writer;
      var util = require_minimal();
      var BufferWriter;
      var LongBits2 = util.LongBits;
      var base642 = util.base64;
      var utf8 = util.utf8;
      function Op(fn, len, val) {
        this.fn = fn;
        this.len = len;
        this.next = void 0;
        this.val = val;
      }
      function noop() {
      }
      function State(writer) {
        this.head = writer.head;
        this.tail = writer.tail;
        this.len = writer.len;
        this.next = writer.states;
      }
      function Writer() {
        this.len = 0;
        this.head = new Op(noop, 0, 0);
        this.tail = this.head;
        this.states = null;
      }
      var create6 = function create7() {
        return util.Buffer ? function create_buffer_setup() {
          return (Writer.create = function create_buffer() {
            return new BufferWriter();
          })();
        } : function create_array() {
          return new Writer();
        };
      };
      Writer.create = create6();
      Writer.alloc = function alloc2(size) {
        return new util.Array(size);
      };
      if (util.Array !== Array)
        Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
      Writer.prototype._push = function push(fn, len, val) {
        this.tail = this.tail.next = new Op(fn, len, val);
        this.len += len;
        return this;
      };
      function writeByte(val, buf2, pos) {
        buf2[pos] = val & 255;
      }
      function writeVarint32(val, buf2, pos) {
        while (val > 127) {
          buf2[pos++] = val & 127 | 128;
          val >>>= 7;
        }
        buf2[pos] = val;
      }
      function VarintOp(len, val) {
        this.len = len;
        this.next = void 0;
        this.val = val;
      }
      VarintOp.prototype = Object.create(Op.prototype);
      VarintOp.prototype.fn = writeVarint32;
      Writer.prototype.uint32 = function write_uint32(value) {
        this.len += (this.tail = this.tail.next = new VarintOp((value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5, value)).len;
        return this;
      };
      Writer.prototype.int32 = function write_int32(value) {
        return value < 0 ? this._push(writeVarint64, 10, LongBits2.fromNumber(value)) : this.uint32(value);
      };
      Writer.prototype.sint32 = function write_sint32(value) {
        return this.uint32((value << 1 ^ value >> 31) >>> 0);
      };
      function writeVarint64(val, buf2, pos) {
        while (val.hi) {
          buf2[pos++] = val.lo & 127 | 128;
          val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
          val.hi >>>= 7;
        }
        while (val.lo > 127) {
          buf2[pos++] = val.lo & 127 | 128;
          val.lo = val.lo >>> 7;
        }
        buf2[pos++] = val.lo;
      }
      Writer.prototype.uint64 = function write_uint64(value) {
        var bits2 = LongBits2.from(value);
        return this._push(writeVarint64, bits2.length(), bits2);
      };
      Writer.prototype.int64 = Writer.prototype.uint64;
      Writer.prototype.sint64 = function write_sint64(value) {
        var bits2 = LongBits2.from(value).zzEncode();
        return this._push(writeVarint64, bits2.length(), bits2);
      };
      Writer.prototype.bool = function write_bool(value) {
        return this._push(writeByte, 1, value ? 1 : 0);
      };
      function writeFixed32(val, buf2, pos) {
        buf2[pos] = val & 255;
        buf2[pos + 1] = val >>> 8 & 255;
        buf2[pos + 2] = val >>> 16 & 255;
        buf2[pos + 3] = val >>> 24;
      }
      Writer.prototype.fixed32 = function write_fixed32(value) {
        return this._push(writeFixed32, 4, value >>> 0);
      };
      Writer.prototype.sfixed32 = Writer.prototype.fixed32;
      Writer.prototype.fixed64 = function write_fixed64(value) {
        var bits2 = LongBits2.from(value);
        return this._push(writeFixed32, 4, bits2.lo)._push(writeFixed32, 4, bits2.hi);
      };
      Writer.prototype.sfixed64 = Writer.prototype.fixed64;
      Writer.prototype.float = function write_float(value) {
        return this._push(util.float.writeFloatLE, 4, value);
      };
      Writer.prototype.double = function write_double(value) {
        return this._push(util.float.writeDoubleLE, 8, value);
      };
      var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf2, pos) {
        buf2.set(val, pos);
      } : function writeBytes_for(val, buf2, pos) {
        for (var i = 0; i < val.length; ++i)
          buf2[pos + i] = val[i];
      };
      Writer.prototype.bytes = function write_bytes(value) {
        var len = value.length >>> 0;
        if (!len)
          return this._push(writeByte, 1, 0);
        if (util.isString(value)) {
          var buf2 = Writer.alloc(len = base642.length(value));
          base642.decode(value, buf2, 0);
          value = buf2;
        }
        return this.uint32(len)._push(writeBytes, len, value);
      };
      Writer.prototype.string = function write_string(value) {
        var len = utf8.length(value);
        return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
      };
      Writer.prototype.fork = function fork() {
        this.states = new State(this);
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
        return this;
      };
      Writer.prototype.reset = function reset() {
        if (this.states) {
          this.head = this.states.head;
          this.tail = this.states.tail;
          this.len = this.states.len;
          this.states = this.states.next;
        } else {
          this.head = this.tail = new Op(noop, 0, 0);
          this.len = 0;
        }
        return this;
      };
      Writer.prototype.ldelim = function ldelim() {
        var head = this.head, tail = this.tail, len = this.len;
        this.reset().uint32(len);
        if (len) {
          this.tail.next = head.next;
          this.tail = tail;
          this.len += len;
        }
        return this;
      };
      Writer.prototype.finish = function finish() {
        var head = this.head.next, buf2 = this.constructor.alloc(this.len), pos = 0;
        while (head) {
          head.fn(head.val, buf2, pos);
          pos += head.len;
          head = head.next;
        }
        return buf2;
      };
      Writer._configure = function(BufferWriter_) {
        BufferWriter = BufferWriter_;
        Writer.create = create6();
        BufferWriter._configure();
      };
    }
  });

  // ../node_modules/protobufjs/src/writer_buffer.js
  var require_writer_buffer = __commonJS({
    "../node_modules/protobufjs/src/writer_buffer.js"(exports2, module2) {
      "use strict";
      module2.exports = BufferWriter;
      var Writer = require_writer();
      (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
      var util = require_minimal();
      function BufferWriter() {
        Writer.call(this);
      }
      BufferWriter._configure = function() {
        BufferWriter.alloc = util._Buffer_allocUnsafe;
        BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf2, pos) {
          buf2.set(val, pos);
        } : function writeBytesBuffer_copy(val, buf2, pos) {
          if (val.copy)
            val.copy(buf2, pos, 0, val.length);
          else
            for (var i = 0; i < val.length; )
              buf2[pos++] = val[i++];
        };
      };
      BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
        if (util.isString(value))
          value = util._Buffer_from(value, "base64");
        var len = value.length >>> 0;
        this.uint32(len);
        if (len)
          this._push(BufferWriter.writeBytesBuffer, len, value);
        return this;
      };
      function writeStringBuffer(val, buf2, pos) {
        if (val.length < 40)
          util.utf8.write(val, buf2, pos);
        else if (buf2.utf8Write)
          buf2.utf8Write(val, pos);
        else
          buf2.write(val, pos);
      }
      BufferWriter.prototype.string = function write_string_buffer(value) {
        var len = util.Buffer.byteLength(value);
        this.uint32(len);
        if (len)
          this._push(writeStringBuffer, len, value);
        return this;
      };
      BufferWriter._configure();
    }
  });

  // ../node_modules/protobufjs/src/reader.js
  var require_reader = __commonJS({
    "../node_modules/protobufjs/src/reader.js"(exports2, module2) {
      "use strict";
      module2.exports = Reader;
      var util = require_minimal();
      var BufferReader;
      var LongBits2 = util.LongBits;
      var utf8 = util.utf8;
      function indexOutOfRange(reader, writeLength) {
        return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
      }
      function Reader(buffer2) {
        this.buf = buffer2;
        this.pos = 0;
        this.len = buffer2.length;
      }
      var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer2) {
        if (buffer2 instanceof Uint8Array || Array.isArray(buffer2))
          return new Reader(buffer2);
        throw Error("illegal buffer");
      } : function create_array2(buffer2) {
        if (Array.isArray(buffer2))
          return new Reader(buffer2);
        throw Error("illegal buffer");
      };
      var create6 = function create7() {
        return util.Buffer ? function create_buffer_setup(buffer2) {
          return (Reader.create = function create_buffer(buffer3) {
            return util.Buffer.isBuffer(buffer3) ? new BufferReader(buffer3) : create_array(buffer3);
          })(buffer2);
        } : create_array;
      };
      Reader.create = create6();
      Reader.prototype._slice = util.Array.prototype.subarray || util.Array.prototype.slice;
      Reader.prototype.uint32 = function read_uint32_setup() {
        var value = 4294967295;
        return function read_uint32() {
          value = (this.buf[this.pos] & 127) >>> 0;
          if (this.buf[this.pos++] < 128)
            return value;
          value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return value;
          value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
          if (this.buf[this.pos++] < 128)
            return value;
          value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
          if (this.buf[this.pos++] < 128)
            return value;
          value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
          if (this.buf[this.pos++] < 128)
            return value;
          if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
          }
          return value;
        };
      }();
      Reader.prototype.int32 = function read_int32() {
        return this.uint32() | 0;
      };
      Reader.prototype.sint32 = function read_sint32() {
        var value = this.uint32();
        return value >>> 1 ^ -(value & 1) | 0;
      };
      function readLongVarint() {
        var bits2 = new LongBits2(0, 0);
        var i = 0;
        if (this.len - this.pos > 4) {
          for (; i < 4; ++i) {
            bits2.lo = (bits2.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits2;
          }
          bits2.lo = (bits2.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
          bits2.hi = (bits2.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits2;
          i = 0;
        } else {
          for (; i < 3; ++i) {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
            bits2.lo = (bits2.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits2;
          }
          bits2.lo = (bits2.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
          return bits2;
        }
        if (this.len - this.pos > 4) {
          for (; i < 5; ++i) {
            bits2.hi = (bits2.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits2;
          }
        } else {
          for (; i < 5; ++i) {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
            bits2.hi = (bits2.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits2;
          }
        }
        throw Error("invalid varint encoding");
      }
      Reader.prototype.bool = function read_bool() {
        return this.uint32() !== 0;
      };
      function readFixed32_end(buf2, end) {
        return (buf2[end - 4] | buf2[end - 3] << 8 | buf2[end - 2] << 16 | buf2[end - 1] << 24) >>> 0;
      }
      Reader.prototype.fixed32 = function read_fixed32() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        return readFixed32_end(this.buf, this.pos += 4);
      };
      Reader.prototype.sfixed32 = function read_sfixed32() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        return readFixed32_end(this.buf, this.pos += 4) | 0;
      };
      function readFixed64() {
        if (this.pos + 8 > this.len)
          throw indexOutOfRange(this, 8);
        return new LongBits2(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
      }
      Reader.prototype.float = function read_float() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        var value = util.float.readFloatLE(this.buf, this.pos);
        this.pos += 4;
        return value;
      };
      Reader.prototype.double = function read_double() {
        if (this.pos + 8 > this.len)
          throw indexOutOfRange(this, 4);
        var value = util.float.readDoubleLE(this.buf, this.pos);
        this.pos += 8;
        return value;
      };
      Reader.prototype.bytes = function read_bytes() {
        var length2 = this.uint32(), start = this.pos, end = this.pos + length2;
        if (end > this.len)
          throw indexOutOfRange(this, length2);
        this.pos += length2;
        if (Array.isArray(this.buf))
          return this.buf.slice(start, end);
        return start === end ? new this.buf.constructor(0) : this._slice.call(this.buf, start, end);
      };
      Reader.prototype.string = function read_string() {
        var bytes2 = this.bytes();
        return utf8.read(bytes2, 0, bytes2.length);
      };
      Reader.prototype.skip = function skip(length2) {
        if (typeof length2 === "number") {
          if (this.pos + length2 > this.len)
            throw indexOutOfRange(this, length2);
          this.pos += length2;
        } else {
          do {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
          } while (this.buf[this.pos++] & 128);
        }
        return this;
      };
      Reader.prototype.skipType = function(wireType) {
        switch (wireType) {
          case 0:
            this.skip();
            break;
          case 1:
            this.skip(8);
            break;
          case 2:
            this.skip(this.uint32());
            break;
          case 3:
            while ((wireType = this.uint32() & 7) !== 4) {
              this.skipType(wireType);
            }
            break;
          case 5:
            this.skip(4);
            break;
          default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
        }
        return this;
      };
      Reader._configure = function(BufferReader_) {
        BufferReader = BufferReader_;
        Reader.create = create6();
        BufferReader._configure();
        var fn = util.Long ? "toLong" : "toNumber";
        util.merge(Reader.prototype, {
          int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
          },
          uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
          },
          sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
          },
          fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
          },
          sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
          }
        });
      };
    }
  });

  // ../node_modules/protobufjs/src/reader_buffer.js
  var require_reader_buffer = __commonJS({
    "../node_modules/protobufjs/src/reader_buffer.js"(exports2, module2) {
      "use strict";
      module2.exports = BufferReader;
      var Reader = require_reader();
      (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
      var util = require_minimal();
      function BufferReader(buffer2) {
        Reader.call(this, buffer2);
      }
      BufferReader._configure = function() {
        if (util.Buffer)
          BufferReader.prototype._slice = util.Buffer.prototype.slice;
      };
      BufferReader.prototype.string = function read_string_buffer() {
        var len = this.uint32();
        return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
      };
      BufferReader._configure();
    }
  });

  // ../node_modules/protobufjs/src/rpc/service.js
  var require_service = __commonJS({
    "../node_modules/protobufjs/src/rpc/service.js"(exports2, module2) {
      "use strict";
      module2.exports = Service;
      var util = require_minimal();
      (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
      function Service(rpcImpl, requestDelimited, responseDelimited) {
        if (typeof rpcImpl !== "function")
          throw TypeError("rpcImpl must be a function");
        util.EventEmitter.call(this);
        this.rpcImpl = rpcImpl;
        this.requestDelimited = Boolean(requestDelimited);
        this.responseDelimited = Boolean(responseDelimited);
      }
      Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
        if (!request)
          throw TypeError("request must be specified");
        var self2 = this;
        if (!callback)
          return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
        if (!self2.rpcImpl) {
          setTimeout(function() {
            callback(Error("already ended"));
          }, 0);
          return void 0;
        }
        try {
          return self2.rpcImpl(method, requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(), function rpcCallback(err, response) {
            if (err) {
              self2.emit("error", err, method);
              return callback(err);
            }
            if (response === null) {
              self2.end(true);
              return void 0;
            }
            if (!(response instanceof responseCtor)) {
              try {
                response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
              } catch (err2) {
                self2.emit("error", err2, method);
                return callback(err2);
              }
            }
            self2.emit("data", response, method);
            return callback(null, response);
          });
        } catch (err) {
          self2.emit("error", err, method);
          setTimeout(function() {
            callback(err);
          }, 0);
          return void 0;
        }
      };
      Service.prototype.end = function end(endedByRPC) {
        if (this.rpcImpl) {
          if (!endedByRPC)
            this.rpcImpl(null, null, null);
          this.rpcImpl = null;
          this.emit("end").off();
        }
        return this;
      };
    }
  });

  // ../node_modules/protobufjs/src/rpc.js
  var require_rpc = __commonJS({
    "../node_modules/protobufjs/src/rpc.js"(exports2) {
      "use strict";
      var rpc = exports2;
      rpc.Service = require_service();
    }
  });

  // ../node_modules/protobufjs/src/roots.js
  var require_roots = __commonJS({
    "../node_modules/protobufjs/src/roots.js"(exports2, module2) {
      "use strict";
      module2.exports = {};
    }
  });

  // ../node_modules/protobufjs/src/index-minimal.js
  var require_index_minimal = __commonJS({
    "../node_modules/protobufjs/src/index-minimal.js"(exports2) {
      "use strict";
      var protobuf = exports2;
      protobuf.build = "minimal";
      protobuf.Writer = require_writer();
      protobuf.BufferWriter = require_writer_buffer();
      protobuf.Reader = require_reader();
      protobuf.BufferReader = require_reader_buffer();
      protobuf.util = require_minimal();
      protobuf.rpc = require_rpc();
      protobuf.roots = require_roots();
      protobuf.configure = configure;
      function configure() {
        protobuf.util._configure();
        protobuf.Writer._configure(protobuf.BufferWriter);
        protobuf.Reader._configure(protobuf.BufferReader);
      }
      configure();
    }
  });

  // ../node_modules/protobufjs/minimal.js
  var require_minimal2 = __commonJS({
    "../node_modules/protobufjs/minimal.js"(exports2, module2) {
      "use strict";
      module2.exports = require_index_minimal();
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/keys.js
  var require_keys = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/keys.js"(exports2, module2) {
      "use strict";
      var $protobuf = require_minimal2();
      var $Reader = $protobuf.Reader;
      var $Writer = $protobuf.Writer;
      var $util = $protobuf.util;
      var $root = $protobuf.roots["libp2p-crypto-keys"] || ($protobuf.roots["libp2p-crypto-keys"] = {});
      $root.KeyType = function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "RSA"] = 0;
        values[valuesById[1] = "Ed25519"] = 1;
        values[valuesById[2] = "Secp256k1"] = 2;
        return values;
      }();
      $root.PublicKey = function() {
        function PublicKey2(p) {
          if (p) {
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
              if (p[ks[i]] != null)
                this[ks[i]] = p[ks[i]];
          }
        }
        PublicKey2.prototype.Type = 0;
        PublicKey2.prototype.Data = $util.newBuffer([]);
        PublicKey2.encode = function encode20(m, w) {
          if (!w)
            w = $Writer.create();
          w.uint32(8).int32(m.Type);
          w.uint32(18).bytes(m.Data);
          return w;
        };
        PublicKey2.decode = function decode21(r, l) {
          if (!(r instanceof $Reader))
            r = $Reader.create(r);
          var c = l === void 0 ? r.len : r.pos + l, m = new $root.PublicKey();
          while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
              case 1:
                m.Type = r.int32();
                break;
              case 2:
                m.Data = r.bytes();
                break;
              default:
                r.skipType(t & 7);
                break;
            }
          }
          if (!m.hasOwnProperty("Type"))
            throw $util.ProtocolError("missing required 'Type'", { instance: m });
          if (!m.hasOwnProperty("Data"))
            throw $util.ProtocolError("missing required 'Data'", { instance: m });
          return m;
        };
        PublicKey2.fromObject = function fromObject(d) {
          if (d instanceof $root.PublicKey)
            return d;
          var m = new $root.PublicKey();
          switch (d.Type) {
            case "RSA":
            case 0:
              m.Type = 0;
              break;
            case "Ed25519":
            case 1:
              m.Type = 1;
              break;
            case "Secp256k1":
            case 2:
              m.Type = 2;
              break;
          }
          if (d.Data != null) {
            if (typeof d.Data === "string")
              $util.base64.decode(d.Data, m.Data = $util.newBuffer($util.base64.length(d.Data)), 0);
            else if (d.Data.length)
              m.Data = d.Data;
          }
          return m;
        };
        PublicKey2.toObject = function toObject(m, o) {
          if (!o)
            o = {};
          var d = {};
          if (o.defaults) {
            d.Type = o.enums === String ? "RSA" : 0;
            if (o.bytes === String)
              d.Data = "";
            else {
              d.Data = [];
              if (o.bytes !== Array)
                d.Data = $util.newBuffer(d.Data);
            }
          }
          if (m.Type != null && m.hasOwnProperty("Type")) {
            d.Type = o.enums === String ? $root.KeyType[m.Type] : m.Type;
          }
          if (m.Data != null && m.hasOwnProperty("Data")) {
            d.Data = o.bytes === String ? $util.base64.encode(m.Data, 0, m.Data.length) : o.bytes === Array ? Array.prototype.slice.call(m.Data) : m.Data;
          }
          return d;
        };
        PublicKey2.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return PublicKey2;
      }();
      $root.PrivateKey = function() {
        function PrivateKey2(p) {
          if (p) {
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
              if (p[ks[i]] != null)
                this[ks[i]] = p[ks[i]];
          }
        }
        PrivateKey2.prototype.Type = 0;
        PrivateKey2.prototype.Data = $util.newBuffer([]);
        PrivateKey2.encode = function encode20(m, w) {
          if (!w)
            w = $Writer.create();
          w.uint32(8).int32(m.Type);
          w.uint32(18).bytes(m.Data);
          return w;
        };
        PrivateKey2.decode = function decode21(r, l) {
          if (!(r instanceof $Reader))
            r = $Reader.create(r);
          var c = l === void 0 ? r.len : r.pos + l, m = new $root.PrivateKey();
          while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
              case 1:
                m.Type = r.int32();
                break;
              case 2:
                m.Data = r.bytes();
                break;
              default:
                r.skipType(t & 7);
                break;
            }
          }
          if (!m.hasOwnProperty("Type"))
            throw $util.ProtocolError("missing required 'Type'", { instance: m });
          if (!m.hasOwnProperty("Data"))
            throw $util.ProtocolError("missing required 'Data'", { instance: m });
          return m;
        };
        PrivateKey2.fromObject = function fromObject(d) {
          if (d instanceof $root.PrivateKey)
            return d;
          var m = new $root.PrivateKey();
          switch (d.Type) {
            case "RSA":
            case 0:
              m.Type = 0;
              break;
            case "Ed25519":
            case 1:
              m.Type = 1;
              break;
            case "Secp256k1":
            case 2:
              m.Type = 2;
              break;
          }
          if (d.Data != null) {
            if (typeof d.Data === "string")
              $util.base64.decode(d.Data, m.Data = $util.newBuffer($util.base64.length(d.Data)), 0);
            else if (d.Data.length)
              m.Data = d.Data;
          }
          return m;
        };
        PrivateKey2.toObject = function toObject(m, o) {
          if (!o)
            o = {};
          var d = {};
          if (o.defaults) {
            d.Type = o.enums === String ? "RSA" : 0;
            if (o.bytes === String)
              d.Data = "";
            else {
              d.Data = [];
              if (o.bytes !== Array)
                d.Data = $util.newBuffer(d.Data);
            }
          }
          if (m.Type != null && m.hasOwnProperty("Type")) {
            d.Type = o.enums === String ? $root.KeyType[m.Type] : m.Type;
          }
          if (m.Data != null && m.hasOwnProperty("Data")) {
            d.Data = o.bytes === String ? $util.base64.encode(m.Data, 0, m.Data.length) : o.bytes === Array ? Array.prototype.slice.call(m.Data) : m.Data;
          }
          return d;
        };
        PrivateKey2.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return PrivateKey2;
      }();
      module2.exports = $root;
    }
  });

  // ../node_modules/libp2p-crypto/src/ciphers/aes-gcm.browser.js
  var require_aes_gcm_browser = __commonJS({
    "../node_modules/libp2p-crypto/src/ciphers/aes-gcm.browser.js"(exports2, module2) {
      "use strict";
      var { concat: concat3 } = (init_concat(), __toCommonJS(concat_exports));
      var { fromString: fromString4 } = (init_from_string(), __toCommonJS(from_string_exports));
      var webcrypto = require_webcrypto();
      function create6({
        algorithm = "AES-GCM",
        nonceLength = 12,
        keyLength = 16,
        digest: digest2 = "SHA-256",
        saltLength = 16,
        iterations = 32767
      } = {}) {
        const crypto4 = webcrypto.get();
        keyLength *= 8;
        async function encrypt2(data, password) {
          const salt = crypto4.getRandomValues(new Uint8Array(saltLength));
          const nonce = crypto4.getRandomValues(new Uint8Array(nonceLength));
          const aesGcm = { name: algorithm, iv: nonce };
          const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
          const rawKey = await crypto4.subtle.importKey("raw", fromString4(password), { name: "PBKDF2" }, false, ["deriveKey", "deriveBits"]);
          const cryptoKey = await crypto4.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["encrypt"]);
          const ciphertext = await crypto4.subtle.encrypt(aesGcm, cryptoKey, data);
          return concat3([salt, aesGcm.iv, new Uint8Array(ciphertext)]);
        }
        async function decrypt2(data, password) {
          const salt = data.slice(0, saltLength);
          const nonce = data.slice(saltLength, saltLength + nonceLength);
          const ciphertext = data.slice(saltLength + nonceLength);
          const aesGcm = { name: algorithm, iv: nonce };
          const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
          const rawKey = await crypto4.subtle.importKey("raw", fromString4(password), { name: "PBKDF2" }, false, ["deriveKey", "deriveBits"]);
          const cryptoKey = await crypto4.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["decrypt"]);
          const plaintext = await crypto4.subtle.decrypt(aesGcm, cryptoKey, ciphertext);
          return new Uint8Array(plaintext);
        }
        return {
          encrypt: encrypt2,
          decrypt: decrypt2
        };
      }
      module2.exports = {
        create: create6
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/importer.js
  var require_importer = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/importer.js"(exports2, module2) {
      "use strict";
      var { base64: base642 } = (init_base64(), __toCommonJS(base64_exports));
      var ciphers = require_aes_gcm_browser();
      module2.exports = {
        import: async function(privateKey, password) {
          const encryptedKey = base642.decode(privateKey);
          const cipher = ciphers.create();
          return await cipher.decrypt(encryptedKey, password);
        }
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/random-bytes.js
  var require_random_bytes = __commonJS({
    "../node_modules/libp2p-crypto/src/random-bytes.js"(exports2, module2) {
      "use strict";
      var randomBytes2 = require_random_browser();
      var errcode12 = require_err_code();
      module2.exports = function(length2) {
        if (isNaN(length2) || length2 <= 0) {
          throw errcode12(new Error("random bytes length must be a Number bigger than 0"), "ERR_INVALID_LENGTH");
        }
        return randomBytes2(length2);
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/util.js
  var require_util2 = __commonJS({
    "../node_modules/libp2p-crypto/src/util.js"(exports2) {
      "use strict";
      require_util();
      require_jsbn();
      var forge6 = require_forge();
      var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
      var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
      var { concat: uint8ArrayConcat } = (init_concat(), __toCommonJS(concat_exports));
      exports2.bigIntegerToUintBase64url = (num, len) => {
        let buf2 = Uint8Array.from(num.abs().toByteArray());
        buf2 = buf2[0] === 0 ? buf2.slice(1) : buf2;
        if (len != null) {
          if (buf2.length > len)
            throw new Error("byte array longer than desired length");
          buf2 = uint8ArrayConcat([new Uint8Array(len - buf2.length), buf2]);
        }
        return uint8ArrayToString(buf2, "base64url");
      };
      exports2.base64urlToBigInteger = (str) => {
        const buf2 = exports2.base64urlToBuffer(str);
        return new forge6.jsbn.BigInteger(uint8ArrayToString(buf2, "base16"), 16);
      };
      exports2.base64urlToBuffer = (str, len) => {
        let buf2 = uint8ArrayFromString(str, "base64urlpad");
        if (len != null) {
          if (buf2.length > len)
            throw new Error("byte array longer than desired length");
          buf2 = uint8ArrayConcat([new Uint8Array(len - buf2.length), buf2]);
        }
        return buf2;
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/rsa-utils.js
  var require_rsa_utils = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/rsa-utils.js"(exports2) {
      "use strict";
      require_asn1();
      require_rsa();
      var forge6 = require_forge();
      var { bigIntegerToUintBase64url: bigIntegerToUintBase64url2, base64urlToBigInteger: base64urlToBigInteger2 } = require_util2();
      var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
      var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
      exports2.pkcs1ToJwk = function(bytes2) {
        const asn1 = forge6.asn1.fromDer(uint8ArrayToString(bytes2, "ascii"));
        const privateKey = forge6.pki.privateKeyFromAsn1(asn1);
        return {
          kty: "RSA",
          n: bigIntegerToUintBase64url2(privateKey.n),
          e: bigIntegerToUintBase64url2(privateKey.e),
          d: bigIntegerToUintBase64url2(privateKey.d),
          p: bigIntegerToUintBase64url2(privateKey.p),
          q: bigIntegerToUintBase64url2(privateKey.q),
          dp: bigIntegerToUintBase64url2(privateKey.dP),
          dq: bigIntegerToUintBase64url2(privateKey.dQ),
          qi: bigIntegerToUintBase64url2(privateKey.qInv),
          alg: "RS256",
          kid: "2011-04-29"
        };
      };
      exports2.jwkToPkcs1 = function(jwk) {
        const asn1 = forge6.pki.privateKeyToAsn1({
          n: base64urlToBigInteger2(jwk.n),
          e: base64urlToBigInteger2(jwk.e),
          d: base64urlToBigInteger2(jwk.d),
          p: base64urlToBigInteger2(jwk.p),
          q: base64urlToBigInteger2(jwk.q),
          dP: base64urlToBigInteger2(jwk.dp),
          dQ: base64urlToBigInteger2(jwk.dq),
          qInv: base64urlToBigInteger2(jwk.qi)
        });
        return uint8ArrayFromString(forge6.asn1.toDer(asn1).getBytes(), "ascii");
      };
      exports2.pkixToJwk = function(bytes2) {
        const asn1 = forge6.asn1.fromDer(uint8ArrayToString(bytes2, "ascii"));
        const publicKey = forge6.pki.publicKeyFromAsn1(asn1);
        return {
          kty: "RSA",
          n: bigIntegerToUintBase64url2(publicKey.n),
          e: bigIntegerToUintBase64url2(publicKey.e),
          alg: "RS256",
          kid: "2011-04-29"
        };
      };
      exports2.jwkToPkix = function(jwk) {
        const asn1 = forge6.pki.publicKeyToAsn1({
          n: base64urlToBigInteger2(jwk.n),
          e: base64urlToBigInteger2(jwk.e)
        });
        return uint8ArrayFromString(forge6.asn1.toDer(asn1).getBytes(), "ascii");
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/jwk2pem.js
  var require_jwk2pem = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/jwk2pem.js"(exports2, module2) {
      "use strict";
      require_rsa();
      var forge6 = require_forge();
      var { base64urlToBigInteger: base64urlToBigInteger2 } = require_util2();
      function convert2(key, types) {
        return types.map((t) => base64urlToBigInteger2(key[t]));
      }
      function jwk2priv2(key) {
        return forge6.pki.setRsaPrivateKey(...convert2(key, ["n", "e", "d", "p", "q", "dp", "dq", "qi"]));
      }
      function jwk2pub2(key) {
        return forge6.pki.setRsaPublicKey(...convert2(key, ["n", "e"]));
      }
      module2.exports = {
        jwk2pub: jwk2pub2,
        jwk2priv: jwk2priv2
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/rsa-browser.js
  var require_rsa_browser = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/rsa-browser.js"(exports2) {
      "use strict";
      var webcrypto = require_webcrypto();
      var randomBytes2 = require_random_bytes();
      var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
      var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
      exports2.utils = require_rsa_utils();
      exports2.generateKey = async function(bits2) {
        const pair = await webcrypto.get().subtle.generateKey({
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: bits2,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: { name: "SHA-256" }
        }, true, ["sign", "verify"]);
        const keys2 = await exportKey2(pair);
        return {
          privateKey: keys2[0],
          publicKey: keys2[1]
        };
      };
      exports2.unmarshalPrivateKey = async function(key) {
        const privateKey = await webcrypto.get().subtle.importKey("jwk", key, {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" }
        }, true, ["sign"]);
        const pair = [
          privateKey,
          await derivePublicFromPrivate2(key)
        ];
        const keys2 = await exportKey2({
          privateKey: pair[0],
          publicKey: pair[1]
        });
        return {
          privateKey: keys2[0],
          publicKey: keys2[1]
        };
      };
      exports2.getRandomValues = randomBytes2;
      exports2.hashAndSign = async function(key, msg) {
        const privateKey = await webcrypto.get().subtle.importKey("jwk", key, {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" }
        }, false, ["sign"]);
        const sig = await webcrypto.get().subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, privateKey, Uint8Array.from(msg));
        return new Uint8Array(sig, sig.byteOffset, sig.byteLength);
      };
      exports2.hashAndVerify = async function(key, sig, msg) {
        const publicKey = await webcrypto.get().subtle.importKey("jwk", key, {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" }
        }, false, ["verify"]);
        return webcrypto.get().subtle.verify({ name: "RSASSA-PKCS1-v1_5" }, publicKey, sig, msg);
      };
      function exportKey2(pair) {
        return Promise.all([
          webcrypto.get().subtle.exportKey("jwk", pair.privateKey),
          webcrypto.get().subtle.exportKey("jwk", pair.publicKey)
        ]);
      }
      function derivePublicFromPrivate2(jwKey) {
        return webcrypto.get().subtle.importKey("jwk", {
          kty: jwKey.kty,
          n: jwKey.n,
          e: jwKey.e
        }, {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" }
        }, true, ["verify"]);
      }
      var { jwk2pub: jwk2pub2, jwk2priv: jwk2priv2 } = require_jwk2pem();
      function convertKey2(key, pub, msg, handle) {
        const fkey = pub ? jwk2pub2(key) : jwk2priv2(key);
        const fmsg = uint8ArrayToString(Uint8Array.from(msg), "ascii");
        const fomsg = handle(fmsg, fkey);
        return uint8ArrayFromString(fomsg, "ascii");
      }
      exports2.encrypt = function(key, msg) {
        return convertKey2(key, true, msg, (msg2, key2) => key2.encrypt(msg2));
      };
      exports2.decrypt = function(key, msg) {
        return convertKey2(key, false, msg, (msg2, key2) => key2.decrypt(msg2));
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/exporter.js
  var require_exporter = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/exporter.js"(exports2, module2) {
      "use strict";
      var { base64: base642 } = (init_base64(), __toCommonJS(base64_exports));
      var ciphers = require_aes_gcm_browser();
      module2.exports = {
        export: async function(privateKey, password) {
          const cipher = ciphers.create();
          const encryptedKey = await cipher.encrypt(privateKey, password);
          return base642.encode(encryptedKey);
        }
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/rsa-class.js
  var require_rsa_class = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/rsa-class.js"(exports2, module2) {
      "use strict";
      var { sha256: sha2562 } = (init_sha2_browser(), __toCommonJS(sha2_browser_exports));
      var errcode12 = require_err_code();
      var { equals: uint8ArrayEquals } = (init_equals(), __toCommonJS(equals_exports));
      var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
      require_sha512();
      var forge6 = require_forge();
      var crypto4 = require_rsa_browser();
      var pbm = require_keys();
      var exporter2 = require_exporter();
      var RsaPublicKey2 = class {
        constructor(key) {
          this._key = key;
        }
        async verify(data, sig) {
          return crypto4.hashAndVerify(this._key, sig, data);
        }
        marshal() {
          return crypto4.utils.jwkToPkix(this._key);
        }
        get bytes() {
          return pbm.PublicKey.encode({
            Type: pbm.KeyType.RSA,
            Data: this.marshal()
          }).finish();
        }
        encrypt(bytes2) {
          return crypto4.encrypt(this._key, bytes2);
        }
        equals(key) {
          return uint8ArrayEquals(this.bytes, key.bytes);
        }
        async hash() {
          const { bytes: bytes2 } = await sha2562.digest(this.bytes);
          return bytes2;
        }
      };
      var RsaPrivateKey2 = class {
        constructor(key, publicKey) {
          this._key = key;
          this._publicKey = publicKey;
        }
        genSecret() {
          return crypto4.getRandomValues(16);
        }
        async sign(message2) {
          return crypto4.hashAndSign(this._key, message2);
        }
        get public() {
          if (!this._publicKey) {
            throw errcode12(new Error("public key not provided"), "ERR_PUBKEY_NOT_PROVIDED");
          }
          return new RsaPublicKey2(this._publicKey);
        }
        decrypt(bytes2) {
          return crypto4.decrypt(this._key, bytes2);
        }
        marshal() {
          return crypto4.utils.jwkToPkcs1(this._key);
        }
        get bytes() {
          return pbm.PrivateKey.encode({
            Type: pbm.KeyType.RSA,
            Data: this.marshal()
          }).finish();
        }
        equals(key) {
          return uint8ArrayEquals(this.bytes, key.bytes);
        }
        async hash() {
          const { bytes: bytes2 } = await sha2562.digest(this.bytes);
          return bytes2;
        }
        async id() {
          const hash = await this.public.hash();
          return uint8ArrayToString(hash, "base58btc");
        }
        async export(password, format = "pkcs-8") {
          if (format === "pkcs-8") {
            const buffer2 = new forge6.util.ByteBuffer(this.marshal());
            const asn1 = forge6.asn1.fromDer(buffer2);
            const privateKey = forge6.pki.privateKeyFromAsn1(asn1);
            const options = {
              algorithm: "aes256",
              count: 1e4,
              saltSize: 128 / 8,
              prfAlgorithm: "sha512"
            };
            return forge6.pki.encryptRsaPrivateKey(privateKey, password, options);
          } else if (format === "libp2p-key") {
            return exporter2.export(this.bytes, password);
          } else {
            throw errcode12(new Error(`export format '${format}' is not supported`), "ERR_INVALID_EXPORT_FORMAT");
          }
        }
      };
      async function unmarshalRsaPrivateKey2(bytes2) {
        const jwk = crypto4.utils.pkcs1ToJwk(bytes2);
        const keys2 = await crypto4.unmarshalPrivateKey(jwk);
        return new RsaPrivateKey2(keys2.privateKey, keys2.publicKey);
      }
      function unmarshalRsaPublicKey2(bytes2) {
        const jwk = crypto4.utils.pkixToJwk(bytes2);
        return new RsaPublicKey2(jwk);
      }
      async function fromJwk2(jwk) {
        const keys2 = await crypto4.unmarshalPrivateKey(jwk);
        return new RsaPrivateKey2(keys2.privateKey, keys2.publicKey);
      }
      async function generateKeyPair4(bits2) {
        const keys2 = await crypto4.generateKey(bits2);
        return new RsaPrivateKey2(keys2.privateKey, keys2.publicKey);
      }
      module2.exports = {
        RsaPublicKey: RsaPublicKey2,
        RsaPrivateKey: RsaPrivateKey2,
        unmarshalRsaPublicKey: unmarshalRsaPublicKey2,
        unmarshalRsaPrivateKey: unmarshalRsaPrivateKey2,
        generateKeyPair: generateKeyPair4,
        fromJwk: fromJwk2
      };
    }
  });

  // ../node_modules/@noble/ed25519/lib/index.js
  var require_lib = __commonJS({
    "../node_modules/@noble/ed25519/lib/index.js"(exports2) {
      "use strict";
      var __importDefault = exports2 && exports2.__importDefault || function(mod5) {
        return mod5 && mod5.__esModule ? mod5 : { "default": mod5 };
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.utils = exports2.curve25519 = exports2.getSharedSecret = exports2.verify = exports2.sign = exports2.getPublicKey = exports2.Signature = exports2.Point = exports2.RistrettoPoint = exports2.ExtendedPoint = exports2.CURVE = void 0;
      var crypto_1 = __importDefault(require_crypto());
      var _0n3 = BigInt(0);
      var _1n3 = BigInt(1);
      var _2n3 = BigInt(2);
      var _255n2 = BigInt(255);
      var CURVE_ORDER2 = _2n3 ** BigInt(252) + BigInt("27742317777372353535851937790883648493");
      var CURVE3 = {
        a: BigInt(-1),
        d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
        P: _2n3 ** _255n2 - BigInt(19),
        l: CURVE_ORDER2,
        n: CURVE_ORDER2,
        h: BigInt(8),
        Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
        Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960")
      };
      exports2.CURVE = CURVE3;
      var MAX_256B2 = _2n3 ** BigInt(256);
      var SQRT_M12 = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
      var SQRT_D2 = BigInt("6853475219497561581579357271197624642482790079785650197046958215289687604742");
      var SQRT_AD_MINUS_ONE2 = BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
      var INVSQRT_A_MINUS_D2 = BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
      var ONE_MINUS_D_SQ2 = BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
      var D_MINUS_ONE_SQ2 = BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
      var ExtendedPoint2 = class {
        constructor(x, y, z, t) {
          this.x = x;
          this.y = y;
          this.z = z;
          this.t = t;
        }
        static fromAffine(p) {
          if (!(p instanceof Point3)) {
            throw new TypeError("ExtendedPoint#fromAffine: expected Point");
          }
          if (p.equals(Point3.ZERO))
            return ExtendedPoint2.ZERO;
          return new ExtendedPoint2(p.x, p.y, _1n3, mod4(p.x * p.y));
        }
        static toAffineBatch(points) {
          const toInv = invertBatch3(points.map((p) => p.z));
          return points.map((p, i) => p.toAffine(toInv[i]));
        }
        static normalizeZ(points) {
          return this.toAffineBatch(points).map(this.fromAffine);
        }
        equals(other) {
          assertExtPoint2(other);
          const { x: X1, y: Y1, z: Z1 } = this;
          const { x: X2, y: Y2, z: Z2 } = other;
          const X1Z2 = mod4(X1 * Z2);
          const X2Z1 = mod4(X2 * Z1);
          const Y1Z2 = mod4(Y1 * Z2);
          const Y2Z1 = mod4(Y2 * Z1);
          return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
        }
        negate() {
          return new ExtendedPoint2(mod4(-this.x), this.y, this.z, mod4(-this.t));
        }
        double() {
          const { x: X1, y: Y1, z: Z1 } = this;
          const { a } = CURVE3;
          const A = mod4(X1 ** _2n3);
          const B = mod4(Y1 ** _2n3);
          const C = mod4(_2n3 * mod4(Z1 ** _2n3));
          const D = mod4(a * A);
          const E = mod4(mod4((X1 + Y1) ** _2n3) - A - B);
          const G = D + B;
          const F = G - C;
          const H = D - B;
          const X3 = mod4(E * F);
          const Y3 = mod4(G * H);
          const T3 = mod4(E * H);
          const Z3 = mod4(F * G);
          return new ExtendedPoint2(X3, Y3, Z3, T3);
        }
        add(other) {
          assertExtPoint2(other);
          const { x: X1, y: Y1, z: Z1, t: T1 } = this;
          const { x: X2, y: Y2, z: Z2, t: T2 } = other;
          const A = mod4((Y1 - X1) * (Y2 + X2));
          const B = mod4((Y1 + X1) * (Y2 - X2));
          const F = mod4(B - A);
          if (F === _0n3)
            return this.double();
          const C = mod4(Z1 * _2n3 * T2);
          const D = mod4(T1 * _2n3 * Z2);
          const E = D + C;
          const G = B + A;
          const H = D - C;
          const X3 = mod4(E * F);
          const Y3 = mod4(G * H);
          const T3 = mod4(E * H);
          const Z3 = mod4(F * G);
          return new ExtendedPoint2(X3, Y3, Z3, T3);
        }
        subtract(other) {
          return this.add(other.negate());
        }
        precomputeWindow(W) {
          const windows = 1 + 256 / W;
          const points = [];
          let p = this;
          let base3 = p;
          for (let window2 = 0; window2 < windows; window2++) {
            base3 = p;
            points.push(base3);
            for (let i = 1; i < 2 ** (W - 1); i++) {
              base3 = base3.add(p);
              points.push(base3);
            }
            p = base3.double();
          }
          return points;
        }
        wNAF(n, affinePoint) {
          if (!affinePoint && this.equals(ExtendedPoint2.BASE))
            affinePoint = Point3.BASE;
          const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
          if (256 % W) {
            throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
          }
          let precomputes = affinePoint && pointPrecomputes3.get(affinePoint);
          if (!precomputes) {
            precomputes = this.precomputeWindow(W);
            if (affinePoint && W !== 1) {
              precomputes = ExtendedPoint2.normalizeZ(precomputes);
              pointPrecomputes3.set(affinePoint, precomputes);
            }
          }
          let p = ExtendedPoint2.ZERO;
          let f = ExtendedPoint2.ZERO;
          const windows = 1 + 256 / W;
          const windowSize = 2 ** (W - 1);
          const mask = BigInt(2 ** W - 1);
          const maxNumber = 2 ** W;
          const shiftBy = BigInt(W);
          for (let window2 = 0; window2 < windows; window2++) {
            const offset = window2 * windowSize;
            let wbits = Number(n & mask);
            n >>= shiftBy;
            if (wbits > windowSize) {
              wbits -= maxNumber;
              n += _1n3;
            }
            if (wbits === 0) {
              let pr = precomputes[offset];
              if (window2 % 2)
                pr = pr.negate();
              f = f.add(pr);
            } else {
              let cached = precomputes[offset + Math.abs(wbits) - 1];
              if (wbits < 0)
                cached = cached.negate();
              p = p.add(cached);
            }
          }
          return ExtendedPoint2.normalizeZ([p, f])[0];
        }
        multiply(scalar, affinePoint) {
          return this.wNAF(normalizeScalar3(scalar, CURVE3.l), affinePoint);
        }
        multiplyUnsafe(scalar) {
          let n = normalizeScalar3(scalar, CURVE3.l, false);
          const G = ExtendedPoint2.BASE;
          const P0 = ExtendedPoint2.ZERO;
          if (n === _0n3)
            return P0;
          if (this.equals(P0) || n === _1n3)
            return this;
          if (this.equals(G))
            return this.wNAF(n);
          let p = P0;
          let d = this;
          while (n > _0n3) {
            if (n & _1n3)
              p = p.add(d);
            d = d.double();
            n >>= _1n3;
          }
          return p;
        }
        isSmallOrder() {
          return this.multiplyUnsafe(CURVE3.h).equals(ExtendedPoint2.ZERO);
        }
        isTorsionFree() {
          return this.multiplyUnsafe(CURVE3.l).equals(ExtendedPoint2.ZERO);
        }
        toAffine(invZ = invert3(this.z)) {
          const { x, y, z } = this;
          const ax = mod4(x * invZ);
          const ay = mod4(y * invZ);
          const zz = mod4(z * invZ);
          if (zz !== _1n3)
            throw new Error("invZ was invalid");
          return new Point3(ax, ay);
        }
        fromRistrettoBytes() {
          legacyRist2();
        }
        toRistrettoBytes() {
          legacyRist2();
        }
        fromRistrettoHash() {
          legacyRist2();
        }
      };
      exports2.ExtendedPoint = ExtendedPoint2;
      ExtendedPoint2.BASE = new ExtendedPoint2(CURVE3.Gx, CURVE3.Gy, _1n3, mod4(CURVE3.Gx * CURVE3.Gy));
      ExtendedPoint2.ZERO = new ExtendedPoint2(_0n3, _1n3, _1n3, _0n3);
      function assertExtPoint2(other) {
        if (!(other instanceof ExtendedPoint2))
          throw new TypeError("ExtendedPoint expected");
      }
      function assertRstPoint2(other) {
        if (!(other instanceof RistrettoPoint2))
          throw new TypeError("RistrettoPoint expected");
      }
      function legacyRist2() {
        throw new Error("Legacy method: switch to RistrettoPoint");
      }
      var RistrettoPoint2 = class {
        constructor(ep) {
          this.ep = ep;
        }
        static calcElligatorRistrettoMap(r0) {
          const { d } = CURVE3;
          const r = mod4(SQRT_M12 * r0 * r0);
          const Ns = mod4((r + _1n3) * ONE_MINUS_D_SQ2);
          let c = BigInt(-1);
          const D = mod4((c - d * r) * mod4(r + d));
          let { isValid: Ns_D_is_sq, value: s } = uvRatio2(Ns, D);
          let s_ = mod4(s * r0);
          if (!edIsNegative2(s_))
            s_ = mod4(-s_);
          if (!Ns_D_is_sq)
            s = s_;
          if (!Ns_D_is_sq)
            c = r;
          const Nt = mod4(c * (r - _1n3) * D_MINUS_ONE_SQ2 - D);
          const s2 = s * s;
          const W0 = mod4((s + s) * D);
          const W1 = mod4(Nt * SQRT_AD_MINUS_ONE2);
          const W2 = mod4(_1n3 - s2);
          const W3 = mod4(_1n3 + s2);
          return new ExtendedPoint2(mod4(W0 * W3), mod4(W2 * W1), mod4(W1 * W3), mod4(W0 * W2));
        }
        static hashToCurve(hex) {
          hex = ensureBytes3(hex, 64);
          const r1 = bytes255ToNumberLE2(hex.slice(0, 32));
          const R1 = this.calcElligatorRistrettoMap(r1);
          const r2 = bytes255ToNumberLE2(hex.slice(32, 64));
          const R2 = this.calcElligatorRistrettoMap(r2);
          return new RistrettoPoint2(R1.add(R2));
        }
        static fromHex(hex) {
          hex = ensureBytes3(hex, 32);
          const { a, d } = CURVE3;
          const emsg = "RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint";
          const s = bytes255ToNumberLE2(hex);
          if (!equalBytes2(numberTo32BytesLE2(s), hex) || edIsNegative2(s))
            throw new Error(emsg);
          const s2 = mod4(s * s);
          const u1 = mod4(_1n3 + a * s2);
          const u2 = mod4(_1n3 - a * s2);
          const u1_2 = mod4(u1 * u1);
          const u2_2 = mod4(u2 * u2);
          const v = mod4(a * d * u1_2 - u2_2);
          const { isValid, value: I } = invertSqrt2(mod4(v * u2_2));
          const Dx = mod4(I * u2);
          const Dy = mod4(I * Dx * v);
          let x = mod4((s + s) * Dx);
          if (edIsNegative2(x))
            x = mod4(-x);
          const y = mod4(u1 * Dy);
          const t = mod4(x * y);
          if (!isValid || edIsNegative2(t) || y === _0n3)
            throw new Error(emsg);
          return new RistrettoPoint2(new ExtendedPoint2(x, y, _1n3, t));
        }
        toRawBytes() {
          let { x, y, z, t } = this.ep;
          const u1 = mod4(mod4(z + y) * mod4(z - y));
          const u2 = mod4(x * y);
          const { value: invsqrt } = invertSqrt2(mod4(u1 * u2 ** _2n3));
          const D1 = mod4(invsqrt * u1);
          const D2 = mod4(invsqrt * u2);
          const zInv = mod4(D1 * D2 * t);
          let D;
          if (edIsNegative2(t * zInv)) {
            let _x = mod4(y * SQRT_M12);
            let _y = mod4(x * SQRT_M12);
            x = _x;
            y = _y;
            D = mod4(D1 * INVSQRT_A_MINUS_D2);
          } else {
            D = D2;
          }
          if (edIsNegative2(x * zInv))
            y = mod4(-y);
          let s = mod4((z - y) * D);
          if (edIsNegative2(s))
            s = mod4(-s);
          return numberTo32BytesLE2(s);
        }
        toHex() {
          return bytesToHex3(this.toRawBytes());
        }
        toString() {
          return this.toHex();
        }
        equals(other) {
          assertRstPoint2(other);
          const a = this.ep;
          const b = other.ep;
          const one = mod4(a.x * b.y) === mod4(a.y * b.x);
          const two = mod4(a.y * b.y) === mod4(a.x * b.x);
          return one || two;
        }
        add(other) {
          assertRstPoint2(other);
          return new RistrettoPoint2(this.ep.add(other.ep));
        }
        subtract(other) {
          assertRstPoint2(other);
          return new RistrettoPoint2(this.ep.subtract(other.ep));
        }
        multiply(scalar) {
          return new RistrettoPoint2(this.ep.multiply(scalar));
        }
        multiplyUnsafe(scalar) {
          return new RistrettoPoint2(this.ep.multiplyUnsafe(scalar));
        }
      };
      exports2.RistrettoPoint = RistrettoPoint2;
      RistrettoPoint2.BASE = new RistrettoPoint2(ExtendedPoint2.BASE);
      RistrettoPoint2.ZERO = new RistrettoPoint2(ExtendedPoint2.ZERO);
      var pointPrecomputes3 = /* @__PURE__ */ new WeakMap();
      var Point3 = class {
        constructor(x, y) {
          this.x = x;
          this.y = y;
        }
        _setWindowSize(windowSize) {
          this._WINDOW_SIZE = windowSize;
          pointPrecomputes3.delete(this);
        }
        static fromHex(hex, strict = true) {
          const { d, P } = CURVE3;
          hex = ensureBytes3(hex, 32);
          const normed = hex.slice();
          normed[31] = hex[31] & ~128;
          const y = bytesToNumberLE2(normed);
          if (strict && y >= P)
            throw new Error("Expected 0 < hex < P");
          if (!strict && y >= MAX_256B2)
            throw new Error("Expected 0 < hex < 2**256");
          const y2 = mod4(y * y);
          const u = mod4(y2 - _1n3);
          const v = mod4(d * y2 + _1n3);
          let { isValid, value: x } = uvRatio2(u, v);
          if (!isValid)
            throw new Error("Point.fromHex: invalid y coordinate");
          const isXOdd = (x & _1n3) === _1n3;
          const isLastByteOdd = (hex[31] & 128) !== 0;
          if (isLastByteOdd !== isXOdd) {
            x = mod4(-x);
          }
          return new Point3(x, y);
        }
        static async fromPrivateKey(privateKey) {
          return (await getExtendedPublicKey2(privateKey)).point;
        }
        toRawBytes() {
          const bytes2 = numberTo32BytesLE2(this.y);
          bytes2[31] |= this.x & _1n3 ? 128 : 0;
          return bytes2;
        }
        toHex() {
          return bytesToHex3(this.toRawBytes());
        }
        toX25519() {
          const { y } = this;
          const u = mod4((_1n3 + y) * invert3(_1n3 - y));
          return numberTo32BytesLE2(u);
        }
        isTorsionFree() {
          return ExtendedPoint2.fromAffine(this).isTorsionFree();
        }
        equals(other) {
          return this.x === other.x && this.y === other.y;
        }
        negate() {
          return new Point3(mod4(-this.x), this.y);
        }
        add(other) {
          return ExtendedPoint2.fromAffine(this).add(ExtendedPoint2.fromAffine(other)).toAffine();
        }
        subtract(other) {
          return this.add(other.negate());
        }
        multiply(scalar) {
          return ExtendedPoint2.fromAffine(this).multiply(scalar, this).toAffine();
        }
      };
      exports2.Point = Point3;
      Point3.BASE = new Point3(CURVE3.Gx, CURVE3.Gy);
      Point3.ZERO = new Point3(_0n3, _1n3);
      var Signature3 = class {
        constructor(r, s) {
          this.r = r;
          this.s = s;
          this.assertValidity();
        }
        static fromHex(hex) {
          const bytes2 = ensureBytes3(hex, 64);
          const r = Point3.fromHex(bytes2.slice(0, 32), false);
          const s = bytesToNumberLE2(bytes2.slice(32, 64));
          return new Signature3(r, s);
        }
        assertValidity() {
          const { r, s } = this;
          if (!(r instanceof Point3))
            throw new Error("Expected Point instance");
          normalizeScalar3(s, CURVE3.l, false);
          return this;
        }
        toRawBytes() {
          const u8 = new Uint8Array(64);
          u8.set(this.r.toRawBytes());
          u8.set(numberTo32BytesLE2(this.s), 32);
          return u8;
        }
        toHex() {
          return bytesToHex3(this.toRawBytes());
        }
      };
      exports2.Signature = Signature3;
      function concatBytes3(...arrays) {
        if (!arrays.every((a) => a instanceof Uint8Array))
          throw new Error("Expected Uint8Array list");
        if (arrays.length === 1)
          return arrays[0];
        const length2 = arrays.reduce((a, arr) => a + arr.length, 0);
        const result = new Uint8Array(length2);
        for (let i = 0, pad = 0; i < arrays.length; i++) {
          const arr = arrays[i];
          result.set(arr, pad);
          pad += arr.length;
        }
        return result;
      }
      var hexes3 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
      function bytesToHex3(uint8a) {
        if (!(uint8a instanceof Uint8Array))
          throw new Error("Uint8Array expected");
        let hex = "";
        for (let i = 0; i < uint8a.length; i++) {
          hex += hexes3[uint8a[i]];
        }
        return hex;
      }
      function hexToBytes3(hex) {
        if (typeof hex !== "string") {
          throw new TypeError("hexToBytes: expected string, got " + typeof hex);
        }
        if (hex.length % 2)
          throw new Error("hexToBytes: received invalid unpadded hex");
        const array = new Uint8Array(hex.length / 2);
        for (let i = 0; i < array.length; i++) {
          const j = i * 2;
          const hexByte = hex.slice(j, j + 2);
          const byte = Number.parseInt(hexByte, 16);
          if (Number.isNaN(byte) || byte < 0)
            throw new Error("Invalid byte sequence");
          array[i] = byte;
        }
        return array;
      }
      function numberTo32BytesBE2(num) {
        const length2 = 32;
        const hex = num.toString(16).padStart(length2 * 2, "0");
        return hexToBytes3(hex);
      }
      function numberTo32BytesLE2(num) {
        return numberTo32BytesBE2(num).reverse();
      }
      function edIsNegative2(num) {
        return (mod4(num) & _1n3) === _1n3;
      }
      function bytesToNumberLE2(uint8a) {
        if (!(uint8a instanceof Uint8Array))
          throw new Error("Expected Uint8Array");
        return BigInt("0x" + bytesToHex3(Uint8Array.from(uint8a).reverse()));
      }
      function bytes255ToNumberLE2(bytes2) {
        return mod4(bytesToNumberLE2(bytes2) & _2n3 ** _255n2 - _1n3);
      }
      function mod4(a, b = CURVE3.P) {
        const res = a % b;
        return res >= _0n3 ? res : b + res;
      }
      function invert3(number, modulo = CURVE3.P) {
        if (number === _0n3 || modulo <= _0n3) {
          throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
        }
        let a = mod4(number, modulo);
        let b = modulo;
        let x = _0n3, y = _1n3, u = _1n3, v = _0n3;
        while (a !== _0n3) {
          const q = b / a;
          const r = b % a;
          const m = x - u * q;
          const n = y - v * q;
          b = a, a = r, x = u, y = v, u = m, v = n;
        }
        const gcd = b;
        if (gcd !== _1n3)
          throw new Error("invert: does not exist");
        return mod4(x, modulo);
      }
      function invertBatch3(nums, p = CURVE3.P) {
        const tmp = new Array(nums.length);
        const lastMultiplied = nums.reduce((acc, num, i) => {
          if (num === _0n3)
            return acc;
          tmp[i] = acc;
          return mod4(acc * num, p);
        }, _1n3);
        const inverted = invert3(lastMultiplied, p);
        nums.reduceRight((acc, num, i) => {
          if (num === _0n3)
            return acc;
          tmp[i] = mod4(acc * tmp[i], p);
          return mod4(acc * num, p);
        }, inverted);
        return tmp;
      }
      function pow23(x, power) {
        const { P } = CURVE3;
        let res = x;
        while (power-- > _0n3) {
          res *= res;
          res %= P;
        }
        return res;
      }
      function pow_2_252_32(x) {
        const { P } = CURVE3;
        const _5n = BigInt(5);
        const _10n = BigInt(10);
        const _20n = BigInt(20);
        const _40n = BigInt(40);
        const _80n = BigInt(80);
        const x2 = x * x % P;
        const b2 = x2 * x % P;
        const b4 = pow23(b2, _2n3) * b2 % P;
        const b5 = pow23(b4, _1n3) * x % P;
        const b10 = pow23(b5, _5n) * b5 % P;
        const b20 = pow23(b10, _10n) * b10 % P;
        const b40 = pow23(b20, _20n) * b20 % P;
        const b80 = pow23(b40, _40n) * b40 % P;
        const b160 = pow23(b80, _80n) * b80 % P;
        const b240 = pow23(b160, _80n) * b80 % P;
        const b250 = pow23(b240, _10n) * b10 % P;
        const pow_p_5_8 = pow23(b250, _2n3) * x % P;
        return { pow_p_5_8, b2 };
      }
      function uvRatio2(u, v) {
        const v3 = mod4(v * v * v);
        const v7 = mod4(v3 * v3 * v);
        const pow = pow_2_252_32(u * v7).pow_p_5_8;
        let x = mod4(u * v3 * pow);
        const vx2 = mod4(v * x * x);
        const root1 = x;
        const root2 = mod4(x * SQRT_M12);
        const useRoot1 = vx2 === u;
        const useRoot2 = vx2 === mod4(-u);
        const noRoot = vx2 === mod4(-u * SQRT_M12);
        if (useRoot1)
          x = root1;
        if (useRoot2 || noRoot)
          x = root2;
        if (edIsNegative2(x))
          x = mod4(-x);
        return { isValid: useRoot1 || useRoot2, value: x };
      }
      function invertSqrt2(number) {
        return uvRatio2(_1n3, number);
      }
      async function sha512ModqLE2(...args) {
        const hash = await exports2.utils.sha512(concatBytes3(...args));
        const value = bytesToNumberLE2(hash);
        return mod4(value, CURVE3.l);
      }
      function equalBytes2(b1, b2) {
        if (b1.length !== b2.length) {
          return false;
        }
        for (let i = 0; i < b1.length; i++) {
          if (b1[i] !== b2[i]) {
            return false;
          }
        }
        return true;
      }
      function ensureBytes3(hex, expectedLength) {
        const bytes2 = hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes3(hex);
        if (typeof expectedLength === "number" && bytes2.length !== expectedLength)
          throw new Error(`Expected ${expectedLength} bytes`);
        return bytes2;
      }
      function normalizeScalar3(num, max, strict = true) {
        if (!max)
          throw new TypeError("Specify max value");
        if (typeof num === "number" && Number.isSafeInteger(num))
          num = BigInt(num);
        if (typeof num === "bigint" && num < max) {
          if (strict) {
            if (_0n3 < num)
              return num;
          } else {
            if (_0n3 <= num)
              return num;
          }
        }
        throw new TypeError("Expected valid scalar: 0 < scalar < max");
      }
      function adjustBytes255192(bytes2) {
        bytes2[0] &= 248;
        bytes2[31] &= 127;
        bytes2[31] |= 64;
        return bytes2;
      }
      function decodeScalar25519(n) {
        return bytesToNumberLE2(adjustBytes255192(ensureBytes3(n, 32)));
      }
      async function getExtendedPublicKey2(key) {
        key = typeof key === "bigint" || typeof key === "number" ? numberTo32BytesBE2(normalizeScalar3(key, MAX_256B2)) : ensureBytes3(key);
        if (key.length !== 32)
          throw new Error(`Expected 32 bytes`);
        const hashed = await exports2.utils.sha512(key);
        const head = adjustBytes255192(hashed.slice(0, 32));
        const prefix = hashed.slice(32, 64);
        const scalar = mod4(bytesToNumberLE2(head), CURVE3.l);
        const point = Point3.BASE.multiply(scalar);
        const pointBytes = point.toRawBytes();
        return { head, prefix, scalar, point, pointBytes };
      }
      async function getPublicKey3(privateKey) {
        return (await getExtendedPublicKey2(privateKey)).pointBytes;
      }
      exports2.getPublicKey = getPublicKey3;
      async function sign4(message2, privateKey) {
        message2 = ensureBytes3(message2);
        const { prefix, scalar, pointBytes } = await getExtendedPublicKey2(privateKey);
        const r = await sha512ModqLE2(prefix, message2);
        const R = Point3.BASE.multiply(r);
        const k = await sha512ModqLE2(R.toRawBytes(), pointBytes, message2);
        const s = mod4(r + k * scalar, CURVE3.l);
        return new Signature3(R, s).toRawBytes();
      }
      exports2.sign = sign4;
      async function verify3(sig, message2, publicKey) {
        message2 = ensureBytes3(message2);
        if (!(publicKey instanceof Point3))
          publicKey = Point3.fromHex(publicKey, false);
        const { r, s } = sig instanceof Signature3 ? sig.assertValidity() : Signature3.fromHex(sig);
        const SB = ExtendedPoint2.BASE.multiplyUnsafe(s);
        const k = await sha512ModqLE2(r.toRawBytes(), publicKey.toRawBytes(), message2);
        const kA = ExtendedPoint2.fromAffine(publicKey).multiplyUnsafe(k);
        const RkA = ExtendedPoint2.fromAffine(r).add(kA);
        return RkA.subtract(SB).multiplyUnsafe(CURVE3.h).equals(ExtendedPoint2.ZERO);
      }
      exports2.verify = verify3;
      async function getSharedSecret(privateKey, publicKey) {
        const { head } = await getExtendedPublicKey2(privateKey);
        const u = Point3.fromHex(publicKey).toX25519();
        return exports2.curve25519.scalarMult(head, u);
      }
      exports2.getSharedSecret = getSharedSecret;
      Point3.BASE._setWindowSize(8);
      function cswap(swap, x_2, x_3) {
        const dummy = mod4(swap * (x_2 - x_3));
        x_2 = mod4(x_2 - dummy);
        x_3 = mod4(x_3 + dummy);
        return [x_2, x_3];
      }
      function montgomeryLadder(pointU, scalar) {
        const { P } = CURVE3;
        const u = normalizeScalar3(pointU, P);
        const k = normalizeScalar3(scalar, P);
        const a24 = BigInt(121665);
        const x_1 = u;
        let x_2 = _1n3;
        let z_2 = _0n3;
        let x_3 = u;
        let z_3 = _1n3;
        let swap = _0n3;
        let sw;
        for (let t = BigInt(255 - 1); t >= _0n3; t--) {
          const k_t = k >> t & _1n3;
          swap ^= k_t;
          sw = cswap(swap, x_2, x_3);
          x_2 = sw[0];
          x_3 = sw[1];
          sw = cswap(swap, z_2, z_3);
          z_2 = sw[0];
          z_3 = sw[1];
          swap = k_t;
          const A = x_2 + z_2;
          const AA = mod4(A * A);
          const B = x_2 - z_2;
          const BB = mod4(B * B);
          const E = AA - BB;
          const C = x_3 + z_3;
          const D = x_3 - z_3;
          const DA = mod4(D * A);
          const CB = mod4(C * B);
          x_3 = mod4((DA + CB) ** _2n3);
          z_3 = mod4(x_1 * (DA - CB) ** _2n3);
          x_2 = mod4(AA * BB);
          z_2 = mod4(E * (AA + mod4(a24 * E)));
        }
        sw = cswap(swap, x_2, x_3);
        x_2 = sw[0];
        x_3 = sw[1];
        sw = cswap(swap, z_2, z_3);
        z_2 = sw[0];
        z_3 = sw[1];
        const { pow_p_5_8, b2 } = pow_2_252_32(z_2);
        const xp2 = mod4(pow23(pow_p_5_8, BigInt(3)) * b2);
        return mod4(x_2 * xp2);
      }
      function encodeUCoordinate(u) {
        return numberTo32BytesLE2(mod4(u, CURVE3.P));
      }
      function decodeUCoordinate(uEnc) {
        const u = ensureBytes3(uEnc, 32);
        u[31] &= 127;
        return bytesToNumberLE2(u);
      }
      exports2.curve25519 = {
        BASE_POINT_U: "0900000000000000000000000000000000000000000000000000000000000000",
        scalarMult(privateKey, publicKey) {
          const u = decodeUCoordinate(publicKey);
          const p = decodeScalar25519(privateKey);
          const pu = montgomeryLadder(u, p);
          if (pu === _0n3)
            throw new Error("Invalid private or public key received");
          return encodeUCoordinate(pu);
        },
        scalarMultBase(privateKey) {
          return exports2.curve25519.scalarMult(privateKey, exports2.curve25519.BASE_POINT_U);
        }
      };
      var crypto4 = {
        node: crypto_1.default,
        web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
      };
      exports2.utils = {
        TORSION_SUBGROUP: [
          "0100000000000000000000000000000000000000000000000000000000000000",
          "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
          "0000000000000000000000000000000000000000000000000000000000000080",
          "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
          "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
          "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
        ],
        bytesToHex: bytesToHex3,
        getExtendedPublicKey: getExtendedPublicKey2,
        mod: mod4,
        invert: invert3,
        hashToPrivateScalar: (hash) => {
          hash = ensureBytes3(hash);
          if (hash.length < 40 || hash.length > 1024)
            throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
          const num = mod4(bytesToNumberLE2(hash), CURVE3.l);
          if (num === _0n3 || num === _1n3)
            throw new Error("Invalid private key");
          return num;
        },
        randomBytes: (bytesLength = 32) => {
          if (crypto4.web) {
            return crypto4.web.getRandomValues(new Uint8Array(bytesLength));
          } else if (crypto4.node) {
            const { randomBytes: randomBytes2 } = crypto4.node;
            return new Uint8Array(randomBytes2(bytesLength).buffer);
          } else {
            throw new Error("The environment doesn't have randomBytes function");
          }
        },
        randomPrivateKey: () => {
          return exports2.utils.randomBytes(32);
        },
        sha512: async (message2) => {
          if (crypto4.web) {
            const buffer2 = await crypto4.web.subtle.digest("SHA-512", message2.buffer);
            return new Uint8Array(buffer2);
          } else if (crypto4.node) {
            return Uint8Array.from(crypto4.node.createHash("sha512").update(message2).digest());
          } else {
            throw new Error("The environment doesn't have sha512 function");
          }
        },
        precompute(windowSize = 8, point = Point3.BASE) {
          const cached = point.equals(Point3.BASE) ? point : new Point3(point.x, point.y);
          cached._setWindowSize(windowSize);
          cached.multiply(_2n3);
          return cached;
        }
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/ed25519.js
  var require_ed25519 = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/ed25519.js"(exports2) {
      "use strict";
      var ed = require_lib();
      var PUBLIC_KEY_BYTE_LENGTH2 = 32;
      var PRIVATE_KEY_BYTE_LENGTH2 = 64;
      var KEYS_BYTE_LENGTH2 = 32;
      exports2.publicKeyLength = PUBLIC_KEY_BYTE_LENGTH2;
      exports2.privateKeyLength = PRIVATE_KEY_BYTE_LENGTH2;
      exports2.generateKey = async function() {
        const privateKeyRaw = ed.utils.randomPrivateKey();
        const publicKey = await ed.getPublicKey(privateKeyRaw);
        const privateKey = concatKeys2(privateKeyRaw, publicKey);
        return {
          privateKey,
          publicKey
        };
      };
      exports2.generateKeyFromSeed = async function(seed) {
        if (seed.length !== KEYS_BYTE_LENGTH2) {
          throw new TypeError('"seed" must be 32 bytes in length.');
        } else if (!(seed instanceof Uint8Array)) {
          throw new TypeError('"seed" must be a node.js Buffer, or Uint8Array.');
        }
        const privateKeyRaw = seed;
        const publicKey = await ed.getPublicKey(privateKeyRaw);
        const privateKey = concatKeys2(privateKeyRaw, publicKey);
        return {
          privateKey,
          publicKey
        };
      };
      exports2.hashAndSign = function(privateKey, msg) {
        const privateKeyRaw = privateKey.slice(0, KEYS_BYTE_LENGTH2);
        return ed.sign(msg, privateKeyRaw);
      };
      exports2.hashAndVerify = function(publicKey, sig, msg) {
        return ed.verify(sig, msg, publicKey);
      };
      function concatKeys2(privateKeyRaw, publicKey) {
        const privateKey = new Uint8Array(exports2.privateKeyLength);
        for (let i = 0; i < KEYS_BYTE_LENGTH2; i++) {
          privateKey[i] = privateKeyRaw[i];
          privateKey[KEYS_BYTE_LENGTH2 + i] = publicKey[i];
        }
        return privateKey;
      }
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/ed25519-class.js
  var require_ed25519_class = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/ed25519-class.js"(exports2, module2) {
      "use strict";
      var errcode12 = require_err_code();
      var { equals: uint8ArrayEquals } = (init_equals(), __toCommonJS(equals_exports));
      var { sha256: sha2562 } = (init_sha2_browser(), __toCommonJS(sha2_browser_exports));
      var { base58btc: base58btc2 } = (init_base58(), __toCommonJS(base58_exports));
      var { identity: identity3 } = (init_identity2(), __toCommonJS(identity_exports2));
      var crypto4 = require_ed25519();
      var pbm = require_keys();
      var exporter2 = require_exporter();
      var Ed25519PublicKey2 = class {
        constructor(key) {
          this._key = ensureKey2(key, crypto4.publicKeyLength);
        }
        async verify(data, sig) {
          return crypto4.hashAndVerify(this._key, sig, data);
        }
        marshal() {
          return this._key;
        }
        get bytes() {
          return pbm.PublicKey.encode({
            Type: pbm.KeyType.Ed25519,
            Data: this.marshal()
          }).finish();
        }
        equals(key) {
          return uint8ArrayEquals(this.bytes, key.bytes);
        }
        async hash() {
          const { bytes: bytes2 } = await sha2562.digest(this.bytes);
          return bytes2;
        }
      };
      var Ed25519PrivateKey2 = class {
        constructor(key, publicKey) {
          this._key = ensureKey2(key, crypto4.privateKeyLength);
          this._publicKey = ensureKey2(publicKey, crypto4.publicKeyLength);
        }
        async sign(message2) {
          return crypto4.hashAndSign(this._key, message2);
        }
        get public() {
          return new Ed25519PublicKey2(this._publicKey);
        }
        marshal() {
          return this._key;
        }
        get bytes() {
          return pbm.PrivateKey.encode({
            Type: pbm.KeyType.Ed25519,
            Data: this.marshal()
          }).finish();
        }
        equals(key) {
          return uint8ArrayEquals(this.bytes, key.bytes);
        }
        async hash() {
          const { bytes: bytes2 } = await sha2562.digest(this.bytes);
          return bytes2;
        }
        async id() {
          const encoding = await identity3.digest(this.public.bytes);
          return base58btc2.encode(encoding.bytes).substring(1);
        }
        async export(password, format = "libp2p-key") {
          if (format === "libp2p-key") {
            return exporter2.export(this.bytes, password);
          } else {
            throw errcode12(new Error(`export format '${format}' is not supported`), "ERR_INVALID_EXPORT_FORMAT");
          }
        }
      };
      function unmarshalEd25519PrivateKey2(bytes2) {
        if (bytes2.length > crypto4.privateKeyLength) {
          bytes2 = ensureKey2(bytes2, crypto4.privateKeyLength + crypto4.publicKeyLength);
          const privateKeyBytes2 = bytes2.slice(0, crypto4.privateKeyLength);
          const publicKeyBytes2 = bytes2.slice(crypto4.privateKeyLength, bytes2.length);
          return new Ed25519PrivateKey2(privateKeyBytes2, publicKeyBytes2);
        }
        bytes2 = ensureKey2(bytes2, crypto4.privateKeyLength);
        const privateKeyBytes = bytes2.slice(0, crypto4.privateKeyLength);
        const publicKeyBytes = bytes2.slice(crypto4.publicKeyLength);
        return new Ed25519PrivateKey2(privateKeyBytes, publicKeyBytes);
      }
      function unmarshalEd25519PublicKey2(bytes2) {
        bytes2 = ensureKey2(bytes2, crypto4.publicKeyLength);
        return new Ed25519PublicKey2(bytes2);
      }
      async function generateKeyPair4() {
        const { privateKey, publicKey } = await crypto4.generateKey();
        return new Ed25519PrivateKey2(privateKey, publicKey);
      }
      async function generateKeyPairFromSeed2(seed) {
        const { privateKey, publicKey } = await crypto4.generateKeyFromSeed(seed);
        return new Ed25519PrivateKey2(privateKey, publicKey);
      }
      function ensureKey2(key, length2) {
        key = Uint8Array.from(key || []);
        if (key.length !== length2) {
          throw errcode12(new Error(`Key must be a Uint8Array of length ${length2}, got ${key.length}`), "ERR_INVALID_KEY_TYPE");
        }
        return key;
      }
      module2.exports = {
        Ed25519PublicKey: Ed25519PublicKey2,
        Ed25519PrivateKey: Ed25519PrivateKey2,
        unmarshalEd25519PrivateKey: unmarshalEd25519PrivateKey2,
        unmarshalEd25519PublicKey: unmarshalEd25519PublicKey2,
        generateKeyPair: generateKeyPair4,
        generateKeyPairFromSeed: generateKeyPairFromSeed2
      };
    }
  });

  // ../node_modules/@noble/secp256k1/lib/index.js
  var require_lib2 = __commonJS({
    "../node_modules/@noble/secp256k1/lib/index.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.utils = exports2.schnorr = exports2.verify = exports2.signSync = exports2.sign = exports2.getSharedSecret = exports2.recoverPublicKey = exports2.getPublicKey = exports2.Signature = exports2.Point = exports2.CURVE = void 0;
      var nodeCrypto3 = require_crypto();
      var _0n3 = BigInt(0);
      var _1n3 = BigInt(1);
      var _2n3 = BigInt(2);
      var _3n2 = BigInt(3);
      var _8n2 = BigInt(8);
      var POW_2_2562 = _2n3 ** BigInt(256);
      var CURVE3 = {
        a: _0n3,
        b: BigInt(7),
        P: POW_2_2562 - _2n3 ** BigInt(32) - BigInt(977),
        n: POW_2_2562 - BigInt("432420386565659656852420866394968145599"),
        h: _1n3,
        Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
        Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
      };
      exports2.CURVE = CURVE3;
      function weistrass2(x) {
        const { a, b } = CURVE3;
        const x2 = mod4(x * x);
        const x3 = mod4(x2 * x);
        return mod4(x3 + a * x + b);
      }
      var USE_ENDOMORPHISM2 = CURVE3.a === _0n3;
      var JacobianPoint2 = class {
        constructor(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
        }
        static fromAffine(p) {
          if (!(p instanceof Point3)) {
            throw new TypeError("JacobianPoint#fromAffine: expected Point");
          }
          return new JacobianPoint2(p.x, p.y, _1n3);
        }
        static toAffineBatch(points) {
          const toInv = invertBatch3(points.map((p) => p.z));
          return points.map((p, i) => p.toAffine(toInv[i]));
        }
        static normalizeZ(points) {
          return JacobianPoint2.toAffineBatch(points).map(JacobianPoint2.fromAffine);
        }
        equals(other) {
          if (!(other instanceof JacobianPoint2))
            throw new TypeError("JacobianPoint expected");
          const { x: X1, y: Y1, z: Z1 } = this;
          const { x: X2, y: Y2, z: Z2 } = other;
          const Z1Z1 = mod4(Z1 ** _2n3);
          const Z2Z2 = mod4(Z2 ** _2n3);
          const U1 = mod4(X1 * Z2Z2);
          const U2 = mod4(X2 * Z1Z1);
          const S1 = mod4(mod4(Y1 * Z2) * Z2Z2);
          const S2 = mod4(mod4(Y2 * Z1) * Z1Z1);
          return U1 === U2 && S1 === S2;
        }
        negate() {
          return new JacobianPoint2(this.x, mod4(-this.y), this.z);
        }
        double() {
          const { x: X1, y: Y1, z: Z1 } = this;
          const A = mod4(X1 ** _2n3);
          const B = mod4(Y1 ** _2n3);
          const C = mod4(B ** _2n3);
          const D = mod4(_2n3 * (mod4((X1 + B) ** _2n3) - A - C));
          const E = mod4(_3n2 * A);
          const F = mod4(E ** _2n3);
          const X3 = mod4(F - _2n3 * D);
          const Y3 = mod4(E * (D - X3) - _8n2 * C);
          const Z3 = mod4(_2n3 * Y1 * Z1);
          return new JacobianPoint2(X3, Y3, Z3);
        }
        add(other) {
          if (!(other instanceof JacobianPoint2))
            throw new TypeError("JacobianPoint expected");
          const { x: X1, y: Y1, z: Z1 } = this;
          const { x: X2, y: Y2, z: Z2 } = other;
          if (X2 === _0n3 || Y2 === _0n3)
            return this;
          if (X1 === _0n3 || Y1 === _0n3)
            return other;
          const Z1Z1 = mod4(Z1 ** _2n3);
          const Z2Z2 = mod4(Z2 ** _2n3);
          const U1 = mod4(X1 * Z2Z2);
          const U2 = mod4(X2 * Z1Z1);
          const S1 = mod4(mod4(Y1 * Z2) * Z2Z2);
          const S2 = mod4(mod4(Y2 * Z1) * Z1Z1);
          const H = mod4(U2 - U1);
          const r = mod4(S2 - S1);
          if (H === _0n3) {
            if (r === _0n3) {
              return this.double();
            } else {
              return JacobianPoint2.ZERO;
            }
          }
          const HH = mod4(H ** _2n3);
          const HHH = mod4(H * HH);
          const V = mod4(U1 * HH);
          const X3 = mod4(r ** _2n3 - HHH - _2n3 * V);
          const Y3 = mod4(r * (V - X3) - S1 * HHH);
          const Z3 = mod4(Z1 * Z2 * H);
          return new JacobianPoint2(X3, Y3, Z3);
        }
        subtract(other) {
          return this.add(other.negate());
        }
        multiplyUnsafe(scalar) {
          let n = normalizeScalar3(scalar);
          const G = JacobianPoint2.BASE;
          const P0 = JacobianPoint2.ZERO;
          if (n === _0n3)
            return P0;
          if (n === _1n3)
            return this;
          if (!USE_ENDOMORPHISM2) {
            let p = P0;
            let d2 = this;
            while (n > _0n3) {
              if (n & _1n3)
                p = p.add(d2);
              d2 = d2.double();
              n >>= _1n3;
            }
            return p;
          }
          let { k1neg, k1, k2neg, k2 } = splitScalarEndo2(n);
          let k1p = P0;
          let k2p = P0;
          let d = this;
          while (k1 > _0n3 || k2 > _0n3) {
            if (k1 & _1n3)
              k1p = k1p.add(d);
            if (k2 & _1n3)
              k2p = k2p.add(d);
            d = d.double();
            k1 >>= _1n3;
            k2 >>= _1n3;
          }
          if (k1neg)
            k1p = k1p.negate();
          if (k2neg)
            k2p = k2p.negate();
          k2p = new JacobianPoint2(mod4(k2p.x * CURVE3.beta), k2p.y, k2p.z);
          return k1p.add(k2p);
        }
        precomputeWindow(W) {
          const windows = USE_ENDOMORPHISM2 ? 128 / W + 1 : 256 / W + 1;
          const points = [];
          let p = this;
          let base3 = p;
          for (let window2 = 0; window2 < windows; window2++) {
            base3 = p;
            points.push(base3);
            for (let i = 1; i < 2 ** (W - 1); i++) {
              base3 = base3.add(p);
              points.push(base3);
            }
            p = base3.double();
          }
          return points;
        }
        wNAF(n, affinePoint) {
          if (!affinePoint && this.equals(JacobianPoint2.BASE))
            affinePoint = Point3.BASE;
          const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
          if (256 % W) {
            throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
          }
          let precomputes = affinePoint && pointPrecomputes3.get(affinePoint);
          if (!precomputes) {
            precomputes = this.precomputeWindow(W);
            if (affinePoint && W !== 1) {
              precomputes = JacobianPoint2.normalizeZ(precomputes);
              pointPrecomputes3.set(affinePoint, precomputes);
            }
          }
          let p = JacobianPoint2.ZERO;
          let f = JacobianPoint2.ZERO;
          const windows = 1 + (USE_ENDOMORPHISM2 ? 128 / W : 256 / W);
          const windowSize = 2 ** (W - 1);
          const mask = BigInt(2 ** W - 1);
          const maxNumber = 2 ** W;
          const shiftBy = BigInt(W);
          for (let window2 = 0; window2 < windows; window2++) {
            const offset = window2 * windowSize;
            let wbits = Number(n & mask);
            n >>= shiftBy;
            if (wbits > windowSize) {
              wbits -= maxNumber;
              n += _1n3;
            }
            if (wbits === 0) {
              let pr = precomputes[offset];
              if (window2 % 2)
                pr = pr.negate();
              f = f.add(pr);
            } else {
              let cached = precomputes[offset + Math.abs(wbits) - 1];
              if (wbits < 0)
                cached = cached.negate();
              p = p.add(cached);
            }
          }
          return { p, f };
        }
        multiply(scalar, affinePoint) {
          let n = normalizeScalar3(scalar);
          let point;
          let fake;
          if (USE_ENDOMORPHISM2) {
            const { k1neg, k1, k2neg, k2 } = splitScalarEndo2(n);
            let { p: k1p, f: f1p } = this.wNAF(k1, affinePoint);
            let { p: k2p, f: f2p } = this.wNAF(k2, affinePoint);
            if (k1neg)
              k1p = k1p.negate();
            if (k2neg)
              k2p = k2p.negate();
            k2p = new JacobianPoint2(mod4(k2p.x * CURVE3.beta), k2p.y, k2p.z);
            point = k1p.add(k2p);
            fake = f1p.add(f2p);
          } else {
            const { p, f } = this.wNAF(n, affinePoint);
            point = p;
            fake = f;
          }
          return JacobianPoint2.normalizeZ([point, fake])[0];
        }
        toAffine(invZ = invert3(this.z)) {
          const { x, y, z } = this;
          const iz1 = invZ;
          const iz2 = mod4(iz1 * iz1);
          const iz3 = mod4(iz2 * iz1);
          const ax = mod4(x * iz2);
          const ay = mod4(y * iz3);
          const zz = mod4(z * iz1);
          if (zz !== _1n3)
            throw new Error("invZ was invalid");
          return new Point3(ax, ay);
        }
      };
      JacobianPoint2.BASE = new JacobianPoint2(CURVE3.Gx, CURVE3.Gy, _1n3);
      JacobianPoint2.ZERO = new JacobianPoint2(_0n3, _1n3, _0n3);
      var pointPrecomputes3 = /* @__PURE__ */ new WeakMap();
      var Point3 = class {
        constructor(x, y) {
          this.x = x;
          this.y = y;
        }
        _setWindowSize(windowSize) {
          this._WINDOW_SIZE = windowSize;
          pointPrecomputes3.delete(this);
        }
        static fromCompressedHex(bytes2) {
          const isShort = bytes2.length === 32;
          const x = bytesToNumber2(isShort ? bytes2 : bytes2.subarray(1));
          if (!isValidFieldElement2(x))
            throw new Error("Point is not on curve");
          const y2 = weistrass2(x);
          let y = sqrtMod2(y2);
          const isYOdd = (y & _1n3) === _1n3;
          if (isShort) {
            if (isYOdd)
              y = mod4(-y);
          } else {
            const isFirstByteOdd = (bytes2[0] & 1) === 1;
            if (isFirstByteOdd !== isYOdd)
              y = mod4(-y);
          }
          const point = new Point3(x, y);
          point.assertValidity();
          return point;
        }
        static fromUncompressedHex(bytes2) {
          const x = bytesToNumber2(bytes2.subarray(1, 33));
          const y = bytesToNumber2(bytes2.subarray(33, 65));
          const point = new Point3(x, y);
          point.assertValidity();
          return point;
        }
        static fromHex(hex) {
          const bytes2 = ensureBytes3(hex);
          const len = bytes2.length;
          const header = bytes2[0];
          if (len === 32 || len === 33 && (header === 2 || header === 3)) {
            return this.fromCompressedHex(bytes2);
          }
          if (len === 65 && header === 4)
            return this.fromUncompressedHex(bytes2);
          throw new Error(`Point.fromHex: received invalid point. Expected 32-33 compressed bytes or 65 uncompressed bytes, not ${len}`);
        }
        static fromPrivateKey(privateKey) {
          return Point3.BASE.multiply(normalizePrivateKey2(privateKey));
        }
        static fromSignature(msgHash, signature, recovery) {
          msgHash = ensureBytes3(msgHash);
          const h = truncateHash2(msgHash);
          const { r, s } = normalizeSignature2(signature);
          if (recovery !== 0 && recovery !== 1) {
            throw new Error("Cannot recover signature: invalid recovery bit");
          }
          if (h === _0n3)
            throw new Error("Cannot recover signature: msgHash cannot be 0");
          const prefix = recovery & 1 ? "03" : "02";
          const R = Point3.fromHex(prefix + numTo32bStr2(r));
          const { n } = CURVE3;
          const rinv = invert3(r, n);
          const u1 = mod4(-h * rinv, n);
          const u2 = mod4(s * rinv, n);
          const Q = Point3.BASE.multiplyAndAddUnsafe(R, u1, u2);
          if (!Q)
            throw new Error("Cannot recover signature: point at infinify");
          Q.assertValidity();
          return Q;
        }
        toRawBytes(isCompressed = false) {
          return hexToBytes3(this.toHex(isCompressed));
        }
        toHex(isCompressed = false) {
          const x = numTo32bStr2(this.x);
          if (isCompressed) {
            const prefix = this.y & _1n3 ? "03" : "02";
            return `${prefix}${x}`;
          } else {
            return `04${x}${numTo32bStr2(this.y)}`;
          }
        }
        toHexX() {
          return this.toHex(true).slice(2);
        }
        toRawX() {
          return this.toRawBytes(true).slice(1);
        }
        assertValidity() {
          const msg = "Point is not on elliptic curve";
          const { x, y } = this;
          if (!isValidFieldElement2(x) || !isValidFieldElement2(y))
            throw new Error(msg);
          const left = mod4(y * y);
          const right = weistrass2(x);
          if (mod4(left - right) !== _0n3)
            throw new Error(msg);
        }
        equals(other) {
          return this.x === other.x && this.y === other.y;
        }
        negate() {
          return new Point3(this.x, mod4(-this.y));
        }
        double() {
          return JacobianPoint2.fromAffine(this).double().toAffine();
        }
        add(other) {
          return JacobianPoint2.fromAffine(this).add(JacobianPoint2.fromAffine(other)).toAffine();
        }
        subtract(other) {
          return this.add(other.negate());
        }
        multiply(scalar) {
          return JacobianPoint2.fromAffine(this).multiply(scalar, this).toAffine();
        }
        multiplyAndAddUnsafe(Q, a, b) {
          const P = JacobianPoint2.fromAffine(this);
          const aP = a === _0n3 || a === _1n3 || this !== Point3.BASE ? P.multiplyUnsafe(a) : P.multiply(a);
          const bQ = JacobianPoint2.fromAffine(Q).multiplyUnsafe(b);
          const sum = aP.add(bQ);
          return sum.equals(JacobianPoint2.ZERO) ? void 0 : sum.toAffine();
        }
      };
      exports2.Point = Point3;
      Point3.BASE = new Point3(CURVE3.Gx, CURVE3.Gy);
      Point3.ZERO = new Point3(_0n3, _0n3);
      function sliceDER2(s) {
        return Number.parseInt(s[0], 16) >= 8 ? "00" + s : s;
      }
      function parseDERInt2(data) {
        if (data.length < 2 || data[0] !== 2) {
          throw new Error(`Invalid signature integer tag: ${bytesToHex3(data)}`);
        }
        const len = data[1];
        const res = data.subarray(2, len + 2);
        if (!len || res.length !== len) {
          throw new Error(`Invalid signature integer: wrong length`);
        }
        if (res[0] === 0 && res[1] <= 127) {
          throw new Error("Invalid signature integer: trailing length");
        }
        return { data: bytesToNumber2(res), left: data.subarray(len + 2) };
      }
      function parseDERSignature2(data) {
        if (data.length < 2 || data[0] != 48) {
          throw new Error(`Invalid signature tag: ${bytesToHex3(data)}`);
        }
        if (data[1] !== data.length - 2) {
          throw new Error("Invalid signature: incorrect length");
        }
        const { data: r, left: sBytes } = parseDERInt2(data.subarray(2));
        const { data: s, left: rBytesLeft } = parseDERInt2(sBytes);
        if (rBytesLeft.length) {
          throw new Error(`Invalid signature: left bytes after parsing: ${bytesToHex3(rBytesLeft)}`);
        }
        return { r, s };
      }
      var Signature3 = class {
        constructor(r, s) {
          this.r = r;
          this.s = s;
          this.assertValidity();
        }
        static fromCompact(hex) {
          const arr = isUint8a2(hex);
          const name2 = "Signature.fromCompact";
          if (typeof hex !== "string" && !arr)
            throw new TypeError(`${name2}: Expected string or Uint8Array`);
          const str = arr ? bytesToHex3(hex) : hex;
          if (str.length !== 128)
            throw new Error(`${name2}: Expected 64-byte hex`);
          return new Signature3(hexToNumber2(str.slice(0, 64)), hexToNumber2(str.slice(64, 128)));
        }
        static fromDER(hex) {
          const arr = isUint8a2(hex);
          if (typeof hex !== "string" && !arr)
            throw new TypeError(`Signature.fromDER: Expected string or Uint8Array`);
          const { r, s } = parseDERSignature2(arr ? hex : hexToBytes3(hex));
          return new Signature3(r, s);
        }
        static fromHex(hex) {
          return this.fromDER(hex);
        }
        assertValidity() {
          const { r, s } = this;
          if (!isWithinCurveOrder2(r))
            throw new Error("Invalid Signature: r must be 0 < r < n");
          if (!isWithinCurveOrder2(s))
            throw new Error("Invalid Signature: s must be 0 < s < n");
        }
        hasHighS() {
          const HALF = CURVE3.n >> _1n3;
          return this.s > HALF;
        }
        normalizeS() {
          return this.hasHighS() ? new Signature3(this.r, CURVE3.n - this.s) : this;
        }
        toDERRawBytes(isCompressed = false) {
          return hexToBytes3(this.toDERHex(isCompressed));
        }
        toDERHex(isCompressed = false) {
          const sHex = sliceDER2(numberToHexUnpadded2(this.s));
          if (isCompressed)
            return sHex;
          const rHex = sliceDER2(numberToHexUnpadded2(this.r));
          const rLen = numberToHexUnpadded2(rHex.length / 2);
          const sLen = numberToHexUnpadded2(sHex.length / 2);
          const length2 = numberToHexUnpadded2(rHex.length / 2 + sHex.length / 2 + 4);
          return `30${length2}02${rLen}${rHex}02${sLen}${sHex}`;
        }
        toRawBytes() {
          return this.toDERRawBytes();
        }
        toHex() {
          return this.toDERHex();
        }
        toCompactRawBytes() {
          return hexToBytes3(this.toCompactHex());
        }
        toCompactHex() {
          return numTo32bStr2(this.r) + numTo32bStr2(this.s);
        }
      };
      exports2.Signature = Signature3;
      function concatBytes3(...arrays) {
        if (!arrays.every(isUint8a2))
          throw new Error("Uint8Array list expected");
        if (arrays.length === 1)
          return arrays[0];
        const length2 = arrays.reduce((a, arr) => a + arr.length, 0);
        const result = new Uint8Array(length2);
        for (let i = 0, pad = 0; i < arrays.length; i++) {
          const arr = arrays[i];
          result.set(arr, pad);
          pad += arr.length;
        }
        return result;
      }
      function isUint8a2(bytes2) {
        return bytes2 instanceof Uint8Array;
      }
      var hexes3 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
      function bytesToHex3(uint8a) {
        if (!(uint8a instanceof Uint8Array))
          throw new Error("Expected Uint8Array");
        let hex = "";
        for (let i = 0; i < uint8a.length; i++) {
          hex += hexes3[uint8a[i]];
        }
        return hex;
      }
      function numTo32bStr2(num) {
        if (num > POW_2_2562)
          throw new Error("Expected number < 2^256");
        return num.toString(16).padStart(64, "0");
      }
      function numTo32b2(num) {
        return hexToBytes3(numTo32bStr2(num));
      }
      function numberToHexUnpadded2(num) {
        const hex = num.toString(16);
        return hex.length & 1 ? `0${hex}` : hex;
      }
      function hexToNumber2(hex) {
        if (typeof hex !== "string") {
          throw new TypeError("hexToNumber: expected string, got " + typeof hex);
        }
        return BigInt(`0x${hex}`);
      }
      function hexToBytes3(hex) {
        if (typeof hex !== "string") {
          throw new TypeError("hexToBytes: expected string, got " + typeof hex);
        }
        if (hex.length % 2)
          throw new Error("hexToBytes: received invalid unpadded hex" + hex.length);
        const array = new Uint8Array(hex.length / 2);
        for (let i = 0; i < array.length; i++) {
          const j = i * 2;
          const hexByte = hex.slice(j, j + 2);
          const byte = Number.parseInt(hexByte, 16);
          if (Number.isNaN(byte) || byte < 0)
            throw new Error("Invalid byte sequence");
          array[i] = byte;
        }
        return array;
      }
      function bytesToNumber2(bytes2) {
        return hexToNumber2(bytesToHex3(bytes2));
      }
      function ensureBytes3(hex) {
        return hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes3(hex);
      }
      function normalizeScalar3(num) {
        if (typeof num === "number" && Number.isSafeInteger(num) && num > 0)
          return BigInt(num);
        if (typeof num === "bigint" && isWithinCurveOrder2(num))
          return num;
        throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
      }
      function mod4(a, b = CURVE3.P) {
        const result = a % b;
        return result >= _0n3 ? result : b + result;
      }
      function pow23(x, power) {
        const { P } = CURVE3;
        let res = x;
        while (power-- > _0n3) {
          res *= res;
          res %= P;
        }
        return res;
      }
      function sqrtMod2(x) {
        const { P } = CURVE3;
        const _6n = BigInt(6);
        const _11n = BigInt(11);
        const _22n = BigInt(22);
        const _23n = BigInt(23);
        const _44n = BigInt(44);
        const _88n = BigInt(88);
        const b2 = x * x * x % P;
        const b3 = b2 * b2 * x % P;
        const b6 = pow23(b3, _3n2) * b3 % P;
        const b9 = pow23(b6, _3n2) * b3 % P;
        const b11 = pow23(b9, _2n3) * b2 % P;
        const b22 = pow23(b11, _11n) * b11 % P;
        const b44 = pow23(b22, _22n) * b22 % P;
        const b88 = pow23(b44, _44n) * b44 % P;
        const b176 = pow23(b88, _88n) * b88 % P;
        const b220 = pow23(b176, _44n) * b44 % P;
        const b223 = pow23(b220, _3n2) * b3 % P;
        const t1 = pow23(b223, _23n) * b22 % P;
        const t2 = pow23(t1, _6n) * b2 % P;
        return pow23(t2, _2n3);
      }
      function invert3(number, modulo = CURVE3.P) {
        if (number === _0n3 || modulo <= _0n3) {
          throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
        }
        let a = mod4(number, modulo);
        let b = modulo;
        let x = _0n3, y = _1n3, u = _1n3, v = _0n3;
        while (a !== _0n3) {
          const q = b / a;
          const r = b % a;
          const m = x - u * q;
          const n = y - v * q;
          b = a, a = r, x = u, y = v, u = m, v = n;
        }
        const gcd = b;
        if (gcd !== _1n3)
          throw new Error("invert: does not exist");
        return mod4(x, modulo);
      }
      function invertBatch3(nums, p = CURVE3.P) {
        const scratch = new Array(nums.length);
        const lastMultiplied = nums.reduce((acc, num, i) => {
          if (num === _0n3)
            return acc;
          scratch[i] = acc;
          return mod4(acc * num, p);
        }, _1n3);
        const inverted = invert3(lastMultiplied, p);
        nums.reduceRight((acc, num, i) => {
          if (num === _0n3)
            return acc;
          scratch[i] = mod4(acc * scratch[i], p);
          return mod4(acc * num, p);
        }, inverted);
        return scratch;
      }
      var divNearest2 = (a, b) => (a + b / _2n3) / b;
      var POW_2_1282 = _2n3 ** BigInt(128);
      function splitScalarEndo2(k) {
        const { n } = CURVE3;
        const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
        const b1 = -_1n3 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
        const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
        const b2 = a1;
        const c1 = divNearest2(b2 * k, n);
        const c2 = divNearest2(-b1 * k, n);
        let k1 = mod4(k - c1 * a1 - c2 * a2, n);
        let k2 = mod4(-c1 * b1 - c2 * b2, n);
        const k1neg = k1 > POW_2_1282;
        const k2neg = k2 > POW_2_1282;
        if (k1neg)
          k1 = n - k1;
        if (k2neg)
          k2 = n - k2;
        if (k1 > POW_2_1282 || k2 > POW_2_1282) {
          throw new Error("splitScalarEndo: Endomorphism failed, k=" + k);
        }
        return { k1neg, k1, k2neg, k2 };
      }
      function truncateHash2(hash) {
        const { n } = CURVE3;
        const byteLength = hash.length;
        const delta = byteLength * 8 - 256;
        let h = bytesToNumber2(hash);
        if (delta > 0)
          h = h >> BigInt(delta);
        if (h >= n)
          h -= n;
        return h;
      }
      var HmacDrbg2 = class {
        constructor() {
          this.v = new Uint8Array(32).fill(1);
          this.k = new Uint8Array(32).fill(0);
          this.counter = 0;
        }
        hmac(...values) {
          return exports2.utils.hmacSha256(this.k, ...values);
        }
        hmacSync(...values) {
          if (typeof exports2.utils.hmacSha256Sync !== "function")
            throw new Error("utils.hmacSha256Sync is undefined, you need to set it");
          const res = exports2.utils.hmacSha256Sync(this.k, ...values);
          if (res instanceof Promise)
            throw new Error("To use sync sign(), ensure utils.hmacSha256 is sync");
          return res;
        }
        incr() {
          if (this.counter >= 1e3) {
            throw new Error("Tried 1,000 k values for sign(), all were invalid");
          }
          this.counter += 1;
        }
        async reseed(seed = new Uint8Array()) {
          this.k = await this.hmac(this.v, Uint8Array.from([0]), seed);
          this.v = await this.hmac(this.v);
          if (seed.length === 0)
            return;
          this.k = await this.hmac(this.v, Uint8Array.from([1]), seed);
          this.v = await this.hmac(this.v);
        }
        reseedSync(seed = new Uint8Array()) {
          this.k = this.hmacSync(this.v, Uint8Array.from([0]), seed);
          this.v = this.hmacSync(this.v);
          if (seed.length === 0)
            return;
          this.k = this.hmacSync(this.v, Uint8Array.from([1]), seed);
          this.v = this.hmacSync(this.v);
        }
        async generate() {
          this.incr();
          this.v = await this.hmac(this.v);
          return this.v;
        }
        generateSync() {
          this.incr();
          this.v = this.hmacSync(this.v);
          return this.v;
        }
      };
      function isWithinCurveOrder2(num) {
        return _0n3 < num && num < CURVE3.n;
      }
      function isValidFieldElement2(num) {
        return _0n3 < num && num < CURVE3.P;
      }
      function kmdToSig2(kBytes, m, d) {
        const k = bytesToNumber2(kBytes);
        if (!isWithinCurveOrder2(k))
          return;
        const { n } = CURVE3;
        const q = Point3.BASE.multiply(k);
        const r = mod4(q.x, n);
        if (r === _0n3)
          return;
        const s = mod4(invert3(k, n) * mod4(m + d * r, n), n);
        if (s === _0n3)
          return;
        const sig = new Signature3(r, s);
        const recovery = (q.x === sig.r ? 0 : 2) | Number(q.y & _1n3);
        return { sig, recovery };
      }
      function normalizePrivateKey2(key) {
        let num;
        if (typeof key === "bigint") {
          num = key;
        } else if (typeof key === "number" && Number.isSafeInteger(key) && key > 0) {
          num = BigInt(key);
        } else if (typeof key === "string") {
          if (key.length !== 64)
            throw new Error("Expected 32 bytes of private key");
          num = hexToNumber2(key);
        } else if (isUint8a2(key)) {
          if (key.length !== 32)
            throw new Error("Expected 32 bytes of private key");
          num = bytesToNumber2(key);
        } else {
          throw new TypeError("Expected valid private key");
        }
        if (!isWithinCurveOrder2(num))
          throw new Error("Expected private key: 0 < key < n");
        return num;
      }
      function normalizePublicKey2(publicKey) {
        if (publicKey instanceof Point3) {
          publicKey.assertValidity();
          return publicKey;
        } else {
          return Point3.fromHex(publicKey);
        }
      }
      function normalizeSignature2(signature) {
        if (signature instanceof Signature3) {
          signature.assertValidity();
          return signature;
        }
        try {
          return Signature3.fromDER(signature);
        } catch (error) {
          return Signature3.fromCompact(signature);
        }
      }
      function getPublicKey3(privateKey, isCompressed = false) {
        return Point3.fromPrivateKey(privateKey).toRawBytes(isCompressed);
      }
      exports2.getPublicKey = getPublicKey3;
      function recoverPublicKey(msgHash, signature, recovery, isCompressed = false) {
        return Point3.fromSignature(msgHash, signature, recovery).toRawBytes(isCompressed);
      }
      exports2.recoverPublicKey = recoverPublicKey;
      function isPub(item) {
        const arr = isUint8a2(item);
        const str = typeof item === "string";
        const len = (arr || str) && item.length;
        if (arr)
          return len === 33 || len === 65;
        if (str)
          return len === 66 || len === 130;
        if (item instanceof Point3)
          return true;
        return false;
      }
      function getSharedSecret(privateA, publicB, isCompressed = false) {
        if (isPub(privateA))
          throw new TypeError("getSharedSecret: first arg must be private key");
        if (!isPub(publicB))
          throw new TypeError("getSharedSecret: second arg must be public key");
        const b = normalizePublicKey2(publicB);
        b.assertValidity();
        return b.multiply(normalizePrivateKey2(privateA)).toRawBytes(isCompressed);
      }
      exports2.getSharedSecret = getSharedSecret;
      function bits2int2(bytes2) {
        const slice2 = bytes2.length > 32 ? bytes2.slice(0, 32) : bytes2;
        return bytesToNumber2(slice2);
      }
      function bits2octets2(bytes2) {
        const z1 = bits2int2(bytes2);
        const z2 = mod4(z1, CURVE3.n);
        return int2octets2(z2 < _0n3 ? z1 : z2);
      }
      function int2octets2(num) {
        if (typeof num !== "bigint")
          throw new Error("Expected bigint");
        const hex = numTo32bStr2(num);
        return hexToBytes3(hex);
      }
      function initSigArgs2(msgHash, privateKey, extraEntropy) {
        if (msgHash == null)
          throw new Error(`sign: expected valid message hash, not "${msgHash}"`);
        const h1 = ensureBytes3(msgHash);
        const d = normalizePrivateKey2(privateKey);
        const seedArgs = [int2octets2(d), bits2octets2(h1)];
        if (extraEntropy != null) {
          if (extraEntropy === true)
            extraEntropy = exports2.utils.randomBytes(32);
          const e = ensureBytes3(extraEntropy);
          if (e.length !== 32)
            throw new Error("sign: Expected 32 bytes of extra data");
          seedArgs.push(e);
        }
        const seed = concatBytes3(...seedArgs);
        const m = bits2int2(h1);
        return { seed, m, d };
      }
      function finalizeSig2(recSig, opts) {
        let { sig, recovery } = recSig;
        const { canonical, der, recovered } = Object.assign({ canonical: true, der: true }, opts);
        if (canonical && sig.hasHighS()) {
          sig = sig.normalizeS();
          recovery ^= 1;
        }
        const hashed = der ? sig.toDERRawBytes() : sig.toCompactRawBytes();
        return recovered ? [hashed, recovery] : hashed;
      }
      async function sign4(msgHash, privKey, opts = {}) {
        const { seed, m, d } = initSigArgs2(msgHash, privKey, opts.extraEntropy);
        let sig;
        const drbg = new HmacDrbg2();
        await drbg.reseed(seed);
        while (!(sig = kmdToSig2(await drbg.generate(), m, d)))
          await drbg.reseed();
        return finalizeSig2(sig, opts);
      }
      exports2.sign = sign4;
      function signSync(msgHash, privKey, opts = {}) {
        const { seed, m, d } = initSigArgs2(msgHash, privKey, opts.extraEntropy);
        let sig;
        const drbg = new HmacDrbg2();
        drbg.reseedSync(seed);
        while (!(sig = kmdToSig2(drbg.generateSync(), m, d)))
          drbg.reseedSync();
        return finalizeSig2(sig, opts);
      }
      exports2.signSync = signSync;
      var vopts2 = { strict: true };
      function verify3(signature, msgHash, publicKey, opts = vopts2) {
        let sig;
        try {
          sig = normalizeSignature2(signature);
          msgHash = ensureBytes3(msgHash);
        } catch (error) {
          return false;
        }
        const { r, s } = sig;
        if (opts.strict && sig.hasHighS())
          return false;
        const h = truncateHash2(msgHash);
        if (h === _0n3)
          return false;
        let P;
        try {
          P = normalizePublicKey2(publicKey);
        } catch (error) {
          return false;
        }
        const { n } = CURVE3;
        const sinv = invert3(s, n);
        const u1 = mod4(h * sinv, n);
        const u2 = mod4(r * sinv, n);
        const R = Point3.BASE.multiplyAndAddUnsafe(P, u1, u2);
        if (!R)
          return false;
        const v = mod4(R.x, n);
        return v === r;
      }
      exports2.verify = verify3;
      function finalizeSchnorrChallenge(ch) {
        return mod4(bytesToNumber2(ch), CURVE3.n);
      }
      function hasEvenY(point) {
        return (point.y & _1n3) === _0n3;
      }
      var SchnorrSignature = class {
        constructor(r, s) {
          this.r = r;
          this.s = s;
          this.assertValidity();
        }
        static fromHex(hex) {
          const bytes2 = ensureBytes3(hex);
          if (bytes2.length !== 64)
            throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${bytes2.length}`);
          const r = bytesToNumber2(bytes2.subarray(0, 32));
          const s = bytesToNumber2(bytes2.subarray(32, 64));
          return new SchnorrSignature(r, s);
        }
        assertValidity() {
          const { r, s } = this;
          if (!isValidFieldElement2(r) || !isWithinCurveOrder2(s))
            throw new Error("Invalid signature");
        }
        toHex() {
          return numTo32bStr2(this.r) + numTo32bStr2(this.s);
        }
        toRawBytes() {
          return hexToBytes3(this.toHex());
        }
      };
      function schnorrGetPublicKey(privateKey) {
        return Point3.fromPrivateKey(privateKey).toRawX();
      }
      function initSchnorrSigArgs(message2, privateKey, auxRand) {
        if (message2 == null)
          throw new TypeError(`sign: Expected valid message, not "${message2}"`);
        const m = ensureBytes3(message2);
        const d0 = normalizePrivateKey2(privateKey);
        const rand = ensureBytes3(auxRand);
        if (rand.length !== 32)
          throw new TypeError("sign: Expected 32 bytes of aux randomness");
        const P = Point3.fromPrivateKey(d0);
        const px = P.toRawX();
        const d = hasEvenY(P) ? d0 : CURVE3.n - d0;
        return { m, P, px, d, rand };
      }
      function initSchnorrNonce(d, t0h) {
        return numTo32b2(d ^ bytesToNumber2(t0h));
      }
      function finalizeSchnorrNonce(k0h) {
        const k0 = mod4(bytesToNumber2(k0h), CURVE3.n);
        if (k0 === _0n3)
          throw new Error("sign: Creation of signature failed. k is zero");
        const R = Point3.fromPrivateKey(k0);
        const rx = R.toRawX();
        const k = hasEvenY(R) ? k0 : CURVE3.n - k0;
        return { R, rx, k };
      }
      function finalizeSchnorrSig(R, k, e, d) {
        return new SchnorrSignature(R.x, mod4(k + e * d, CURVE3.n)).toRawBytes();
      }
      async function schnorrSign(message2, privateKey, auxRand = exports2.utils.randomBytes()) {
        const { m, px, d, rand } = initSchnorrSigArgs(message2, privateKey, auxRand);
        const t = initSchnorrNonce(d, await exports2.utils.taggedHash(TAGS.aux, rand));
        const { R, rx, k } = finalizeSchnorrNonce(await exports2.utils.taggedHash(TAGS.nonce, t, px, m));
        const e = finalizeSchnorrChallenge(await exports2.utils.taggedHash(TAGS.challenge, rx, px, m));
        const sig = finalizeSchnorrSig(R, k, e, d);
        const isValid = await schnorrVerify(sig, m, px);
        if (!isValid)
          throw new Error("sign: Invalid signature produced");
        return sig;
      }
      function schnorrSignSync(message2, privateKey, auxRand = exports2.utils.randomBytes()) {
        const { m, px, d, rand } = initSchnorrSigArgs(message2, privateKey, auxRand);
        const t = initSchnorrNonce(d, exports2.utils.taggedHashSync(TAGS.aux, rand));
        const { R, rx, k } = finalizeSchnorrNonce(exports2.utils.taggedHashSync(TAGS.nonce, t, px, m));
        const e = finalizeSchnorrChallenge(exports2.utils.taggedHashSync(TAGS.challenge, rx, px, m));
        const sig = finalizeSchnorrSig(R, k, e, d);
        const isValid = schnorrVerifySync(sig, m, px);
        if (!isValid)
          throw new Error("sign: Invalid signature produced");
        return sig;
      }
      function initSchnorrVerify(signature, message2, publicKey) {
        const raw = signature instanceof SchnorrSignature;
        const sig = raw ? signature : SchnorrSignature.fromHex(signature);
        if (raw)
          sig.assertValidity();
        return {
          ...sig,
          m: ensureBytes3(message2),
          P: normalizePublicKey2(publicKey)
        };
      }
      function finalizeSchnorrVerify(r, P, s, e) {
        const R = Point3.BASE.multiplyAndAddUnsafe(P, normalizePrivateKey2(s), mod4(-e, CURVE3.n));
        if (!R || !hasEvenY(R) || R.x !== r)
          return false;
        return true;
      }
      async function schnorrVerify(signature, message2, publicKey) {
        try {
          const { r, s, m, P } = initSchnorrVerify(signature, message2, publicKey);
          const e = finalizeSchnorrChallenge(await exports2.utils.taggedHash(TAGS.challenge, numTo32b2(r), P.toRawX(), m));
          return finalizeSchnorrVerify(r, P, s, e);
        } catch (error) {
          return false;
        }
      }
      function schnorrVerifySync(signature, message2, publicKey) {
        try {
          const { r, s, m, P } = initSchnorrVerify(signature, message2, publicKey);
          const e = finalizeSchnorrChallenge(exports2.utils.taggedHashSync(TAGS.challenge, numTo32b2(r), P.toRawX(), m));
          return finalizeSchnorrVerify(r, P, s, e);
        } catch (error) {
          return false;
        }
      }
      exports2.schnorr = {
        Signature: SchnorrSignature,
        getPublicKey: schnorrGetPublicKey,
        sign: schnorrSign,
        verify: schnorrVerify,
        signSync: schnorrSignSync,
        verifySync: schnorrVerifySync
      };
      Point3.BASE._setWindowSize(8);
      var crypto4 = {
        node: nodeCrypto3,
        web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
      };
      var TAGS = {
        challenge: "BIP0340/challenge",
        aux: "BIP0340/aux",
        nonce: "BIP0340/nonce"
      };
      var TAGGED_HASH_PREFIXES2 = {};
      exports2.utils = {
        isValidPrivateKey(privateKey) {
          try {
            normalizePrivateKey2(privateKey);
            return true;
          } catch (error) {
            return false;
          }
        },
        privateAdd: (privateKey, tweak) => {
          const p = normalizePrivateKey2(privateKey);
          const t = bytesToNumber2(ensureBytes3(tweak));
          return numTo32b2(mod4(p + t, CURVE3.n));
        },
        privateNegate: (privateKey) => {
          const p = normalizePrivateKey2(privateKey);
          return numTo32b2(CURVE3.n - p);
        },
        pointAddScalar: (p, tweak, isCompressed) => {
          const P = Point3.fromHex(p);
          const t = bytesToNumber2(ensureBytes3(tweak));
          const Q = Point3.BASE.multiplyAndAddUnsafe(P, t, _1n3);
          if (!Q)
            throw new Error("Tweaked point at infinity");
          return Q.toRawBytes(isCompressed);
        },
        pointMultiply: (p, tweak, isCompressed) => {
          const P = Point3.fromHex(p);
          const t = bytesToNumber2(ensureBytes3(tweak));
          return P.multiply(t).toRawBytes(isCompressed);
        },
        hashToPrivateKey: (hash) => {
          hash = ensureBytes3(hash);
          if (hash.length < 40 || hash.length > 1024)
            throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
          const num = mod4(bytesToNumber2(hash), CURVE3.n - _1n3) + _1n3;
          return numTo32b2(num);
        },
        randomBytes: (bytesLength = 32) => {
          if (crypto4.web) {
            return crypto4.web.getRandomValues(new Uint8Array(bytesLength));
          } else if (crypto4.node) {
            const { randomBytes: randomBytes2 } = crypto4.node;
            return Uint8Array.from(randomBytes2(bytesLength));
          } else {
            throw new Error("The environment doesn't have randomBytes function");
          }
        },
        randomPrivateKey: () => {
          return exports2.utils.hashToPrivateKey(exports2.utils.randomBytes(40));
        },
        bytesToHex: bytesToHex3,
        hexToBytes: hexToBytes3,
        concatBytes: concatBytes3,
        mod: mod4,
        invert: invert3,
        sha256: async (...messages) => {
          if (crypto4.web) {
            const buffer2 = await crypto4.web.subtle.digest("SHA-256", concatBytes3(...messages));
            return new Uint8Array(buffer2);
          } else if (crypto4.node) {
            const { createHash } = crypto4.node;
            const hash = createHash("sha256");
            messages.forEach((m) => hash.update(m));
            return Uint8Array.from(hash.digest());
          } else {
            throw new Error("The environment doesn't have sha256 function");
          }
        },
        hmacSha256: async (key, ...messages) => {
          if (crypto4.web) {
            const ckey = await crypto4.web.subtle.importKey("raw", key, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
            const message2 = concatBytes3(...messages);
            const buffer2 = await crypto4.web.subtle.sign("HMAC", ckey, message2);
            return new Uint8Array(buffer2);
          } else if (crypto4.node) {
            const { createHmac } = crypto4.node;
            const hash = createHmac("sha256", key);
            messages.forEach((m) => hash.update(m));
            return Uint8Array.from(hash.digest());
          } else {
            throw new Error("The environment doesn't have hmac-sha256 function");
          }
        },
        sha256Sync: void 0,
        hmacSha256Sync: void 0,
        taggedHash: async (tag, ...messages) => {
          let tagP = TAGGED_HASH_PREFIXES2[tag];
          if (tagP === void 0) {
            const tagH = await exports2.utils.sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
            tagP = concatBytes3(tagH, tagH);
            TAGGED_HASH_PREFIXES2[tag] = tagP;
          }
          return exports2.utils.sha256(tagP, ...messages);
        },
        taggedHashSync: (tag, ...messages) => {
          if (typeof exports2.utils.sha256Sync !== "function")
            throw new Error("utils.sha256Sync is undefined, you need to set it");
          let tagP = TAGGED_HASH_PREFIXES2[tag];
          if (tagP === void 0) {
            const tagH = exports2.utils.sha256Sync(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
            tagP = concatBytes3(tagH, tagH);
            TAGGED_HASH_PREFIXES2[tag] = tagP;
          }
          return exports2.utils.sha256Sync(tagP, ...messages);
        },
        precompute(windowSize = 8, point = Point3.BASE) {
          const cached = point === Point3.BASE ? point : new Point3(point.x, point.y);
          cached._setWindowSize(windowSize);
          cached.multiply(_3n2);
          return cached;
        }
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/secp256k1.js
  var require_secp256k1 = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/secp256k1.js"(exports2, module2) {
      "use strict";
      var errcode12 = require_err_code();
      var secp = require_lib2();
      var { sha256: sha2562 } = (init_sha2_browser(), __toCommonJS(sha2_browser_exports));
      module2.exports = () => {
        const privateKeyLength = 32;
        function generateKey4() {
          return secp.utils.randomPrivateKey();
        }
        async function hashAndSign4(key, msg) {
          const { digest: digest2 } = await sha2562.digest(msg);
          try {
            return await secp.sign(digest2, key);
          } catch (err) {
            throw errcode12(err, "ERR_INVALID_INPUT");
          }
        }
        async function hashAndVerify4(key, sig, msg) {
          try {
            const { digest: digest2 } = await sha2562.digest(msg);
            return secp.verify(sig, digest2, key);
          } catch (err) {
            throw errcode12(err, "ERR_INVALID_INPUT");
          }
        }
        function compressPublicKey2(key) {
          const point = secp.Point.fromHex(key).toRawBytes(true);
          return point;
        }
        function decompressPublicKey(key) {
          const point = secp.Point.fromHex(key).toRawBytes(false);
          return point;
        }
        function validatePrivateKey2(key) {
          try {
            secp.getPublicKey(key, true);
          } catch (err) {
            throw errcode12(err, "ERR_INVALID_PRIVATE_KEY");
          }
        }
        function validatePublicKey2(key) {
          try {
            secp.Point.fromHex(key);
          } catch (err) {
            throw errcode12(err, "ERR_INVALID_PUBLIC_KEY");
          }
        }
        function computePublicKey2(privateKey) {
          try {
            return secp.getPublicKey(privateKey, true);
          } catch (err) {
            throw errcode12(err, "ERR_INVALID_PRIVATE_KEY");
          }
        }
        return {
          generateKey: generateKey4,
          privateKeyLength,
          hashAndSign: hashAndSign4,
          hashAndVerify: hashAndVerify4,
          compressPublicKey: compressPublicKey2,
          decompressPublicKey,
          validatePrivateKey: validatePrivateKey2,
          validatePublicKey: validatePublicKey2,
          computePublicKey: computePublicKey2
        };
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/secp256k1-class.js
  var require_secp256k1_class = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/secp256k1-class.js"(exports2, module2) {
      "use strict";
      var { sha256: sha2562 } = (init_sha2_browser(), __toCommonJS(sha2_browser_exports));
      var errcode12 = require_err_code();
      var { equals: uint8ArrayEquals } = (init_equals(), __toCommonJS(equals_exports));
      var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
      var exporter2 = require_exporter();
      module2.exports = (keysProtobuf, randomBytes2, crypto4) => {
        crypto4 = crypto4 || require_secp256k1()();
        class Secp256k1PublicKey2 {
          constructor(key) {
            crypto4.validatePublicKey(key);
            this._key = key;
          }
          verify(data, sig) {
            return crypto4.hashAndVerify(this._key, sig, data);
          }
          marshal() {
            return crypto4.compressPublicKey(this._key);
          }
          get bytes() {
            return keysProtobuf.PublicKey.encode({
              Type: keysProtobuf.KeyType.Secp256k1,
              Data: this.marshal()
            }).finish();
          }
          equals(key) {
            return uint8ArrayEquals(this.bytes, key.bytes);
          }
          async hash() {
            const { bytes: bytes2 } = await sha2562.digest(this.bytes);
            return bytes2;
          }
        }
        class Secp256k1PrivateKey2 {
          constructor(key, publicKey) {
            this._key = key;
            this._publicKey = publicKey || crypto4.computePublicKey(key);
            crypto4.validatePrivateKey(this._key);
            crypto4.validatePublicKey(this._publicKey);
          }
          sign(message2) {
            return crypto4.hashAndSign(this._key, message2);
          }
          get public() {
            return new Secp256k1PublicKey2(this._publicKey);
          }
          marshal() {
            return this._key;
          }
          get bytes() {
            return keysProtobuf.PrivateKey.encode({
              Type: keysProtobuf.KeyType.Secp256k1,
              Data: this.marshal()
            }).finish();
          }
          equals(key) {
            return uint8ArrayEquals(this.bytes, key.bytes);
          }
          async hash() {
            const { bytes: bytes2 } = await sha2562.digest(this.bytes);
            return bytes2;
          }
          async id() {
            const hash = await this.public.hash();
            return uint8ArrayToString(hash, "base58btc");
          }
          async export(password, format = "libp2p-key") {
            if (format === "libp2p-key") {
              return exporter2.export(this.bytes, password);
            } else {
              throw errcode12(new Error(`export format '${format}' is not supported`), "ERR_INVALID_EXPORT_FORMAT");
            }
          }
        }
        function unmarshalSecp256k1PrivateKey2(bytes2) {
          return new Secp256k1PrivateKey2(bytes2);
        }
        function unmarshalSecp256k1PublicKey2(bytes2) {
          return new Secp256k1PublicKey2(bytes2);
        }
        async function generateKeyPair4() {
          const privateKeyBytes = await crypto4.generateKey();
          return new Secp256k1PrivateKey2(privateKeyBytes);
        }
        return {
          Secp256k1PublicKey: Secp256k1PublicKey2,
          Secp256k1PrivateKey: Secp256k1PrivateKey2,
          unmarshalSecp256k1PrivateKey: unmarshalSecp256k1PrivateKey2,
          unmarshalSecp256k1PublicKey: unmarshalSecp256k1PublicKey2,
          generateKeyPair: generateKeyPair4
        };
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/key-stretcher.js
  var require_key_stretcher = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/key-stretcher.js"(exports2, module2) {
      "use strict";
      var errcode12 = require_err_code();
      var { concat: uint8ArrayConcat } = (init_concat(), __toCommonJS(concat_exports));
      var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
      var hmac = require_index_browser();
      var cipherMap = {
        "AES-128": {
          ivSize: 16,
          keySize: 16
        },
        "AES-256": {
          ivSize: 16,
          keySize: 32
        },
        Blowfish: {
          ivSize: 8,
          cipherKeySize: 32
        }
      };
      module2.exports = async (cipherType, hash, secret) => {
        const cipher = cipherMap[cipherType];
        if (!cipher) {
          const allowed = Object.keys(cipherMap).join(" / ");
          throw errcode12(new Error(`unknown cipher type '${cipherType}'. Must be ${allowed}`), "ERR_INVALID_CIPHER_TYPE");
        }
        if (!hash) {
          throw errcode12(new Error("missing hash type"), "ERR_MISSING_HASH_TYPE");
        }
        const cipherKeySize = cipher.keySize;
        const ivSize = cipher.ivSize;
        const hmacKeySize = 20;
        const seed = uint8ArrayFromString("key expansion");
        const resultLength = 2 * (ivSize + cipherKeySize + hmacKeySize);
        const m = await hmac.create(hash, secret);
        let a = await m.digest(seed);
        const result = [];
        let j = 0;
        while (j < resultLength) {
          const b = await m.digest(uint8ArrayConcat([a, seed]));
          let todo = b.length;
          if (j + todo > resultLength) {
            todo = resultLength - j;
          }
          result.push(b);
          j += todo;
          a = await m.digest(a);
        }
        const half = resultLength / 2;
        const resultBuffer = uint8ArrayConcat(result);
        const r1 = resultBuffer.slice(0, half);
        const r2 = resultBuffer.slice(half, resultLength);
        const createKey = (res) => ({
          iv: res.slice(0, ivSize),
          cipherKey: res.slice(ivSize, ivSize + cipherKeySize),
          macKey: res.slice(ivSize + cipherKeySize)
        });
        return {
          k1: createKey(r1),
          k2: createKey(r2)
        };
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/validate-curve-type.js
  var require_validate_curve_type = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/validate-curve-type.js"(exports2, module2) {
      "use strict";
      var errcode12 = require_err_code();
      module2.exports = function(curveTypes2, type) {
        if (!curveTypes2.includes(type)) {
          const names2 = curveTypes2.join(" / ");
          throw errcode12(new Error(`Unknown curve: ${type}. Must be ${names2}`), "ERR_INVALID_CURVE");
        }
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/ecdh-browser.js
  var require_ecdh_browser = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/ecdh-browser.js"(exports2) {
      "use strict";
      var errcode12 = require_err_code();
      var webcrypto = require_webcrypto();
      var { base64urlToBuffer: base64urlToBuffer2 } = require_util2();
      var validateCurveType = require_validate_curve_type();
      var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
      var { concat: uint8ArrayConcat } = (init_concat(), __toCommonJS(concat_exports));
      var { equals: uint8ArrayEquals } = (init_equals(), __toCommonJS(equals_exports));
      var bits2 = {
        "P-256": 256,
        "P-384": 384,
        "P-521": 521
      };
      exports2.generateEphmeralKeyPair = async function(curve) {
        validateCurveType(Object.keys(bits2), curve);
        const pair = await webcrypto.get().subtle.generateKey({
          name: "ECDH",
          namedCurve: curve
        }, true, ["deriveBits"]);
        const genSharedKey = async (theirPub, forcePrivate) => {
          let privateKey;
          if (forcePrivate) {
            privateKey = await webcrypto.get().subtle.importKey("jwk", unmarshalPrivateKey3(curve, forcePrivate), {
              name: "ECDH",
              namedCurve: curve
            }, false, ["deriveBits"]);
          } else {
            privateKey = pair.privateKey;
          }
          const keys2 = [
            await webcrypto.get().subtle.importKey("jwk", unmarshalPublicKey2(curve, theirPub), {
              name: "ECDH",
              namedCurve: curve
            }, false, []),
            privateKey
          ];
          const buffer2 = await webcrypto.get().subtle.deriveBits({
            name: "ECDH",
            namedCurve: curve,
            public: keys2[0]
          }, keys2[1], bits2[curve]);
          return new Uint8Array(buffer2, buffer2.byteOffset, buffer2.byteLength);
        };
        const publicKey = await webcrypto.get().subtle.exportKey("jwk", pair.publicKey);
        return {
          key: marshalPublicKey(publicKey),
          genSharedKey
        };
      };
      var curveLengths = {
        "P-256": 32,
        "P-384": 48,
        "P-521": 66
      };
      function marshalPublicKey(jwk) {
        const byteLen = curveLengths[jwk.crv];
        return uint8ArrayConcat([
          Uint8Array.from([4]),
          base64urlToBuffer2(jwk.x, byteLen),
          base64urlToBuffer2(jwk.y, byteLen)
        ], 1 + byteLen * 2);
      }
      function unmarshalPublicKey2(curve, key) {
        const byteLen = curveLengths[curve];
        if (uint8ArrayEquals(!key.slice(0, 1), Uint8Array.from([4]))) {
          throw errcode12(new Error("Cannot unmarshal public key - invalid key format"), "ERR_INVALID_KEY_FORMAT");
        }
        return {
          kty: "EC",
          crv: curve,
          x: uint8ArrayToString(key.slice(1, byteLen + 1), "base64url"),
          y: uint8ArrayToString(key.slice(1 + byteLen), "base64url"),
          ext: true
        };
      }
      var unmarshalPrivateKey3 = (curve, key) => ({
        ...unmarshalPublicKey2(curve, key.public),
        d: uint8ArrayToString(key.private, "base64url")
      });
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/ephemeral-keys.js
  var require_ephemeral_keys = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/ephemeral-keys.js"(exports2, module2) {
      "use strict";
      var ecdh = require_ecdh_browser();
      module2.exports = async (curve) => ecdh.generateEphmeralKeyPair(curve);
    }
  });

  // ../node_modules/libp2p-crypto/src/keys/index.js
  var require_keys2 = __commonJS({
    "../node_modules/libp2p-crypto/src/keys/index.js"(exports2, module2) {
      "use strict";
      var keysPBM = require_keys();
      require_asn1();
      require_pbe();
      var forge6 = require_forge();
      var errcode12 = require_err_code();
      var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
      var importer2 = require_importer();
      var supportedKeys2 = {
        rsa: require_rsa_class(),
        ed25519: require_ed25519_class(),
        secp256k1: require_secp256k1_class()(keysPBM, require_random_bytes())
      };
      var ErrMissingSecp256K1 = {
        message: "secp256k1 support requires libp2p-crypto-secp256k1 package",
        code: "ERR_MISSING_PACKAGE"
      };
      function typeToKey(type) {
        const key = supportedKeys2[type.toLowerCase()];
        if (!key) {
          const supported = Object.keys(supportedKeys2).join(" / ");
          throw errcode12(new Error(`invalid or unsupported key type ${type}. Must be ${supported}`), "ERR_UNSUPPORTED_KEY_TYPE");
        }
        return key;
      }
      var generateKeyPair4 = async (type, bits2) => {
        return typeToKey(type).generateKeyPair(bits2);
      };
      var generateKeyPairFromSeed2 = async (type, seed, bits2) => {
        const key = typeToKey(type);
        if (type.toLowerCase() !== "ed25519") {
          throw errcode12(new Error("Seed key derivation is unimplemented for RSA or secp256k1"), "ERR_UNSUPPORTED_KEY_DERIVATION_TYPE");
        }
        return key.generateKeyPairFromSeed(seed, bits2);
      };
      var unmarshalPublicKey2 = (buf2) => {
        const decoded = keysPBM.PublicKey.decode(buf2);
        const data = decoded.Data;
        switch (decoded.Type) {
          case keysPBM.KeyType.RSA:
            return supportedKeys2.rsa.unmarshalRsaPublicKey(data);
          case keysPBM.KeyType.Ed25519:
            return supportedKeys2.ed25519.unmarshalEd25519PublicKey(data);
          case keysPBM.KeyType.Secp256k1:
            if (supportedKeys2.secp256k1) {
              return supportedKeys2.secp256k1.unmarshalSecp256k1PublicKey(data);
            } else {
              throw errcode12(new Error(ErrMissingSecp256K1.message), ErrMissingSecp256K1.code);
            }
          default:
            typeToKey(decoded.Type);
        }
      };
      var marshalPublicKey = (key, type) => {
        type = (type || "rsa").toLowerCase();
        typeToKey(type);
        return key.bytes;
      };
      var unmarshalPrivateKey3 = async (buf2) => {
        const decoded = keysPBM.PrivateKey.decode(buf2);
        const data = decoded.Data;
        switch (decoded.Type) {
          case keysPBM.KeyType.RSA:
            return supportedKeys2.rsa.unmarshalRsaPrivateKey(data);
          case keysPBM.KeyType.Ed25519:
            return supportedKeys2.ed25519.unmarshalEd25519PrivateKey(data);
          case keysPBM.KeyType.Secp256k1:
            if (supportedKeys2.secp256k1) {
              return supportedKeys2.secp256k1.unmarshalSecp256k1PrivateKey(data);
            } else {
              throw errcode12(new Error(ErrMissingSecp256K1.message), ErrMissingSecp256K1.code);
            }
          default:
            typeToKey(decoded.Type);
        }
      };
      var marshalPrivateKey = (key, type) => {
        type = (type || "rsa").toLowerCase();
        typeToKey(type);
        return key.bytes;
      };
      var importKey = async (encryptedKey, password) => {
        try {
          const key2 = await importer2.import(encryptedKey, password);
          return unmarshalPrivateKey3(key2);
        } catch (_) {
        }
        const key = forge6.pki.decryptRsaPrivateKey(encryptedKey, password);
        if (key === null) {
          throw errcode12(new Error("Cannot read the key, most likely the password is wrong or not a RSA key"), "ERR_CANNOT_DECRYPT_PEM");
        }
        let der = forge6.asn1.toDer(forge6.pki.privateKeyToAsn1(key));
        der = uint8ArrayFromString(der.getBytes(), "ascii");
        return supportedKeys2.rsa.unmarshalRsaPrivateKey(der);
      };
      module2.exports = {
        supportedKeys: supportedKeys2,
        keysPBM,
        keyStretcher: require_key_stretcher(),
        generateEphemeralKeyPair: require_ephemeral_keys(),
        generateKeyPair: generateKeyPair4,
        generateKeyPairFromSeed: generateKeyPairFromSeed2,
        unmarshalPublicKey: unmarshalPublicKey2,
        marshalPublicKey,
        unmarshalPrivateKey: unmarshalPrivateKey3,
        marshalPrivateKey,
        import: importKey
      };
    }
  });

  // ../node_modules/libp2p-crypto/src/pbkdf2.js
  var require_pbkdf22 = __commonJS({
    "../node_modules/libp2p-crypto/src/pbkdf2.js"(exports2, module2) {
      "use strict";
      var forgePbkdf2 = require_pbkdf2();
      var forgeUtil = require_util();
      var errcode12 = require_err_code();
      var hashName = {
        sha1: "sha1",
        "sha2-256": "sha256",
        "sha2-512": "sha512"
      };
      function pbkdf2(password, salt, iterations, keySize, hash) {
        const hasher = hashName[hash];
        if (!hasher) {
          const types = Object.keys(hashName).join(" / ");
          throw errcode12(new Error(`Hash '${hash}' is unknown or not supported. Must be ${types}`), "ERR_UNSUPPORTED_HASH_TYPE");
        }
        const dek = forgePbkdf2(password, salt, iterations, keySize, hasher);
        return forgeUtil.encode64(dek);
      }
      module2.exports = pbkdf2;
    }
  });

  // ../node_modules/libp2p-crypto/src/index.js
  var require_src = __commonJS({
    "../node_modules/libp2p-crypto/src/index.js"(exports2) {
      "use strict";
      var hmac = require_index_browser();
      var aes = require_aes2();
      var keys2 = require_keys2();
      exports2.aes = aes;
      exports2.hmac = hmac;
      exports2.keys = keys2;
      exports2.randomBytes = require_random_bytes();
      exports2.pbkdf2 = require_pbkdf22();
    }
  });

  // ../node_modules/it-drain/index.js
  var require_it_drain = __commonJS({
    "../node_modules/it-drain/index.js"(exports2, module2) {
      "use strict";
      var drain2 = async (source) => {
        for await (const _ of source) {
        }
      };
      module2.exports = drain2;
    }
  });

  // ../node_modules/it-filter/index.js
  var require_it_filter = __commonJS({
    "../node_modules/it-filter/index.js"(exports2, module2) {
      "use strict";
      var filter2 = async function* (source, fn) {
        for await (const entry of source) {
          if (await fn(entry)) {
            yield entry;
          }
        }
      };
      module2.exports = filter2;
    }
  });

  // ../node_modules/it-take/index.js
  var require_it_take = __commonJS({
    "../node_modules/it-take/index.js"(exports2, module2) {
      "use strict";
      var take2 = async function* (source, limit) {
        let items = 0;
        if (limit < 1) {
          return;
        }
        for await (const entry of source) {
          yield entry;
          items++;
          if (items === limit) {
            return;
          }
        }
      };
      module2.exports = take2;
    }
  });

  // ../node_modules/it-all/index.js
  var require_it_all = __commonJS({
    "../node_modules/it-all/index.js"(exports2, module2) {
      "use strict";
      var all2 = async (source) => {
        const arr = [];
        for await (const entry of source) {
          arr.push(entry);
        }
        return arr;
      };
      module2.exports = all2;
    }
  });

  // index.ts
  init_from_string();
  init_to_string();

  // ../node_modules/ipns/dist/src/index.js
  var import_timestamp_nano = __toESM(require_timestamp(), 1);

  // ../node_modules/nanoid/index.browser.js
  var nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63;
    if (byte < 36) {
      id += byte.toString(36);
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase();
    } else if (byte > 62) {
      id += "-";
    } else {
      id += "_";
    }
    return id;
  }, "");

  // ../node_modules/interface-datastore/esm/src/key.js
  init_to_string();
  init_from_string();
  var pathSepS = "/";
  var pathSepB = new TextEncoder().encode(pathSepS);
  var pathSep = pathSepB[0];
  var Key = class {
    constructor(s, clean) {
      if (typeof s === "string") {
        this._buf = fromString2(s);
      } else if (s instanceof Uint8Array) {
        this._buf = s;
      } else {
        throw new Error("Invalid key, should be String of Uint8Array");
      }
      if (clean == null) {
        clean = true;
      }
      if (clean) {
        this.clean();
      }
      if (this._buf.byteLength === 0 || this._buf[0] !== pathSep) {
        throw new Error("Invalid key");
      }
    }
    toString(encoding = "utf8") {
      return toString2(this._buf, encoding);
    }
    uint8Array() {
      return this._buf;
    }
    get [Symbol.toStringTag]() {
      return `Key(${this.toString()})`;
    }
    static withNamespaces(list) {
      return new Key(list.join(pathSepS));
    }
    static random() {
      return new Key(nanoid().replace(/-/g, ""));
    }
    static asKey(other) {
      if (other instanceof Uint8Array || typeof other === "string") {
        return new Key(other);
      }
      if (other.uint8Array) {
        return new Key(other.uint8Array());
      }
      return null;
    }
    clean() {
      if (!this._buf || this._buf.byteLength === 0) {
        this._buf = pathSepB;
      }
      if (this._buf[0] !== pathSep) {
        const bytes2 = new Uint8Array(this._buf.byteLength + 1);
        bytes2.fill(pathSep, 0, 1);
        bytes2.set(this._buf, 1);
        this._buf = bytes2;
      }
      while (this._buf.byteLength > 1 && this._buf[this._buf.byteLength - 1] === pathSep) {
        this._buf = this._buf.subarray(0, -1);
      }
    }
    less(key) {
      const list1 = this.list();
      const list2 = key.list();
      for (let i = 0; i < list1.length; i++) {
        if (list2.length < i + 1) {
          return false;
        }
        const c1 = list1[i];
        const c2 = list2[i];
        if (c1 < c2) {
          return true;
        } else if (c1 > c2) {
          return false;
        }
      }
      return list1.length < list2.length;
    }
    reverse() {
      return Key.withNamespaces(this.list().slice().reverse());
    }
    namespaces() {
      return this.list();
    }
    baseNamespace() {
      const ns = this.namespaces();
      return ns[ns.length - 1];
    }
    list() {
      return this.toString().split(pathSepS).slice(1);
    }
    type() {
      return namespaceType(this.baseNamespace());
    }
    name() {
      return namespaceValue(this.baseNamespace());
    }
    instance(s) {
      return new Key(this.toString() + ":" + s);
    }
    path() {
      let p = this.parent().toString();
      if (!p.endsWith(pathSepS)) {
        p += pathSepS;
      }
      p += this.type();
      return new Key(p);
    }
    parent() {
      const list = this.list();
      if (list.length === 1) {
        return new Key(pathSepS);
      }
      return new Key(list.slice(0, -1).join(pathSepS));
    }
    child(key) {
      if (this.toString() === pathSepS) {
        return key;
      } else if (key.toString() === pathSepS) {
        return this;
      }
      return new Key(this.toString() + key.toString(), false);
    }
    isAncestorOf(other) {
      if (other.toString() === this.toString()) {
        return false;
      }
      return other.toString().startsWith(this.toString());
    }
    isDecendantOf(other) {
      if (other.toString() === this.toString()) {
        return false;
      }
      return this.toString().startsWith(other.toString());
    }
    isTopLevel() {
      return this.list().length === 1;
    }
    concat(...keys2) {
      return Key.withNamespaces([
        ...this.namespaces(),
        ...flatten(keys2.map((key) => key.namespaces()))
      ]);
    }
  };
  function namespaceType(ns) {
    const parts = ns.split(":");
    if (parts.length < 2) {
      return "";
    }
    return parts.slice(0, -1).join(":");
  }
  function namespaceValue(ns) {
    const parts = ns.split(":");
    return parts[parts.length - 1];
  }
  function flatten(arr) {
    return [].concat(...arr);
  }

  // ../node_modules/uint8arrays/esm/src/index.js
  init_concat();
  init_equals();
  init_from_string();
  init_to_string();

  // ../node_modules/uint8arraylist/dist/src/index.js
  var symbol = Symbol.for("@achingbrain/uint8arraylist");
  function findBufAndOffset(bufs, index, totalLength) {
    if (index == null || index < 0 || index >= totalLength) {
      throw new RangeError("index is out of bounds");
    }
    let offset = 0;
    for (const buf2 of bufs) {
      const bufEnd = offset + buf2.byteLength;
      if (index < bufEnd) {
        return {
          buf: buf2,
          index: index - offset
        };
      }
      offset = bufEnd;
    }
    throw new RangeError("index is out of bounds");
  }
  function isUint8ArrayList(value) {
    return Boolean(value?.[symbol]);
  }
  var Uint8ArrayList = class {
    constructor(...data) {
      Object.defineProperty(this, symbol, { value: true });
      this.bufs = [];
      this.length = 0;
      this.appendAll(data);
    }
    *[Symbol.iterator]() {
      yield* this.bufs;
    }
    get byteLength() {
      return this.length;
    }
    append(...bufs) {
      this.appendAll(bufs);
    }
    appendAll(bufs) {
      let length2 = 0;
      for (const buf2 of bufs) {
        if (buf2 instanceof Uint8Array) {
          length2 += buf2.byteLength;
          this.bufs.push(buf2);
        } else if (isUint8ArrayList(buf2)) {
          length2 += buf2.length;
          this.bufs = this.bufs.concat(buf2.bufs);
        } else {
          throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");
        }
      }
      this.length += length2;
    }
    get(index) {
      const res = findBufAndOffset(this.bufs, index, this.length);
      return res.buf[res.index];
    }
    set(index, value) {
      const res = findBufAndOffset(this.bufs, index, this.length);
      res.buf[res.index] = value;
    }
    write(buf2, offset = 0) {
      if (buf2 instanceof Uint8Array) {
        for (let i = 0; i < buf2.length; i++) {
          this.set(offset + i, buf2[i]);
        }
      } else if (isUint8ArrayList(buf2)) {
        for (let i = 0; i < buf2.length; i++) {
          this.set(offset + i, buf2.get(i));
        }
      } else {
        throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList");
      }
    }
    consume(bytes2) {
      bytes2 = Math.trunc(bytes2);
      if (Number.isNaN(bytes2) || bytes2 <= 0) {
        return;
      }
      while (this.bufs.length > 0) {
        if (bytes2 >= this.bufs[0].byteLength) {
          bytes2 -= this.bufs[0].byteLength;
          this.length -= this.bufs[0].byteLength;
          this.bufs.shift();
        } else {
          this.bufs[0] = this.bufs[0].subarray(bytes2);
          this.length -= bytes2;
          break;
        }
      }
    }
    slice(beginInclusive, endExclusive) {
      const { bufs, length: length2 } = this._subList(beginInclusive, endExclusive);
      return concat(bufs, length2);
    }
    subarray(beginInclusive, endExclusive) {
      const { bufs } = this._subList(beginInclusive, endExclusive);
      const list = new Uint8ArrayList();
      list.appendAll(bufs);
      return list;
    }
    _subList(beginInclusive, endExclusive) {
      if (beginInclusive == null && endExclusive == null) {
        return { bufs: this.bufs, length: this.length };
      }
      beginInclusive = beginInclusive ?? 0;
      endExclusive = endExclusive ?? (this.length > 0 ? this.length : 0);
      if (beginInclusive < 0 || endExclusive > this.length) {
        throw new RangeError("index out of bounds");
      }
      if (beginInclusive === endExclusive) {
        return { bufs: [], length: 0 };
      }
      const bufs = [];
      let offset = 0;
      for (const buf2 of this.bufs) {
        const bufStart = offset;
        const bufEnd = bufStart + buf2.byteLength;
        const sliceStartInBuf = beginInclusive >= bufStart && beginInclusive < bufEnd;
        const sliceEndsInBuf = endExclusive > bufStart && endExclusive <= bufEnd;
        const bufInSlice = beginInclusive < bufStart && endExclusive >= bufEnd;
        offset = bufEnd;
        let startIndex;
        let endIndex;
        if (sliceStartInBuf) {
          startIndex = beginInclusive - bufStart;
          endIndex = buf2.byteLength;
        }
        if (sliceEndsInBuf) {
          endIndex = endExclusive - bufStart;
          if (startIndex == null) {
            startIndex = 0;
          }
        }
        if (bufInSlice) {
          startIndex = 0;
          endIndex = buf2.byteLength;
        }
        if (startIndex != null && endIndex != null) {
          bufs.push(buf2.subarray(startIndex, endIndex));
        }
        if (sliceEndsInBuf) {
          break;
        }
      }
      return { bufs, length: endExclusive - beginInclusive };
    }
    getInt8(byteOffset) {
      const buf2 = this.slice(byteOffset, byteOffset + 1);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      return view.getInt8(0);
    }
    setInt8(byteOffset, value) {
      const buf2 = new Uint8Array(1);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      view.setInt8(0, value);
      this.write(buf2, byteOffset);
    }
    getInt16(byteOffset, littleEndian) {
      const buf2 = this.slice(byteOffset, byteOffset + 2);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      return view.getInt16(0, littleEndian);
    }
    setInt16(byteOffset, value, littleEndian) {
      const buf2 = new Uint8Array(2);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      view.setInt16(0, value, littleEndian);
      this.write(buf2, byteOffset);
    }
    getInt32(byteOffset, littleEndian) {
      const buf2 = this.slice(byteOffset, byteOffset + 4);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      return view.getInt32(0, littleEndian);
    }
    setInt32(byteOffset, value, littleEndian) {
      const buf2 = new Uint8Array(4);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      view.setInt32(0, value, littleEndian);
      this.write(buf2, byteOffset);
    }
    getBigInt64(byteOffset, littleEndian) {
      const buf2 = this.slice(byteOffset, byteOffset + 8);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      return view.getBigInt64(0, littleEndian);
    }
    setBigInt64(byteOffset, value, littleEndian) {
      const buf2 = new Uint8Array(8);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      view.setBigInt64(0, value, littleEndian);
      this.write(buf2, byteOffset);
    }
    getUint8(byteOffset) {
      const buf2 = this.slice(byteOffset, byteOffset + 1);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      return view.getUint8(0);
    }
    setUint8(byteOffset, value) {
      const buf2 = new Uint8Array(1);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      view.setUint8(0, value);
      this.write(buf2, byteOffset);
    }
    getUint16(byteOffset, littleEndian) {
      const buf2 = this.slice(byteOffset, byteOffset + 2);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      return view.getUint16(0, littleEndian);
    }
    setUint16(byteOffset, value, littleEndian) {
      const buf2 = new Uint8Array(2);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      view.setUint16(0, value, littleEndian);
      this.write(buf2, byteOffset);
    }
    getUint32(byteOffset, littleEndian) {
      const buf2 = this.slice(byteOffset, byteOffset + 4);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      return view.getUint32(0, littleEndian);
    }
    setUint32(byteOffset, value, littleEndian) {
      const buf2 = new Uint8Array(4);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      view.setUint32(0, value, littleEndian);
      this.write(buf2, byteOffset);
    }
    getBigUint64(byteOffset, littleEndian) {
      const buf2 = this.slice(byteOffset, byteOffset + 8);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      return view.getBigUint64(0, littleEndian);
    }
    setBigUint64(byteOffset, value, littleEndian) {
      const buf2 = new Uint8Array(8);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      view.setBigUint64(0, value, littleEndian);
      this.write(buf2, byteOffset);
    }
    getFloat32(byteOffset, littleEndian) {
      const buf2 = this.slice(byteOffset, byteOffset + 4);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      return view.getFloat32(0, littleEndian);
    }
    setFloat32(byteOffset, value, littleEndian) {
      const buf2 = new Uint8Array(4);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      view.setFloat32(0, value, littleEndian);
      this.write(buf2, byteOffset);
    }
    getFloat64(byteOffset, littleEndian) {
      const buf2 = this.slice(byteOffset, byteOffset + 8);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      return view.getFloat64(0, littleEndian);
    }
    setFloat64(byteOffset, value, littleEndian) {
      const buf2 = new Uint8Array(8);
      const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
      view.setFloat64(0, value, littleEndian);
      this.write(buf2, byteOffset);
    }
  };

  // ../node_modules/protons-runtime/dist/src/utils/accessor.js
  function accessor(buf2) {
    if (buf2 instanceof Uint8Array) {
      return {
        get(index) {
          return buf2[index];
        },
        set(index, value) {
          buf2[index] = value;
        }
      };
    }
    return {
      get(index) {
        return buf2.get(index);
      },
      set(index, value) {
        buf2.set(index, value);
      }
    };
  }

  // ../node_modules/protons-runtime/dist/src/utils/long-bits.js
  var TWO_32 = 4294967296;
  var LongBits = class {
    constructor(hi = 0, lo = 0) {
      this.hi = hi;
      this.lo = lo;
    }
    toBigInt(unsigned3) {
      if (unsigned3) {
        return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
      }
      if (this.hi >>> 31 !== 0) {
        const lo = ~this.lo + 1 >>> 0;
        let hi = ~this.hi >>> 0;
        if (lo === 0) {
          hi = hi + 1 >>> 0;
        }
        return -(BigInt(lo) + (BigInt(hi) << 32n));
      }
      return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
    }
    zzDecode() {
      const mask = -(this.lo & 1);
      const lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
      const hi = (this.hi >>> 1 ^ mask) >>> 0;
      return new LongBits(hi, lo);
    }
    zzEncode() {
      const mask = this.hi >> 31;
      const hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
      const lo = (this.lo << 1 ^ mask) >>> 0;
      return new LongBits(hi, lo);
    }
    toBytes(buf2, offset = 0) {
      const access = accessor(buf2);
      while (this.hi > 0) {
        access.set(offset++, this.lo & 127 | 128);
        this.lo = (this.lo >>> 7 | this.hi << 25) >>> 0;
        this.hi >>>= 7;
      }
      while (this.lo > 127) {
        access.set(offset++, this.lo & 127 | 128);
        this.lo = this.lo >>> 7;
      }
      access.set(offset++, this.lo);
    }
    static fromBigInt(value) {
      if (value === 0n) {
        return new LongBits();
      }
      const negative = value < 0;
      if (negative) {
        value = -value;
      }
      let hi = Number(value >> 32n) | 0;
      let lo = Number(value - (BigInt(hi) << 32n)) | 0;
      if (negative) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > TWO_32) {
          lo = 0;
          if (++hi > TWO_32) {
            hi = 0;
          }
        }
      }
      return new LongBits(hi, lo);
    }
    static fromNumber(value) {
      if (value === 0) {
        return new LongBits();
      }
      const sign4 = value < 0;
      if (sign4) {
        value = -value;
      }
      let lo = value >>> 0;
      let hi = (value - lo) / 4294967296 >>> 0;
      if (sign4) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
          lo = 0;
          if (++hi > 4294967295) {
            hi = 0;
          }
        }
      }
      return new LongBits(hi, lo);
    }
    static fromBytes(buf2, offset) {
      const access = accessor(buf2);
      const bits2 = new LongBits();
      let i = 0;
      if (buf2.length - offset > 4) {
        for (; i < 4; ++i) {
          bits2.lo = (bits2.lo | (access.get(offset) & 127) << i * 7) >>> 0;
          if (access.get(offset++) < 128) {
            return bits2;
          }
        }
        bits2.lo = (bits2.lo | (access.get(offset) & 127) << 28) >>> 0;
        bits2.hi = (bits2.hi | (access.get(offset) & 127) >> 4) >>> 0;
        if (access.get(offset++) < 128) {
          return bits2;
        }
        i = 0;
      } else {
        for (; i < 3; ++i) {
          if (offset >= buf2.length) {
            throw RangeError(`index out of range: ${offset} > ${buf2.length}`);
          }
          bits2.lo = (bits2.lo | (access.get(offset) & 127) << i * 7) >>> 0;
          if (access.get(offset++) < 128) {
            return bits2;
          }
        }
        bits2.lo = (bits2.lo | (access.get(offset++) & 127) << i * 7) >>> 0;
        return bits2;
      }
      if (buf2.length - offset > 4) {
        for (; i < 5; ++i) {
          bits2.hi = (bits2.hi | (access.get(offset) & 127) << i * 7 + 3) >>> 0;
          if (access.get(offset++) < 128) {
            return bits2;
          }
        }
      } else {
        for (; i < 5; ++i) {
          if (offset >= buf2.length) {
            throw RangeError(`index out of range: ${offset} > ${buf2.length}`);
          }
          bits2.hi = (bits2.hi | (access.get(offset) & 127) << i * 7 + 3) >>> 0;
          if (access.get(offset++) < 128) {
            return bits2;
          }
        }
      }
      throw Error("invalid varint encoding");
    }
  };

  // ../node_modules/protons-runtime/dist/src/utils/varint.js
  var MSB2 = 128;
  var REST2 = 127;
  var MSBALL2 = ~REST2;
  var INT2 = Math.pow(2, 31);
  var N12 = Math.pow(2, 7);
  var N22 = Math.pow(2, 14);
  var N32 = Math.pow(2, 21);
  var N42 = Math.pow(2, 28);
  var N52 = Math.pow(2, 35);
  var N62 = Math.pow(2, 42);
  var N72 = Math.pow(2, 49);
  var N82 = Math.pow(2, 56);
  var N92 = Math.pow(2, 63);
  var unsigned = {
    encodingLength(value) {
      if (value < N12) {
        return 1;
      }
      if (value < N22) {
        return 2;
      }
      if (value < N32) {
        return 3;
      }
      if (value < N42) {
        return 4;
      }
      if (value < N52) {
        return 5;
      }
      if (value < N62) {
        return 6;
      }
      if (value < N72) {
        return 7;
      }
      if (value < N82) {
        return 8;
      }
      if (value < N92) {
        return 9;
      }
      return 10;
    },
    encode(value, buf2) {
      let offset = 0;
      const access = accessor(buf2);
      while (value >= INT2) {
        access.set(offset++, value & 255 | MSB2);
        value /= 128;
      }
      while ((value & MSBALL2) > 0) {
        access.set(offset++, value & 255 | MSB2);
        value >>>= 7;
      }
      access.set(offset, value | 0);
    },
    decode(buf2, offset = 0) {
      const access = accessor(buf2);
      let value = 4294967295;
      value = (access.get(offset) & 127) >>> 0;
      if (access.get(offset++) < 128) {
        return value;
      }
      value = (value | (access.get(offset) & 127) << 7) >>> 0;
      if (access.get(offset++) < 128) {
        return value;
      }
      value = (value | (access.get(offset) & 127) << 14) >>> 0;
      if (access.get(offset++) < 128) {
        return value;
      }
      value = (value | (access.get(offset) & 127) << 21) >>> 0;
      if (access.get(offset++) < 128) {
        return value;
      }
      value = (value | (access.get(offset) & 15) << 28) >>> 0;
      if (access.get(offset++) < 128) {
        return value;
      }
      if ((offset += 5) > buf2.length) {
        throw RangeError(`index out of range: ${offset} > ${buf2.length}`);
      }
      return value;
    }
  };
  var signed = {
    encodingLength(value) {
      if (value < 0) {
        return 10;
      }
      return unsigned.encodingLength(value);
    },
    encode(value, buf2) {
      if (value < 0) {
        let offset = 0;
        const access = accessor(buf2);
        const bits2 = LongBits.fromNumber(value);
        while (bits2.hi > 0) {
          access.set(offset++, bits2.lo & 127 | 128);
          bits2.lo = (bits2.lo >>> 7 | bits2.hi << 25) >>> 0;
          bits2.hi >>>= 7;
        }
        while (bits2.lo > 127) {
          access.set(offset++, bits2.lo & 127 | 128);
          bits2.lo = bits2.lo >>> 7;
        }
        access.set(offset++, bits2.lo);
        return;
      }
      unsigned.encode(value, buf2);
    },
    decode(data, offset = 0) {
      return unsigned.decode(data, offset) | 0;
    }
  };
  var zigzag = {
    encodingLength(value) {
      value = (value << 1 ^ value >> 31) >>> 0;
      return unsigned.encodingLength(value);
    },
    encode(value, buf2, offset = 0) {
      value = (value << 1 ^ value >> 31) >>> 0;
      return unsigned.encode(value, buf2);
    },
    decode(data, offset = 0) {
      const value = unsigned.decode(data, offset);
      return value >>> 1 ^ -(value & 1) | 0;
    }
  };

  // ../node_modules/protons-runtime/dist/src/decode.js
  function decodeMessage(buf2, codec) {
    const prefix = new Uint8Array(unsigned.encodingLength(buf2.length));
    unsigned.encode(buf2.length, prefix);
    return codec.decode(new Uint8ArrayList(prefix, buf2), 0);
  }

  // ../node_modules/protons-runtime/dist/src/encode.js
  function encodeMessage(message2, codec) {
    const encoded = codec.encode(message2);
    const skip = unsigned.encodingLength(unsigned.decode(encoded));
    return encoded.slice(skip);
  }

  // ../node_modules/protons-runtime/dist/src/codec.js
  var CODEC_TYPES;
  (function(CODEC_TYPES2) {
    CODEC_TYPES2[CODEC_TYPES2["VARINT"] = 0] = "VARINT";
    CODEC_TYPES2[CODEC_TYPES2["BIT64"] = 1] = "BIT64";
    CODEC_TYPES2[CODEC_TYPES2["LENGTH_DELIMITED"] = 2] = "LENGTH_DELIMITED";
    CODEC_TYPES2[CODEC_TYPES2["START_GROUP"] = 3] = "START_GROUP";
    CODEC_TYPES2[CODEC_TYPES2["END_GROUP"] = 4] = "END_GROUP";
    CODEC_TYPES2[CODEC_TYPES2["BIT32"] = 5] = "BIT32";
  })(CODEC_TYPES || (CODEC_TYPES = {}));
  function createCodec2(name2, type, encode20, decode21, encodingLength17) {
    return {
      name: name2,
      type,
      encode: encode20,
      decode: decode21,
      encodingLength: encodingLength17
    };
  }

  // ../node_modules/protons-runtime/dist/src/codecs/bool.js
  var encodingLength2 = function boolEncodingLength() {
    return 1;
  };
  var encode4 = function boolEncode(value) {
    return Uint8Array.from([value ? 1 : 0]);
  };
  var decode5 = function boolDecode(buffer2, offset) {
    return buffer2.get(offset) > 0;
  };
  var bool = createCodec2("bool", CODEC_TYPES.VARINT, encode4, decode5, encodingLength2);

  // ../node_modules/protons-runtime/dist/src/codecs/bytes.js
  var encodingLength3 = function bytesEncodingLength(val) {
    const len = val.byteLength;
    return unsigned.encodingLength(len) + len;
  };
  var encode5 = function bytesEncode(val) {
    const prefix = new Uint8Array(unsigned.encodingLength(val.byteLength));
    unsigned.encode(val.byteLength, prefix);
    return new Uint8ArrayList(prefix, val);
  };
  var decode6 = function bytesDecode(buf2, offset) {
    const byteLength = unsigned.decode(buf2, offset);
    offset += unsigned.encodingLength(byteLength);
    return buf2.slice(offset, offset + byteLength);
  };
  var bytes = createCodec2("bytes", CODEC_TYPES.LENGTH_DELIMITED, encode5, decode6, encodingLength3);

  // ../node_modules/protons-runtime/dist/src/codecs/double.js
  var encodingLength4 = function doubleEncodingLength() {
    return 8;
  };
  var encode6 = function doubleEncode(val) {
    const buf2 = new Uint8ArrayList(new Uint8Array(encodingLength4(val)));
    buf2.setFloat64(0, val, true);
    return buf2;
  };
  var decode7 = function doubleDecode(buf2, offset) {
    return buf2.getFloat64(offset, true);
  };
  var double = createCodec2("double", CODEC_TYPES.BIT64, encode6, decode7, encodingLength4);

  // ../node_modules/protons-runtime/dist/src/codecs/enum.js
  function enumeration(v) {
    function findValue(val) {
      if (v[val.toString()] == null) {
        throw new Error("Invalid enum value");
      }
      if (typeof val === "number") {
        return val;
      }
      return v[val];
    }
    const encodingLength17 = function enumEncodingLength(val) {
      return unsigned.encodingLength(findValue(val));
    };
    const encode20 = function enumEncode(val) {
      const enumValue = findValue(val);
      const buf2 = new Uint8Array(unsigned.encodingLength(enumValue));
      unsigned.encode(enumValue, buf2);
      return buf2;
    };
    const decode21 = function enumDecode(buf2, offset) {
      const value = unsigned.decode(buf2, offset);
      const strValue = value.toString();
      if (v[strValue] == null) {
        throw new Error("Invalid enum value");
      }
      return v[strValue];
    };
    return createCodec2("enum", CODEC_TYPES.VARINT, encode20, decode21, encodingLength17);
  }

  // ../node_modules/protons-runtime/dist/src/codecs/fixed32.js
  var encodingLength5 = function fixed32EncodingLength() {
    return 4;
  };
  var encode7 = function fixed32Encode(val) {
    const buf2 = new Uint8ArrayList(new Uint8Array(encodingLength5(val)));
    buf2.setInt32(0, val, true);
    return buf2;
  };
  var decode8 = function fixed32Decode(buf2, offset) {
    return buf2.getInt32(offset, true);
  };
  var fixed32 = createCodec2("fixed32", CODEC_TYPES.BIT32, encode7, decode8, encodingLength5);

  // ../node_modules/protons-runtime/dist/src/codecs/fixed64.js
  var encodingLength6 = function int64EncodingLength(val) {
    return 8;
  };
  var encode8 = function int64Encode(val) {
    const buf2 = new Uint8ArrayList(new Uint8Array(encodingLength6(val)));
    buf2.setBigInt64(0, val, true);
    return buf2;
  };
  var decode9 = function int64Decode(buf2, offset) {
    return buf2.getBigInt64(offset, true);
  };
  var fixed64 = createCodec2("fixed64", CODEC_TYPES.BIT64, encode8, decode9, encodingLength6);

  // ../node_modules/protons-runtime/dist/src/codecs/float.js
  var encodingLength7 = function floatEncodingLength() {
    return 4;
  };
  var encode9 = function floatEncode(val) {
    const buf2 = new Uint8ArrayList(new Uint8Array(encodingLength7(1)));
    buf2.setFloat32(0, val, true);
    return buf2;
  };
  var decode10 = function floatDecode(buf2, offset) {
    return buf2.getFloat32(offset, true);
  };
  var float = createCodec2("float", CODEC_TYPES.BIT32, encode9, decode10, encodingLength7);

  // ../node_modules/protons-runtime/dist/src/codecs/int32.js
  var encodingLength8 = function int32EncodingLength(val) {
    return signed.encodingLength(val);
  };
  var encode10 = function int32Encode(val) {
    const buf2 = new Uint8Array(encodingLength8(val));
    signed.encode(val, buf2);
    return buf2;
  };
  var decode11 = function int32Decode(buf2, offset) {
    return signed.decode(buf2, offset);
  };
  var int32 = createCodec2("int32", CODEC_TYPES.VARINT, encode10, decode11, encodingLength8);

  // ../node_modules/protons-runtime/dist/src/utils/big-varint.js
  var LIMIT = 0x7fn;
  var unsigned2 = {
    encodingLength(value) {
      let i = 0;
      for (; value >= 0x80n; i++) {
        value >>= 7n;
      }
      return i + 1;
    },
    encode(value, buf2) {
      const access = accessor(buf2);
      let offset = 0;
      while (LIMIT < value) {
        access.set(offset++, Number(value & LIMIT) | 128);
        value >>= 7n;
      }
      access.set(offset, Number(value));
    },
    decode(buf2, offset = 0) {
      return LongBits.fromBytes(buf2, offset).toBigInt(true);
    }
  };
  var signed2 = {
    encodingLength(value) {
      if (value < 0n) {
        return 10;
      }
      return unsigned2.encodingLength(value);
    },
    encode(value, buf2, offset = 0) {
      if (value < 0n) {
        LongBits.fromBigInt(value).toBytes(buf2, offset);
        return;
      }
      return unsigned2.encode(value, buf2);
    },
    decode(buf2, offset = 0) {
      return LongBits.fromBytes(buf2, offset).toBigInt(false);
    }
  };
  var zigzag2 = {
    encodingLength(value) {
      return unsigned2.encodingLength(value >= 0 ? value * 2n : value * -2n - 1n);
    },
    encode(value, buf2, offset = 0) {
      LongBits.fromBigInt(value).zzEncode().toBytes(buf2, offset);
    },
    decode(buf2, offset = 0) {
      return LongBits.fromBytes(buf2, offset).zzDecode().toBigInt(false);
    }
  };

  // ../node_modules/protons-runtime/dist/src/codecs/int64.js
  var encodingLength9 = function int64EncodingLength2(val) {
    return signed2.encodingLength(val);
  };
  var encode11 = function int64Encode2(val) {
    const buf2 = new Uint8Array(encodingLength9(val));
    signed2.encode(val, buf2);
    return buf2;
  };
  var decode12 = function int64Decode2(buf2, offset) {
    return signed2.decode(buf2, offset) | 0n;
  };
  var int64 = createCodec2("int64", CODEC_TYPES.VARINT, encode11, decode12, encodingLength9);

  // ../node_modules/protons-runtime/dist/src/codecs/message.js
  function message(fieldDefs) {
    const encodingLength17 = function messageEncodingLength(val) {
      let length2 = 0;
      for (const fieldDef of Object.values(fieldDefs)) {
        length2 += fieldDef.codec.encodingLength(val[fieldDef.name]);
      }
      return unsigned.encodingLength(length2) + length2;
    };
    const encode20 = function messageEncode(val) {
      const bytes2 = new Uint8ArrayList();
      function encodeValue(value, fieldNumber, fieldDef) {
        if (value == null) {
          if (fieldDef.optional === true) {
            return;
          }
          throw new Error(`Non optional field "${fieldDef.name}" was ${value === null ? "null" : "undefined"}`);
        }
        const key = fieldNumber << 3 | fieldDef.codec.type;
        const prefix2 = new Uint8Array(unsigned.encodingLength(key));
        unsigned.encode(key, prefix2);
        const encoded = fieldDef.codec.encode(value);
        bytes2.append(prefix2);
        bytes2.append(encoded);
      }
      for (const [fieldNumberStr, fieldDef] of Object.entries(fieldDefs)) {
        const fieldNumber = parseInt(fieldNumberStr);
        if (fieldDef.repeats === true) {
          if (!Array.isArray(val[fieldDef.name])) {
            throw new Error(`Repeating field "${fieldDef.name}" was not an array`);
          }
          for (const value of val[fieldDef.name]) {
            encodeValue(value, fieldNumber, fieldDef);
          }
        } else {
          encodeValue(val[fieldDef.name], fieldNumber, fieldDef);
        }
      }
      const prefix = new Uint8Array(unsigned.encodingLength(bytes2.length));
      unsigned.encode(bytes2.length, prefix);
      return new Uint8ArrayList(prefix, bytes2);
    };
    const decode21 = function messageDecode(buffer2, offset) {
      const length2 = unsigned.decode(buffer2, offset);
      offset += unsigned.encodingLength(length2);
      const end = offset + length2;
      const fields = {};
      while (offset < end) {
        const key = unsigned.decode(buffer2, offset);
        offset += unsigned.encodingLength(key);
        const wireType = key & 7;
        const fieldNumber = key >> 3;
        const fieldDef = fieldDefs[fieldNumber];
        let fieldLength = 0;
        if (wireType === CODEC_TYPES.VARINT) {
          if (fieldDef != null) {
            const value = fieldDef.codec.decode(buffer2, offset);
            fieldLength = fieldDef.codec.encodingLength(value);
          } else {
            const value = unsigned.decode(buffer2, offset);
            fieldLength = unsigned.encodingLength(value);
          }
        } else if (wireType === CODEC_TYPES.BIT64) {
          fieldLength = 8;
        } else if (wireType === CODEC_TYPES.LENGTH_DELIMITED) {
          const valueLength = unsigned.decode(buffer2, offset);
          fieldLength = valueLength + unsigned.encodingLength(valueLength);
        } else if (wireType === CODEC_TYPES.BIT32) {
          fieldLength = 4;
        } else if (wireType === CODEC_TYPES.START_GROUP) {
          throw new Error("Unsupported wire type START_GROUP");
        } else if (wireType === CODEC_TYPES.END_GROUP) {
          throw new Error("Unsupported wire type END_GROUP");
        }
        if (fieldDef != null) {
          const value = fieldDef.codec.decode(buffer2, offset);
          if (fieldDef.repeats === true) {
            if (fields[fieldDef.name] == null) {
              fields[fieldDef.name] = [];
            }
            fields[fieldDef.name].push(value);
          } else {
            fields[fieldDef.name] = value;
          }
        }
        offset += fieldLength;
      }
      for (const fieldDef of Object.values(fieldDefs)) {
        if (fieldDef.repeats === true && fields[fieldDef.name] == null) {
          fields[fieldDef.name] = [];
        }
      }
      return fields;
    };
    return createCodec2("message", CODEC_TYPES.LENGTH_DELIMITED, encode20, decode21, encodingLength17);
  }

  // ../node_modules/protons-runtime/dist/src/codecs/sfixed32.js
  var encodingLength10 = function sfixed32EncodingLength() {
    return 4;
  };
  var encode12 = function sfixed32Encode(val) {
    const buf2 = new Uint8ArrayList(new Uint8Array(encodingLength10(val)));
    buf2.setInt32(0, val, true);
    return buf2;
  };
  var decode13 = function sfixed32Decode(buf2, offset) {
    return buf2.getInt32(offset, true);
  };
  var sfixed32 = createCodec2("sfixed32", CODEC_TYPES.BIT32, encode12, decode13, encodingLength10);

  // ../node_modules/protons-runtime/dist/src/codecs/sfixed64.js
  var encodingLength11 = function sfixed64EncodingLength() {
    return 8;
  };
  var encode13 = function sfixed64Encode(val) {
    const buf2 = new Uint8ArrayList(new Uint8Array(encodingLength11(val)));
    buf2.setBigInt64(0, val, true);
    return buf2;
  };
  var decode14 = function sfixed64Decode(buf2, offset) {
    return buf2.getBigInt64(offset, true);
  };
  var sfixed64 = createCodec2("sfixed64", CODEC_TYPES.BIT64, encode13, decode14, encodingLength11);

  // ../node_modules/protons-runtime/dist/src/codecs/sint32.js
  var encodingLength12 = function sint32EncodingLength(val) {
    return zigzag.encodingLength(val);
  };
  var encode14 = function svarintEncode(val) {
    const buf2 = new Uint8Array(encodingLength12(val));
    zigzag.encode(val, buf2);
    return buf2;
  };
  var decode15 = function svarintDecode(buf2, offset) {
    return zigzag.decode(buf2, offset);
  };
  var sint32 = createCodec2("sint32", CODEC_TYPES.VARINT, encode14, decode15, encodingLength12);

  // ../node_modules/protons-runtime/dist/src/codecs/sint64.js
  var encodingLength13 = function int64EncodingLength3(val) {
    return zigzag2.encodingLength(val);
  };
  var encode15 = function int64Encode3(val) {
    const buf2 = new Uint8Array(encodingLength13(val));
    zigzag2.encode(val, buf2);
    return buf2;
  };
  var decode16 = function int64Decode3(buf2, offset) {
    return zigzag2.decode(buf2, offset);
  };
  var sint64 = createCodec2("sint64", CODEC_TYPES.VARINT, encode15, decode16, encodingLength13);

  // ../node_modules/protons-runtime/dist/src/codecs/string.js
  init_from_string();
  init_to_string();
  var encodingLength14 = function stringEncodingLength(val) {
    const len = fromString2(val).byteLength;
    return unsigned.encodingLength(len) + len;
  };
  var encode16 = function stringEncode(val) {
    const asBuf = fromString2(val);
    const prefix = new Uint8Array(unsigned.encodingLength(asBuf.byteLength));
    unsigned.encode(asBuf.length, prefix);
    return new Uint8ArrayList(prefix, asBuf);
  };
  var decode17 = function stringDecode(buf2, offset) {
    const strLen = unsigned.decode(buf2, offset);
    offset += unsigned.encodingLength(strLen);
    return toString2(buf2.slice(offset, offset + strLen));
  };
  var string2 = createCodec2("string", CODEC_TYPES.LENGTH_DELIMITED, encode16, decode17, encodingLength14);

  // ../node_modules/protons-runtime/dist/src/codecs/uint32.js
  var encodingLength15 = function uint32EncodingLength(val) {
    return unsigned.encodingLength(val);
  };
  var encode17 = function uint32Encode(val) {
    const buf2 = new Uint8Array(encodingLength15(val));
    unsigned.encode(val, buf2);
    return buf2;
  };
  var decode18 = function uint32Decode(buf2, offset) {
    return unsigned.decode(buf2, offset);
  };
  var uint32 = createCodec2("uint32", CODEC_TYPES.VARINT, encode17, decode18, encodingLength15);

  // ../node_modules/protons-runtime/dist/src/codecs/uint64.js
  var encodingLength16 = function uint64EncodingLength(val) {
    return unsigned2.encodingLength(val);
  };
  var encode18 = function uint64Encode(val) {
    const buf2 = new Uint8Array(unsigned2.encodingLength(val));
    unsigned2.encode(val, buf2);
    return buf2;
  };
  var decode19 = function uint64Decode(buf2, offset) {
    return unsigned2.decode(buf2, offset);
  };
  var uint64 = createCodec2("uint64", CODEC_TYPES.VARINT, encode18, decode19, encodingLength16);

  // ../node_modules/@libp2p/crypto/dist/src/keys/keys.js
  var KeyType;
  (function(KeyType2) {
    KeyType2["RSA"] = "RSA";
    KeyType2["Ed25519"] = "Ed25519";
    KeyType2["Secp256k1"] = "Secp256k1";
  })(KeyType || (KeyType = {}));
  var __KeyTypeValues;
  (function(__KeyTypeValues2) {
    __KeyTypeValues2[__KeyTypeValues2["RSA"] = 0] = "RSA";
    __KeyTypeValues2[__KeyTypeValues2["Ed25519"] = 1] = "Ed25519";
    __KeyTypeValues2[__KeyTypeValues2["Secp256k1"] = 2] = "Secp256k1";
  })(__KeyTypeValues || (__KeyTypeValues = {}));
  (function(KeyType2) {
    KeyType2.codec = () => {
      return enumeration(__KeyTypeValues);
    };
  })(KeyType || (KeyType = {}));
  var PublicKey;
  (function(PublicKey2) {
    PublicKey2.codec = () => {
      return message({
        1: { name: "Type", codec: KeyType.codec() },
        2: { name: "Data", codec: bytes }
      });
    };
    PublicKey2.encode = (obj) => {
      return encodeMessage(obj, PublicKey2.codec());
    };
    PublicKey2.decode = (buf2) => {
      return decodeMessage(buf2, PublicKey2.codec());
    };
  })(PublicKey || (PublicKey = {}));
  var PrivateKey;
  (function(PrivateKey2) {
    PrivateKey2.codec = () => {
      return message({
        1: { name: "Type", codec: KeyType.codec() },
        2: { name: "Data", codec: bytes }
      });
    };
    PrivateKey2.encode = (obj) => {
      return encodeMessage(obj, PrivateKey2.codec());
    };
    PrivateKey2.decode = (buf2) => {
      return decodeMessage(buf2, PrivateKey2.codec());
    };
  })(PrivateKey || (PrivateKey = {}));

  // ../node_modules/@libp2p/crypto/dist/src/keys/index.js
  var import_asn12 = __toESM(require_asn1(), 1);
  var import_pbe = __toESM(require_pbe(), 1);
  var import_forge5 = __toESM(require_forge(), 1);
  var import_err_code10 = __toESM(require_err_code(), 1);
  init_from_string();

  // ../node_modules/@libp2p/crypto/dist/src/keys/key-stretcher.js
  var import_err_code = __toESM(require_err_code(), 1);
  init_concat();
  init_from_string();

  // ../node_modules/@libp2p/crypto/dist/src/webcrypto.js
  var webcrypto_default = {
    get(win = globalThis) {
      const nativeCrypto = win.crypto;
      if (nativeCrypto == null || nativeCrypto.subtle == null) {
        throw Object.assign(new Error("Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure context (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p-crypto/blob/master/README.md#web-crypto-api"), { code: "ERR_MISSING_WEB_CRYPTO" });
      }
      return nativeCrypto;
    }
  };

  // ../node_modules/@libp2p/crypto/dist/src/keys/ecdh-browser.js
  var import_err_code2 = __toESM(require_err_code(), 1);

  // ../node_modules/@libp2p/crypto/dist/src/util.js
  var import_util = __toESM(require_util(), 1);
  var import_jsbn = __toESM(require_jsbn(), 1);
  var import_forge = __toESM(require_forge(), 1);
  init_from_string();
  init_to_string();
  init_concat();
  function bigIntegerToUintBase64url(num, len) {
    let buf2 = Uint8Array.from(num.abs().toByteArray());
    buf2 = buf2[0] === 0 ? buf2.slice(1) : buf2;
    if (len != null) {
      if (buf2.length > len)
        throw new Error("byte array longer than desired length");
      buf2 = concat([new Uint8Array(len - buf2.length), buf2]);
    }
    return toString2(buf2, "base64url");
  }
  function base64urlToBigInteger(str) {
    const buf2 = base64urlToBuffer(str);
    return new import_forge.default.jsbn.BigInteger(toString2(buf2, "base16"), 16);
  }
  function base64urlToBuffer(str, len) {
    let buf2 = fromString2(str, "base64urlpad");
    if (len != null) {
      if (buf2.length > len)
        throw new Error("byte array longer than desired length");
      buf2 = concat([new Uint8Array(len - buf2.length), buf2]);
    }
    return buf2;
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/ecdh-browser.js
  init_to_string();
  init_concat();
  init_equals();
  var bits = {
    "P-256": 256,
    "P-384": 384,
    "P-521": 521
  };
  var curveTypes = Object.keys(bits);
  var names = curveTypes.join(" / ");

  // ../node_modules/@libp2p/crypto/dist/src/keys/importer.js
  init_base64();

  // ../node_modules/@libp2p/crypto/dist/src/ciphers/aes-gcm.browser.js
  init_concat();
  init_from_string();
  function create3(opts) {
    const algorithm = opts?.algorithm ?? "AES-GCM";
    let keyLength = opts?.keyLength ?? 16;
    const nonceLength = opts?.nonceLength ?? 12;
    const digest2 = opts?.digest ?? "SHA-256";
    const saltLength = opts?.saltLength ?? 16;
    const iterations = opts?.iterations ?? 32767;
    const crypto4 = webcrypto_default.get();
    keyLength *= 8;
    async function encrypt2(data, password) {
      const salt = crypto4.getRandomValues(new Uint8Array(saltLength));
      const nonce = crypto4.getRandomValues(new Uint8Array(nonceLength));
      const aesGcm = { name: algorithm, iv: nonce };
      if (typeof password === "string") {
        password = fromString2(password);
      }
      const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
      const rawKey = await crypto4.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey", "deriveBits"]);
      const cryptoKey = await crypto4.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["encrypt"]);
      const ciphertext = await crypto4.subtle.encrypt(aesGcm, cryptoKey, data);
      return concat([salt, aesGcm.iv, new Uint8Array(ciphertext)]);
    }
    async function decrypt2(data, password) {
      const salt = data.slice(0, saltLength);
      const nonce = data.slice(saltLength, saltLength + nonceLength);
      const ciphertext = data.slice(saltLength + nonceLength);
      const aesGcm = { name: algorithm, iv: nonce };
      if (typeof password === "string") {
        password = fromString2(password);
      }
      const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
      const rawKey = await crypto4.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey", "deriveBits"]);
      const cryptoKey = await crypto4.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["decrypt"]);
      const plaintext = await crypto4.subtle.decrypt(aesGcm, cryptoKey, ciphertext);
      return new Uint8Array(plaintext);
    }
    const cipher = {
      encrypt: encrypt2,
      decrypt: decrypt2
    };
    return cipher;
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/rsa-class.js
  var rsa_class_exports = {};
  __export(rsa_class_exports, {
    RsaPrivateKey: () => RsaPrivateKey,
    RsaPublicKey: () => RsaPublicKey,
    fromJwk: () => fromJwk,
    generateKeyPair: () => generateKeyPair,
    unmarshalRsaPrivateKey: () => unmarshalRsaPrivateKey,
    unmarshalRsaPublicKey: () => unmarshalRsaPublicKey
  });
  init_sha2_browser();
  var import_err_code6 = __toESM(require_err_code(), 1);
  init_equals();
  init_to_string();
  var import_sha512 = __toESM(require_sha512(), 1);
  var import_forge4 = __toESM(require_forge(), 1);

  // ../node_modules/@libp2p/crypto/dist/src/random-bytes.js
  var import_random = __toESM(require_random_browser(), 1);
  var import_err_code3 = __toESM(require_err_code(), 1);
  function randomBytes(length2) {
    if (isNaN(length2) || length2 <= 0) {
      throw (0, import_err_code3.default)(new Error("random bytes length must be a Number bigger than 0"), "ERR_INVALID_LENGTH");
    }
    return (0, import_random.default)(length2);
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/rsa-browser.js
  init_to_string();
  init_from_string();

  // ../node_modules/@libp2p/crypto/dist/src/keys/rsa-utils.js
  var rsa_utils_exports = {};
  __export(rsa_utils_exports, {
    jwkToPkcs1: () => jwkToPkcs1,
    jwkToPkix: () => jwkToPkix,
    pkcs1ToJwk: () => pkcs1ToJwk,
    pkixToJwk: () => pkixToJwk
  });
  var import_asn1 = __toESM(require_asn1(), 1);
  var import_rsa = __toESM(require_rsa(), 1);
  var import_forge2 = __toESM(require_forge(), 1);
  init_from_string();
  init_to_string();
  var import_err_code4 = __toESM(require_err_code(), 1);
  function pkcs1ToJwk(bytes2) {
    const asn1 = import_forge2.default.asn1.fromDer(toString2(bytes2, "ascii"));
    const privateKey = import_forge2.default.pki.privateKeyFromAsn1(asn1);
    return {
      kty: "RSA",
      n: bigIntegerToUintBase64url(privateKey.n),
      e: bigIntegerToUintBase64url(privateKey.e),
      d: bigIntegerToUintBase64url(privateKey.d),
      p: bigIntegerToUintBase64url(privateKey.p),
      q: bigIntegerToUintBase64url(privateKey.q),
      dp: bigIntegerToUintBase64url(privateKey.dP),
      dq: bigIntegerToUintBase64url(privateKey.dQ),
      qi: bigIntegerToUintBase64url(privateKey.qInv),
      alg: "RS256"
    };
  }
  function jwkToPkcs1(jwk) {
    if (jwk.n == null || jwk.e == null || jwk.d == null || jwk.p == null || jwk.q == null || jwk.dp == null || jwk.dq == null || jwk.qi == null) {
      throw (0, import_err_code4.default)(new Error("JWK was missing components"), "ERR_INVALID_PARAMETERS");
    }
    const asn1 = import_forge2.default.pki.privateKeyToAsn1({
      n: base64urlToBigInteger(jwk.n),
      e: base64urlToBigInteger(jwk.e),
      d: base64urlToBigInteger(jwk.d),
      p: base64urlToBigInteger(jwk.p),
      q: base64urlToBigInteger(jwk.q),
      dP: base64urlToBigInteger(jwk.dp),
      dQ: base64urlToBigInteger(jwk.dq),
      qInv: base64urlToBigInteger(jwk.qi)
    });
    return fromString2(import_forge2.default.asn1.toDer(asn1).getBytes(), "ascii");
  }
  function pkixToJwk(bytes2) {
    const asn1 = import_forge2.default.asn1.fromDer(toString2(bytes2, "ascii"));
    const publicKey = import_forge2.default.pki.publicKeyFromAsn1(asn1);
    return {
      kty: "RSA",
      n: bigIntegerToUintBase64url(publicKey.n),
      e: bigIntegerToUintBase64url(publicKey.e)
    };
  }
  function jwkToPkix(jwk) {
    if (jwk.n == null || jwk.e == null) {
      throw (0, import_err_code4.default)(new Error("JWK was missing components"), "ERR_INVALID_PARAMETERS");
    }
    const asn1 = import_forge2.default.pki.publicKeyToAsn1({
      n: base64urlToBigInteger(jwk.n),
      e: base64urlToBigInteger(jwk.e)
    });
    return fromString2(import_forge2.default.asn1.toDer(asn1).getBytes(), "ascii");
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/jwk2pem.js
  var import_rsa2 = __toESM(require_rsa(), 1);
  var import_forge3 = __toESM(require_forge(), 1);
  function convert(key, types) {
    return types.map((t) => base64urlToBigInteger(key[t]));
  }
  function jwk2priv(key) {
    return import_forge3.default.pki.setRsaPrivateKey(...convert(key, ["n", "e", "d", "p", "q", "dp", "dq", "qi"]));
  }
  function jwk2pub(key) {
    return import_forge3.default.pki.setRsaPublicKey(...convert(key, ["n", "e"]));
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/rsa-browser.js
  var import_err_code5 = __toESM(require_err_code(), 1);
  async function generateKey(bits2) {
    const pair = await webcrypto_default.get().subtle.generateKey({
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: bits2,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: "SHA-256" }
    }, true, ["sign", "verify"]);
    const keys2 = await exportKey(pair);
    return {
      privateKey: keys2[0],
      publicKey: keys2[1]
    };
  }
  async function unmarshalPrivateKey(key) {
    const privateKey = await webcrypto_default.get().subtle.importKey("jwk", key, {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" }
    }, true, ["sign"]);
    const pair = [
      privateKey,
      await derivePublicFromPrivate(key)
    ];
    const keys2 = await exportKey({
      privateKey: pair[0],
      publicKey: pair[1]
    });
    return {
      privateKey: keys2[0],
      publicKey: keys2[1]
    };
  }
  async function hashAndSign(key, msg) {
    const privateKey = await webcrypto_default.get().subtle.importKey("jwk", key, {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" }
    }, false, ["sign"]);
    const sig = await webcrypto_default.get().subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, privateKey, Uint8Array.from(msg));
    return new Uint8Array(sig, 0, sig.byteLength);
  }
  async function hashAndVerify(key, sig, msg) {
    const publicKey = await webcrypto_default.get().subtle.importKey("jwk", key, {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" }
    }, false, ["verify"]);
    return await webcrypto_default.get().subtle.verify({ name: "RSASSA-PKCS1-v1_5" }, publicKey, sig, msg);
  }
  async function exportKey(pair) {
    if (pair.privateKey == null || pair.publicKey == null) {
      throw (0, import_err_code5.default)(new Error("Private and public key are required"), "ERR_INVALID_PARAMETERS");
    }
    return await Promise.all([
      webcrypto_default.get().subtle.exportKey("jwk", pair.privateKey),
      webcrypto_default.get().subtle.exportKey("jwk", pair.publicKey)
    ]);
  }
  async function derivePublicFromPrivate(jwKey) {
    return await webcrypto_default.get().subtle.importKey("jwk", {
      kty: jwKey.kty,
      n: jwKey.n,
      e: jwKey.e
    }, {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" }
    }, true, ["verify"]);
  }
  function convertKey(key, pub, msg, handle) {
    const fkey = pub ? jwk2pub(key) : jwk2priv(key);
    const fmsg = toString2(Uint8Array.from(msg), "ascii");
    const fomsg = handle(fmsg, fkey);
    return fromString2(fomsg, "ascii");
  }
  function encrypt(key, msg) {
    return convertKey(key, true, msg, (msg2, key2) => key2.encrypt(msg2));
  }
  function decrypt(key, msg) {
    return convertKey(key, false, msg, (msg2, key2) => key2.decrypt(msg2));
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/exporter.js
  init_base64();
  async function exporter(privateKey, password) {
    const cipher = create3();
    const encryptedKey = await cipher.encrypt(privateKey, password);
    return base64.encode(encryptedKey);
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/rsa-class.js
  var RsaPublicKey = class {
    constructor(key) {
      this._key = key;
    }
    async verify(data, sig) {
      return await hashAndVerify(this._key, sig, data);
    }
    marshal() {
      return rsa_utils_exports.jwkToPkix(this._key);
    }
    get bytes() {
      return PublicKey.encode({
        Type: KeyType.RSA,
        Data: this.marshal()
      });
    }
    encrypt(bytes2) {
      return encrypt(this._key, bytes2);
    }
    equals(key) {
      return equals3(this.bytes, key.bytes);
    }
    async hash() {
      const { bytes: bytes2 } = await sha256.digest(this.bytes);
      return bytes2;
    }
  };
  var RsaPrivateKey = class {
    constructor(key, publicKey) {
      this._key = key;
      this._publicKey = publicKey;
    }
    genSecret() {
      return randomBytes(16);
    }
    async sign(message2) {
      return await hashAndSign(this._key, message2);
    }
    get public() {
      if (this._publicKey == null) {
        throw (0, import_err_code6.default)(new Error("public key not provided"), "ERR_PUBKEY_NOT_PROVIDED");
      }
      return new RsaPublicKey(this._publicKey);
    }
    decrypt(bytes2) {
      return decrypt(this._key, bytes2);
    }
    marshal() {
      return rsa_utils_exports.jwkToPkcs1(this._key);
    }
    get bytes() {
      return PrivateKey.encode({
        Type: KeyType.RSA,
        Data: this.marshal()
      });
    }
    equals(key) {
      return equals3(this.bytes, key.bytes);
    }
    async hash() {
      const { bytes: bytes2 } = await sha256.digest(this.bytes);
      return bytes2;
    }
    async id() {
      const hash = await this.public.hash();
      return toString2(hash, "base58btc");
    }
    async export(password, format = "pkcs-8") {
      if (format === "pkcs-8") {
        const buffer2 = new import_forge4.default.util.ByteBuffer(this.marshal());
        const asn1 = import_forge4.default.asn1.fromDer(buffer2);
        const privateKey = import_forge4.default.pki.privateKeyFromAsn1(asn1);
        const options = {
          algorithm: "aes256",
          count: 1e4,
          saltSize: 128 / 8,
          prfAlgorithm: "sha512"
        };
        return import_forge4.default.pki.encryptRsaPrivateKey(privateKey, password, options);
      } else if (format === "libp2p-key") {
        return await exporter(this.bytes, password);
      } else {
        throw (0, import_err_code6.default)(new Error(`export format '${format}' is not supported`), "ERR_INVALID_EXPORT_FORMAT");
      }
    }
  };
  async function unmarshalRsaPrivateKey(bytes2) {
    const jwk = rsa_utils_exports.pkcs1ToJwk(bytes2);
    const keys2 = await unmarshalPrivateKey(jwk);
    return new RsaPrivateKey(keys2.privateKey, keys2.publicKey);
  }
  function unmarshalRsaPublicKey(bytes2) {
    const jwk = rsa_utils_exports.pkixToJwk(bytes2);
    return new RsaPublicKey(jwk);
  }
  async function fromJwk(jwk) {
    const keys2 = await unmarshalPrivateKey(jwk);
    return new RsaPrivateKey(keys2.privateKey, keys2.publicKey);
  }
  async function generateKeyPair(bits2) {
    const keys2 = await generateKey(bits2);
    return new RsaPrivateKey(keys2.privateKey, keys2.publicKey);
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/ed25519-class.js
  var ed25519_class_exports = {};
  __export(ed25519_class_exports, {
    Ed25519PrivateKey: () => Ed25519PrivateKey,
    Ed25519PublicKey: () => Ed25519PublicKey,
    generateKeyPair: () => generateKeyPair2,
    generateKeyPairFromSeed: () => generateKeyPairFromSeed,
    unmarshalEd25519PrivateKey: () => unmarshalEd25519PrivateKey,
    unmarshalEd25519PublicKey: () => unmarshalEd25519PublicKey
  });
  var import_err_code7 = __toESM(require_err_code(), 1);
  init_equals();
  init_sha2_browser();
  init_base58();
  init_identity2();

  // ../node_modules/@noble/ed25519/lib/esm/index.js
  var import_crypto = __toESM(require_crypto(), 1);
  var _0n = BigInt(0);
  var _1n = BigInt(1);
  var _2n = BigInt(2);
  var _255n = BigInt(255);
  var CURVE_ORDER = _2n ** BigInt(252) + BigInt("27742317777372353535851937790883648493");
  var CURVE = {
    a: BigInt(-1),
    d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
    P: _2n ** _255n - BigInt(19),
    l: CURVE_ORDER,
    n: CURVE_ORDER,
    h: BigInt(8),
    Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
    Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960")
  };
  var MAX_256B = _2n ** BigInt(256);
  var SQRT_M1 = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
  var SQRT_D = BigInt("6853475219497561581579357271197624642482790079785650197046958215289687604742");
  var SQRT_AD_MINUS_ONE = BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
  var INVSQRT_A_MINUS_D = BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
  var ONE_MINUS_D_SQ = BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
  var D_MINUS_ONE_SQ = BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
  var ExtendedPoint = class {
    constructor(x, y, z, t) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.t = t;
    }
    static fromAffine(p) {
      if (!(p instanceof Point)) {
        throw new TypeError("ExtendedPoint#fromAffine: expected Point");
      }
      if (p.equals(Point.ZERO))
        return ExtendedPoint.ZERO;
      return new ExtendedPoint(p.x, p.y, _1n, mod2(p.x * p.y));
    }
    static toAffineBatch(points) {
      const toInv = invertBatch(points.map((p) => p.z));
      return points.map((p, i) => p.toAffine(toInv[i]));
    }
    static normalizeZ(points) {
      return this.toAffineBatch(points).map(this.fromAffine);
    }
    equals(other) {
      assertExtPoint(other);
      const { x: X1, y: Y1, z: Z1 } = this;
      const { x: X2, y: Y2, z: Z2 } = other;
      const X1Z2 = mod2(X1 * Z2);
      const X2Z1 = mod2(X2 * Z1);
      const Y1Z2 = mod2(Y1 * Z2);
      const Y2Z1 = mod2(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    negate() {
      return new ExtendedPoint(mod2(-this.x), this.y, this.z, mod2(-this.t));
    }
    double() {
      const { x: X1, y: Y1, z: Z1 } = this;
      const { a } = CURVE;
      const A = mod2(X1 ** _2n);
      const B = mod2(Y1 ** _2n);
      const C = mod2(_2n * mod2(Z1 ** _2n));
      const D = mod2(a * A);
      const E = mod2(mod2((X1 + Y1) ** _2n) - A - B);
      const G = D + B;
      const F = G - C;
      const H = D - B;
      const X3 = mod2(E * F);
      const Y3 = mod2(G * H);
      const T3 = mod2(E * H);
      const Z3 = mod2(F * G);
      return new ExtendedPoint(X3, Y3, Z3, T3);
    }
    add(other) {
      assertExtPoint(other);
      const { x: X1, y: Y1, z: Z1, t: T1 } = this;
      const { x: X2, y: Y2, z: Z2, t: T2 } = other;
      const A = mod2((Y1 - X1) * (Y2 + X2));
      const B = mod2((Y1 + X1) * (Y2 - X2));
      const F = mod2(B - A);
      if (F === _0n)
        return this.double();
      const C = mod2(Z1 * _2n * T2);
      const D = mod2(T1 * _2n * Z2);
      const E = D + C;
      const G = B + A;
      const H = D - C;
      const X3 = mod2(E * F);
      const Y3 = mod2(G * H);
      const T3 = mod2(E * H);
      const Z3 = mod2(F * G);
      return new ExtendedPoint(X3, Y3, Z3, T3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    precomputeWindow(W) {
      const windows = 1 + 256 / W;
      const points = [];
      let p = this;
      let base3 = p;
      for (let window2 = 0; window2 < windows; window2++) {
        base3 = p;
        points.push(base3);
        for (let i = 1; i < 2 ** (W - 1); i++) {
          base3 = base3.add(p);
          points.push(base3);
        }
        p = base3.double();
      }
      return points;
    }
    wNAF(n, affinePoint) {
      if (!affinePoint && this.equals(ExtendedPoint.BASE))
        affinePoint = Point.BASE;
      const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
      if (256 % W) {
        throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
      }
      let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
      if (!precomputes) {
        precomputes = this.precomputeWindow(W);
        if (affinePoint && W !== 1) {
          precomputes = ExtendedPoint.normalizeZ(precomputes);
          pointPrecomputes.set(affinePoint, precomputes);
        }
      }
      let p = ExtendedPoint.ZERO;
      let f = ExtendedPoint.ZERO;
      const windows = 1 + 256 / W;
      const windowSize = 2 ** (W - 1);
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window2 = 0; window2 < windows; window2++) {
        const offset = window2 * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n;
        }
        if (wbits === 0) {
          let pr = precomputes[offset];
          if (window2 % 2)
            pr = pr.negate();
          f = f.add(pr);
        } else {
          let cached = precomputes[offset + Math.abs(wbits) - 1];
          if (wbits < 0)
            cached = cached.negate();
          p = p.add(cached);
        }
      }
      return ExtendedPoint.normalizeZ([p, f])[0];
    }
    multiply(scalar, affinePoint) {
      return this.wNAF(normalizeScalar(scalar, CURVE.l), affinePoint);
    }
    multiplyUnsafe(scalar) {
      let n = normalizeScalar(scalar, CURVE.l, false);
      const G = ExtendedPoint.BASE;
      const P0 = ExtendedPoint.ZERO;
      if (n === _0n)
        return P0;
      if (this.equals(P0) || n === _1n)
        return this;
      if (this.equals(G))
        return this.wNAF(n);
      let p = P0;
      let d = this;
      while (n > _0n) {
        if (n & _1n)
          p = p.add(d);
        d = d.double();
        n >>= _1n;
      }
      return p;
    }
    isSmallOrder() {
      return this.multiplyUnsafe(CURVE.h).equals(ExtendedPoint.ZERO);
    }
    isTorsionFree() {
      return this.multiplyUnsafe(CURVE.l).equals(ExtendedPoint.ZERO);
    }
    toAffine(invZ = invert(this.z)) {
      const { x, y, z } = this;
      const ax = mod2(x * invZ);
      const ay = mod2(y * invZ);
      const zz = mod2(z * invZ);
      if (zz !== _1n)
        throw new Error("invZ was invalid");
      return new Point(ax, ay);
    }
    fromRistrettoBytes() {
      legacyRist();
    }
    toRistrettoBytes() {
      legacyRist();
    }
    fromRistrettoHash() {
      legacyRist();
    }
  };
  ExtendedPoint.BASE = new ExtendedPoint(CURVE.Gx, CURVE.Gy, _1n, mod2(CURVE.Gx * CURVE.Gy));
  ExtendedPoint.ZERO = new ExtendedPoint(_0n, _1n, _1n, _0n);
  function assertExtPoint(other) {
    if (!(other instanceof ExtendedPoint))
      throw new TypeError("ExtendedPoint expected");
  }
  function assertRstPoint(other) {
    if (!(other instanceof RistrettoPoint))
      throw new TypeError("RistrettoPoint expected");
  }
  function legacyRist() {
    throw new Error("Legacy method: switch to RistrettoPoint");
  }
  var RistrettoPoint = class {
    constructor(ep) {
      this.ep = ep;
    }
    static calcElligatorRistrettoMap(r0) {
      const { d } = CURVE;
      const r = mod2(SQRT_M1 * r0 * r0);
      const Ns = mod2((r + _1n) * ONE_MINUS_D_SQ);
      let c = BigInt(-1);
      const D = mod2((c - d * r) * mod2(r + d));
      let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
      let s_ = mod2(s * r0);
      if (!edIsNegative(s_))
        s_ = mod2(-s_);
      if (!Ns_D_is_sq)
        s = s_;
      if (!Ns_D_is_sq)
        c = r;
      const Nt = mod2(c * (r - _1n) * D_MINUS_ONE_SQ - D);
      const s2 = s * s;
      const W0 = mod2((s + s) * D);
      const W1 = mod2(Nt * SQRT_AD_MINUS_ONE);
      const W2 = mod2(_1n - s2);
      const W3 = mod2(_1n + s2);
      return new ExtendedPoint(mod2(W0 * W3), mod2(W2 * W1), mod2(W1 * W3), mod2(W0 * W2));
    }
    static hashToCurve(hex) {
      hex = ensureBytes(hex, 64);
      const r1 = bytes255ToNumberLE(hex.slice(0, 32));
      const R1 = this.calcElligatorRistrettoMap(r1);
      const r2 = bytes255ToNumberLE(hex.slice(32, 64));
      const R2 = this.calcElligatorRistrettoMap(r2);
      return new RistrettoPoint(R1.add(R2));
    }
    static fromHex(hex) {
      hex = ensureBytes(hex, 32);
      const { a, d } = CURVE;
      const emsg = "RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint";
      const s = bytes255ToNumberLE(hex);
      if (!equalBytes(numberTo32BytesLE(s), hex) || edIsNegative(s))
        throw new Error(emsg);
      const s2 = mod2(s * s);
      const u1 = mod2(_1n + a * s2);
      const u2 = mod2(_1n - a * s2);
      const u1_2 = mod2(u1 * u1);
      const u2_2 = mod2(u2 * u2);
      const v = mod2(a * d * u1_2 - u2_2);
      const { isValid, value: I } = invertSqrt(mod2(v * u2_2));
      const Dx = mod2(I * u2);
      const Dy = mod2(I * Dx * v);
      let x = mod2((s + s) * Dx);
      if (edIsNegative(x))
        x = mod2(-x);
      const y = mod2(u1 * Dy);
      const t = mod2(x * y);
      if (!isValid || edIsNegative(t) || y === _0n)
        throw new Error(emsg);
      return new RistrettoPoint(new ExtendedPoint(x, y, _1n, t));
    }
    toRawBytes() {
      let { x, y, z, t } = this.ep;
      const u1 = mod2(mod2(z + y) * mod2(z - y));
      const u2 = mod2(x * y);
      const { value: invsqrt } = invertSqrt(mod2(u1 * u2 ** _2n));
      const D1 = mod2(invsqrt * u1);
      const D2 = mod2(invsqrt * u2);
      const zInv = mod2(D1 * D2 * t);
      let D;
      if (edIsNegative(t * zInv)) {
        let _x = mod2(y * SQRT_M1);
        let _y = mod2(x * SQRT_M1);
        x = _x;
        y = _y;
        D = mod2(D1 * INVSQRT_A_MINUS_D);
      } else {
        D = D2;
      }
      if (edIsNegative(x * zInv))
        y = mod2(-y);
      let s = mod2((z - y) * D);
      if (edIsNegative(s))
        s = mod2(-s);
      return numberTo32BytesLE(s);
    }
    toHex() {
      return bytesToHex(this.toRawBytes());
    }
    toString() {
      return this.toHex();
    }
    equals(other) {
      assertRstPoint(other);
      const a = this.ep;
      const b = other.ep;
      const one = mod2(a.x * b.y) === mod2(a.y * b.x);
      const two = mod2(a.y * b.y) === mod2(a.x * b.x);
      return one || two;
    }
    add(other) {
      assertRstPoint(other);
      return new RistrettoPoint(this.ep.add(other.ep));
    }
    subtract(other) {
      assertRstPoint(other);
      return new RistrettoPoint(this.ep.subtract(other.ep));
    }
    multiply(scalar) {
      return new RistrettoPoint(this.ep.multiply(scalar));
    }
    multiplyUnsafe(scalar) {
      return new RistrettoPoint(this.ep.multiplyUnsafe(scalar));
    }
  };
  RistrettoPoint.BASE = new RistrettoPoint(ExtendedPoint.BASE);
  RistrettoPoint.ZERO = new RistrettoPoint(ExtendedPoint.ZERO);
  var pointPrecomputes = /* @__PURE__ */ new WeakMap();
  var Point = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    _setWindowSize(windowSize) {
      this._WINDOW_SIZE = windowSize;
      pointPrecomputes.delete(this);
    }
    static fromHex(hex, strict = true) {
      const { d, P } = CURVE;
      hex = ensureBytes(hex, 32);
      const normed = hex.slice();
      normed[31] = hex[31] & ~128;
      const y = bytesToNumberLE(normed);
      if (strict && y >= P)
        throw new Error("Expected 0 < hex < P");
      if (!strict && y >= MAX_256B)
        throw new Error("Expected 0 < hex < 2**256");
      const y2 = mod2(y * y);
      const u = mod2(y2 - _1n);
      const v = mod2(d * y2 + _1n);
      let { isValid, value: x } = uvRatio(u, v);
      if (!isValid)
        throw new Error("Point.fromHex: invalid y coordinate");
      const isXOdd = (x & _1n) === _1n;
      const isLastByteOdd = (hex[31] & 128) !== 0;
      if (isLastByteOdd !== isXOdd) {
        x = mod2(-x);
      }
      return new Point(x, y);
    }
    static async fromPrivateKey(privateKey) {
      return (await getExtendedPublicKey(privateKey)).point;
    }
    toRawBytes() {
      const bytes2 = numberTo32BytesLE(this.y);
      bytes2[31] |= this.x & _1n ? 128 : 0;
      return bytes2;
    }
    toHex() {
      return bytesToHex(this.toRawBytes());
    }
    toX25519() {
      const { y } = this;
      const u = mod2((_1n + y) * invert(_1n - y));
      return numberTo32BytesLE(u);
    }
    isTorsionFree() {
      return ExtendedPoint.fromAffine(this).isTorsionFree();
    }
    equals(other) {
      return this.x === other.x && this.y === other.y;
    }
    negate() {
      return new Point(mod2(-this.x), this.y);
    }
    add(other) {
      return ExtendedPoint.fromAffine(this).add(ExtendedPoint.fromAffine(other)).toAffine();
    }
    subtract(other) {
      return this.add(other.negate());
    }
    multiply(scalar) {
      return ExtendedPoint.fromAffine(this).multiply(scalar, this).toAffine();
    }
  };
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
  Point.ZERO = new Point(_0n, _1n);
  var Signature = class {
    constructor(r, s) {
      this.r = r;
      this.s = s;
      this.assertValidity();
    }
    static fromHex(hex) {
      const bytes2 = ensureBytes(hex, 64);
      const r = Point.fromHex(bytes2.slice(0, 32), false);
      const s = bytesToNumberLE(bytes2.slice(32, 64));
      return new Signature(r, s);
    }
    assertValidity() {
      const { r, s } = this;
      if (!(r instanceof Point))
        throw new Error("Expected Point instance");
      normalizeScalar(s, CURVE.l, false);
      return this;
    }
    toRawBytes() {
      const u8 = new Uint8Array(64);
      u8.set(this.r.toRawBytes());
      u8.set(numberTo32BytesLE(this.s), 32);
      return u8;
    }
    toHex() {
      return bytesToHex(this.toRawBytes());
    }
  };
  function concatBytes(...arrays) {
    if (!arrays.every((a) => a instanceof Uint8Array))
      throw new Error("Expected Uint8Array list");
    if (arrays.length === 1)
      return arrays[0];
    const length2 = arrays.reduce((a, arr) => a + arr.length, 0);
    const result = new Uint8Array(length2);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const arr = arrays[i];
      result.set(arr, pad);
      pad += arr.length;
    }
    return result;
  }
  var hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex(uint8a) {
    if (!(uint8a instanceof Uint8Array))
      throw new Error("Uint8Array expected");
    let hex = "";
    for (let i = 0; i < uint8a.length; i++) {
      hex += hexes[uint8a[i]];
    }
    return hex;
  }
  function hexToBytes(hex) {
    if (typeof hex !== "string") {
      throw new TypeError("hexToBytes: expected string, got " + typeof hex);
    }
    if (hex.length % 2)
      throw new Error("hexToBytes: received invalid unpadded hex");
    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < array.length; i++) {
      const j = i * 2;
      const hexByte = hex.slice(j, j + 2);
      const byte = Number.parseInt(hexByte, 16);
      if (Number.isNaN(byte) || byte < 0)
        throw new Error("Invalid byte sequence");
      array[i] = byte;
    }
    return array;
  }
  function numberTo32BytesBE(num) {
    const length2 = 32;
    const hex = num.toString(16).padStart(length2 * 2, "0");
    return hexToBytes(hex);
  }
  function numberTo32BytesLE(num) {
    return numberTo32BytesBE(num).reverse();
  }
  function edIsNegative(num) {
    return (mod2(num) & _1n) === _1n;
  }
  function bytesToNumberLE(uint8a) {
    if (!(uint8a instanceof Uint8Array))
      throw new Error("Expected Uint8Array");
    return BigInt("0x" + bytesToHex(Uint8Array.from(uint8a).reverse()));
  }
  function bytes255ToNumberLE(bytes2) {
    return mod2(bytesToNumberLE(bytes2) & _2n ** _255n - _1n);
  }
  function mod2(a, b = CURVE.P) {
    const res = a % b;
    return res >= _0n ? res : b + res;
  }
  function invert(number, modulo = CURVE.P) {
    if (number === _0n || modulo <= _0n) {
      throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
    }
    let a = mod2(number, modulo);
    let b = modulo;
    let x = _0n, y = _1n, u = _1n, v = _0n;
    while (a !== _0n) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n)
      throw new Error("invert: does not exist");
    return mod2(x, modulo);
  }
  function invertBatch(nums, p = CURVE.P) {
    const tmp = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
      if (num === _0n)
        return acc;
      tmp[i] = acc;
      return mod2(acc * num, p);
    }, _1n);
    const inverted = invert(lastMultiplied, p);
    nums.reduceRight((acc, num, i) => {
      if (num === _0n)
        return acc;
      tmp[i] = mod2(acc * tmp[i], p);
      return mod2(acc * num, p);
    }, inverted);
    return tmp;
  }
  function pow2(x, power) {
    const { P } = CURVE;
    let res = x;
    while (power-- > _0n) {
      res *= res;
      res %= P;
    }
    return res;
  }
  function pow_2_252_3(x) {
    const { P } = CURVE;
    const _5n = BigInt(5);
    const _10n = BigInt(10);
    const _20n = BigInt(20);
    const _40n = BigInt(40);
    const _80n = BigInt(80);
    const x2 = x * x % P;
    const b2 = x2 * x % P;
    const b4 = pow2(b2, _2n) * b2 % P;
    const b5 = pow2(b4, _1n) * x % P;
    const b10 = pow2(b5, _5n) * b5 % P;
    const b20 = pow2(b10, _10n) * b10 % P;
    const b40 = pow2(b20, _20n) * b20 % P;
    const b80 = pow2(b40, _40n) * b40 % P;
    const b160 = pow2(b80, _80n) * b80 % P;
    const b240 = pow2(b160, _80n) * b80 % P;
    const b250 = pow2(b240, _10n) * b10 % P;
    const pow_p_5_8 = pow2(b250, _2n) * x % P;
    return { pow_p_5_8, b2 };
  }
  function uvRatio(u, v) {
    const v3 = mod2(v * v * v);
    const v7 = mod2(v3 * v3 * v);
    const pow = pow_2_252_3(u * v7).pow_p_5_8;
    let x = mod2(u * v3 * pow);
    const vx2 = mod2(v * x * x);
    const root1 = x;
    const root2 = mod2(x * SQRT_M1);
    const useRoot1 = vx2 === u;
    const useRoot2 = vx2 === mod2(-u);
    const noRoot = vx2 === mod2(-u * SQRT_M1);
    if (useRoot1)
      x = root1;
    if (useRoot2 || noRoot)
      x = root2;
    if (edIsNegative(x))
      x = mod2(-x);
    return { isValid: useRoot1 || useRoot2, value: x };
  }
  function invertSqrt(number) {
    return uvRatio(_1n, number);
  }
  async function sha512ModqLE(...args) {
    const hash = await utils.sha512(concatBytes(...args));
    const value = bytesToNumberLE(hash);
    return mod2(value, CURVE.l);
  }
  function equalBytes(b1, b2) {
    if (b1.length !== b2.length) {
      return false;
    }
    for (let i = 0; i < b1.length; i++) {
      if (b1[i] !== b2[i]) {
        return false;
      }
    }
    return true;
  }
  function ensureBytes(hex, expectedLength) {
    const bytes2 = hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes(hex);
    if (typeof expectedLength === "number" && bytes2.length !== expectedLength)
      throw new Error(`Expected ${expectedLength} bytes`);
    return bytes2;
  }
  function normalizeScalar(num, max, strict = true) {
    if (!max)
      throw new TypeError("Specify max value");
    if (typeof num === "number" && Number.isSafeInteger(num))
      num = BigInt(num);
    if (typeof num === "bigint" && num < max) {
      if (strict) {
        if (_0n < num)
          return num;
      } else {
        if (_0n <= num)
          return num;
      }
    }
    throw new TypeError("Expected valid scalar: 0 < scalar < max");
  }
  function adjustBytes25519(bytes2) {
    bytes2[0] &= 248;
    bytes2[31] &= 127;
    bytes2[31] |= 64;
    return bytes2;
  }
  async function getExtendedPublicKey(key) {
    key = typeof key === "bigint" || typeof key === "number" ? numberTo32BytesBE(normalizeScalar(key, MAX_256B)) : ensureBytes(key);
    if (key.length !== 32)
      throw new Error(`Expected 32 bytes`);
    const hashed = await utils.sha512(key);
    const head = adjustBytes25519(hashed.slice(0, 32));
    const prefix = hashed.slice(32, 64);
    const scalar = mod2(bytesToNumberLE(head), CURVE.l);
    const point = Point.BASE.multiply(scalar);
    const pointBytes = point.toRawBytes();
    return { head, prefix, scalar, point, pointBytes };
  }
  async function getPublicKey(privateKey) {
    return (await getExtendedPublicKey(privateKey)).pointBytes;
  }
  async function sign(message2, privateKey) {
    message2 = ensureBytes(message2);
    const { prefix, scalar, pointBytes } = await getExtendedPublicKey(privateKey);
    const r = await sha512ModqLE(prefix, message2);
    const R = Point.BASE.multiply(r);
    const k = await sha512ModqLE(R.toRawBytes(), pointBytes, message2);
    const s = mod2(r + k * scalar, CURVE.l);
    return new Signature(R, s).toRawBytes();
  }
  async function verify(sig, message2, publicKey) {
    message2 = ensureBytes(message2);
    if (!(publicKey instanceof Point))
      publicKey = Point.fromHex(publicKey, false);
    const { r, s } = sig instanceof Signature ? sig.assertValidity() : Signature.fromHex(sig);
    const SB = ExtendedPoint.BASE.multiplyUnsafe(s);
    const k = await sha512ModqLE(r.toRawBytes(), publicKey.toRawBytes(), message2);
    const kA = ExtendedPoint.fromAffine(publicKey).multiplyUnsafe(k);
    const RkA = ExtendedPoint.fromAffine(r).add(kA);
    return RkA.subtract(SB).multiplyUnsafe(CURVE.h).equals(ExtendedPoint.ZERO);
  }
  Point.BASE._setWindowSize(8);
  var crypto2 = {
    node: import_crypto.default,
    web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
  };
  var utils = {
    TORSION_SUBGROUP: [
      "0100000000000000000000000000000000000000000000000000000000000000",
      "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
      "0000000000000000000000000000000000000000000000000000000000000080",
      "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
      "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
      "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
      "0000000000000000000000000000000000000000000000000000000000000000",
      "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
    ],
    bytesToHex,
    getExtendedPublicKey,
    mod: mod2,
    invert,
    hashToPrivateScalar: (hash) => {
      hash = ensureBytes(hash);
      if (hash.length < 40 || hash.length > 1024)
        throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
      const num = mod2(bytesToNumberLE(hash), CURVE.l);
      if (num === _0n || num === _1n)
        throw new Error("Invalid private key");
      return num;
    },
    randomBytes: (bytesLength = 32) => {
      if (crypto2.web) {
        return crypto2.web.getRandomValues(new Uint8Array(bytesLength));
      } else if (crypto2.node) {
        const { randomBytes: randomBytes2 } = crypto2.node;
        return new Uint8Array(randomBytes2(bytesLength).buffer);
      } else {
        throw new Error("The environment doesn't have randomBytes function");
      }
    },
    randomPrivateKey: () => {
      return utils.randomBytes(32);
    },
    sha512: async (message2) => {
      if (crypto2.web) {
        const buffer2 = await crypto2.web.subtle.digest("SHA-512", message2.buffer);
        return new Uint8Array(buffer2);
      } else if (crypto2.node) {
        return Uint8Array.from(crypto2.node.createHash("sha512").update(message2).digest());
      } else {
        throw new Error("The environment doesn't have sha512 function");
      }
    },
    precompute(windowSize = 8, point = Point.BASE) {
      const cached = point.equals(Point.BASE) ? point : new Point(point.x, point.y);
      cached._setWindowSize(windowSize);
      cached.multiply(_2n);
      return cached;
    }
  };

  // ../node_modules/@libp2p/crypto/dist/src/keys/ed25519.js
  var PUBLIC_KEY_BYTE_LENGTH = 32;
  var PRIVATE_KEY_BYTE_LENGTH = 64;
  var KEYS_BYTE_LENGTH = 32;
  async function generateKey2() {
    const privateKeyRaw = utils.randomPrivateKey();
    const publicKey = await getPublicKey(privateKeyRaw);
    const privateKey = concatKeys(privateKeyRaw, publicKey);
    return {
      privateKey,
      publicKey
    };
  }
  async function generateKeyFromSeed(seed) {
    if (seed.length !== KEYS_BYTE_LENGTH) {
      throw new TypeError('"seed" must be 32 bytes in length.');
    } else if (!(seed instanceof Uint8Array)) {
      throw new TypeError('"seed" must be a node.js Buffer, or Uint8Array.');
    }
    const privateKeyRaw = seed;
    const publicKey = await getPublicKey(privateKeyRaw);
    const privateKey = concatKeys(privateKeyRaw, publicKey);
    return {
      privateKey,
      publicKey
    };
  }
  async function hashAndSign2(privateKey, msg) {
    const privateKeyRaw = privateKey.slice(0, KEYS_BYTE_LENGTH);
    return await sign(msg, privateKeyRaw);
  }
  async function hashAndVerify2(publicKey, sig, msg) {
    return await verify(sig, msg, publicKey);
  }
  function concatKeys(privateKeyRaw, publicKey) {
    const privateKey = new Uint8Array(PRIVATE_KEY_BYTE_LENGTH);
    for (let i = 0; i < KEYS_BYTE_LENGTH; i++) {
      privateKey[i] = privateKeyRaw[i];
      privateKey[KEYS_BYTE_LENGTH + i] = publicKey[i];
    }
    return privateKey;
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/ed25519-class.js
  var Ed25519PublicKey = class {
    constructor(key) {
      this._key = ensureKey(key, PUBLIC_KEY_BYTE_LENGTH);
    }
    async verify(data, sig) {
      return await hashAndVerify2(this._key, sig, data);
    }
    marshal() {
      return this._key;
    }
    get bytes() {
      return PublicKey.encode({
        Type: KeyType.Ed25519,
        Data: this.marshal()
      });
    }
    equals(key) {
      return equals3(this.bytes, key.bytes);
    }
    async hash() {
      const { bytes: bytes2 } = await sha256.digest(this.bytes);
      return bytes2;
    }
  };
  var Ed25519PrivateKey = class {
    constructor(key, publicKey) {
      this._key = ensureKey(key, PRIVATE_KEY_BYTE_LENGTH);
      this._publicKey = ensureKey(publicKey, PUBLIC_KEY_BYTE_LENGTH);
    }
    async sign(message2) {
      return await hashAndSign2(this._key, message2);
    }
    get public() {
      return new Ed25519PublicKey(this._publicKey);
    }
    marshal() {
      return this._key;
    }
    get bytes() {
      return PrivateKey.encode({
        Type: KeyType.Ed25519,
        Data: this.marshal()
      });
    }
    equals(key) {
      return equals3(this.bytes, key.bytes);
    }
    async hash() {
      const { bytes: bytes2 } = await sha256.digest(this.bytes);
      return bytes2;
    }
    async id() {
      const encoding = await identity2.digest(this.public.bytes);
      return base58btc.encode(encoding.bytes).substring(1);
    }
    async export(password, format = "libp2p-key") {
      if (format === "libp2p-key") {
        return await exporter(this.bytes, password);
      } else {
        throw (0, import_err_code7.default)(new Error(`export format '${format}' is not supported`), "ERR_INVALID_EXPORT_FORMAT");
      }
    }
  };
  function unmarshalEd25519PrivateKey(bytes2) {
    if (bytes2.length > PRIVATE_KEY_BYTE_LENGTH) {
      bytes2 = ensureKey(bytes2, PRIVATE_KEY_BYTE_LENGTH + PUBLIC_KEY_BYTE_LENGTH);
      const privateKeyBytes2 = bytes2.slice(0, PRIVATE_KEY_BYTE_LENGTH);
      const publicKeyBytes2 = bytes2.slice(PRIVATE_KEY_BYTE_LENGTH, bytes2.length);
      return new Ed25519PrivateKey(privateKeyBytes2, publicKeyBytes2);
    }
    bytes2 = ensureKey(bytes2, PRIVATE_KEY_BYTE_LENGTH);
    const privateKeyBytes = bytes2.slice(0, PRIVATE_KEY_BYTE_LENGTH);
    const publicKeyBytes = bytes2.slice(PUBLIC_KEY_BYTE_LENGTH);
    return new Ed25519PrivateKey(privateKeyBytes, publicKeyBytes);
  }
  function unmarshalEd25519PublicKey(bytes2) {
    bytes2 = ensureKey(bytes2, PUBLIC_KEY_BYTE_LENGTH);
    return new Ed25519PublicKey(bytes2);
  }
  async function generateKeyPair2() {
    const { privateKey, publicKey } = await generateKey2();
    return new Ed25519PrivateKey(privateKey, publicKey);
  }
  async function generateKeyPairFromSeed(seed) {
    const { privateKey, publicKey } = await generateKeyFromSeed(seed);
    return new Ed25519PrivateKey(privateKey, publicKey);
  }
  function ensureKey(key, length2) {
    key = Uint8Array.from(key ?? []);
    if (key.length !== length2) {
      throw (0, import_err_code7.default)(new Error(`Key must be a Uint8Array of length ${length2}, got ${key.length}`), "ERR_INVALID_KEY_TYPE");
    }
    return key;
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/secp256k1-class.js
  var secp256k1_class_exports = {};
  __export(secp256k1_class_exports, {
    Secp256k1PrivateKey: () => Secp256k1PrivateKey,
    Secp256k1PublicKey: () => Secp256k1PublicKey,
    generateKeyPair: () => generateKeyPair3,
    unmarshalSecp256k1PrivateKey: () => unmarshalSecp256k1PrivateKey,
    unmarshalSecp256k1PublicKey: () => unmarshalSecp256k1PublicKey
  });
  init_sha2_browser();
  var import_err_code9 = __toESM(require_err_code(), 1);
  init_equals();
  init_to_string();

  // ../node_modules/@libp2p/crypto/dist/src/keys/secp256k1.js
  var import_err_code8 = __toESM(require_err_code(), 1);

  // ../node_modules/@noble/secp256k1/lib/esm/index.js
  var nodeCrypto2 = __toESM(require_crypto(), 1);
  var _0n2 = BigInt(0);
  var _1n2 = BigInt(1);
  var _2n2 = BigInt(2);
  var _3n = BigInt(3);
  var _8n = BigInt(8);
  var POW_2_256 = _2n2 ** BigInt(256);
  var CURVE2 = {
    a: _0n2,
    b: BigInt(7),
    P: POW_2_256 - _2n2 ** BigInt(32) - BigInt(977),
    n: POW_2_256 - BigInt("432420386565659656852420866394968145599"),
    h: _1n2,
    Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
    Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
  };
  function weistrass(x) {
    const { a, b } = CURVE2;
    const x2 = mod3(x * x);
    const x3 = mod3(x2 * x);
    return mod3(x3 + a * x + b);
  }
  var USE_ENDOMORPHISM = CURVE2.a === _0n2;
  var JacobianPoint = class {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    static fromAffine(p) {
      if (!(p instanceof Point2)) {
        throw new TypeError("JacobianPoint#fromAffine: expected Point");
      }
      return new JacobianPoint(p.x, p.y, _1n2);
    }
    static toAffineBatch(points) {
      const toInv = invertBatch2(points.map((p) => p.z));
      return points.map((p, i) => p.toAffine(toInv[i]));
    }
    static normalizeZ(points) {
      return JacobianPoint.toAffineBatch(points).map(JacobianPoint.fromAffine);
    }
    equals(other) {
      if (!(other instanceof JacobianPoint))
        throw new TypeError("JacobianPoint expected");
      const { x: X1, y: Y1, z: Z1 } = this;
      const { x: X2, y: Y2, z: Z2 } = other;
      const Z1Z1 = mod3(Z1 ** _2n2);
      const Z2Z2 = mod3(Z2 ** _2n2);
      const U1 = mod3(X1 * Z2Z2);
      const U2 = mod3(X2 * Z1Z1);
      const S1 = mod3(mod3(Y1 * Z2) * Z2Z2);
      const S2 = mod3(mod3(Y2 * Z1) * Z1Z1);
      return U1 === U2 && S1 === S2;
    }
    negate() {
      return new JacobianPoint(this.x, mod3(-this.y), this.z);
    }
    double() {
      const { x: X1, y: Y1, z: Z1 } = this;
      const A = mod3(X1 ** _2n2);
      const B = mod3(Y1 ** _2n2);
      const C = mod3(B ** _2n2);
      const D = mod3(_2n2 * (mod3((X1 + B) ** _2n2) - A - C));
      const E = mod3(_3n * A);
      const F = mod3(E ** _2n2);
      const X3 = mod3(F - _2n2 * D);
      const Y3 = mod3(E * (D - X3) - _8n * C);
      const Z3 = mod3(_2n2 * Y1 * Z1);
      return new JacobianPoint(X3, Y3, Z3);
    }
    add(other) {
      if (!(other instanceof JacobianPoint))
        throw new TypeError("JacobianPoint expected");
      const { x: X1, y: Y1, z: Z1 } = this;
      const { x: X2, y: Y2, z: Z2 } = other;
      if (X2 === _0n2 || Y2 === _0n2)
        return this;
      if (X1 === _0n2 || Y1 === _0n2)
        return other;
      const Z1Z1 = mod3(Z1 ** _2n2);
      const Z2Z2 = mod3(Z2 ** _2n2);
      const U1 = mod3(X1 * Z2Z2);
      const U2 = mod3(X2 * Z1Z1);
      const S1 = mod3(mod3(Y1 * Z2) * Z2Z2);
      const S2 = mod3(mod3(Y2 * Z1) * Z1Z1);
      const H = mod3(U2 - U1);
      const r = mod3(S2 - S1);
      if (H === _0n2) {
        if (r === _0n2) {
          return this.double();
        } else {
          return JacobianPoint.ZERO;
        }
      }
      const HH = mod3(H ** _2n2);
      const HHH = mod3(H * HH);
      const V = mod3(U1 * HH);
      const X3 = mod3(r ** _2n2 - HHH - _2n2 * V);
      const Y3 = mod3(r * (V - X3) - S1 * HHH);
      const Z3 = mod3(Z1 * Z2 * H);
      return new JacobianPoint(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    multiplyUnsafe(scalar) {
      let n = normalizeScalar2(scalar);
      const G = JacobianPoint.BASE;
      const P0 = JacobianPoint.ZERO;
      if (n === _0n2)
        return P0;
      if (n === _1n2)
        return this;
      if (!USE_ENDOMORPHISM) {
        let p = P0;
        let d2 = this;
        while (n > _0n2) {
          if (n & _1n2)
            p = p.add(d2);
          d2 = d2.double();
          n >>= _1n2;
        }
        return p;
      }
      let { k1neg, k1, k2neg, k2 } = splitScalarEndo(n);
      let k1p = P0;
      let k2p = P0;
      let d = this;
      while (k1 > _0n2 || k2 > _0n2) {
        if (k1 & _1n2)
          k1p = k1p.add(d);
        if (k2 & _1n2)
          k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n2;
        k2 >>= _1n2;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new JacobianPoint(mod3(k2p.x * CURVE2.beta), k2p.y, k2p.z);
      return k1p.add(k2p);
    }
    precomputeWindow(W) {
      const windows = USE_ENDOMORPHISM ? 128 / W + 1 : 256 / W + 1;
      const points = [];
      let p = this;
      let base3 = p;
      for (let window2 = 0; window2 < windows; window2++) {
        base3 = p;
        points.push(base3);
        for (let i = 1; i < 2 ** (W - 1); i++) {
          base3 = base3.add(p);
          points.push(base3);
        }
        p = base3.double();
      }
      return points;
    }
    wNAF(n, affinePoint) {
      if (!affinePoint && this.equals(JacobianPoint.BASE))
        affinePoint = Point2.BASE;
      const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
      if (256 % W) {
        throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
      }
      let precomputes = affinePoint && pointPrecomputes2.get(affinePoint);
      if (!precomputes) {
        precomputes = this.precomputeWindow(W);
        if (affinePoint && W !== 1) {
          precomputes = JacobianPoint.normalizeZ(precomputes);
          pointPrecomputes2.set(affinePoint, precomputes);
        }
      }
      let p = JacobianPoint.ZERO;
      let f = JacobianPoint.ZERO;
      const windows = 1 + (USE_ENDOMORPHISM ? 128 / W : 256 / W);
      const windowSize = 2 ** (W - 1);
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window2 = 0; window2 < windows; window2++) {
        const offset = window2 * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n2;
        }
        if (wbits === 0) {
          let pr = precomputes[offset];
          if (window2 % 2)
            pr = pr.negate();
          f = f.add(pr);
        } else {
          let cached = precomputes[offset + Math.abs(wbits) - 1];
          if (wbits < 0)
            cached = cached.negate();
          p = p.add(cached);
        }
      }
      return { p, f };
    }
    multiply(scalar, affinePoint) {
      let n = normalizeScalar2(scalar);
      let point;
      let fake;
      if (USE_ENDOMORPHISM) {
        const { k1neg, k1, k2neg, k2 } = splitScalarEndo(n);
        let { p: k1p, f: f1p } = this.wNAF(k1, affinePoint);
        let { p: k2p, f: f2p } = this.wNAF(k2, affinePoint);
        if (k1neg)
          k1p = k1p.negate();
        if (k2neg)
          k2p = k2p.negate();
        k2p = new JacobianPoint(mod3(k2p.x * CURVE2.beta), k2p.y, k2p.z);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p, f } = this.wNAF(n, affinePoint);
        point = p;
        fake = f;
      }
      return JacobianPoint.normalizeZ([point, fake])[0];
    }
    toAffine(invZ = invert2(this.z)) {
      const { x, y, z } = this;
      const iz1 = invZ;
      const iz2 = mod3(iz1 * iz1);
      const iz3 = mod3(iz2 * iz1);
      const ax = mod3(x * iz2);
      const ay = mod3(y * iz3);
      const zz = mod3(z * iz1);
      if (zz !== _1n2)
        throw new Error("invZ was invalid");
      return new Point2(ax, ay);
    }
  };
  JacobianPoint.BASE = new JacobianPoint(CURVE2.Gx, CURVE2.Gy, _1n2);
  JacobianPoint.ZERO = new JacobianPoint(_0n2, _1n2, _0n2);
  var pointPrecomputes2 = /* @__PURE__ */ new WeakMap();
  var Point2 = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    _setWindowSize(windowSize) {
      this._WINDOW_SIZE = windowSize;
      pointPrecomputes2.delete(this);
    }
    static fromCompressedHex(bytes2) {
      const isShort = bytes2.length === 32;
      const x = bytesToNumber(isShort ? bytes2 : bytes2.subarray(1));
      if (!isValidFieldElement(x))
        throw new Error("Point is not on curve");
      const y2 = weistrass(x);
      let y = sqrtMod(y2);
      const isYOdd = (y & _1n2) === _1n2;
      if (isShort) {
        if (isYOdd)
          y = mod3(-y);
      } else {
        const isFirstByteOdd = (bytes2[0] & 1) === 1;
        if (isFirstByteOdd !== isYOdd)
          y = mod3(-y);
      }
      const point = new Point2(x, y);
      point.assertValidity();
      return point;
    }
    static fromUncompressedHex(bytes2) {
      const x = bytesToNumber(bytes2.subarray(1, 33));
      const y = bytesToNumber(bytes2.subarray(33, 65));
      const point = new Point2(x, y);
      point.assertValidity();
      return point;
    }
    static fromHex(hex) {
      const bytes2 = ensureBytes2(hex);
      const len = bytes2.length;
      const header = bytes2[0];
      if (len === 32 || len === 33 && (header === 2 || header === 3)) {
        return this.fromCompressedHex(bytes2);
      }
      if (len === 65 && header === 4)
        return this.fromUncompressedHex(bytes2);
      throw new Error(`Point.fromHex: received invalid point. Expected 32-33 compressed bytes or 65 uncompressed bytes, not ${len}`);
    }
    static fromPrivateKey(privateKey) {
      return Point2.BASE.multiply(normalizePrivateKey(privateKey));
    }
    static fromSignature(msgHash, signature, recovery) {
      msgHash = ensureBytes2(msgHash);
      const h = truncateHash(msgHash);
      const { r, s } = normalizeSignature(signature);
      if (recovery !== 0 && recovery !== 1) {
        throw new Error("Cannot recover signature: invalid recovery bit");
      }
      if (h === _0n2)
        throw new Error("Cannot recover signature: msgHash cannot be 0");
      const prefix = recovery & 1 ? "03" : "02";
      const R = Point2.fromHex(prefix + numTo32bStr(r));
      const { n } = CURVE2;
      const rinv = invert2(r, n);
      const u1 = mod3(-h * rinv, n);
      const u2 = mod3(s * rinv, n);
      const Q = Point2.BASE.multiplyAndAddUnsafe(R, u1, u2);
      if (!Q)
        throw new Error("Cannot recover signature: point at infinify");
      Q.assertValidity();
      return Q;
    }
    toRawBytes(isCompressed = false) {
      return hexToBytes2(this.toHex(isCompressed));
    }
    toHex(isCompressed = false) {
      const x = numTo32bStr(this.x);
      if (isCompressed) {
        const prefix = this.y & _1n2 ? "03" : "02";
        return `${prefix}${x}`;
      } else {
        return `04${x}${numTo32bStr(this.y)}`;
      }
    }
    toHexX() {
      return this.toHex(true).slice(2);
    }
    toRawX() {
      return this.toRawBytes(true).slice(1);
    }
    assertValidity() {
      const msg = "Point is not on elliptic curve";
      const { x, y } = this;
      if (!isValidFieldElement(x) || !isValidFieldElement(y))
        throw new Error(msg);
      const left = mod3(y * y);
      const right = weistrass(x);
      if (mod3(left - right) !== _0n2)
        throw new Error(msg);
    }
    equals(other) {
      return this.x === other.x && this.y === other.y;
    }
    negate() {
      return new Point2(this.x, mod3(-this.y));
    }
    double() {
      return JacobianPoint.fromAffine(this).double().toAffine();
    }
    add(other) {
      return JacobianPoint.fromAffine(this).add(JacobianPoint.fromAffine(other)).toAffine();
    }
    subtract(other) {
      return this.add(other.negate());
    }
    multiply(scalar) {
      return JacobianPoint.fromAffine(this).multiply(scalar, this).toAffine();
    }
    multiplyAndAddUnsafe(Q, a, b) {
      const P = JacobianPoint.fromAffine(this);
      const aP = a === _0n2 || a === _1n2 || this !== Point2.BASE ? P.multiplyUnsafe(a) : P.multiply(a);
      const bQ = JacobianPoint.fromAffine(Q).multiplyUnsafe(b);
      const sum = aP.add(bQ);
      return sum.equals(JacobianPoint.ZERO) ? void 0 : sum.toAffine();
    }
  };
  Point2.BASE = new Point2(CURVE2.Gx, CURVE2.Gy);
  Point2.ZERO = new Point2(_0n2, _0n2);
  function sliceDER(s) {
    return Number.parseInt(s[0], 16) >= 8 ? "00" + s : s;
  }
  function parseDERInt(data) {
    if (data.length < 2 || data[0] !== 2) {
      throw new Error(`Invalid signature integer tag: ${bytesToHex2(data)}`);
    }
    const len = data[1];
    const res = data.subarray(2, len + 2);
    if (!len || res.length !== len) {
      throw new Error(`Invalid signature integer: wrong length`);
    }
    if (res[0] === 0 && res[1] <= 127) {
      throw new Error("Invalid signature integer: trailing length");
    }
    return { data: bytesToNumber(res), left: data.subarray(len + 2) };
  }
  function parseDERSignature(data) {
    if (data.length < 2 || data[0] != 48) {
      throw new Error(`Invalid signature tag: ${bytesToHex2(data)}`);
    }
    if (data[1] !== data.length - 2) {
      throw new Error("Invalid signature: incorrect length");
    }
    const { data: r, left: sBytes } = parseDERInt(data.subarray(2));
    const { data: s, left: rBytesLeft } = parseDERInt(sBytes);
    if (rBytesLeft.length) {
      throw new Error(`Invalid signature: left bytes after parsing: ${bytesToHex2(rBytesLeft)}`);
    }
    return { r, s };
  }
  var Signature2 = class {
    constructor(r, s) {
      this.r = r;
      this.s = s;
      this.assertValidity();
    }
    static fromCompact(hex) {
      const arr = isUint8a(hex);
      const name2 = "Signature.fromCompact";
      if (typeof hex !== "string" && !arr)
        throw new TypeError(`${name2}: Expected string or Uint8Array`);
      const str = arr ? bytesToHex2(hex) : hex;
      if (str.length !== 128)
        throw new Error(`${name2}: Expected 64-byte hex`);
      return new Signature2(hexToNumber(str.slice(0, 64)), hexToNumber(str.slice(64, 128)));
    }
    static fromDER(hex) {
      const arr = isUint8a(hex);
      if (typeof hex !== "string" && !arr)
        throw new TypeError(`Signature.fromDER: Expected string or Uint8Array`);
      const { r, s } = parseDERSignature(arr ? hex : hexToBytes2(hex));
      return new Signature2(r, s);
    }
    static fromHex(hex) {
      return this.fromDER(hex);
    }
    assertValidity() {
      const { r, s } = this;
      if (!isWithinCurveOrder(r))
        throw new Error("Invalid Signature: r must be 0 < r < n");
      if (!isWithinCurveOrder(s))
        throw new Error("Invalid Signature: s must be 0 < s < n");
    }
    hasHighS() {
      const HALF = CURVE2.n >> _1n2;
      return this.s > HALF;
    }
    normalizeS() {
      return this.hasHighS() ? new Signature2(this.r, CURVE2.n - this.s) : this;
    }
    toDERRawBytes(isCompressed = false) {
      return hexToBytes2(this.toDERHex(isCompressed));
    }
    toDERHex(isCompressed = false) {
      const sHex = sliceDER(numberToHexUnpadded(this.s));
      if (isCompressed)
        return sHex;
      const rHex = sliceDER(numberToHexUnpadded(this.r));
      const rLen = numberToHexUnpadded(rHex.length / 2);
      const sLen = numberToHexUnpadded(sHex.length / 2);
      const length2 = numberToHexUnpadded(rHex.length / 2 + sHex.length / 2 + 4);
      return `30${length2}02${rLen}${rHex}02${sLen}${sHex}`;
    }
    toRawBytes() {
      return this.toDERRawBytes();
    }
    toHex() {
      return this.toDERHex();
    }
    toCompactRawBytes() {
      return hexToBytes2(this.toCompactHex());
    }
    toCompactHex() {
      return numTo32bStr(this.r) + numTo32bStr(this.s);
    }
  };
  function concatBytes2(...arrays) {
    if (!arrays.every(isUint8a))
      throw new Error("Uint8Array list expected");
    if (arrays.length === 1)
      return arrays[0];
    const length2 = arrays.reduce((a, arr) => a + arr.length, 0);
    const result = new Uint8Array(length2);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const arr = arrays[i];
      result.set(arr, pad);
      pad += arr.length;
    }
    return result;
  }
  function isUint8a(bytes2) {
    return bytes2 instanceof Uint8Array;
  }
  var hexes2 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex2(uint8a) {
    if (!(uint8a instanceof Uint8Array))
      throw new Error("Expected Uint8Array");
    let hex = "";
    for (let i = 0; i < uint8a.length; i++) {
      hex += hexes2[uint8a[i]];
    }
    return hex;
  }
  function numTo32bStr(num) {
    if (num > POW_2_256)
      throw new Error("Expected number < 2^256");
    return num.toString(16).padStart(64, "0");
  }
  function numTo32b(num) {
    return hexToBytes2(numTo32bStr(num));
  }
  function numberToHexUnpadded(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? `0${hex}` : hex;
  }
  function hexToNumber(hex) {
    if (typeof hex !== "string") {
      throw new TypeError("hexToNumber: expected string, got " + typeof hex);
    }
    return BigInt(`0x${hex}`);
  }
  function hexToBytes2(hex) {
    if (typeof hex !== "string") {
      throw new TypeError("hexToBytes: expected string, got " + typeof hex);
    }
    if (hex.length % 2)
      throw new Error("hexToBytes: received invalid unpadded hex" + hex.length);
    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < array.length; i++) {
      const j = i * 2;
      const hexByte = hex.slice(j, j + 2);
      const byte = Number.parseInt(hexByte, 16);
      if (Number.isNaN(byte) || byte < 0)
        throw new Error("Invalid byte sequence");
      array[i] = byte;
    }
    return array;
  }
  function bytesToNumber(bytes2) {
    return hexToNumber(bytesToHex2(bytes2));
  }
  function ensureBytes2(hex) {
    return hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes2(hex);
  }
  function normalizeScalar2(num) {
    if (typeof num === "number" && Number.isSafeInteger(num) && num > 0)
      return BigInt(num);
    if (typeof num === "bigint" && isWithinCurveOrder(num))
      return num;
    throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
  }
  function mod3(a, b = CURVE2.P) {
    const result = a % b;
    return result >= _0n2 ? result : b + result;
  }
  function pow22(x, power) {
    const { P } = CURVE2;
    let res = x;
    while (power-- > _0n2) {
      res *= res;
      res %= P;
    }
    return res;
  }
  function sqrtMod(x) {
    const { P } = CURVE2;
    const _6n = BigInt(6);
    const _11n = BigInt(11);
    const _22n = BigInt(22);
    const _23n = BigInt(23);
    const _44n = BigInt(44);
    const _88n = BigInt(88);
    const b2 = x * x * x % P;
    const b3 = b2 * b2 * x % P;
    const b6 = pow22(b3, _3n) * b3 % P;
    const b9 = pow22(b6, _3n) * b3 % P;
    const b11 = pow22(b9, _2n2) * b2 % P;
    const b22 = pow22(b11, _11n) * b11 % P;
    const b44 = pow22(b22, _22n) * b22 % P;
    const b88 = pow22(b44, _44n) * b44 % P;
    const b176 = pow22(b88, _88n) * b88 % P;
    const b220 = pow22(b176, _44n) * b44 % P;
    const b223 = pow22(b220, _3n) * b3 % P;
    const t1 = pow22(b223, _23n) * b22 % P;
    const t2 = pow22(t1, _6n) * b2 % P;
    return pow22(t2, _2n2);
  }
  function invert2(number, modulo = CURVE2.P) {
    if (number === _0n2 || modulo <= _0n2) {
      throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
    }
    let a = mod3(number, modulo);
    let b = modulo;
    let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
    while (a !== _0n2) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n2)
      throw new Error("invert: does not exist");
    return mod3(x, modulo);
  }
  function invertBatch2(nums, p = CURVE2.P) {
    const scratch = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
      if (num === _0n2)
        return acc;
      scratch[i] = acc;
      return mod3(acc * num, p);
    }, _1n2);
    const inverted = invert2(lastMultiplied, p);
    nums.reduceRight((acc, num, i) => {
      if (num === _0n2)
        return acc;
      scratch[i] = mod3(acc * scratch[i], p);
      return mod3(acc * num, p);
    }, inverted);
    return scratch;
  }
  var divNearest = (a, b) => (a + b / _2n2) / b;
  var POW_2_128 = _2n2 ** BigInt(128);
  function splitScalarEndo(k) {
    const { n } = CURVE2;
    const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
    const b1 = -_1n2 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
    const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
    const b2 = a1;
    const c1 = divNearest(b2 * k, n);
    const c2 = divNearest(-b1 * k, n);
    let k1 = mod3(k - c1 * a1 - c2 * a2, n);
    let k2 = mod3(-c1 * b1 - c2 * b2, n);
    const k1neg = k1 > POW_2_128;
    const k2neg = k2 > POW_2_128;
    if (k1neg)
      k1 = n - k1;
    if (k2neg)
      k2 = n - k2;
    if (k1 > POW_2_128 || k2 > POW_2_128) {
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + k);
    }
    return { k1neg, k1, k2neg, k2 };
  }
  function truncateHash(hash) {
    const { n } = CURVE2;
    const byteLength = hash.length;
    const delta = byteLength * 8 - 256;
    let h = bytesToNumber(hash);
    if (delta > 0)
      h = h >> BigInt(delta);
    if (h >= n)
      h -= n;
    return h;
  }
  var HmacDrbg = class {
    constructor() {
      this.v = new Uint8Array(32).fill(1);
      this.k = new Uint8Array(32).fill(0);
      this.counter = 0;
    }
    hmac(...values) {
      return utils2.hmacSha256(this.k, ...values);
    }
    hmacSync(...values) {
      if (typeof utils2.hmacSha256Sync !== "function")
        throw new Error("utils.hmacSha256Sync is undefined, you need to set it");
      const res = utils2.hmacSha256Sync(this.k, ...values);
      if (res instanceof Promise)
        throw new Error("To use sync sign(), ensure utils.hmacSha256 is sync");
      return res;
    }
    incr() {
      if (this.counter >= 1e3) {
        throw new Error("Tried 1,000 k values for sign(), all were invalid");
      }
      this.counter += 1;
    }
    async reseed(seed = new Uint8Array()) {
      this.k = await this.hmac(this.v, Uint8Array.from([0]), seed);
      this.v = await this.hmac(this.v);
      if (seed.length === 0)
        return;
      this.k = await this.hmac(this.v, Uint8Array.from([1]), seed);
      this.v = await this.hmac(this.v);
    }
    reseedSync(seed = new Uint8Array()) {
      this.k = this.hmacSync(this.v, Uint8Array.from([0]), seed);
      this.v = this.hmacSync(this.v);
      if (seed.length === 0)
        return;
      this.k = this.hmacSync(this.v, Uint8Array.from([1]), seed);
      this.v = this.hmacSync(this.v);
    }
    async generate() {
      this.incr();
      this.v = await this.hmac(this.v);
      return this.v;
    }
    generateSync() {
      this.incr();
      this.v = this.hmacSync(this.v);
      return this.v;
    }
  };
  function isWithinCurveOrder(num) {
    return _0n2 < num && num < CURVE2.n;
  }
  function isValidFieldElement(num) {
    return _0n2 < num && num < CURVE2.P;
  }
  function kmdToSig(kBytes, m, d) {
    const k = bytesToNumber(kBytes);
    if (!isWithinCurveOrder(k))
      return;
    const { n } = CURVE2;
    const q = Point2.BASE.multiply(k);
    const r = mod3(q.x, n);
    if (r === _0n2)
      return;
    const s = mod3(invert2(k, n) * mod3(m + d * r, n), n);
    if (s === _0n2)
      return;
    const sig = new Signature2(r, s);
    const recovery = (q.x === sig.r ? 0 : 2) | Number(q.y & _1n2);
    return { sig, recovery };
  }
  function normalizePrivateKey(key) {
    let num;
    if (typeof key === "bigint") {
      num = key;
    } else if (typeof key === "number" && Number.isSafeInteger(key) && key > 0) {
      num = BigInt(key);
    } else if (typeof key === "string") {
      if (key.length !== 64)
        throw new Error("Expected 32 bytes of private key");
      num = hexToNumber(key);
    } else if (isUint8a(key)) {
      if (key.length !== 32)
        throw new Error("Expected 32 bytes of private key");
      num = bytesToNumber(key);
    } else {
      throw new TypeError("Expected valid private key");
    }
    if (!isWithinCurveOrder(num))
      throw new Error("Expected private key: 0 < key < n");
    return num;
  }
  function normalizePublicKey(publicKey) {
    if (publicKey instanceof Point2) {
      publicKey.assertValidity();
      return publicKey;
    } else {
      return Point2.fromHex(publicKey);
    }
  }
  function normalizeSignature(signature) {
    if (signature instanceof Signature2) {
      signature.assertValidity();
      return signature;
    }
    try {
      return Signature2.fromDER(signature);
    } catch (error) {
      return Signature2.fromCompact(signature);
    }
  }
  function getPublicKey2(privateKey, isCompressed = false) {
    return Point2.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  function bits2int(bytes2) {
    const slice2 = bytes2.length > 32 ? bytes2.slice(0, 32) : bytes2;
    return bytesToNumber(slice2);
  }
  function bits2octets(bytes2) {
    const z1 = bits2int(bytes2);
    const z2 = mod3(z1, CURVE2.n);
    return int2octets(z2 < _0n2 ? z1 : z2);
  }
  function int2octets(num) {
    if (typeof num !== "bigint")
      throw new Error("Expected bigint");
    const hex = numTo32bStr(num);
    return hexToBytes2(hex);
  }
  function initSigArgs(msgHash, privateKey, extraEntropy) {
    if (msgHash == null)
      throw new Error(`sign: expected valid message hash, not "${msgHash}"`);
    const h1 = ensureBytes2(msgHash);
    const d = normalizePrivateKey(privateKey);
    const seedArgs = [int2octets(d), bits2octets(h1)];
    if (extraEntropy != null) {
      if (extraEntropy === true)
        extraEntropy = utils2.randomBytes(32);
      const e = ensureBytes2(extraEntropy);
      if (e.length !== 32)
        throw new Error("sign: Expected 32 bytes of extra data");
      seedArgs.push(e);
    }
    const seed = concatBytes2(...seedArgs);
    const m = bits2int(h1);
    return { seed, m, d };
  }
  function finalizeSig(recSig, opts) {
    let { sig, recovery } = recSig;
    const { canonical, der, recovered } = Object.assign({ canonical: true, der: true }, opts);
    if (canonical && sig.hasHighS()) {
      sig = sig.normalizeS();
      recovery ^= 1;
    }
    const hashed = der ? sig.toDERRawBytes() : sig.toCompactRawBytes();
    return recovered ? [hashed, recovery] : hashed;
  }
  async function sign2(msgHash, privKey, opts = {}) {
    const { seed, m, d } = initSigArgs(msgHash, privKey, opts.extraEntropy);
    let sig;
    const drbg = new HmacDrbg();
    await drbg.reseed(seed);
    while (!(sig = kmdToSig(await drbg.generate(), m, d)))
      await drbg.reseed();
    return finalizeSig(sig, opts);
  }
  var vopts = { strict: true };
  function verify2(signature, msgHash, publicKey, opts = vopts) {
    let sig;
    try {
      sig = normalizeSignature(signature);
      msgHash = ensureBytes2(msgHash);
    } catch (error) {
      return false;
    }
    const { r, s } = sig;
    if (opts.strict && sig.hasHighS())
      return false;
    const h = truncateHash(msgHash);
    if (h === _0n2)
      return false;
    let P;
    try {
      P = normalizePublicKey(publicKey);
    } catch (error) {
      return false;
    }
    const { n } = CURVE2;
    const sinv = invert2(s, n);
    const u1 = mod3(h * sinv, n);
    const u2 = mod3(r * sinv, n);
    const R = Point2.BASE.multiplyAndAddUnsafe(P, u1, u2);
    if (!R)
      return false;
    const v = mod3(R.x, n);
    return v === r;
  }
  Point2.BASE._setWindowSize(8);
  var crypto3 = {
    node: nodeCrypto2,
    web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
  };
  var TAGGED_HASH_PREFIXES = {};
  var utils2 = {
    isValidPrivateKey(privateKey) {
      try {
        normalizePrivateKey(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    privateAdd: (privateKey, tweak) => {
      const p = normalizePrivateKey(privateKey);
      const t = bytesToNumber(ensureBytes2(tweak));
      return numTo32b(mod3(p + t, CURVE2.n));
    },
    privateNegate: (privateKey) => {
      const p = normalizePrivateKey(privateKey);
      return numTo32b(CURVE2.n - p);
    },
    pointAddScalar: (p, tweak, isCompressed) => {
      const P = Point2.fromHex(p);
      const t = bytesToNumber(ensureBytes2(tweak));
      const Q = Point2.BASE.multiplyAndAddUnsafe(P, t, _1n2);
      if (!Q)
        throw new Error("Tweaked point at infinity");
      return Q.toRawBytes(isCompressed);
    },
    pointMultiply: (p, tweak, isCompressed) => {
      const P = Point2.fromHex(p);
      const t = bytesToNumber(ensureBytes2(tweak));
      return P.multiply(t).toRawBytes(isCompressed);
    },
    hashToPrivateKey: (hash) => {
      hash = ensureBytes2(hash);
      if (hash.length < 40 || hash.length > 1024)
        throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
      const num = mod3(bytesToNumber(hash), CURVE2.n - _1n2) + _1n2;
      return numTo32b(num);
    },
    randomBytes: (bytesLength = 32) => {
      if (crypto3.web) {
        return crypto3.web.getRandomValues(new Uint8Array(bytesLength));
      } else if (crypto3.node) {
        const { randomBytes: randomBytes2 } = crypto3.node;
        return Uint8Array.from(randomBytes2(bytesLength));
      } else {
        throw new Error("The environment doesn't have randomBytes function");
      }
    },
    randomPrivateKey: () => {
      return utils2.hashToPrivateKey(utils2.randomBytes(40));
    },
    bytesToHex: bytesToHex2,
    hexToBytes: hexToBytes2,
    concatBytes: concatBytes2,
    mod: mod3,
    invert: invert2,
    sha256: async (...messages) => {
      if (crypto3.web) {
        const buffer2 = await crypto3.web.subtle.digest("SHA-256", concatBytes2(...messages));
        return new Uint8Array(buffer2);
      } else if (crypto3.node) {
        const { createHash } = crypto3.node;
        const hash = createHash("sha256");
        messages.forEach((m) => hash.update(m));
        return Uint8Array.from(hash.digest());
      } else {
        throw new Error("The environment doesn't have sha256 function");
      }
    },
    hmacSha256: async (key, ...messages) => {
      if (crypto3.web) {
        const ckey = await crypto3.web.subtle.importKey("raw", key, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
        const message2 = concatBytes2(...messages);
        const buffer2 = await crypto3.web.subtle.sign("HMAC", ckey, message2);
        return new Uint8Array(buffer2);
      } else if (crypto3.node) {
        const { createHmac } = crypto3.node;
        const hash = createHmac("sha256", key);
        messages.forEach((m) => hash.update(m));
        return Uint8Array.from(hash.digest());
      } else {
        throw new Error("The environment doesn't have hmac-sha256 function");
      }
    },
    sha256Sync: void 0,
    hmacSha256Sync: void 0,
    taggedHash: async (tag, ...messages) => {
      let tagP = TAGGED_HASH_PREFIXES[tag];
      if (tagP === void 0) {
        const tagH = await utils2.sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
        tagP = concatBytes2(tagH, tagH);
        TAGGED_HASH_PREFIXES[tag] = tagP;
      }
      return utils2.sha256(tagP, ...messages);
    },
    taggedHashSync: (tag, ...messages) => {
      if (typeof utils2.sha256Sync !== "function")
        throw new Error("utils.sha256Sync is undefined, you need to set it");
      let tagP = TAGGED_HASH_PREFIXES[tag];
      if (tagP === void 0) {
        const tagH = utils2.sha256Sync(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
        tagP = concatBytes2(tagH, tagH);
        TAGGED_HASH_PREFIXES[tag] = tagP;
      }
      return utils2.sha256Sync(tagP, ...messages);
    },
    precompute(windowSize = 8, point = Point2.BASE) {
      const cached = point === Point2.BASE ? point : new Point2(point.x, point.y);
      cached._setWindowSize(windowSize);
      cached.multiply(_3n);
      return cached;
    }
  };

  // ../node_modules/@libp2p/crypto/dist/src/keys/secp256k1.js
  init_sha2_browser();
  function generateKey3() {
    return utils2.randomPrivateKey();
  }
  async function hashAndSign3(key, msg) {
    const { digest: digest2 } = await sha256.digest(msg);
    try {
      return await sign2(digest2, key);
    } catch (err) {
      throw (0, import_err_code8.default)(err, "ERR_INVALID_INPUT");
    }
  }
  async function hashAndVerify3(key, sig, msg) {
    try {
      const { digest: digest2 } = await sha256.digest(msg);
      return verify2(sig, digest2, key);
    } catch (err) {
      throw (0, import_err_code8.default)(err, "ERR_INVALID_INPUT");
    }
  }
  function compressPublicKey(key) {
    const point = Point2.fromHex(key).toRawBytes(true);
    return point;
  }
  function validatePrivateKey(key) {
    try {
      getPublicKey2(key, true);
    } catch (err) {
      throw (0, import_err_code8.default)(err, "ERR_INVALID_PRIVATE_KEY");
    }
  }
  function validatePublicKey(key) {
    try {
      Point2.fromHex(key);
    } catch (err) {
      throw (0, import_err_code8.default)(err, "ERR_INVALID_PUBLIC_KEY");
    }
  }
  function computePublicKey(privateKey) {
    try {
      return getPublicKey2(privateKey, true);
    } catch (err) {
      throw (0, import_err_code8.default)(err, "ERR_INVALID_PRIVATE_KEY");
    }
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/secp256k1-class.js
  var Secp256k1PublicKey = class {
    constructor(key) {
      validatePublicKey(key);
      this._key = key;
    }
    async verify(data, sig) {
      return await hashAndVerify3(this._key, sig, data);
    }
    marshal() {
      return compressPublicKey(this._key);
    }
    get bytes() {
      return PublicKey.encode({
        Type: KeyType.Secp256k1,
        Data: this.marshal()
      });
    }
    equals(key) {
      return equals3(this.bytes, key.bytes);
    }
    async hash() {
      const { bytes: bytes2 } = await sha256.digest(this.bytes);
      return bytes2;
    }
  };
  var Secp256k1PrivateKey = class {
    constructor(key, publicKey) {
      this._key = key;
      this._publicKey = publicKey ?? computePublicKey(key);
      validatePrivateKey(this._key);
      validatePublicKey(this._publicKey);
    }
    async sign(message2) {
      return await hashAndSign3(this._key, message2);
    }
    get public() {
      return new Secp256k1PublicKey(this._publicKey);
    }
    marshal() {
      return this._key;
    }
    get bytes() {
      return PrivateKey.encode({
        Type: KeyType.Secp256k1,
        Data: this.marshal()
      });
    }
    equals(key) {
      return equals3(this.bytes, key.bytes);
    }
    async hash() {
      const { bytes: bytes2 } = await sha256.digest(this.bytes);
      return bytes2;
    }
    async id() {
      const hash = await this.public.hash();
      return toString2(hash, "base58btc");
    }
    async export(password, format = "libp2p-key") {
      if (format === "libp2p-key") {
        return await exporter(this.bytes, password);
      } else {
        throw (0, import_err_code9.default)(new Error(`export format '${format}' is not supported`), "ERR_INVALID_EXPORT_FORMAT");
      }
    }
  };
  function unmarshalSecp256k1PrivateKey(bytes2) {
    return new Secp256k1PrivateKey(bytes2);
  }
  function unmarshalSecp256k1PublicKey(bytes2) {
    return new Secp256k1PublicKey(bytes2);
  }
  async function generateKeyPair3() {
    const privateKeyBytes = await generateKey3();
    return new Secp256k1PrivateKey(privateKeyBytes);
  }

  // ../node_modules/@libp2p/crypto/dist/src/keys/index.js
  var supportedKeys = {
    rsa: rsa_class_exports,
    ed25519: ed25519_class_exports,
    secp256k1: secp256k1_class_exports
  };
  function unsupportedKey(type) {
    const supported = Object.keys(supportedKeys).join(" / ");
    return (0, import_err_code10.default)(new Error(`invalid or unsupported key type ${type}. Must be ${supported}`), "ERR_UNSUPPORTED_KEY_TYPE");
  }
  async function unmarshalPrivateKey2(buf2) {
    const decoded = PrivateKey.decode(buf2);
    const data = decoded.Data;
    switch (decoded.Type) {
      case KeyType.RSA:
        return await supportedKeys.rsa.unmarshalRsaPrivateKey(data);
      case KeyType.Ed25519:
        return supportedKeys.ed25519.unmarshalEd25519PrivateKey(data);
      case KeyType.Secp256k1:
        return supportedKeys.secp256k1.unmarshalSecp256k1PrivateKey(data);
      default:
        throw unsupportedKey(decoded.Type);
    }
  }

  // ../node_modules/ipns/dist/src/index.js
  var import_err_code13 = __toESM(require_err_code(), 1);
  init_base32();
  init_from_string();

  // ../node_modules/@libp2p/logger/dist/src/index.js
  var import_debug = __toESM(require_browser(), 1);
  init_base58();
  init_base32();
  init_base64();
  import_debug.default.formatters.b = (v) => {
    return v == null ? "undefined" : base58btc.baseEncode(v);
  };
  import_debug.default.formatters.t = (v) => {
    return v == null ? "undefined" : base32.baseEncode(v);
  };
  import_debug.default.formatters.m = (v) => {
    return v == null ? "undefined" : base64.baseEncode(v);
  };
  import_debug.default.formatters.p = (v) => {
    return v == null ? "undefined" : v.toString();
  };
  import_debug.default.formatters.c = (v) => {
    return v == null ? "undefined" : v.toString();
  };
  import_debug.default.formatters.k = (v) => {
    return v == null ? "undefined" : v.toString();
  };
  function logger(name2) {
    return Object.assign((0, import_debug.default)(name2), {
      error: (0, import_debug.default)(`${name2}:error`),
      trace: (0, import_debug.default)(`${name2}:trace`)
    });
  }

  // ../node_modules/ipns/dist/src/utils.js
  var import_err_code12 = __toESM(require_err_code(), 1);

  // ../node_modules/ipns/dist/src/errors.js
  var ERR_UNRECOGNIZED_VALIDITY = "ERR_UNRECOGNIZED_VALIDITY";
  var ERR_SIGNATURE_CREATION = "ERR_SIGNATURE_CREATION";
  var ERR_MISSING_PRIVATE_KEY = "ERR_MISSING_PRIVATE_KEY";

  // ../node_modules/@libp2p/peer-id/dist/src/index.js
  init_cid();
  init_basics();
  init_base58();
  init_digest();
  init_identity2();
  init_equals();
  init_sha2_browser();
  var import_err_code11 = __toESM(require_err_code(), 1);

  // ../node_modules/@libp2p/interface-peer-id/dist/src/index.js
  var symbol2 = Symbol.for("@libp2p/peer-id");

  // ../node_modules/@libp2p/peer-id/dist/src/index.js
  var baseDecoder = Object.values(bases).map((codec) => codec.decoder).reduce((acc, curr) => acc.or(curr), bases.identity.decoder);
  var LIBP2P_KEY_CODE = 114;
  var MARSHALLED_ED225519_PUBLIC_KEY_LENGTH = 36;
  var MARSHALLED_SECP258K1_PUBLIC_KEY_LENGTH = 37;
  var PeerIdImpl = class {
    constructor(init) {
      this.type = init.type;
      this.multihash = init.multihash;
      this.privateKey = init.privateKey;
      Object.defineProperty(this, "string", {
        enumerable: false,
        writable: true
      });
    }
    get [Symbol.toStringTag]() {
      return `PeerId(${this.toString()})`;
    }
    get [symbol2]() {
      return true;
    }
    toString() {
      if (this.string == null) {
        this.string = base58btc.encode(this.multihash.bytes).slice(1);
      }
      return this.string;
    }
    toCID() {
      return CID.createV1(LIBP2P_KEY_CODE, this.multihash);
    }
    toBytes() {
      return this.multihash.bytes;
    }
    toJSON() {
      return this.toString();
    }
    equals(id) {
      if (id instanceof Uint8Array) {
        return equals3(this.multihash.bytes, id);
      } else if (typeof id === "string") {
        return peerIdFromString(id).equals(this);
      } else if (id?.multihash?.bytes != null) {
        return equals3(this.multihash.bytes, id.multihash.bytes);
      } else {
        throw new Error("not valid Id");
      }
    }
  };
  var RSAPeerIdImpl = class extends PeerIdImpl {
    constructor(init) {
      super({ ...init, type: "RSA" });
      this.type = "RSA";
      this.publicKey = init.publicKey;
    }
  };
  var Ed25519PeerIdImpl = class extends PeerIdImpl {
    constructor(init) {
      super({ ...init, type: "Ed25519" });
      this.type = "Ed25519";
      this.publicKey = init.multihash.digest;
    }
  };
  var Secp256k1PeerIdImpl = class extends PeerIdImpl {
    constructor(init) {
      super({ ...init, type: "secp256k1" });
      this.type = "secp256k1";
      this.publicKey = init.multihash.digest;
    }
  };
  function peerIdFromString(str, decoder) {
    decoder = decoder ?? baseDecoder;
    if (str.charAt(0) === "1" || str.charAt(0) === "Q") {
      const multihash = decode4(base58btc.decode(`z${str}`));
      if (str.startsWith("12D")) {
        return new Ed25519PeerIdImpl({ multihash });
      } else if (str.startsWith("16U")) {
        return new Secp256k1PeerIdImpl({ multihash });
      } else {
        return new RSAPeerIdImpl({ multihash });
      }
    }
    return peerIdFromBytes(baseDecoder.decode(str));
  }
  function peerIdFromBytes(buf2) {
    try {
      const multihash = decode4(buf2);
      if (multihash.code === identity2.code) {
        if (multihash.digest.length === MARSHALLED_ED225519_PUBLIC_KEY_LENGTH) {
          return new Ed25519PeerIdImpl({ multihash });
        } else if (multihash.digest.length === MARSHALLED_SECP258K1_PUBLIC_KEY_LENGTH) {
          return new Secp256k1PeerIdImpl({ multihash });
        }
      }
      if (multihash.code === sha256.code) {
        return new RSAPeerIdImpl({ multihash });
      }
    } catch {
      return peerIdFromCID(CID.decode(buf2));
    }
    throw new Error("Supplied PeerID CID is invalid");
  }
  function peerIdFromCID(cid) {
    if (cid == null || cid.multihash == null || cid.version == null || cid.version === 1 && cid.code !== LIBP2P_KEY_CODE) {
      throw new Error("Supplied PeerID CID is invalid");
    }
    const multihash = cid.multihash;
    if (multihash.code === sha256.code) {
      return new RSAPeerIdImpl({ multihash: cid.multihash });
    } else if (multihash.code === identity2.code) {
      if (multihash.digest.length === MARSHALLED_ED225519_PUBLIC_KEY_LENGTH) {
        return new Ed25519PeerIdImpl({ multihash: cid.multihash });
      } else if (multihash.digest.length === MARSHALLED_SECP258K1_PUBLIC_KEY_LENGTH) {
        return new Secp256k1PeerIdImpl({ multihash: cid.multihash });
      }
    }
    throw new Error("Supplied PeerID CID is invalid");
  }

  // ../node_modules/ipns/dist/src/pb/ipns.js
  var IpnsEntry;
  (function(IpnsEntry2) {
    let ValidityType;
    (function(ValidityType2) {
      ValidityType2["EOL"] = "EOL";
    })(ValidityType = IpnsEntry2.ValidityType || (IpnsEntry2.ValidityType = {}));
    let __ValidityTypeValues;
    (function(__ValidityTypeValues2) {
      __ValidityTypeValues2[__ValidityTypeValues2["EOL"] = 0] = "EOL";
    })(__ValidityTypeValues || (__ValidityTypeValues = {}));
    (function(ValidityType2) {
      ValidityType2.codec = () => {
        return enumeration(__ValidityTypeValues);
      };
    })(ValidityType = IpnsEntry2.ValidityType || (IpnsEntry2.ValidityType = {}));
    IpnsEntry2.codec = () => {
      return message({
        1: { name: "value", codec: bytes, optional: true },
        2: { name: "signature", codec: bytes, optional: true },
        3: { name: "validityType", codec: IpnsEntry2.ValidityType.codec(), optional: true },
        4: { name: "validity", codec: bytes, optional: true },
        5: { name: "sequence", codec: uint64, optional: true },
        6: { name: "ttl", codec: uint64, optional: true },
        7: { name: "pubKey", codec: bytes, optional: true },
        8: { name: "signatureV2", codec: bytes, optional: true },
        9: { name: "data", codec: bytes, optional: true }
      });
    };
    IpnsEntry2.encode = (obj) => {
      return encodeMessage(obj, IpnsEntry2.codec());
    };
    IpnsEntry2.decode = (buf2) => {
      return decodeMessage(buf2, IpnsEntry2.codec());
    };
  })(IpnsEntry || (IpnsEntry = {}));

  // ../node_modules/ipns/dist/src/utils.js
  init_from_string();
  init_concat();

  // ../node_modules/cborg/esm/lib/is.js
  var typeofs = [
    "string",
    "number",
    "bigint",
    "symbol"
  ];
  var objectTypeNames = [
    "Function",
    "Generator",
    "AsyncGenerator",
    "GeneratorFunction",
    "AsyncGeneratorFunction",
    "AsyncFunction",
    "Observable",
    "Array",
    "Buffer",
    "Object",
    "RegExp",
    "Date",
    "Error",
    "Map",
    "Set",
    "WeakMap",
    "WeakSet",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Promise",
    "URL",
    "HTMLElement",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array",
    "BigInt64Array",
    "BigUint64Array"
  ];
  function is(value) {
    if (value === null) {
      return "null";
    }
    if (value === void 0) {
      return "undefined";
    }
    if (value === true || value === false) {
      return "boolean";
    }
    const typeOf = typeof value;
    if (typeofs.includes(typeOf)) {
      return typeOf;
    }
    if (typeOf === "function") {
      return "Function";
    }
    if (Array.isArray(value)) {
      return "Array";
    }
    if (isBuffer(value)) {
      return "Buffer";
    }
    const objectType = getObjectType(value);
    if (objectType) {
      return objectType;
    }
    return "Object";
  }
  function isBuffer(value) {
    return value && value.constructor && value.constructor.isBuffer && value.constructor.isBuffer.call(null, value);
  }
  function getObjectType(value) {
    const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
    if (objectTypeNames.includes(objectTypeName)) {
      return objectTypeName;
    }
    return void 0;
  }

  // ../node_modules/cborg/esm/lib/token.js
  var Type = class {
    constructor(major, name2, terminal) {
      this.major = major;
      this.majorEncoded = major << 5;
      this.name = name2;
      this.terminal = terminal;
    }
    toString() {
      return `Type[${this.major}].${this.name}`;
    }
    compare(typ) {
      return this.major < typ.major ? -1 : this.major > typ.major ? 1 : 0;
    }
  };
  Type.uint = new Type(0, "uint", true);
  Type.negint = new Type(1, "negint", true);
  Type.bytes = new Type(2, "bytes", true);
  Type.string = new Type(3, "string", true);
  Type.array = new Type(4, "array", false);
  Type.map = new Type(5, "map", false);
  Type.tag = new Type(6, "tag", false);
  Type.float = new Type(7, "float", true);
  Type.false = new Type(7, "false", true);
  Type.true = new Type(7, "true", true);
  Type.null = new Type(7, "null", true);
  Type.undefined = new Type(7, "undefined", true);
  Type.break = new Type(7, "break", true);
  var Token = class {
    constructor(type, value, encodedLength) {
      this.type = type;
      this.value = value;
      this.encodedLength = encodedLength;
      this.encodedBytes = void 0;
      this.byteValue = void 0;
    }
    toString() {
      return `Token[${this.type}].${this.value}`;
    }
  };

  // ../node_modules/cborg/esm/lib/byte-utils.js
  var useBuffer = globalThis.process && !globalThis.process.browser && globalThis.Buffer && typeof globalThis.Buffer.isBuffer === "function";
  var textDecoder2 = new TextDecoder();
  var textEncoder2 = new TextEncoder();
  function isBuffer2(buf2) {
    return useBuffer && globalThis.Buffer.isBuffer(buf2);
  }
  function asU8A(buf2) {
    if (!(buf2 instanceof Uint8Array)) {
      return Uint8Array.from(buf2);
    }
    return isBuffer2(buf2) ? new Uint8Array(buf2.buffer, buf2.byteOffset, buf2.byteLength) : buf2;
  }
  var toString3 = useBuffer ? (bytes2, start, end) => {
    return end - start > 64 ? globalThis.Buffer.from(bytes2.subarray(start, end)).toString("utf8") : utf8Slice(bytes2, start, end);
  } : (bytes2, start, end) => {
    return end - start > 64 ? textDecoder2.decode(bytes2.subarray(start, end)) : utf8Slice(bytes2, start, end);
  };
  var fromString3 = useBuffer ? (string3) => {
    return string3.length > 64 ? globalThis.Buffer.from(string3) : utf8ToBytes(string3);
  } : (string3) => {
    return string3.length > 64 ? textEncoder2.encode(string3) : utf8ToBytes(string3);
  };
  var fromArray = (arr) => {
    return Uint8Array.from(arr);
  };
  var slice = useBuffer ? (bytes2, start, end) => {
    if (isBuffer2(bytes2)) {
      return new Uint8Array(bytes2.subarray(start, end));
    }
    return bytes2.slice(start, end);
  } : (bytes2, start, end) => {
    return bytes2.slice(start, end);
  };
  var concat2 = useBuffer ? (chunks, length2) => {
    chunks = chunks.map((c) => c instanceof Uint8Array ? c : globalThis.Buffer.from(c));
    return asU8A(globalThis.Buffer.concat(chunks, length2));
  } : (chunks, length2) => {
    const out = new Uint8Array(length2);
    let off = 0;
    for (let b of chunks) {
      if (off + b.length > out.length) {
        b = b.subarray(0, out.length - off);
      }
      out.set(b, off);
      off += b.length;
    }
    return out;
  };
  var alloc = useBuffer ? (size) => {
    return globalThis.Buffer.allocUnsafe(size);
  } : (size) => {
    return new Uint8Array(size);
  };
  function compare2(b1, b2) {
    if (isBuffer2(b1) && isBuffer2(b2)) {
      return b1.compare(b2);
    }
    for (let i = 0; i < b1.length; i++) {
      if (b1[i] === b2[i]) {
        continue;
      }
      return b1[i] < b2[i] ? -1 : 1;
    }
    return 0;
  }
  function utf8ToBytes(string3, units = Infinity) {
    let codePoint;
    const length2 = string3.length;
    let leadSurrogate = null;
    const bytes2 = [];
    for (let i = 0; i < length2; ++i) {
      codePoint = string3.charCodeAt(i);
      if (codePoint > 55295 && codePoint < 57344) {
        if (!leadSurrogate) {
          if (codePoint > 56319) {
            if ((units -= 3) > -1)
              bytes2.push(239, 191, 189);
            continue;
          } else if (i + 1 === length2) {
            if ((units -= 3) > -1)
              bytes2.push(239, 191, 189);
            continue;
          }
          leadSurrogate = codePoint;
          continue;
        }
        if (codePoint < 56320) {
          if ((units -= 3) > -1)
            bytes2.push(239, 191, 189);
          leadSurrogate = codePoint;
          continue;
        }
        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
      } else if (leadSurrogate) {
        if ((units -= 3) > -1)
          bytes2.push(239, 191, 189);
      }
      leadSurrogate = null;
      if (codePoint < 128) {
        if ((units -= 1) < 0)
          break;
        bytes2.push(codePoint);
      } else if (codePoint < 2048) {
        if ((units -= 2) < 0)
          break;
        bytes2.push(codePoint >> 6 | 192, codePoint & 63 | 128);
      } else if (codePoint < 65536) {
        if ((units -= 3) < 0)
          break;
        bytes2.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
      } else if (codePoint < 1114112) {
        if ((units -= 4) < 0)
          break;
        bytes2.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
      } else {
        throw new Error("Invalid code point");
      }
    }
    return bytes2;
  }
  function utf8Slice(buf2, offset, end) {
    const res = [];
    while (offset < end) {
      const firstByte = buf2[offset];
      let codePoint = null;
      let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (offset + bytesPerSequence <= end) {
        let secondByte, thirdByte, fourthByte, tempCodePoint;
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 128) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf2[offset + 1];
            if ((secondByte & 192) === 128) {
              tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
              if (tempCodePoint > 127) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf2[offset + 1];
            thirdByte = buf2[offset + 2];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
              if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf2[offset + 1];
            thirdByte = buf2[offset + 2];
            fourthByte = buf2[offset + 3];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
              if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                codePoint = tempCodePoint;
              }
            }
        }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        res.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      res.push(codePoint);
      offset += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
  }
  var MAX_ARGUMENTS_LENGTH = 4096;
  function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints);
    }
    let res = "";
    let i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }
    return res;
  }

  // ../node_modules/cborg/esm/lib/bl.js
  var defaultChunkSize = 256;
  var Bl = class {
    constructor(chunkSize = defaultChunkSize) {
      this.chunkSize = chunkSize;
      this.cursor = 0;
      this.maxCursor = -1;
      this.chunks = [];
      this._initReuseChunk = null;
    }
    reset() {
      this.cursor = 0;
      this.maxCursor = -1;
      if (this.chunks.length) {
        this.chunks = [];
      }
      if (this._initReuseChunk !== null) {
        this.chunks.push(this._initReuseChunk);
        this.maxCursor = this._initReuseChunk.length - 1;
      }
    }
    push(bytes2) {
      let topChunk = this.chunks[this.chunks.length - 1];
      const newMax = this.cursor + bytes2.length;
      if (newMax <= this.maxCursor + 1) {
        const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
        topChunk.set(bytes2, chunkPos);
      } else {
        if (topChunk) {
          const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
          if (chunkPos < topChunk.length) {
            this.chunks[this.chunks.length - 1] = topChunk.subarray(0, chunkPos);
            this.maxCursor = this.cursor - 1;
          }
        }
        if (bytes2.length < 64 && bytes2.length < this.chunkSize) {
          topChunk = alloc(this.chunkSize);
          this.chunks.push(topChunk);
          this.maxCursor += topChunk.length;
          if (this._initReuseChunk === null) {
            this._initReuseChunk = topChunk;
          }
          topChunk.set(bytes2, 0);
        } else {
          this.chunks.push(bytes2);
          this.maxCursor += bytes2.length;
        }
      }
      this.cursor += bytes2.length;
    }
    toBytes(reset = false) {
      let byts;
      if (this.chunks.length === 1) {
        const chunk = this.chunks[0];
        if (reset && this.cursor > chunk.length / 2) {
          byts = this.cursor === chunk.length ? chunk : chunk.subarray(0, this.cursor);
          this._initReuseChunk = null;
          this.chunks = [];
        } else {
          byts = slice(chunk, 0, this.cursor);
        }
      } else {
        byts = concat2(this.chunks, this.cursor);
      }
      if (reset) {
        this.reset();
      }
      return byts;
    }
  };

  // ../node_modules/cborg/esm/lib/common.js
  var decodeErrPrefix = "CBOR decode error:";
  var encodeErrPrefix = "CBOR encode error:";
  var uintMinorPrefixBytes = [];
  uintMinorPrefixBytes[23] = 1;
  uintMinorPrefixBytes[24] = 2;
  uintMinorPrefixBytes[25] = 3;
  uintMinorPrefixBytes[26] = 5;
  uintMinorPrefixBytes[27] = 9;
  function assertEnoughData(data, pos, need) {
    if (data.length - pos < need) {
      throw new Error(`${decodeErrPrefix} not enough data for type`);
    }
  }

  // ../node_modules/cborg/esm/lib/0uint.js
  var uintBoundaries = [
    24,
    256,
    65536,
    4294967296,
    BigInt("18446744073709551616")
  ];
  function readUint8(data, offset, options) {
    assertEnoughData(data, offset, 1);
    const value = data[offset];
    if (options.strict === true && value < uintBoundaries[0]) {
      throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
    }
    return value;
  }
  function readUint16(data, offset, options) {
    assertEnoughData(data, offset, 2);
    const value = data[offset] << 8 | data[offset + 1];
    if (options.strict === true && value < uintBoundaries[1]) {
      throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
    }
    return value;
  }
  function readUint32(data, offset, options) {
    assertEnoughData(data, offset, 4);
    const value = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
    if (options.strict === true && value < uintBoundaries[2]) {
      throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
    }
    return value;
  }
  function readUint64(data, offset, options) {
    assertEnoughData(data, offset, 8);
    const hi = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
    const lo = data[offset + 4] * 16777216 + (data[offset + 5] << 16) + (data[offset + 6] << 8) + data[offset + 7];
    const value = (BigInt(hi) << BigInt(32)) + BigInt(lo);
    if (options.strict === true && value < uintBoundaries[3]) {
      throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
    }
    if (value <= Number.MAX_SAFE_INTEGER) {
      return Number(value);
    }
    if (options.allowBigInt === true) {
      return value;
    }
    throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
  }
  function decodeUint8(data, pos, _minor, options) {
    return new Token(Type.uint, readUint8(data, pos + 1, options), 2);
  }
  function decodeUint16(data, pos, _minor, options) {
    return new Token(Type.uint, readUint16(data, pos + 1, options), 3);
  }
  function decodeUint32(data, pos, _minor, options) {
    return new Token(Type.uint, readUint32(data, pos + 1, options), 5);
  }
  function decodeUint64(data, pos, _minor, options) {
    return new Token(Type.uint, readUint64(data, pos + 1, options), 9);
  }
  function encodeUint(buf2, token) {
    return encodeUintValue(buf2, 0, token.value);
  }
  function encodeUintValue(buf2, major, uint) {
    if (uint < uintBoundaries[0]) {
      const nuint = Number(uint);
      buf2.push([major | nuint]);
    } else if (uint < uintBoundaries[1]) {
      const nuint = Number(uint);
      buf2.push([
        major | 24,
        nuint
      ]);
    } else if (uint < uintBoundaries[2]) {
      const nuint = Number(uint);
      buf2.push([
        major | 25,
        nuint >>> 8,
        nuint & 255
      ]);
    } else if (uint < uintBoundaries[3]) {
      const nuint = Number(uint);
      buf2.push([
        major | 26,
        nuint >>> 24 & 255,
        nuint >>> 16 & 255,
        nuint >>> 8 & 255,
        nuint & 255
      ]);
    } else {
      const buint = BigInt(uint);
      if (buint < uintBoundaries[4]) {
        const set = [
          major | 27,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ];
        let lo = Number(buint & BigInt(4294967295));
        let hi = Number(buint >> BigInt(32) & BigInt(4294967295));
        set[8] = lo & 255;
        lo = lo >> 8;
        set[7] = lo & 255;
        lo = lo >> 8;
        set[6] = lo & 255;
        lo = lo >> 8;
        set[5] = lo & 255;
        set[4] = hi & 255;
        hi = hi >> 8;
        set[3] = hi & 255;
        hi = hi >> 8;
        set[2] = hi & 255;
        hi = hi >> 8;
        set[1] = hi & 255;
        buf2.push(set);
      } else {
        throw new Error(`${decodeErrPrefix} encountered BigInt larger than allowable range`);
      }
    }
  }
  encodeUint.encodedSize = function encodedSize(token) {
    return encodeUintValue.encodedSize(token.value);
  };
  encodeUintValue.encodedSize = function encodedSize2(uint) {
    if (uint < uintBoundaries[0]) {
      return 1;
    }
    if (uint < uintBoundaries[1]) {
      return 2;
    }
    if (uint < uintBoundaries[2]) {
      return 3;
    }
    if (uint < uintBoundaries[3]) {
      return 5;
    }
    return 9;
  };
  encodeUint.compareTokens = function compareTokens(tok1, tok2) {
    return tok1.value < tok2.value ? -1 : tok1.value > tok2.value ? 1 : 0;
  };

  // ../node_modules/cborg/esm/lib/1negint.js
  function decodeNegint8(data, pos, _minor, options) {
    return new Token(Type.negint, -1 - readUint8(data, pos + 1, options), 2);
  }
  function decodeNegint16(data, pos, _minor, options) {
    return new Token(Type.negint, -1 - readUint16(data, pos + 1, options), 3);
  }
  function decodeNegint32(data, pos, _minor, options) {
    return new Token(Type.negint, -1 - readUint32(data, pos + 1, options), 5);
  }
  var neg1b = BigInt(-1);
  var pos1b = BigInt(1);
  function decodeNegint64(data, pos, _minor, options) {
    const int = readUint64(data, pos + 1, options);
    if (typeof int !== "bigint") {
      const value = -1 - int;
      if (value >= Number.MIN_SAFE_INTEGER) {
        return new Token(Type.negint, value, 9);
      }
    }
    if (options.allowBigInt !== true) {
      throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
    }
    return new Token(Type.negint, neg1b - BigInt(int), 9);
  }
  function encodeNegint(buf2, token) {
    const negint = token.value;
    const unsigned3 = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
    encodeUintValue(buf2, token.type.majorEncoded, unsigned3);
  }
  encodeNegint.encodedSize = function encodedSize3(token) {
    const negint = token.value;
    const unsigned3 = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
    if (unsigned3 < uintBoundaries[0]) {
      return 1;
    }
    if (unsigned3 < uintBoundaries[1]) {
      return 2;
    }
    if (unsigned3 < uintBoundaries[2]) {
      return 3;
    }
    if (unsigned3 < uintBoundaries[3]) {
      return 5;
    }
    return 9;
  };
  encodeNegint.compareTokens = function compareTokens2(tok1, tok2) {
    return tok1.value < tok2.value ? 1 : tok1.value > tok2.value ? -1 : 0;
  };

  // ../node_modules/cborg/esm/lib/2bytes.js
  function toToken(data, pos, prefix, length2) {
    assertEnoughData(data, pos, prefix + length2);
    const buf2 = slice(data, pos + prefix, pos + prefix + length2);
    return new Token(Type.bytes, buf2, prefix + length2);
  }
  function decodeBytesCompact(data, pos, minor, _options) {
    return toToken(data, pos, 1, minor);
  }
  function decodeBytes8(data, pos, _minor, options) {
    return toToken(data, pos, 2, readUint8(data, pos + 1, options));
  }
  function decodeBytes16(data, pos, _minor, options) {
    return toToken(data, pos, 3, readUint16(data, pos + 1, options));
  }
  function decodeBytes32(data, pos, _minor, options) {
    return toToken(data, pos, 5, readUint32(data, pos + 1, options));
  }
  function decodeBytes64(data, pos, _minor, options) {
    const l = readUint64(data, pos + 1, options);
    if (typeof l === "bigint") {
      throw new Error(`${decodeErrPrefix} 64-bit integer bytes lengths not supported`);
    }
    return toToken(data, pos, 9, l);
  }
  function tokenBytes(token) {
    if (token.encodedBytes === void 0) {
      token.encodedBytes = token.type === Type.string ? fromString3(token.value) : token.value;
    }
    return token.encodedBytes;
  }
  function encodeBytes(buf2, token) {
    const bytes2 = tokenBytes(token);
    encodeUintValue(buf2, token.type.majorEncoded, bytes2.length);
    buf2.push(bytes2);
  }
  encodeBytes.encodedSize = function encodedSize4(token) {
    const bytes2 = tokenBytes(token);
    return encodeUintValue.encodedSize(bytes2.length) + bytes2.length;
  };
  encodeBytes.compareTokens = function compareTokens3(tok1, tok2) {
    return compareBytes(tokenBytes(tok1), tokenBytes(tok2));
  };
  function compareBytes(b1, b2) {
    return b1.length < b2.length ? -1 : b1.length > b2.length ? 1 : compare2(b1, b2);
  }

  // ../node_modules/cborg/esm/lib/3string.js
  function toToken2(data, pos, prefix, length2, options) {
    const totLength = prefix + length2;
    assertEnoughData(data, pos, totLength);
    const tok = new Token(Type.string, toString3(data, pos + prefix, pos + totLength), totLength);
    if (options.retainStringBytes === true) {
      tok.byteValue = slice(data, pos + prefix, pos + totLength);
    }
    return tok;
  }
  function decodeStringCompact(data, pos, minor, options) {
    return toToken2(data, pos, 1, minor, options);
  }
  function decodeString8(data, pos, _minor, options) {
    return toToken2(data, pos, 2, readUint8(data, pos + 1, options), options);
  }
  function decodeString16(data, pos, _minor, options) {
    return toToken2(data, pos, 3, readUint16(data, pos + 1, options), options);
  }
  function decodeString32(data, pos, _minor, options) {
    return toToken2(data, pos, 5, readUint32(data, pos + 1, options), options);
  }
  function decodeString64(data, pos, _minor, options) {
    const l = readUint64(data, pos + 1, options);
    if (typeof l === "bigint") {
      throw new Error(`${decodeErrPrefix} 64-bit integer string lengths not supported`);
    }
    return toToken2(data, pos, 9, l, options);
  }
  var encodeString = encodeBytes;

  // ../node_modules/cborg/esm/lib/4array.js
  function toToken3(_data, _pos, prefix, length2) {
    return new Token(Type.array, length2, prefix);
  }
  function decodeArrayCompact(data, pos, minor, _options) {
    return toToken3(data, pos, 1, minor);
  }
  function decodeArray8(data, pos, _minor, options) {
    return toToken3(data, pos, 2, readUint8(data, pos + 1, options));
  }
  function decodeArray16(data, pos, _minor, options) {
    return toToken3(data, pos, 3, readUint16(data, pos + 1, options));
  }
  function decodeArray32(data, pos, _minor, options) {
    return toToken3(data, pos, 5, readUint32(data, pos + 1, options));
  }
  function decodeArray64(data, pos, _minor, options) {
    const l = readUint64(data, pos + 1, options);
    if (typeof l === "bigint") {
      throw new Error(`${decodeErrPrefix} 64-bit integer array lengths not supported`);
    }
    return toToken3(data, pos, 9, l);
  }
  function decodeArrayIndefinite(data, pos, _minor, options) {
    if (options.allowIndefinite === false) {
      throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
    }
    return toToken3(data, pos, 1, Infinity);
  }
  function encodeArray(buf2, token) {
    encodeUintValue(buf2, Type.array.majorEncoded, token.value);
  }
  encodeArray.compareTokens = encodeUint.compareTokens;
  encodeArray.encodedSize = function encodedSize5(token) {
    return encodeUintValue.encodedSize(token.value);
  };

  // ../node_modules/cborg/esm/lib/5map.js
  function toToken4(_data, _pos, prefix, length2) {
    return new Token(Type.map, length2, prefix);
  }
  function decodeMapCompact(data, pos, minor, _options) {
    return toToken4(data, pos, 1, minor);
  }
  function decodeMap8(data, pos, _minor, options) {
    return toToken4(data, pos, 2, readUint8(data, pos + 1, options));
  }
  function decodeMap16(data, pos, _minor, options) {
    return toToken4(data, pos, 3, readUint16(data, pos + 1, options));
  }
  function decodeMap32(data, pos, _minor, options) {
    return toToken4(data, pos, 5, readUint32(data, pos + 1, options));
  }
  function decodeMap64(data, pos, _minor, options) {
    const l = readUint64(data, pos + 1, options);
    if (typeof l === "bigint") {
      throw new Error(`${decodeErrPrefix} 64-bit integer map lengths not supported`);
    }
    return toToken4(data, pos, 9, l);
  }
  function decodeMapIndefinite(data, pos, _minor, options) {
    if (options.allowIndefinite === false) {
      throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
    }
    return toToken4(data, pos, 1, Infinity);
  }
  function encodeMap(buf2, token) {
    encodeUintValue(buf2, Type.map.majorEncoded, token.value);
  }
  encodeMap.compareTokens = encodeUint.compareTokens;
  encodeMap.encodedSize = function encodedSize6(token) {
    return encodeUintValue.encodedSize(token.value);
  };

  // ../node_modules/cborg/esm/lib/6tag.js
  function decodeTagCompact(_data, _pos, minor, _options) {
    return new Token(Type.tag, minor, 1);
  }
  function decodeTag8(data, pos, _minor, options) {
    return new Token(Type.tag, readUint8(data, pos + 1, options), 2);
  }
  function decodeTag16(data, pos, _minor, options) {
    return new Token(Type.tag, readUint16(data, pos + 1, options), 3);
  }
  function decodeTag32(data, pos, _minor, options) {
    return new Token(Type.tag, readUint32(data, pos + 1, options), 5);
  }
  function decodeTag64(data, pos, _minor, options) {
    return new Token(Type.tag, readUint64(data, pos + 1, options), 9);
  }
  function encodeTag(buf2, token) {
    encodeUintValue(buf2, Type.tag.majorEncoded, token.value);
  }
  encodeTag.compareTokens = encodeUint.compareTokens;
  encodeTag.encodedSize = function encodedSize7(token) {
    return encodeUintValue.encodedSize(token.value);
  };

  // ../node_modules/cborg/esm/lib/7float.js
  var MINOR_FALSE = 20;
  var MINOR_TRUE = 21;
  var MINOR_NULL = 22;
  var MINOR_UNDEFINED = 23;
  function decodeUndefined(_data, _pos, _minor, options) {
    if (options.allowUndefined === false) {
      throw new Error(`${decodeErrPrefix} undefined values are not supported`);
    } else if (options.coerceUndefinedToNull === true) {
      return new Token(Type.null, null, 1);
    }
    return new Token(Type.undefined, void 0, 1);
  }
  function decodeBreak(_data, _pos, _minor, options) {
    if (options.allowIndefinite === false) {
      throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
    }
    return new Token(Type.break, void 0, 1);
  }
  function createToken(value, bytes2, options) {
    if (options) {
      if (options.allowNaN === false && Number.isNaN(value)) {
        throw new Error(`${decodeErrPrefix} NaN values are not supported`);
      }
      if (options.allowInfinity === false && (value === Infinity || value === -Infinity)) {
        throw new Error(`${decodeErrPrefix} Infinity values are not supported`);
      }
    }
    return new Token(Type.float, value, bytes2);
  }
  function decodeFloat16(data, pos, _minor, options) {
    return createToken(readFloat16(data, pos + 1), 3, options);
  }
  function decodeFloat32(data, pos, _minor, options) {
    return createToken(readFloat32(data, pos + 1), 5, options);
  }
  function decodeFloat64(data, pos, _minor, options) {
    return createToken(readFloat64(data, pos + 1), 9, options);
  }
  function encodeFloat(buf2, token, options) {
    const float2 = token.value;
    if (float2 === false) {
      buf2.push([Type.float.majorEncoded | MINOR_FALSE]);
    } else if (float2 === true) {
      buf2.push([Type.float.majorEncoded | MINOR_TRUE]);
    } else if (float2 === null) {
      buf2.push([Type.float.majorEncoded | MINOR_NULL]);
    } else if (float2 === void 0) {
      buf2.push([Type.float.majorEncoded | MINOR_UNDEFINED]);
    } else {
      let decoded;
      let success = false;
      if (!options || options.float64 !== true) {
        encodeFloat16(float2);
        decoded = readFloat16(ui8a, 1);
        if (float2 === decoded || Number.isNaN(float2)) {
          ui8a[0] = 249;
          buf2.push(ui8a.slice(0, 3));
          success = true;
        } else {
          encodeFloat32(float2);
          decoded = readFloat32(ui8a, 1);
          if (float2 === decoded) {
            ui8a[0] = 250;
            buf2.push(ui8a.slice(0, 5));
            success = true;
          }
        }
      }
      if (!success) {
        encodeFloat64(float2);
        decoded = readFloat64(ui8a, 1);
        ui8a[0] = 251;
        buf2.push(ui8a.slice(0, 9));
      }
    }
  }
  encodeFloat.encodedSize = function encodedSize8(token, options) {
    const float2 = token.value;
    if (float2 === false || float2 === true || float2 === null || float2 === void 0) {
      return 1;
    }
    if (!options || options.float64 !== true) {
      encodeFloat16(float2);
      let decoded = readFloat16(ui8a, 1);
      if (float2 === decoded || Number.isNaN(float2)) {
        return 3;
      }
      encodeFloat32(float2);
      decoded = readFloat32(ui8a, 1);
      if (float2 === decoded) {
        return 5;
      }
    }
    return 9;
  };
  var buffer = new ArrayBuffer(9);
  var dataView = new DataView(buffer, 1);
  var ui8a = new Uint8Array(buffer, 0);
  function encodeFloat16(inp) {
    if (inp === Infinity) {
      dataView.setUint16(0, 31744, false);
    } else if (inp === -Infinity) {
      dataView.setUint16(0, 64512, false);
    } else if (Number.isNaN(inp)) {
      dataView.setUint16(0, 32256, false);
    } else {
      dataView.setFloat32(0, inp);
      const valu32 = dataView.getUint32(0);
      const exponent = (valu32 & 2139095040) >> 23;
      const mantissa = valu32 & 8388607;
      if (exponent === 255) {
        dataView.setUint16(0, 31744, false);
      } else if (exponent === 0) {
        dataView.setUint16(0, (inp & 2147483648) >> 16 | mantissa >> 13, false);
      } else {
        const logicalExponent = exponent - 127;
        if (logicalExponent < -24) {
          dataView.setUint16(0, 0);
        } else if (logicalExponent < -14) {
          dataView.setUint16(0, (valu32 & 2147483648) >> 16 | 1 << 24 + logicalExponent, false);
        } else {
          dataView.setUint16(0, (valu32 & 2147483648) >> 16 | logicalExponent + 15 << 10 | mantissa >> 13, false);
        }
      }
    }
  }
  function readFloat16(ui8a2, pos) {
    if (ui8a2.length - pos < 2) {
      throw new Error(`${decodeErrPrefix} not enough data for float16`);
    }
    const half = (ui8a2[pos] << 8) + ui8a2[pos + 1];
    if (half === 31744) {
      return Infinity;
    }
    if (half === 64512) {
      return -Infinity;
    }
    if (half === 32256) {
      return NaN;
    }
    const exp = half >> 10 & 31;
    const mant = half & 1023;
    let val;
    if (exp === 0) {
      val = mant * 2 ** -24;
    } else if (exp !== 31) {
      val = (mant + 1024) * 2 ** (exp - 25);
    } else {
      val = mant === 0 ? Infinity : NaN;
    }
    return half & 32768 ? -val : val;
  }
  function encodeFloat32(inp) {
    dataView.setFloat32(0, inp, false);
  }
  function readFloat32(ui8a2, pos) {
    if (ui8a2.length - pos < 4) {
      throw new Error(`${decodeErrPrefix} not enough data for float32`);
    }
    const offset = (ui8a2.byteOffset || 0) + pos;
    return new DataView(ui8a2.buffer, offset, 4).getFloat32(0, false);
  }
  function encodeFloat64(inp) {
    dataView.setFloat64(0, inp, false);
  }
  function readFloat64(ui8a2, pos) {
    if (ui8a2.length - pos < 8) {
      throw new Error(`${decodeErrPrefix} not enough data for float64`);
    }
    const offset = (ui8a2.byteOffset || 0) + pos;
    return new DataView(ui8a2.buffer, offset, 8).getFloat64(0, false);
  }
  encodeFloat.compareTokens = encodeUint.compareTokens;

  // ../node_modules/cborg/esm/lib/jump.js
  function invalidMinor(data, pos, minor) {
    throw new Error(`${decodeErrPrefix} encountered invalid minor (${minor}) for major ${data[pos] >>> 5}`);
  }
  function errorer(msg) {
    return () => {
      throw new Error(`${decodeErrPrefix} ${msg}`);
    };
  }
  var jump = [];
  for (let i = 0; i <= 23; i++) {
    jump[i] = invalidMinor;
  }
  jump[24] = decodeUint8;
  jump[25] = decodeUint16;
  jump[26] = decodeUint32;
  jump[27] = decodeUint64;
  jump[28] = invalidMinor;
  jump[29] = invalidMinor;
  jump[30] = invalidMinor;
  jump[31] = invalidMinor;
  for (let i = 32; i <= 55; i++) {
    jump[i] = invalidMinor;
  }
  jump[56] = decodeNegint8;
  jump[57] = decodeNegint16;
  jump[58] = decodeNegint32;
  jump[59] = decodeNegint64;
  jump[60] = invalidMinor;
  jump[61] = invalidMinor;
  jump[62] = invalidMinor;
  jump[63] = invalidMinor;
  for (let i = 64; i <= 87; i++) {
    jump[i] = decodeBytesCompact;
  }
  jump[88] = decodeBytes8;
  jump[89] = decodeBytes16;
  jump[90] = decodeBytes32;
  jump[91] = decodeBytes64;
  jump[92] = invalidMinor;
  jump[93] = invalidMinor;
  jump[94] = invalidMinor;
  jump[95] = errorer("indefinite length bytes/strings are not supported");
  for (let i = 96; i <= 119; i++) {
    jump[i] = decodeStringCompact;
  }
  jump[120] = decodeString8;
  jump[121] = decodeString16;
  jump[122] = decodeString32;
  jump[123] = decodeString64;
  jump[124] = invalidMinor;
  jump[125] = invalidMinor;
  jump[126] = invalidMinor;
  jump[127] = errorer("indefinite length bytes/strings are not supported");
  for (let i = 128; i <= 151; i++) {
    jump[i] = decodeArrayCompact;
  }
  jump[152] = decodeArray8;
  jump[153] = decodeArray16;
  jump[154] = decodeArray32;
  jump[155] = decodeArray64;
  jump[156] = invalidMinor;
  jump[157] = invalidMinor;
  jump[158] = invalidMinor;
  jump[159] = decodeArrayIndefinite;
  for (let i = 160; i <= 183; i++) {
    jump[i] = decodeMapCompact;
  }
  jump[184] = decodeMap8;
  jump[185] = decodeMap16;
  jump[186] = decodeMap32;
  jump[187] = decodeMap64;
  jump[188] = invalidMinor;
  jump[189] = invalidMinor;
  jump[190] = invalidMinor;
  jump[191] = decodeMapIndefinite;
  for (let i = 192; i <= 215; i++) {
    jump[i] = decodeTagCompact;
  }
  jump[216] = decodeTag8;
  jump[217] = decodeTag16;
  jump[218] = decodeTag32;
  jump[219] = decodeTag64;
  jump[220] = invalidMinor;
  jump[221] = invalidMinor;
  jump[222] = invalidMinor;
  jump[223] = invalidMinor;
  for (let i = 224; i <= 243; i++) {
    jump[i] = errorer("simple values are not supported");
  }
  jump[244] = invalidMinor;
  jump[245] = invalidMinor;
  jump[246] = invalidMinor;
  jump[247] = decodeUndefined;
  jump[248] = errorer("simple values are not supported");
  jump[249] = decodeFloat16;
  jump[250] = decodeFloat32;
  jump[251] = decodeFloat64;
  jump[252] = invalidMinor;
  jump[253] = invalidMinor;
  jump[254] = invalidMinor;
  jump[255] = decodeBreak;
  var quick = [];
  for (let i = 0; i < 24; i++) {
    quick[i] = new Token(Type.uint, i, 1);
  }
  for (let i = -1; i >= -24; i--) {
    quick[31 - i] = new Token(Type.negint, i, 1);
  }
  quick[64] = new Token(Type.bytes, new Uint8Array(0), 1);
  quick[96] = new Token(Type.string, "", 1);
  quick[128] = new Token(Type.array, 0, 1);
  quick[160] = new Token(Type.map, 0, 1);
  quick[244] = new Token(Type.false, false, 1);
  quick[245] = new Token(Type.true, true, 1);
  quick[246] = new Token(Type.null, null, 1);
  function quickEncodeToken(token) {
    switch (token.type) {
      case Type.false:
        return fromArray([244]);
      case Type.true:
        return fromArray([245]);
      case Type.null:
        return fromArray([246]);
      case Type.bytes:
        if (!token.value.length) {
          return fromArray([64]);
        }
        return;
      case Type.string:
        if (token.value === "") {
          return fromArray([96]);
        }
        return;
      case Type.array:
        if (token.value === 0) {
          return fromArray([128]);
        }
        return;
      case Type.map:
        if (token.value === 0) {
          return fromArray([160]);
        }
        return;
      case Type.uint:
        if (token.value < 24) {
          return fromArray([Number(token.value)]);
        }
        return;
      case Type.negint:
        if (token.value >= -24) {
          return fromArray([31 - Number(token.value)]);
        }
    }
  }

  // ../node_modules/cborg/esm/lib/encode.js
  var defaultEncodeOptions = {
    float64: false,
    mapSorter,
    quickEncodeToken
  };
  function makeCborEncoders() {
    const encoders = [];
    encoders[Type.uint.major] = encodeUint;
    encoders[Type.negint.major] = encodeNegint;
    encoders[Type.bytes.major] = encodeBytes;
    encoders[Type.string.major] = encodeString;
    encoders[Type.array.major] = encodeArray;
    encoders[Type.map.major] = encodeMap;
    encoders[Type.tag.major] = encodeTag;
    encoders[Type.float.major] = encodeFloat;
    return encoders;
  }
  var cborEncoders = makeCborEncoders();
  var buf = new Bl();
  var Ref = class {
    constructor(obj, parent) {
      this.obj = obj;
      this.parent = parent;
    }
    includes(obj) {
      let p = this;
      do {
        if (p.obj === obj) {
          return true;
        }
      } while (p = p.parent);
      return false;
    }
    static createCheck(stack, obj) {
      if (stack && stack.includes(obj)) {
        throw new Error(`${encodeErrPrefix} object contains circular references`);
      }
      return new Ref(obj, stack);
    }
  };
  var simpleTokens = {
    null: new Token(Type.null, null),
    undefined: new Token(Type.undefined, void 0),
    true: new Token(Type.true, true),
    false: new Token(Type.false, false),
    emptyArray: new Token(Type.array, 0),
    emptyMap: new Token(Type.map, 0)
  };
  var typeEncoders = {
    number(obj, _typ, _options, _refStack) {
      if (!Number.isInteger(obj) || !Number.isSafeInteger(obj)) {
        return new Token(Type.float, obj);
      } else if (obj >= 0) {
        return new Token(Type.uint, obj);
      } else {
        return new Token(Type.negint, obj);
      }
    },
    bigint(obj, _typ, _options, _refStack) {
      if (obj >= BigInt(0)) {
        return new Token(Type.uint, obj);
      } else {
        return new Token(Type.negint, obj);
      }
    },
    Uint8Array(obj, _typ, _options, _refStack) {
      return new Token(Type.bytes, obj);
    },
    string(obj, _typ, _options, _refStack) {
      return new Token(Type.string, obj);
    },
    boolean(obj, _typ, _options, _refStack) {
      return obj ? simpleTokens.true : simpleTokens.false;
    },
    null(_obj, _typ, _options, _refStack) {
      return simpleTokens.null;
    },
    undefined(_obj, _typ, _options, _refStack) {
      return simpleTokens.undefined;
    },
    ArrayBuffer(obj, _typ, _options, _refStack) {
      return new Token(Type.bytes, new Uint8Array(obj));
    },
    DataView(obj, _typ, _options, _refStack) {
      return new Token(Type.bytes, new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength));
    },
    Array(obj, _typ, options, refStack) {
      if (!obj.length) {
        if (options.addBreakTokens === true) {
          return [
            simpleTokens.emptyArray,
            new Token(Type.break)
          ];
        }
        return simpleTokens.emptyArray;
      }
      refStack = Ref.createCheck(refStack, obj);
      const entries = [];
      let i = 0;
      for (const e of obj) {
        entries[i++] = objectToTokens(e, options, refStack);
      }
      if (options.addBreakTokens) {
        return [
          new Token(Type.array, obj.length),
          entries,
          new Token(Type.break)
        ];
      }
      return [
        new Token(Type.array, obj.length),
        entries
      ];
    },
    Object(obj, typ, options, refStack) {
      const isMap = typ !== "Object";
      const keys2 = isMap ? obj.keys() : Object.keys(obj);
      const length2 = isMap ? obj.size : keys2.length;
      if (!length2) {
        if (options.addBreakTokens === true) {
          return [
            simpleTokens.emptyMap,
            new Token(Type.break)
          ];
        }
        return simpleTokens.emptyMap;
      }
      refStack = Ref.createCheck(refStack, obj);
      const entries = [];
      let i = 0;
      for (const key of keys2) {
        entries[i++] = [
          objectToTokens(key, options, refStack),
          objectToTokens(isMap ? obj.get(key) : obj[key], options, refStack)
        ];
      }
      sortMapEntries(entries, options);
      if (options.addBreakTokens) {
        return [
          new Token(Type.map, length2),
          entries,
          new Token(Type.break)
        ];
      }
      return [
        new Token(Type.map, length2),
        entries
      ];
    }
  };
  typeEncoders.Map = typeEncoders.Object;
  typeEncoders.Buffer = typeEncoders.Uint8Array;
  for (const typ of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) {
    typeEncoders[`${typ}Array`] = typeEncoders.DataView;
  }
  function objectToTokens(obj, options = {}, refStack) {
    const typ = is(obj);
    const customTypeEncoder = options && options.typeEncoders && options.typeEncoders[typ] || typeEncoders[typ];
    if (typeof customTypeEncoder === "function") {
      const tokens = customTypeEncoder(obj, typ, options, refStack);
      if (tokens != null) {
        return tokens;
      }
    }
    const typeEncoder = typeEncoders[typ];
    if (!typeEncoder) {
      throw new Error(`${encodeErrPrefix} unsupported type: ${typ}`);
    }
    return typeEncoder(obj, typ, options, refStack);
  }
  function sortMapEntries(entries, options) {
    if (options.mapSorter) {
      entries.sort(options.mapSorter);
    }
  }
  function mapSorter(e1, e2) {
    const keyToken1 = Array.isArray(e1[0]) ? e1[0][0] : e1[0];
    const keyToken2 = Array.isArray(e2[0]) ? e2[0][0] : e2[0];
    if (keyToken1.type !== keyToken2.type) {
      return keyToken1.type.compare(keyToken2.type);
    }
    const major = keyToken1.type.major;
    const tcmp = cborEncoders[major].compareTokens(keyToken1, keyToken2);
    if (tcmp === 0) {
      console.warn("WARNING: complex key types used, CBOR key sorting guarantees are gone");
    }
    return tcmp;
  }
  function tokensToEncoded(buf2, tokens, encoders, options) {
    if (Array.isArray(tokens)) {
      for (const token of tokens) {
        tokensToEncoded(buf2, token, encoders, options);
      }
    } else {
      encoders[tokens.type.major](buf2, tokens, options);
    }
  }
  function encodeCustom(data, encoders, options) {
    const tokens = objectToTokens(data, options);
    if (!Array.isArray(tokens) && options.quickEncodeToken) {
      const quickBytes = options.quickEncodeToken(tokens);
      if (quickBytes) {
        return quickBytes;
      }
      const encoder = encoders[tokens.type.major];
      if (encoder.encodedSize) {
        const size = encoder.encodedSize(tokens, options);
        const buf2 = new Bl(size);
        encoder(buf2, tokens, options);
        if (buf2.chunks.length !== 1) {
          throw new Error(`Unexpected error: pre-calculated length for ${tokens} was wrong`);
        }
        return asU8A(buf2.chunks[0]);
      }
    }
    buf.reset();
    tokensToEncoded(buf, tokens, encoders, options);
    return buf.toBytes(true);
  }
  function encode19(data, options) {
    options = Object.assign({}, defaultEncodeOptions, options);
    return encodeCustom(data, cborEncoders, options);
  }

  // ../node_modules/cborg/esm/lib/decode.js
  var defaultDecodeOptions = {
    strict: false,
    allowIndefinite: true,
    allowUndefined: true,
    allowBigInt: true
  };
  var Tokeniser = class {
    constructor(data, options = {}) {
      this.pos = 0;
      this.data = data;
      this.options = options;
    }
    done() {
      return this.pos >= this.data.length;
    }
    next() {
      const byt = this.data[this.pos];
      let token = quick[byt];
      if (token === void 0) {
        const decoder = jump[byt];
        if (!decoder) {
          throw new Error(`${decodeErrPrefix} no decoder for major type ${byt >>> 5} (byte 0x${byt.toString(16).padStart(2, "0")})`);
        }
        const minor = byt & 31;
        token = decoder(this.data, this.pos, minor, this.options);
      }
      this.pos += token.encodedLength;
      return token;
    }
  };
  var DONE = Symbol.for("DONE");
  var BREAK = Symbol.for("BREAK");
  function tokenToArray(token, tokeniser, options) {
    const arr = [];
    for (let i = 0; i < token.value; i++) {
      const value = tokensToObject(tokeniser, options);
      if (value === BREAK) {
        if (token.value === Infinity) {
          break;
        }
        throw new Error(`${decodeErrPrefix} got unexpected break to lengthed array`);
      }
      if (value === DONE) {
        throw new Error(`${decodeErrPrefix} found array but not enough entries (got ${i}, expected ${token.value})`);
      }
      arr[i] = value;
    }
    return arr;
  }
  function tokenToMap(token, tokeniser, options) {
    const useMaps = options.useMaps === true;
    const obj = useMaps ? void 0 : {};
    const m = useMaps ? /* @__PURE__ */ new Map() : void 0;
    for (let i = 0; i < token.value; i++) {
      const key = tokensToObject(tokeniser, options);
      if (key === BREAK) {
        if (token.value === Infinity) {
          break;
        }
        throw new Error(`${decodeErrPrefix} got unexpected break to lengthed map`);
      }
      if (key === DONE) {
        throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no key], expected ${token.value})`);
      }
      if (useMaps !== true && typeof key !== "string") {
        throw new Error(`${decodeErrPrefix} non-string keys not supported (got ${typeof key})`);
      }
      const value = tokensToObject(tokeniser, options);
      if (value === DONE) {
        throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no value], expected ${token.value})`);
      }
      if (useMaps) {
        m.set(key, value);
      } else {
        obj[key] = value;
      }
    }
    return useMaps ? m : obj;
  }
  function tokensToObject(tokeniser, options) {
    if (tokeniser.done()) {
      return DONE;
    }
    const token = tokeniser.next();
    if (token.type === Type.break) {
      return BREAK;
    }
    if (token.type.terminal) {
      return token.value;
    }
    if (token.type === Type.array) {
      return tokenToArray(token, tokeniser, options);
    }
    if (token.type === Type.map) {
      return tokenToMap(token, tokeniser, options);
    }
    if (token.type === Type.tag) {
      if (options.tags && typeof options.tags[token.value] === "function") {
        const tagged = tokensToObject(tokeniser, options);
        return options.tags[token.value](tagged);
      }
      throw new Error(`${decodeErrPrefix} tag not supported (${token.value})`);
    }
    throw new Error("unsupported");
  }
  function decode20(data, options) {
    if (!(data instanceof Uint8Array)) {
      throw new Error(`${decodeErrPrefix} data to decode must be a Uint8Array`);
    }
    options = Object.assign({}, defaultDecodeOptions, options);
    const tokeniser = options.tokenizer || new Tokeniser(data, options);
    const decoded = tokensToObject(tokeniser, options);
    if (decoded === DONE) {
      throw new Error(`${decodeErrPrefix} did not find any content to decode`);
    }
    if (decoded === BREAK) {
      throw new Error(`${decodeErrPrefix} got unexpected break`);
    }
    if (!tokeniser.done()) {
      throw new Error(`${decodeErrPrefix} too many terminals, data makes no sense`);
    }
    return decoded;
  }

  // ../node_modules/ipns/dist/src/utils.js
  var log = logger("ipns:utils");
  var IPNS_PREFIX = fromString2("/ipns/");
  var ipnsEntryDataForV1Sig = (value, validityType, validity) => {
    const validityTypeBuffer = fromString2(validityType);
    return concat([value, validity, validityTypeBuffer]);
  };
  var ipnsEntryDataForV2Sig = (data) => {
    const entryData = fromString2("ipns-signature:");
    return concat([entryData, data]);
  };
  var marshal = (obj) => {
    return IpnsEntry.encode(obj);
  };
  var unmarshal = (buf2) => {
    const message2 = IpnsEntry.decode(buf2);
    return {
      value: message2.value ?? new Uint8Array(0),
      signature: message2.signature ?? new Uint8Array(0),
      validityType: message2.validityType ?? IpnsEntry.ValidityType.EOL,
      validity: message2.validity ?? new Uint8Array(0),
      sequence: message2.sequence ?? 0n,
      pubKey: message2.pubKey,
      ttl: message2.ttl ?? void 0,
      signatureV2: message2.signatureV2,
      data: message2.data
    };
  };
  var createCborData = (value, validity, validityType, sequence, ttl) => {
    let ValidityType;
    if (validityType === IpnsEntry.ValidityType.EOL) {
      ValidityType = 0;
    } else {
      throw (0, import_err_code12.default)(new Error("Unknown validity type"), ERR_UNRECOGNIZED_VALIDITY);
    }
    const data = {
      Value: value,
      Validity: validity,
      ValidityType,
      Sequence: sequence,
      TTL: ttl
    };
    return encode19(data);
  };

  // ../node_modules/ipns/dist/src/index.js
  init_equals();
  init_digest();
  init_identity2();
  var log2 = logger("ipns");
  var ID_MULTIHASH_CODE = identity2.code;
  var namespace = "/ipns/";
  var namespaceLength = namespace.length;
  var create4 = async (peerId, value, seq, lifetime) => {
    const expirationDate = new import_timestamp_nano.default(Date.now() + Number(lifetime));
    const validityType = IpnsEntry.ValidityType.EOL;
    const [ms, ns] = lifetime.toString().split(".");
    const lifetimeNs = BigInt(ms) * BigInt(1e5) + BigInt(ns ?? "0");
    return await _create(peerId, value, seq, validityType, expirationDate, lifetimeNs);
  };
  var _create = async (peerId, value, seq, validityType, expirationDate, ttl) => {
    seq = BigInt(seq);
    const isoValidity = fromString2(expirationDate.toString());
    if (peerId.privateKey == null) {
      throw (0, import_err_code13.default)(new Error("Missing private key"), ERR_MISSING_PRIVATE_KEY);
    }
    const privateKey = await unmarshalPrivateKey2(peerId.privateKey);
    const signatureV1 = await sign3(privateKey, value, validityType, isoValidity);
    const data = createCborData(value, isoValidity, validityType, seq, ttl);
    const sigData = ipnsEntryDataForV2Sig(data);
    const signatureV2 = await privateKey.sign(sigData);
    const entry = {
      value,
      signature: signatureV1,
      validityType,
      validity: isoValidity,
      sequence: seq,
      ttl,
      signatureV2,
      data
    };
    if (peerId.publicKey != null) {
      const digest2 = decode4(peerId.toBytes());
      if (digest2.code !== ID_MULTIHASH_CODE || !equals3(peerId.publicKey, digest2.digest)) {
        entry.pubKey = peerId.publicKey;
      }
    }
    log2("ipns entry for %b created", value);
    return entry;
  };
  var sign3 = async (privateKey, value, validityType, validity) => {
    try {
      const dataForSignature = ipnsEntryDataForV1Sig(value, validityType, validity);
      return await privateKey.sign(dataForSignature);
    } catch (error) {
      log2.error("record signature creation failed", error);
      throw (0, import_err_code13.default)(new Error("record signature creation failed"), ERR_SIGNATURE_CREATION);
    }
  };

  // index.ts
  init_digest();
  init_identity2();
  init_base36();
  init_cid();
  var import_libp2p_crypto = __toESM(require_src());

  // ../node_modules/ipfs-car/dist/esm/blockstore/memory.js
  init_src();

  // ../node_modules/blockstore-core/esm/src/errors.js
  var errors_exports2 = {};
  __export(errors_exports2, {
    abortedError: () => abortedError,
    notFoundError: () => notFoundError
  });
  var import_err_code14 = __toESM(require_err_code(), 1);
  function notFoundError(err) {
    err = err || new Error("Not Found");
    return (0, import_err_code14.default)(err, "ERR_NOT_FOUND");
  }
  function abortedError(err) {
    err = err || new Error("Aborted");
    return (0, import_err_code14.default)(err, "ERR_ABORTED");
  }

  // ../node_modules/blockstore-core/esm/src/base.js
  var import_it_drain = __toESM(require_it_drain(), 1);
  var import_it_filter = __toESM(require_it_filter(), 1);
  var import_it_take = __toESM(require_it_take(), 1);
  var import_it_all = __toESM(require_it_all(), 1);

  // ../node_modules/blockstore-core/esm/src/memory.js
  init_base32();
  init_raw();
  init_cid();
  init_digest();

  // ../node_modules/blockstore-core/esm/src/index.js
  var Errors = { ...errors_exports2 };

  // platform.ts
  var fetch = globalThis.fetch;
  var Blob2 = globalThis.Blob;
  var File = globalThis.File;

  // index.ts
  var libp2pKeyCode = 114;
  var ONE_YEAR = 1e3 * 60 * 60 * 24 * 365;
  var defaultValidity = () => new Date(Date.now() + ONE_YEAR).toISOString();
  var Name = class {
    constructor(pubKey) {
      this._pubKey = pubKey;
    }
    get bytes() {
      const digest2 = create(identity2.code, this._pubKey.bytes);
      return CID.createV1(libp2pKeyCode, digest2).bytes;
    }
    toString() {
      const digest2 = create(identity2.code, this._pubKey.bytes);
      return CID.createV1(libp2pKeyCode, digest2).toString(base36);
    }
  };
  var WritableName = class extends Name {
    constructor(privKey) {
      super(privKey.public);
      this._privKey = privKey;
    }
    get key() {
      return this._privKey;
    }
  };
  async function create5() {
    const privKey = await import_libp2p_crypto.keys.generateKeyPair("Ed25519", 2048);
    return new WritableName(privKey);
  }
  function parse(name2) {
    const keyCid = CID.parse(name2, base36);
    if (keyCid.code !== libp2pKeyCode) {
      throw new Error(`invalid key, expected ${libp2pKeyCode} codec code but got ${keyCid.code}`);
    }
    const pubKey = import_libp2p_crypto.keys.unmarshalPublicKey(decode4(keyCid.multihash.bytes).bytes);
    return new Name(pubKey);
  }
  async function from3(key) {
    const privKey = await import_libp2p_crypto.keys.unmarshalPrivateKey(key);
    return new WritableName(privKey);
  }
  async function v0(name2, value) {
    return new Revision(name2, value, 0n, defaultValidity());
  }
  async function increment(revision, value) {
    const seqno = revision.sequence + 1n;
    return new Revision(revision.name, value, seqno, defaultValidity());
  }
  var Revision = class {
    constructor(name2, value, sequence, validity) {
      this._name = name2;
      if (typeof value !== "string") {
        throw new Error("invalid value");
      }
      this._value = value;
      if (typeof sequence !== "bigint") {
        throw new Error("invalid sequence number");
      }
      this._sequence = sequence;
      if (typeof validity !== "string") {
        throw new Error("invalid validity");
      }
      this._validity = validity;
    }
    get name() {
      return this._name;
    }
    get value() {
      return this._value;
    }
    get sequence() {
      return this._sequence;
    }
    get validity() {
      return this._validity;
    }
    static encode(revision) {
      return encode19({
        name: revision._name.toString(),
        value: revision._value,
        sequence: revision._sequence,
        validity: revision._validity
      });
    }
    static decode(bytes2) {
      const raw = decode20(bytes2);
      const name2 = parse(raw.name);
      return new Revision(name2, raw.value, BigInt(raw.sequence), raw.validity);
    }
  };
  async function publish(service, revision, key) {
    const url = new URL(`name/${revision.name}`, service.endpoint);
    const entry = await create4(key, fromString2(revision.value), revision.sequence, new Date(revision.validity).getTime() - Date.now());
    const res = await maybeHandleError(fetch(url.toString(), {
      method: "POST",
      headers: headers(service.token),
      body: toString2(marshal(entry), "base64pad")
    }));
    await res.json();
  }
  async function resolve(service, name2) {
    const url = new URL(`name/${name2}`, service.endpoint);
    const res = await maybeHandleError(fetch(url.toString()));
    const { record } = await res.json();
    const entry = unmarshal(fromString2(record, "base64pad"));
    const keyCid = CID.decode(name2.bytes);
    const pubKey = import_libp2p_crypto.keys.unmarshalPublicKey(decode4(keyCid.multihash.bytes).bytes);
    await (void 0)(pubKey, entry);
    return new Revision(name2, toString2(entry.value), entry.sequence, toString2(entry.validity));
  }
  function headers(token) {
    if (!token)
      throw new Error("missing token");
    return {
      Authorization: `Bearer ${token}`,
      "X-Client": "web3.storage"
    };
  }
  async function maybeHandleError(resPromise) {
    const res = await resPromise;
    if (res.ok)
      return res;
    const err = new Error(`unexpected status: ${res.status}`);
    try {
      Object.assign(err, await res.json());
    } catch {
    }
    throw err;
  }
})();
/*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
/**
 * Timestamp for 64-bit time_t, nanosecond precision and strftime
 *
 * @author Yusuke Kawasaki
 * @license MIT
 * @see https://github.com/kawanet/timestamp-nano
 */
//# sourceMappingURL=index.js.map
