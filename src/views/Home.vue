<template>  
  <div>
    <Battle />
  </div>
  
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Battle from '@/modules/battle/battle.vue';

@Options({
  components: {
    Battle,
  },
})
export default class Home extends Vue {}
</script>
