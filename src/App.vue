<script setup lang="ts">
import { useVibrate } from '@vueuse/core'
import Letter from '@/components/Letter.vue'
import { ref, reactive, computed } from 'vue'
import { Game, Words, LetterResult } from './words.js'
const words = new Words();
const game = reactive(new Game(words));
const { vibrate, stop, isSupported } = useVibrate({ pattern: [100] })

const listone = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M']

const keyHighlight = ref([''])
for (let x = 0; x < 26; x++) {
  keyHighlight.value[x] = ''
}

const keyBkg: { [l: string]: string } = reactive({})
for (let x = 0; x < 26; x++) {
  keyBkg[listone[x]] = ''
}


function onDown(index: number) {
  keyHighlight.value[index] = 'is-inverted'
}

function onUp(index: number) {
  keyHighlight.value[index] = ''
}

const msg = computed(() => (game.msg()))


function onKeyPress(button: any) {
  console.log(button)

  if (isSupported) vibrate();

  if (button === "{bksp}") {
    game.remove_letter()
  } else if (button === "{enter}") {
    let result = game.checkGuess();
    for (let x in result) {
      if (result[x] === LetterResult.CORRECT) {
        keyBkg[x] = 'has-background-success-light';
      } else if (result[x] === LetterResult.WRONG_PLACE) {
        keyBkg[x] = 'has-background-warning-light';
      } else {
        keyBkg[x] = 'has-background-grey';
      }
    }

  } else {
    game.add_letter(button)
  }

}

function checkEvt(event: any) {
  console.log(`Event ${JSON.stringify(event)}`)
}

</script>

<template>
  <div>

    <div class="section">
      <div class="level">
        <span class="level-item has-text-bold is-size-1" style="height: 1.5em;">
          {{ msg.stateMsg }}
        </span>

      </div>
    </div>

    <div class="section" @click.stop.prevent @touchstart.stop.prevent>
      <div class="fixed-grid has-5-cols has-5-cols-mobile">
        <div class="grid">


          <template v-for="(guess, guessindex) in game.guesses" :key="guessindex">
            <letter class="cell" :letterGuess="letterguess" v-for="(letterguess, lgindex) in guess.letterGuess"
              :key="lgindex"></letter>
          </template>
        </div>


      </div>

    </div>
    <div class="section has-background-grey-light">
      <div class="fixed-grid has-10-cols">
        <div class="grid" @mousedown.self.stop @mouseup.self.stop @touchdown.self.stop @touchstart.self.stop>
          <div class="cell button px-0 has-text-centered is-size-2 has-text-weight-semibold" style="border: 0px;"
            @click="onKeyPress(v)" v-for="(v, index) in listone" :key="index" :class="[keyHighlight[index], keyBkg[v]]"
            @mousedown.stop="onDown(index)" @touchdown.stop="onDown(index)" @mouseup.stop="onUp(index)"
            @touchup.stop="onUp(index)">
            {{ v }}</div>

          <div class="cell  button has-text-centered is-col-start-4 is-col-span-2 is-size-2"
            @click="onKeyPress('{bksp}')">
            back
          </div>
          <div class="cell  button has-text-centered is-col-start-6 is-col-span-2 is-size-2"
            @click="onKeyPress('{enter}')">
            enter
          </div>
          <div class=" cell"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped></style>
