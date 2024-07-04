import { Remarkable } from 'https://cdn.jsdelivr.net/npm/remarkable@2.0.1/+esm'
const md = new Remarkable();

// Set up document elements
/**@type {HTMLTemplateElement}*/ const template = document.querySelector('template')
/**@type {HTMLSpanElement|HTMLDivElement}*/ let elem

// Get data
const response = await fetch('./data.json')
const data = await response.json()

// Render cards
for (const card of data.cards) {
  const fragment = template.content.cloneNode(true)

  if (card.colors?.length > 0) {
    const left = card.colors[0]
    const right = card.colors.length > 1 ? card.colors[1] : left

    elem = fragment.querySelector('.card')
    elem.style.setProperty('--left-color', `var(--${left}-color)`)
    elem.style.setProperty('--right-color', `var(--${right}-color)`)
  }

  if (card.cost?.length > 0) {
    elem = fragment.querySelector('[data-slot="cost"]')
    elem.textContent = card.cost
    elem = fragment.querySelector('[data-display-if="cost"]')
    elem.style.display = 'revert'
  }

  if (card.power?.length > 0) {
    elem = fragment.querySelector('[data-slot="power"]')
    elem.textContent = card.power
    elem = fragment.querySelector('[data-display-if="power"]')
    elem.style.display = 'revert'
  }

  if (card.body?.length > 0) {
    elem = fragment.querySelector('[data-slot="body"]')
    elem.innerText = card.body
    elem = fragment.querySelector('[data-display-if="body"]')
    elem.style.display = 'revert'
  }

  if (card.name?.length > 0) {
    elem = fragment.querySelector('[data-slot="name"]')
    elem.textContent = card.name
    elem = fragment.querySelector('[data-slot="tags"]')
    elem.textContent = 'blah'
    elem = fragment.querySelector('[data-slot="info"]')
    //elem.textContent = 'blah'
  }

  document.body.append(fragment)
}
