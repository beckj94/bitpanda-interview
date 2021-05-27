<template lang="pug">
  .pagination-section
    .pagination-section__button-block
      button.pagination-section__button(
        @click="$emit('onChangePage', Pages.Prev)"
        :class="{ inactive: !todoMeta.hasPrevPage }"
      )
        img.pagination-section__img(
          src="@/assets/icons/chevron-left.svg"
          width="20em"
        )
      .pagination-section__separator
      button.pagination-section__button(
        @click="$emit('onChangePage', Pages.Next)"
        :class="{ inactive: !todoMeta.hasNextPage }"
      )
        img.pagination-section__img(
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
  .pagination-section {
    display: flex;
    justify-content: flex-end;
    .pagination-section__button-block {
      background-color: var(--color-white);
      display: flex;
      align-items: center;
      padding: var(--space-xs) 0;
      border: 1px solid var(--color-grey-3);
      border-radius: var(--space-m);
      .pagination-section__button {
        padding: 0 var(--space-m);
        display: flex;
      }
      .pagination-section__img {
        height: 20px;
      }
      .pagination-section__separator {
        border-left: 1px solid var(--color-grey-5);
        height: 100%;
      }
    }
  }
</style>
