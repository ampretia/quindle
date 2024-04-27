<script setup lang="ts">
import type { LetterResult } from '@/game';
import { reactive, ref, computed } from 'vue';



export type LetterGuess = {
  letter: string
  answer: LetterResult
}
const props = defineProps(['letterGuess'])

const bkgClass = computed(() => ({
  'has-background-danger-light': props.letterGuess.answer === 0,
  'has-background-warning-light': props.letterGuess.answer === 2,
  'has-background-success-light': props.letterGuess.answer === 1
}))

const classObject = computed(() => ({
  'has-text-danger': props.letterGuess.answer === 0,
  'has-text-warning': props.letterGuess.answer === 2,
  'has-text-success': props.letterGuess.answer === 1
}))

const flipped = computed(() => ({
  'flipped': props.letterGuess.answer === 3 || props.letterGuess.answer === 4
}))

</script>

<template>
  <div>
    <div class="level flip-card" x>
      <div class="level-item has-text-weight-bold is-family-monospace is-size-1 flip-card-inner has-background-link-light"
        :class="[flipped]">
        <span :class="[]" class="flip-card-back has-text-centered vc">{{ letterGuess.letter }}</span>
        <span :class="[classObject, bkgClass]"
          class="flip-card-front has-text-centered vc">{{ letterGuess.letter }}</span>

      </div>
    </div>
  </div>
</template>

<style scoped type="text/saas">
.vc {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  /* width: 300px; */

  height: 10rem;

  position: relative;
  perspective: 600px;
  border: 1px solid #f1f1f1;
  /* perspective: 1000px; */
  /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {

  top: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Position the front and back side */
.flip-card-front,
.flip-card-back {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  transform: rotateX(0deg) rotateY(0deg);
}

.flipped {
  transform: rotateY(180deg);
}

/* Style the back side */
.flip-card-back {
  transform: rotateY(180deg);
}
</style>
