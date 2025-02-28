// ========================================
// Attributions
//
// Using modified code from the following:
// - jhash by bryc, public domain, https://github.com/bryc/code/blob/master/jshash/PRNGs.md
// - name_generator.js by drow, public domain, https://donjon.bin.sh/code/name/
// - generator.js by drow, public domain, https://donjon.bin.sh/code/random/
// ========================================

export class Random {
  /**
   * @param {string} [seed]
   */
  constructor(seed) {
    this.provider = seed
      ? sfc32(murmur3_128(charCodes(seed)))
      : () => Math.random()
  }

  /**
   * @param {number} min
   * @param {number} max
   */
  int(min, max) {
    return Math.floor(this.provider() * (max - min + 1) + min)
  }

  /**
   * @param {number} count
   * @param {number} size
   */
  dice(count, size) {
    let sum = 0
    for (let i = 0; i < count; i++) {
      sum += this.int(1, size)
    }
    return sum
  }

  /**
   * @param {string} formula A dice formula in postfix notation. Operands are space-separated, and anything parseFloat as a number
   */
  diceFormulaPostfix(formula) {
    /**@type {number[]}*/ const stack = []
    const at = (/**@type {number}*/ i) => stack.at(-i) ?? 0
    const splice = (/**@type {number}*/ c, /**@type {number}*/ v) => stack.splice(-c, c, v)

    for (const token of formula.split(' ').filter(t => t.length > 0)) {
      switch (token) {
        case 'd': splice(2, this.dice(at(2), at(1))); break;
        case '+': splice(2, at(2) + at(1)); break;
        case '-': splice(2, at(2) - at(1)); break;
        default: if (!isNaN(parseFloat(token))) { stack.push(parseFloat(token)) } break;
      }
    }
    return stack.pop()
  }

  /**
   * @template T
   * @param {T[]} arr
   * @returns T
   */
  draw(arr) {
    return arr[this.int(0, arr.length-1)]
  }

  hexId() {
    return this.int(1, 0xfffffffe).toString(16)
  }
}

function charCodes(/**@type {string} */ str) {
  return Array.from(str, c => c.charCodeAt(0))
}

function murmur3_128(key, seed = 0) {
  function fmix32(h) {
      h ^= h >>> 16; h = Math.imul(h, 2246822507);
      h ^= h >>> 13; h = Math.imul(h, 3266489909);
      h ^= h >>> 16;
      return h;
  }

  var p1 = 597399067, p2 = 2869860233, p3 = 951274213, p4 = 2716044179;

  var k1, h1 = seed ^ p1,
      k2, h2 = seed ^ p2,
      k3, h3 = seed ^ p3,
      k4, h4 = seed ^ p4;

  for(var i = 0, b = key.length & -16; i < b;) {
      k1 = key[i+3] << 24 | key[i+2] << 16 | key[i+1] << 8 | key[i];
      k1 = Math.imul(k1, p1); k1 = k1 << 15 | k1 >>> 17;
      h1 ^= Math.imul(k1, p2); h1 = h1 << 19 | h1 >>> 13; h1 += h2;
      h1 = Math.imul(h1, 5) + 1444728091 | 0; // |0 = prevent float
      i += 4;
      k2 = key[i+3] << 24 | key[i+2] << 16 | key[i+1] << 8 | key[i];
      k2 = Math.imul(k2, p2); k2 = k2 << 16 | k2 >>> 16;
      h2 ^= Math.imul(k2, p3); h2 = h2 << 17 | h2 >>> 15; h2 += h3;
      h2 = Math.imul(h2, 5) + 197830471 | 0;
      i += 4;
      k3 = key[i+3] << 24 | key[i+2] << 16 | key[i+1] << 8 | key[i];
      k3 = Math.imul(k3, p3); k3 = k3 << 17 | k3 >>> 15;
      h3 ^= Math.imul(k3, p4); h3 = h3 << 15 | h3 >>> 17; h3 += h4;
      h3 = Math.imul(h3, 5) + 2530024501 | 0;
      i += 4;
      k4 = key[i+3] << 24 | key[i+2] << 16 | key[i+1] << 8 | key[i];
      k4 = Math.imul(k4, p4); k4 = k4 << 18 | k4 >>> 14;
      h4 ^= Math.imul(k4, p1); h4 = h4 << 13 | h4 >>> 19; h4 += h1;
      h4 = Math.imul(h4, 5) + 850148119 | 0;
      i += 4;
  }

  k1 = 0, k2 = 0, k3 = 0, k4 = 0;
  switch (key.length & 15) {
      case 15: k4 ^= key[i+14] << 16;
      case 14: k4 ^= key[i+13] << 8;
      case 13: k4 ^= key[i+12];
               k4 = Math.imul(k4, p4); k4 = k4 << 18 | k4 >>> 14;
               h4 ^= Math.imul(k4, p1);
      case 12: k3 ^= key[i+11] << 24;
      case 11: k3 ^= key[i+10] << 16;
      case 10: k3 ^= key[i+9] << 8;
      case  9: k3 ^= key[i+8];
               k3 = Math.imul(k3, p3); k3 = k3 << 17 | k3 >>> 15;
               h3 ^= Math.imul(k3, p4);
      case  8: k2 ^= key[i+7] << 24;
      case  7: k2 ^= key[i+6] << 16;
      case  6: k2 ^= key[i+5] << 8;
      case  5: k2 ^= key[i+4];
               k2 = Math.imul(k2, p2); k2 = k2 << 16 | k2 >>> 16;
               h2 ^= Math.imul(k2, p3);
      case  4: k1 ^= key[i+3] << 24;
      case  3: k1 ^= key[i+2] << 16;
      case  2: k1 ^= key[i+1] << 8;
      case  1: k1 ^= key[i];
               k1 = Math.imul(k1, p1); k1 = k1 << 15 | k1 >>> 17;
               h1 ^= Math.imul(k1, p2);
  }

  h1 ^= key.length; h2 ^= key.length; h3 ^= key.length; h4 ^= key.length;

  h1 += h2; h1 += h3; h1 += h4;
  h2 += h1; h3 += h1; h4 += h1;

  h1 = fmix32(h1);
  h2 = fmix32(h2);
  h3 = fmix32(h3);
  h4 = fmix32(h4);

  h1 += h2; h1 += h3; h1 += h4;
  h2 += h1; h3 += h1; h4 += h1;

  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

function sfc32(/**@type {number[]}*/ key) {
  let [a, b, c, d] = key;
  return function() {
    a |= 0; b |= 0; c |= 0; d |= 0;
    let t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}
