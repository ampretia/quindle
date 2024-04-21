<template>
    <div :class="keyboardClass"></div>
</template>

<script setup lang="ts">
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import { computed, ref, onMounted } from 'vue';

const emit = defineEmits(['onKeyPress'])
const props = defineProps({
    keyboardClass: {
        default: "simple-keyboard",
        type: String
    },
    input: {
        type: String
    }
}
);

const keyboard = ref()

const keylayout = {

    'default': [
        'Q W E R T Y U I O P',
        'A S D F G H J K L',
        '{bksp} Z X C V B N M {enter}'
    ]

}

onMounted(() => {
    keyboard.value = new Keyboard(props.keyboardClass, {
        // onChange: this.onChange,
        onKeyPress: (button) => { emit('onKeyPress', button) },
        layout: keylayout
    });
}
);



// watch: {
//     input(input) {
//         this.keyboard.setInput(input);
//     }
// }
// };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>