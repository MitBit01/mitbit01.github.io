import $ from 'https://cdn.jsdelivr.net/npm/jquery/+esm'
import { Random } from '../../libs/random.js'
import { serialize, deserialize } from '../../libs/minserdes.js'

const random = new Random()
const diceLookup = [null, '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

const main = $('main')
const templates = $(document.querySelectorAll('template'))
const newGameTemplate = $(templates.filter('#tmp-new-game')[0].content)
const gameTurnTemplate = $(templates.filter('#tmp-game-turn')[0].content)
const gameOverTemplate = $(templates.filter('#tmp-game-over')[0].content)

$(async function() {
  if (location.search.length === 0) {
    loadNewGame()
  } else {
    loadGameTurn(await deserialize(location.search.substring(1)))
  }
})

// --- LOAD NEW GAME

function loadNewGame() {
  main.empty().append($(newGameTemplate.clone(true, true)))

  $('#btn-add', main).on('click', function() {
    const newPlayerNum = $('.player-name', main).last().data('player-number') + 1
    const elm = $(`
        <div class="player-name" data-player-number="${newPlayerNum}">
          <label for="inp-player-${newPlayerNum}">Player ${newPlayerNum}</label>
          <input type="text" name="inp-player-${newPlayerNum}" id="inp-player-${newPlayerNum}" placeholder="Name">
        </div>
      `)
    $('fieldset', main).append(elm)
  })

  $('#btn-remove', main).on('click', function() {
    const elm = $('.player-name', main).last()
    if (elm.data('player-number') > 2) {
      elm.remove()
    }
  })

  $('#btn-start', main).on('click', async function() {
    const players = $('fieldset input[type="text"]', main)
      .map(function() { return $(this).val()?.toString() })
      .get()

    /**@type {Farkle.GameState}*/
    const state = {
      players: players,
      scores: Object.fromEntries(players.map(p => [p, 0]))
    }

    location.search = await serialize(state)
  })
}

// --- LOAD GAME TURN

function loadGameTurn(/**@type {Farkle.GameState}*/ gameState) {
  main.empty().append($(gameTurnTemplate.clone(true, true)))

  const scoreRows = gameState.players.map(p => $(`
      <tr>
        <td>${p}</td>
        <td>${gameState.scores[p]}</td>
      </tr>
    `))
  $('#players tbody', main).append(scoreRows)

  const turnState = {
    currentPlayer: gameState.players[0],
    currentScore: 0,
    /**@type {number[]}*/ rollingDice: [],
    /**@type {number[]}*/ scoringDice: [],
    scoringPoints: 0,
    diceInHand: 6
  }

  function renderStatus() {
    $('#div-status', main).html(`
        <p>${turnState.currentPlayer}! It's your turn!</p>
        <p>Your current score for the turn is ${turnState.currentScore}.</p>
        <p>You are currently holding ${turnState.scoringPoints} points.</p>
      `)
  }
  renderStatus()

  const renderDie = (num) => `<button class="die is-paddingless" data-pips="${num}">${diceLookup[num]}</button>`
  function renderDice() {
    $('#div-dice', main).html(`
        <p class="rolling">Rolling Dice: ${turnState.rollingDice.map(d => renderDie(d)).join('')}</p>
        <p class="scoring">Scoring Dice: ${turnState.scoringDice.map(d => renderDie(d)).join('')}</p>
      `)
  }

  function checkActions() {
    const canRoll = turnState.scoringPoints != 0
    const canBank = canRoll && turnState.currentScore + turnState.scoringPoints + gameState.scores[gameState.players[0]] >= 500
    const canBust = !canRoll && !canBank

    $('#btn-roll', main).prop('disabled', !canRoll)
    $('#btn-bank', main).prop('disabled', !canBank)
    $('#btn-bust', main).prop('disabled', !canBust)
  }

  main.on('click', '.rolling .die', function() {
    const num = $(this).data('pips')

    turnState.rollingDice.splice(turnState.rollingDice.indexOf(num), 1)

    turnState.scoringDice.push(num)
    turnState.scoringDice.sort()

    const score = calculateScore(turnState.scoringDice)
    turnState.scoringPoints = isNaN(score) ? 0 : score
    turnState.diceInHand = turnState.rollingDice.length == 0
      ? 6
      : turnState.rollingDice.length
    renderStatus()
    renderDice()
    checkActions()
  })

  main.on('click', '.scoring .die', function() {
    const num = $(this).data('pips')

    turnState.rollingDice.push(num)
    turnState.rollingDice.sort()

    turnState.scoringDice.splice(turnState.scoringDice.indexOf(num), 1)

    const score = calculateScore(turnState.scoringDice)
    turnState.scoringPoints = isNaN(score) ? 0 : score
    turnState.diceInHand = turnState.rollingDice.length == 0
      ? 6
      : turnState.rollingDice.length
    renderStatus()
    renderDice()
    checkActions()
  })

  $('#btn-roll', main).on('click', function() {
    turnState.currentScore += turnState.scoringPoints
    turnState.rollingDice = Array.from({ length: turnState.diceInHand }, () => random.roll(6)).sort()
    turnState.scoringDice = []
    turnState.scoringPoints = 0
    turnState.diceInHand = 0
    renderStatus()
    renderDice()
    checkActions()
  })

  $('#btn-bank', main).on('click', async function() {
    gameState.scores[gameState.players[0]] += turnState.currentScore + turnState.scoringPoints
    // @ts-ignore
    gameState.players.push(gameState.players.shift())
    location.search = await serialize(gameState)
  })

  $('#btn-bust', main).on('click', async function() {
    // @ts-ignore
    gameState.players.push(gameState.players.shift())
    location.search = await serialize(gameState)
  })
}

// --- LOAD GAME OVER

function loadGameOver() {
  main.empty().append($(gameOverTemplate.clone(true, true)))


}

// --- UTILS

function calculateScore(/**@type {number[]}*/ dice) {
  if (dice.length == 0)
    return 0

  const countsByPip = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  dice.forEach(d => countsByPip[d]++)
  const pipCountKvs = Object.entries(countsByPip).map(kv => [Number(kv[0]), kv[1]])

  // run
  if (pipCountKvs.filter(kv => kv[1] == 1).length == 6)
    return 2500

  // three pair
  if (pipCountKvs.filter(kv => kv[1] == 2).length == 3)
    return 1500

  // six of a kind
  if (pipCountKvs.some(kv => kv[1] == 6))
    return 3000

  // five of a kind
  const fiveKind = pipCountKvs.find(kv => kv[1] == 5)
  if (fiveKind)
    return 2000 + calculateScore(dice.filter(d => d != fiveKind[0]))

  // four aces (three aces and an ace)
  if (countsByPip[1] == 4)
    return 1100 + calculateScore(dice.filter(d => d != 1))

  // four of a kind
  const fourKind = pipCountKvs.find(kv => kv[1] == 4)
  if (fourKind)
    return 1000 + calculateScore(dice.filter(d => d != fourKind[0]))

  // three aces
  if (countsByPip[1] == 3)
    return 1000 + calculateScore(dice.filter(d => d != 1))

  // three of a kind
  const threeKind = pipCountKvs.find(kv => kv[1] == 3)
  if (threeKind)
    return threeKind[0] * 100 + calculateScore(dice.filter(d => d != threeKind[0]))

  // aces and fives
  if (countsByPip[1] > 0 || countsByPip[5] > 0)
    return countsByPip[1] * 100
      + countsByPip[5] * 50
      + calculateScore(dice.filter(d => d != 1 && d != 5))

  // unscorable held dice
  return NaN
}
