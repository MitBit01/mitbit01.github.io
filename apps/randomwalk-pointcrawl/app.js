import $ from 'https://cdn.jsdelivr.net/npm/jquery/+esm'
import { Random } from '../../libs/random.js'

/**
 * @typedef {'dn' | 'ne' | 'se' | 'ds' | 'sw' | 'nw'} Direction
 */

/**
 * @typedef {object} Node
 * @property {string} color
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {object} Edge
 * @property {Node} n1
 * @property {Node} n2
 */

const rand = new Random()

/**
 * @returns {Direction}
 */
function ranDir() {
  return rand.draw(['dn', 'ds', 'ne', 'sw', 'nw', 'se'])
}

const dsYDist = 15
const seYDist = dsYDist / 2
const seXDist = dsYDist * Math.sqrt(3) / 2

/**
 * @param {{x: number, y: number}} p
 * @param {Direction} d
 * @returns {{x: number, y: number}}
 */
function move(p, d) {
  switch (d) {
    case 'dn': return { x: 0, y: -dsYDist }
    case 'ds': return { x: 0, y: dsYDist }
    case 'ne': return { x: seXDist, y: -seYDist }
    case 'sw': return { x: -seXDist, y: seYDist }
    case 'nw': return { x: -seXDist, y: -seYDist }
    case 'se': return { x: seXDist, y: seYDist }
  }
}

/**@type {Node[]}*/
const nodes = [
  { color: 'antiquewhite', x: 50, y: 50 }
]

/**@type {Edge[]}*/
const edges = []

let currentNode = nodes[0]
const dirs = []
while (nodes.length < 15) {
  const d = ranDir()
  const v = move(currentNode, d)
  const p = { x: currentNode.x + v.x, y: currentNode.y + v.y }

  if (p.x <= 0 || p.x >= 100 || p.y <= 0 || p.y >= 100)
    continue

  const existingNode = nodes.filter(n => n.x == p.x && n.y == p.y).at(0)
  const existingEdge = edges.filter(e => e.n1 == existingNode || e.n2 == existingNode)
    .filter(e => e.n1 == currentNode || e.n2 == currentNode)
    .at(0)

  if (existingNode && existingEdge) {
    currentNode = existingNode
  } else if (existingNode) {
    edges.push({ n1: currentNode, n2: existingNode })
    currentNode = existingNode
  } else {
    const newNode = { color: 'antiquewhite', x: p.x, y: p.y }
    nodes.push(newNode)
    edges.push({ n1: currentNode, n2: newNode })
    currentNode = newNode
  }
  dirs.push(d)
}

console.log(dirs)

const svg = $(`
<svg xmlns="http://www.w3.org/2000/svg"
  width="70%" viewBox="0 0 100 100"
  text-anchor="middle" dominant-baseline="middle" font-size="3pt" >

  <rect width="100%" height="100%" fill="navajowhite" />

  <g id="g-edges"></g>
  <g id="g-nodes"></g>
  <g id="g-numbers"></g>
</svg>`)
const edgeGroup = svg.find('#g-edges')
const nodeGroup = svg.find('#g-nodes')
const numberGroup = svg.find('#g-numbers')

nodes.forEach((n, i) => {
  const c = $(`<circle cx="${n.x}" cy="${n.y}" r="4%" stroke="black" stroke-width="0.5" fill="${n.color}" />`)
  const t = $(`<text x="${n.x}" y="${n.y}">${i+1}</text>`)
  c.appendTo(nodeGroup)
  t.appendTo(numberGroup)
})

edges.forEach(e => {
  const l = $(`<line x1="${e.n1.x}" y1="${e.n1.y}" x2="${e.n2.x}" y2="${e.n2.y}" stroke="black" stroke-width="0.5" stroke-dasharray="0.5" />`)
  l.appendTo(edgeGroup)
})

const outputHtml = svg.prop('outerHTML')
$('main div').html(outputHtml)
$('main a').attr('href', `data:image/svg+xml,${encodeURI(outputHtml)}`)

/**
 * @param {Direction} d
 * @returns {Direction}
 */
function reverseDirection(d) {
  switch (d) {
    case 'dn': return 'ds';
    case 'ds': return 'dn';
    case 'ne': return 'sw';
    case 'sw': return 'ne';
    case 'nw': return 'se';
    case 'se': return 'nw';
  }
}
