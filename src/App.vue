<script setup lang="ts">
import { RouterLink, RouterView ,useRouter } from 'vue-router'
import { useGameStore } from './stores/game';
import { GameMode } from './game';
import { computed } from 'vue';

const store  = useGameStore();


const route = useRouter()

function choose(gameMode: GameMode){
  store.resetGame(gameMode);
  route.push('/fiveletters')
}
const isDaily = computed(()=>
 store.game.mode === GameMode.DAILY
)
</script>

<template>
  <header>
    <div class="section py-2 has-background-light">
      <nav class="level is-mobile">
        <div class="level-left">
          <RouterLink to="/" >  <span
            class="has-text-primary is-family-monospace has-text-weight-semibold is-size-1 is-sized-1-mobile">QUINDLE</span></RouterLink>
        </div>
        <div class="level-right">
         
          <!-- <RouterLink to="/" class="level-item button is-info  has-text-light is-size-2">Home</RouterLink> -->
          <div @click="choose(GameMode.DAILY)"  :class="[isDaily?'is-dark':'']" class="level-item button is-info has-text-light is-size-2">Daily</div>
          <div @click="choose(GameMode.RANDOM)" :class="[isDaily?'':'is-dark']" class="level-item button is-info has-text-light is-size-2">Practice</div>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
