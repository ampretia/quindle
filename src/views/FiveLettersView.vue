<script setup lang="ts">
import { useVibrate } from '@vueuse/core'
import Letter from '@/components/Letter.vue'
import { ref, reactive  } from 'vue'
import { LetterResult } from '../game.js'

import { useGameStore } from '@/stores/game.js'
import { storeToRefs } from 'pinia'

let store = useGameStore()
const { game , keyBkg} = storeToRefs(store)

const { vibrate, stop, isSupported } = useVibrate({ pattern: [60] })


const keys = [[{ letter: 'Q' }, { letter: 'W' }, { letter: 'E' }, { letter: 'R' }, { letter: 'T' }, { letter: 'Y' }, { letter: 'U' }, { letter: 'I' }, { letter: 'O' }, { letter: 'P' }],
[{ letter: 'A' }, { letter: 'S' }, { letter: 'D' }, { letter: 'F' }, { letter: 'G' }, { letter: 'H' }, { letter: 'J' }, { letter: 'K' }, { letter: 'L' }],
[{ letter: '{bksp}' }, { letter: 'Z' }, { letter: 'X' }, { letter: 'C' }, { letter: 'V' }, { letter: 'B' }, { letter: 'N' }, { letter: 'M' }, { letter: '{enter}' }]]

const keyHighlight = ref([''])
for (let x = 0; x < 26; x++) {
  keyHighlight.value[x] = ''
}

function onDown(index: number) {
  keyHighlight.value[index] = 'is-inverted'
}

function onUp(index: number) {
  keyHighlight.value[index] = ''
}


function computedColumn(v: any, row: any, count: any) {
  let style = `is-row-start-${row + 1}`
  if (v.letter.startsWith('{enter}')) {
    style = `${style} is-col-span-2`;
  }

  if (v.letter.startsWith('{bksp}')) {
    style = `is-row-start-${row} is-row-span-2`;
  }

  if (row === 1) {
    style = `${style} is-col-start-${count + 2}`;
  }


  return style;
};

function onKeyPress(button: any) {

  if (isSupported) vibrate();

  if (button === "{bksp}") {
    game.value.remove_letter()
  } else if (button === "{enter}") {
    let result = game.value.checkGuess();
    for (let x in result) {
      if (result[x] === LetterResult.CORRECT) {
        keyBkg.value[x] = 'has-background-success-light';
      } else if (result[x] === LetterResult.WRONG_PLACE) {
        keyBkg.value[x] = 'has-background-warning-light';
      } else {
        keyBkg.value[x] = 'has-background-grey';
      }
    }

  } else {
    game.value.add_letter(button)
  }

}
</script>

<template>

  <div class="pb-4">
    <div class="container py-3">
      <div class="level is-mobile">
        <div class="level-item">
          <div class="has-text-bold has-text-centered is-size-1 is-italic is-text-weight-light is-family-monospace"
            style="height: 1.5em;">
            {{ game.msg().stateMsg }}
          </div>
        </div>


      </div>
    </div>

    <div class="container">
      <div class="fixed-grid has-5-cols has-5-cols-mobile">
        <div class="grid">


          <template v-for="(guess, guessindex) in game.guesses" :key="guessindex">
            <letter class="cell" :letterGuess="letterguess" v-for="(letterguess, lgindex) in guess.letterGuess"
              :key="lgindex"></letter>
          </template>
        </div>


      </div>

    </div>

  </div>

  <div class="section has-background-grey-light">
    <div class="fixed-grid has-10-cols is-family-monospace">
      <div class="grid" @mousedown.self.stop @mouseup.self.stop @touchdown.self.stop @touchstart.self.stop>
        <template v-for="(rowlist, rowindex) in keys" :key="rowindex">
          <template v-for="(v, index) in rowlist" :key="index">

            <div class="cell button px-0 has-text-centered  has-text-weight-semibold" style="border: 0px;"
              @click="onKeyPress(v.letter)" :class="[computedColumn(v, rowindex, index), keyBkg[v.letter]]"
              @mousedown.stop="onDown(index)" @touchdown.stop="onDown(index)" @mouseup.stop="onUp(index)"
              @touchup.stop="onUp(index)">

              <span v-if="v.letter === '{bksp}'" class="material-symbols-outlined is-size-1 has-text-grey">
                backspace
              </span>

              <span v-else-if="v.letter === '{enter}'" class="material-symbols-outlined is-size-1  has-text-primary">
                keyboard_return
              </span>

              <span v-else class="is-size-1">
                {{ v.letter }}
              </span>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
