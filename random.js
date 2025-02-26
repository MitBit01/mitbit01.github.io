export function int(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function roll(count, size) {
  let sum = 0
  for (let i = 0; i < count; i++) {
    sum += int(1, size)
  }
  return sum
}

export function randFrom(/**@type {any[]}*/arr) {
  return arr[int(0, arr.length-1)]
}

export function randHexId() {
  return int(1, 0xfffffffe).toString(16)
}

export function randCyAbility(/**@type {number}*/mod) {
  const r = roll(3, 6) + mod
  return r >= 17 ? '+3'
  : r >= 15 ? '+2'
  : r >= 13 ? '+1'
  : r >= 9 ? '±0'
  : r >= 7 ? '-1'
  : r >= 5 ? '-2'
  : '-3'
}
