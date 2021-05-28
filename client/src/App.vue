<template lang="pug">
  #app.todo-app
    TodoPage
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import TodoPage from '@/views/TodoPage.vue';

export default defineComponent({
  name: 'App',
  components: {
    TodoPage,
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/app.scss';
#app {
  display: flex;
  justify-content: center;
}
</style>
