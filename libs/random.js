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
   * @returns A pseudorandom number within [0, 1).
   */
  random() {
    return this.provider()
  }

  /**
   * @param {number} size The size of the die to roll.
   * @returns An integer within [1, size].
   */
  roll(size) {
    return Math.floor(this.random() * size + 1);
  }

  /**
   * @param {number} limit The exclusive upper bound.
   * @returns An integer within [0, limit).
   */
  index(limit) {
    return Math.floor(this.random() * limit)
  }

  /**
   * @param {number} min
   * @param {number} max
   * @returns An integer within [min, max]
   */
  between(min, max) {
    return Math.floor(this.random() * (max - min + 1) + min)
  }

  /**
   * @template T
   * @param {T[]} arr The array of items to draw from.
   * @returns A random item from the array.
   */
  draw(arr) {
    return arr[this.index(arr.length)]
  }

  /**
   * @template T
   * @param {T[]} arr The array of items to shuffle.
   * @returns A shuffled copy of the array.
   */
  shuffle(arr) {
    const res = structuredClone(arr)
    for (let i = res.length - 1; i >= 1; i--) {
        const j = this.between(0, i);
        const tmp = res[i]
        res[i] = res[j]
        res[j] = tmp
    }
    return res
  }

  hexId() {
    return this.between(1, 0xfffffffe).toString(16)
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
