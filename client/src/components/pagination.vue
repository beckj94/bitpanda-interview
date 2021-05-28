<template lang="pug">
  .pagination-wrapper
    .pagination-wrapper__button-wrapper
      button.pagination-wrapper__button(
        @click="$emit('onChangePage', Pages.Prev)"
        :class="{ inactive: !todoMeta.hasPrevPage }"
      )
        img.pagination-wrapper__icon(
          src="@/assets/icons/chevron-left.svg"
          width="20em"
        )
      div |
      button.pagination-wrapper__button(
        @click="$emit('onChangePage', Pages.Next)"
        :class="{ inactive: !todoMeta.hasNextPage }"
      )
        img.pagination-wrapper__icon(
          src="@/assets/icons/chevron-right.svg"
          width="20em"
        )
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';

import { TodoMeta, Pages } from '@/interfaces';

export default defineComponent({
  name: 'Pagination',
  props: {
    todoMeta: {
      type: Object as PropType<TodoMeta>,
      required: true,
    },
  },
  emits: ['onChangePage'],
  setup() {
    return {
      Pages,
    };
  },
});
</script>

<style lang="scss">
  @import '@/assets/scss/app.scss';
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    .pagination-wrapper__button-wrapper {
      background-color: $color-white;
      display: flex;
      align-items: center;
      padding: $em-half 0;
      border: 1px solid $color-grey;
      border-radius: $em-1;
      .pagination-wrapper__button {
        display: flex;
      }
      .pagination-wrapper__icon {
        height: 1.25em;
      }
    }
  }
</style>
