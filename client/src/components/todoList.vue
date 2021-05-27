<template lang="pug">
  div.todo-item(:class="{ 'todo-item_done': props.todoItemData.done }")
    div.todo-item__left
      button.todo-item__button(
        :class="{ 'todo-item_done': props.todoItemData.done }"
        @click="$emit('onUpdateDoneTodoItem', props.todoItemData)"
      )
        img(
          src="@/assets/icons/circle.svg"
          v-if="!todoItemData.done"
          width='30em'
        )
        img(
          src="@/assets/icons/check-circle.svg"
          v-if="todoItemData.done"
          width='30em'
        )
      span.todo-item__description {{props.todoItemData.description}}
    div.todo-item__right
      span.todo-item__age {{calcTodoAge()}}
      button(
        class="delete-item-button"
        @click="$emit('onDeleteTodoItem', props.todoItemData._id)"
      )
        img(
          src="@/assets/icons/trash-alt.svg"
          width='15em'
        )
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api';

import { TodoItem, TimeUnits } from '@/interfaces';

export default defineComponent({
  name: 'TodoItemComponent',
  props: {
    todoItemData: {
      type: Object as PropType<TodoItem>,
      required: true,
    },
  },
  components: {
  },
  emits: ['onDeleteTodoItem', 'onUpdateDoneTodoItem'],
  setup(props) {
    const computeAgeString = (age: number, units: TimeUnits) => `${age} ${units}${age === 1 ? '' : 's'}`;

    function calcTodoAge() {
      let age = '';
      const diff: number = Date.now() - Date.parse(props.todoItemData.createdAt);

      if ((diff / (1000 * 60 * 60 * 24)) > 1) {
        age = computeAgeString(Math.round(diff / (1000 * 60 * 60 * 24)), TimeUnits.Day);
      } else if ((diff / (1000 * 60 * 60)) > 1) {
        age = computeAgeString(Math.round(diff / (1000 * 60 * 60)), TimeUnits.Hour);
      } else {
        age = computeAgeString(Math.round(diff / (1000 * 60)), TimeUnits.Minute);
      }

      return age;
    }
    computed(() => calcTodoAge());
    return {
      calcTodoAge,
      props,
    };
  },
});
</script>

<style lang="scss">
  @import '@/assets/scss/app.scss';
  .todo-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $em-half $em-half;
    border-top: 1px solid $color-grey-3;
    &:hover {
      .todo-item .delete-item-button  {
        opacity: .5;
      }
    }
    &:first-of-type{
      border: none;
    }
    &:hover .delete-item-button {
      opacity: 1;
    }
    .todo-item__left,
    .todo-item__right {
      display: flex;
      align-items: center;
    }
    .todo-item__button {
      padding: 0;
    }
    .todo-item__description {
      margin-left: $em-half;
    }
    .todo-item__status-marker {
      width: $em-3;
      height: $em-3;
      display: flex;
      border: 1px solid $color-grey-3;
      border-radius: $em-2;
      .todo-item_img{
        margin: auto;
      }
    }
    .todo-item__age {
      margin: auto $em-half;
      font-size: smaller;
      color: $color-grey-4;
      white-space: nowrap;
      margin-left: $em-2;
    }
    .delete-item-button {
      opacity: 0;
    }
  }
  .todo-item_done {
    color: $color-grey-4;
    .todo-item__description {
      text-decoration:line-through;
    }
    // .todo-item__status-marker {
      // border-color: $color-green-1;
    // }
  }
</style>
