<script setup lang="ts">
import { ref } from 'vue';

const name = ref('fred');

</script>


<template>
  <div>
    <section class="hero is-link">
      <div class="hero-body">
        <p class="title">Welcome {{ name }}
          <span class="icon is-large">
            <ion-icon name="heart"></ion-icon>
           
          </span>


         
        </p>
        <p class="subtitle">Link subtitle</p>
      </div>
    </section>

  </div>


</template>

<style></style>
