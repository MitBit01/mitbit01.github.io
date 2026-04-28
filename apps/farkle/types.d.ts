namespace Farkle {
  interface GameState {
    players: string[]
    scores: {
      [player: string]: number
    }
  }
}
