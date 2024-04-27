import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { Game,  GameMode } from '../game.js'
import { Words } from '@/words.js';
const listone = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M']

export const useGameStore = defineStore('game', () => {
  const words = new Words();
  const game = reactive(new Game(words));
  game.setup(GameMode.DAILY)


  const keyBkg: { [l: string]: string } = reactive({})
  for (let x = 0; x < 26; x++) {
    keyBkg[listone[x]] = ''
  }


  function resetGame(mode: GameMode){
    game.setup(mode)
    for (let x = 0; x < 26; x++) {
      keyBkg[listone[x]] = ''
    }
  }

  return { game, keyBkg, resetGame }
})
