import { m } from '../util/lib.js'
import Page from '../components/page.js'
import { roll, randFrom, randHexId, randCyAbility } from '../util/rand.js'
import { tablesToMd } from '../util/tables.js'

export default function CyBorgGenerator() {
  let output = ''

  function generate(opt) {
    output = (gensByOpt.get(opt) ?? (() => ''))()
  }

  return {
    view: () => m(Page, {title: 'Cy_Borg Generator'}, [
      m('div.row', Array.from(gensByOpt.entries()).slice(0, 6).map(kv => m('button.button.dark.col-2', {onclick:() => generate(kv[0])}, kv[0]))),
      m('div.row', Array.from(gensByOpt.entries()).slice(6).map(kv => m('button.button.dark.col-2', {onclick:() => generate(kv[0])}, kv[0]))),
      m('div.card', [
        m('header', 'Output'),
        m('pre', {'data-placeholder':'Empty...'}, output)
      ])
    ])
  }
}

const gensByOpt = new Map(Object.entries({
  'Shunned Nanomancer': genShunnedNanomancer,
  'Burned Hacker': genBurnedHacker,
  'Discharged Corp Killer': genDischargedCorpKiller,
  'Orphaned Gearhead': genOrphanedGearhead,
  'Renegade Cyberslasher': genRenegadeCyberSlasher,
  'Forsaken Gang-Goon': genForsakenGangGoon,
  'Punk': genPunk
}))

function genPunk(pcClass = 'punk') {
  const name = randFrom(names)

  const tables = [
    { name: 'Character', entries: [
      { name: 'Name', value: name },
      { name: 'User', value: getUsr(name) },
      { name: 'Class', value: pcClass },
      { name: 'Style', value: '' },
      { name: 'Feature', value: '' },
      { name: 'Want', value: '' },
      { name: 'Quirk', value: '' },
      { name: 'Obsession', value: '' },
      { name: 'Debt', value: '' }
    ] },
    { name: 'Abilities', entries: [
      { name: 'Strength', value: randCyAbility(0) },
      { name: 'Agility', value: randCyAbility(0) },
      { name: 'Presence', value: randCyAbility(0) },
      { name: 'Toughness', value: randCyAbility(0) },
      { name: 'Knowledge', value: randCyAbility(0) }
    ] },
    { name: 'Combat', entries: [
      { name: 'HP', value: 'T+d8/T+d8' },
      { name: 'Glitches (d2)', value: roll(1, 2).toString() },
    ] },
    { name: 'Gear', entries: [
      { name: '', value: '' },
    ] }
  ]

  return tablesToMd(tables)
}

function genShunnedNanomancer() {
  return genPunk('Shunned Nanomancer')
}

function genBurnedHacker() {
  return genPunk('Burned Hacker')
}

function genDischargedCorpKiller() {
  return genPunk('Discharged Corp Killer')
}

function genOrphanedGearhead() {
  return genPunk('Orphaned Gearhead')
}

function genRenegadeCyberSlasher() {
  return genPunk('Renegade Cyberslasher')
}

function genForsakenGangGoon() {
  return genPunk('Forsaken Gang-Goon')
}

const names = ['Ao','Bell','Blink','Clock','Cord','Duzi','Fase','Fu','Glam','Glare','Gul','Hira','Hla','Ia','Kei','Key','Lhamo','Måne','Mehr','Mille','Mpho','Nur','Phix','Reeve','Riz','Shade','Soma','Tick','Vac','Wick','Xleo','Yann','Zalec','Zenit','Zign','Zola']
function getUsr(name) {
  return `@${name}-${randHexId()}`
}

function getAbilities() {
  return `Strength ${randCyAbility(0)} Agility ${randCyAbility(0)} Presence ${randCyAbility(0)} Toughness ${randCyAbility(0)} Knowledge ${randCyAbility(0)}`
}

function toMd(/**@type {string}*/title, /**@type {[string, string|string[]][]}*/entries) {
  return '## ' + title + '\n' + entries.map(e => `${e[0]}: ${Array.isArray(e[1]) ? '\n' + e[1].map(ee => `  - ${ee}`).join('\n') : e[1]}`).join('\n')
}
