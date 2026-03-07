import $ from 'https://cdn.jsdelivr.net/npm/jquery/+esm'
import { Random } from "../../libs/random.js";
import { arrEq, tup } from '../../libs/utils.js';

const random = new Random()

const templates = $(document.querySelectorAll('template'))

const rectTemplate = $(templates.filter('#tmp-rect')[0].content.querySelectorAll('rect'))
const svg = $(templates.filter('#tmp-svg')[0].content.querySelectorAll('svg')).clone(true, true)

let filledSlots = [tup(2, 2)]
let availableSlots = [tup(2, 1), tup(1, 2), tup(3, 2), tup(2, 3)]
let possibleSlots = [0,1,2,3,4].flatMap(x => [tup(x, 0), tup(x, 4)])
  .concat([0,1,3,4].flatMap(x => [tup(x, 1), tup(x, 3)]))
  .concat([tup(0, 2), tup(4, 2)])

for (let room = 2; room <= 5; room++) {
  const newFilledSlot = availableSlots.splice(random.index(availableSlots.length), 1)[0]
  filledSlots.push(newFilledSlot)

  const newAvailableSlots = [
      tup(newFilledSlot[0]-1, newFilledSlot[1]),
      tup(newFilledSlot[0]+1, newFilledSlot[1]),
      tup(newFilledSlot[0], newFilledSlot[1]-1),
      tup(newFilledSlot[0], newFilledSlot[1]+1)]
    .filter(nas => possibleSlots.some(ps => arrEq(nas, ps)))
  availableSlots.push(...newAvailableSlots)
  possibleSlots = possibleSlots.filter(ps => newAvailableSlots.some(as => arrEq(ps, as)))
}

filledSlots.forEach(s => {
  svg.append(rectTemplate
    .clone(true, true)
    .attr('x', s[0]*20)
    .attr('y', s[1]*20))
});

$('#div-svg-target').append(svg)
$('#div-svg-target').html($('#div-svg-target').html()) // reparse SVG
