/// <reference path="../types.d.ts" />

export function tablesToMd(/**@type {Table[]}*/tables) {
  return tables.map(t => tableToMd(t)).join('\n\n')
}
function tableToMd(/**@type {Table}*/table) {
  const nameWidth = Math.max(table.name.length, ...table.entries.map(e => e.name.length))
  const valueWidth = Math.max(...table.entries.map(e => e.value.length))

  return `| ${table.name.padEnd(nameWidth)} | ${''.padEnd(valueWidth)} |\n`
    + `| ${'-'.repeat(nameWidth)} | ${'-'.repeat(valueWidth)} |\n`
    + `${entriesToMd(table.entries, nameWidth, valueWidth)}`
}
function entriesToMd(/**@type {Entry[]}*/entries, /**@type {number}*/nameWidth, /**@type {number}*/valueWidth) {
  return entries.map(e => entryToMd(e, nameWidth, valueWidth)).join('\n')
}
function entryToMd(/**@type {Entry}*/entry, /**@type {number}*/nameWidth, /**@type {number}*/valueWidth) {
  return `| ${entry.name.padEnd(nameWidth)} | ${entry.value.padEnd(valueWidth)} |`
}
