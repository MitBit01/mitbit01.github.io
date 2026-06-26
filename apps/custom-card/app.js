const response = await fetch('./data.tsv')
const data = await response.text()
const lines = data.split(/\r?\n/)
const keys = lines[0].split(/\t/)
const cards = lines.slice(1, -1)
  .map(line => line.split(/\t/).map(column => column.trim()))
  .map(values => Object.fromEntries(keys.map((k, i) => [k, values[i]])))

for (const card of cards) {
  const element = $($(`template.${card.template}`).html())

  element.find('.title').text(card.name)
  element.find('.type').text(card.type)

  $('body').append(element)
}

export {}
