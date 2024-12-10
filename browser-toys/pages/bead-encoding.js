import { m } from '../util/lib.js'

import Page from '../components/page.js'

const beadsByLetter = new Map([['0','⚪⚪⚪'],
  ['A','⚪⚪🔴'],['B','⚪⚪⚫'],['C','⚪🔴⚪'],
  ['D','⚪🔴🔴'],['E','⚪🔴⚫'],['F','⚪⚫⚪'],
  ['G','⚪⚫🔴'],['H','⚪⚫⚫'],['I','🔴⚪⚪'],
  ['J','🔴⚪🔴'],['K','🔴⚪⚫'],['L','🔴🔴⚪'],
  ['M','🔴🔴🔴'],['N','🔴🔴⚫'],['O','🔴⚫⚪'],
  ['P','🔴⚫🔴'],['Q','🔴⚫⚫'],['R','⚫⚪⚪'],
  ['S','⚫⚪🔴'],['T','⚫⚪⚫'],['U','⚫🔴⚪'],
  ['V','⚫🔴🔴'],['W','⚫🔴⚫'],['X','⚫⚫⚪'],
  ['Y','⚫⚫🔴'],['Z','⚫⚫⚫']])
const valuesByNumeral = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1}
const morseByCharacter = new Map(Object.entries({' ':'/', 'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.',
'F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---',
'P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--',
'Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...',
'8':'---..','9':'----.'}))
const morseBeadByCharacter = new Map(Object.entries({'A':'◼️◻️◼️◼️','B':'◼️◼️◻️◼️◻️◼️◻️◼️','C':'◼️◼️◻️◼️◻️◼️◼️◻️◼️','D':'◼️◼️◻️◼️◻️◼️','E':'◼️',
'F':'◼️◻️◼️◻️◼️◼️◻️◼️','G':'◼️◼️◻️◼️◼️◻️◼️','H':'◼️◻️◼️◻️◼️◻️◼️','I':'◼️◻️◼️','J':'◼️◻️◼️◼️◻️◼️◼️◻️◼️◼️','K':'◼️◼️◻️◼️◻️◼️◼️','L':'◼️◻️◼️◼️◻️◼️◻️◼️','M':'◼️◼️◻️◼️◼️','N':'◼️◼️◻️◼️','O':'◼️◼️◻️◼️◼️◻️◼️◼️',
'P':'◼️◻️◼️◼️◻️◼️◼️◻️◼️','Q':'◼️◼️◻️◼️◼️◻️◼️◻️◼️◼️','R':'◼️◻️◼️◼️◻️◼️','S':'◼️◻️◼️◻️◼️','T':'◼️◼️','U':'◼️◻️◼️◻️◼️◼️','V':'◼️◻️◼️◻️◼️◻️◼️◼️','W':'◼️◻️◼️◼️◻️◼️◼️','X':'◼️◼️◻️◼️◻️◼️◻️◼️◼️','Y':'◼️◼️◻️◼️◻️◼️◼️◻️◼️◼️',
'Z':'◼️◼️◻️◼️◼️◻️◼️◻️◼️','0':'◼️◼️◻️◼️◼️◻️◼️◼️◻️◼️◼️◻️◼️◼️','1':'◼️◻️◼️◼️◻️◼️◼️◻️◼️◼️◻️◼️◼️','2':'◼️◻️◼️◻️◼️◼️◻️◼️◼️◻️◼️◼️','3':'◼️◻️◼️◻️◼️◻️◼️◼️◻️◼️◼️','4':'◼️◻️◼️◻️◼️◻️◼️◻️◼️◼️','5':'◼️◻️◼️◻️◼️◻️◼️◻️◼️','6':'◼️◼️◻️◼️◻️◼️◻️◼️◻️◼️','7':'◼️◼️◻️◼️◼️◻️◼️◻️◼️◻️◼️',
'8':'◼️◼️◻️◼️◼️◻️◼️◼️◻️◼️◻️◼️','9':'◼️◼️◻️◼️◼️◻️◼️◼️◻️◼️◼️◻️◼️'}))

function toRomanNumerals(num) {
  if (Number(num) === 0)
    return '0'
  let str = ''
  for (let numeral of Object.keys(valuesByNumeral)) {
    let repeatCount = Math.floor(num / valuesByNumeral[numeral])
    num -= repeatCount * valuesByNumeral[numeral]
    str += numeral.repeat(repeatCount)
  }
  return str
}

export default function BeadEncoding() {
  let output = ''

  function process(input) {
    if (input === '') {
      output = ''
      return
    }

    const filtered = input.toUpperCase().replaceAll(/[^A-Z0-9 ]/g, '')
    const romanized = filtered.replaceAll(/[0-9]+/g, m => toRomanNumerals(m)).replaceAll(' ', '')
    const base3Beads = ['E','0',...romanized].map(c => beadsByLetter.get(c)).join('\n')
    const morsed = Array.from(filtered).map(c => morseByCharacter.get(c)).join(' ')
    const morseBeads = filtered.split(' ').map(word => Array.from(word).map(char => morseBeadByCharacter.get(char)).join('◻️◻️')).join('◻️◻️◻️')

    output = `Filtered: ${filtered}`
    output += `\nRomanized: ${romanized}`
    output += `\nBase3 Beads (len=${romanized.length * 3 + 6}):\n${base3Beads}`
    output += `\nMorse (len=${morsed.length}):\n${morsed}`
    output += `\nMorse Beads (len=${morseBeads.length/2}):\n${morseBeads}`
  }

  return {
    view: () => m(Page, {title: 'Bead Encoding'}, [
      m('div.card', [
        m('heade', 'Input'),
        m('pre', {'data-placeholder':'Input...', contenteditable:'true', role:'textbox', oninput: e => process(e.target.textContent)})
      ]),
      m('div.card', [
        m('heade', 'Output'),
        m('pre', {'data-placeholder':'Empty...'}, output)
      ])
    ])
  }
}
