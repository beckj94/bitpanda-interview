<template lang="pug">
  .container
    template(v-if="todoData")
      .search-input
        button(@click="onSearch")
          img(
            src="@/assets/icons/search.svg"
            width='20em'
          )
        input.search-input__input(
          v-model="searchString"
          @keyup.enter="onSearch"
          placeholder="Search"
        )
        button(
          @click="clearSearch"
          :class="{ inactive: searchString === '' }"
        )
          img.close-icon(
            src="@/assets/icons/times.svg"
            width='10em'
          )
      .add-todo(
        v-if="todoData"
        :class="{ 'add-todo_bottom-round': todoData.items.length === 0 }"
      )
        input.add-todo__input(
          v-model="newTodoDescription"
          type="text"
          placeholder="Take a note"
          @keyup.enter="onCreateNewTodo"
        )
        button(@click="onCreateNewTodo")
          img(
            src="@/assets/icons/plus.svg"
            width='20em'
          )
      template(v-if="todoData.items.length > 0")
        .todos-wrapper
          TodoItemComponent(
            v-for="item in todoData.items"
            :key="item._id"
            :todoItemData="item"
            @onDeleteTodoItem="deleteTodoItem($event)"
            @onUpdateDoneTodoItem="updateStatus($event)"
          )
        Pagination(
          v-if="todoData.meta.pageCount > 1"
          :todoMeta = "todoData.meta"
          @onChangePage="handlePagination($event)"
        )
      template(v-else)
        .empty-list-msg You're all cuaght up with your todos!
    template(v-else)
      img.loader(src="@/assets/icons/spinner.svg")
</template>

<script lang="ts">

import {
  defineComponent,
  ref,
  onMounted,
  watchEffect,
} from '@vue/composition-api';

import * as API from '@/api';
import Pagination from '@/components/pagination.vue';
import TodoItemComponent from '@/components/todoList.vue';
import {
  TodoList,
  TodoItem,
  PaginationSteps,
} from '@/interfaces';

export default defineComponent({
  name: 'TodoPage',
  components: {
    TodoItemComponent,
    Pagination,
  },
  setup() {
    const todoData = ref<TodoList | null>(null);
    const newTodoDescription = ref<string>('');
    const searchString = ref<string>('');
    const urlOffset = ref<number>(0);

    function deleteTodoItem(id: string) {
      // eslint-disable-next-line
      const confirmStatus = window.confirm('Do you really want to delete this item?');

      if (confirmStatus) {
        API.deleteTodo(id, () => API.getTodoData(todoData, searchString.value, urlOffset.value));
      }
    }

    function updatePagination() {
      if (todoData.value) {
        const { page, pageCount, limit } = todoData.value.meta;

        if (page > pageCount) {
          urlOffset.value = (limit * pageCount) - limit;
          API.getTodoData(todoData, searchString.value, urlOffset.value);
        }
      }
    }

    function updateStatus(i: TodoItem) {
      API.updateStatus(i, () => API.getTodoData(todoData, searchString.value, urlOffset.value));
    }

    function onCreateNewTodo() {
      if (newTodoDescription.value.length) {
        API.createNewTodo(
          newTodoDescription.value,
          () => API.getTodoData(todoData, searchString.value, urlOffset.value),
        );
      }

      newTodoDescription.value = '';
    }

    function onSearch() {
      urlOffset.value = 0;
      API.getTodoData(todoData, searchString.value, urlOffset.value);
    }

    function clearSearch() {
      searchString.value = '';
      onSearch();
    }

    function handlePagination(v: keyof PaginationSteps) {
      const p = todoData.value?.meta[v];

      if (todoData.value && p) {
        urlOffset.value = (todoData.value.meta.limit * p) - todoData.value.meta.limit;
        API.changePagination(urlOffset.value, todoData, searchString.value);
      }
    }

    onMounted(() => API.getTodoData(todoData, searchString.value, urlOffset.value));
    watchEffect(() => updatePagination());
    return {
      todoData,
      deleteTodoItem,
      updateStatus,
      newTodoDescription,
      onCreateNewTodo,
      searchString,
      onSearch,
      clearSearch,
      handlePagination,
    };
  },
});
</script>

<style lang="scss">
  @import '@/assets/scss/app.scss';
  .container {
    width: 100%;
    max-width: 590px;
    margin: auto;
    padding: $em-5;
  }
  .search-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $em-2;
    padding: $em-half;
    background-color: $color-grey-3;
    border-radius: $em-1;
    .search-input__input {
      font-weight: 300;
      width: 100%;
      &::placeholder {
        color: $color-grey-5;
      }
    }
  }
  .add-todo {
    display: flex;
    padding: $em-1 $em-1;
    background-color: $color-white;
    border-radius: $em-1 $em-1 0 0;
    border: 1px solid $color-grey-3;
    color: $color-grey-3;
    &.add-todo_bottom-round {
      border-radius: $em-3;
    }
    .add-todo__input {
      width: 100%;
      &::placeholder {
        color: $color-grey-4;
      }
    }
  }
  .todos-wrapper {
    margin-bottom: $em-3;
    background-color: $color-white;
    border-radius: 0 0 $em-1 $em-1;
    border: 1px solid $color-grey-3;
    border-top: none;
  }
  .empty-list-msg {
    margin: $em-5;
    text-align: center;
    font-size: var(--space-xl);
  }
  .loader {
    position: absolute;
    right: 50%;
    transform: translate3d(50%, -50%, 0);
  }
</style>
