<template lang="pug">
  .container
    template(v-if="errors")
      div.alert-popup.alert-popup--error
        span(
          v-for="(errorType, key) in errors"
        ) {{error.key}}
    template(v-if="successMessage != ''")
      div.alert-popup.alert-popup--success
        span {{successMessage}}
    template(v-if="todoData")
      div.search-input-wrapper
        button(@click="search")
          img(
            src="@/assets/icons/search.svg"
            width='20em'
          )
        input.search-input-wrapper__input(
          v-model="searchString"
          @keyup.enter="search"
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
      div.add-todo(
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
          @onChangePage="changePage($event)"
        )
      template(v-else)
        .empty-list-msg No todos here.
    template(v-else)
      div.loader-wrapper
        img.loader-wrapper__icon(src="@/assets/icons/spinner.svg")
        span Loading...
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
  ErrorList,
  // SuccessList,
} from '@/interfaces';

export default defineComponent({
  name: 'TodoPage',
  components: {
    TodoItemComponent,
    Pagination,
  },
  setup() {
    const todoData = ref<TodoList | null>(null);
    const errors = ref<ErrorList | null>(null);
    const successMessage = ref<string>('');
    const newTodoDescription = ref<string>('');
    const searchString = ref<string>('');
    const urlOffset = ref<number>(0);

    function showSuccessMessage(message: string) {
      successMessage.value = message;
      setTimeout(() => successMessage.value = '', 3000);
    }

    function deleteTodoItem(id: string) {
      // eslint-disable-next-line
      const confirmStatus = window.confirm('Do you really want to delete this item?');

      if (confirmStatus) {
        API.deleteTodo(
          id,
          errors,
          () => {
            showSuccessMessage('Todo successfully deleted!');
            API.getTodoData(todoData, errors, searchString.value, urlOffset.value);
          },
        );
      }
    }

    function updatePagination() {
      if (todoData.value) {
        const { page, pageCount, limit } = todoData.value.meta;

        if (page > pageCount) {
          urlOffset.value = (limit * pageCount) - limit;
          API.getTodoData(todoData, errors, searchString.value, urlOffset.value);
        }
      }
    }

    function updateStatus(item: TodoItem) {
      API.updateStatus(
        item,
        errors,
        () => {
          showSuccessMessage('Todo successfully updated!');
          API.getTodoData(todoData, errors, searchString.value, urlOffset.value);
        },
      );
    }

    function onCreateNewTodo() {
      if (newTodoDescription.value.length) {
        API.createNewTodo(
          newTodoDescription.value,
          errors,
          () => {
            showSuccessMessage('Todo successfully created!');
            API.getTodoData(todoData, errors, searchString.value, urlOffset.value);
          },
        );
      }

      newTodoDescription.value = '';
    }

    function search() {
      urlOffset.value = 0;
      API.getTodoData(todoData, errors, searchString.value, urlOffset.value);
    }

    function clearSearch() {
      searchString.value = '';
      search();
    }

    function changePage(index: keyof PaginationSteps) {
      const pageNum = todoData.value?.meta[index];

      if (todoData.value && pageNum) {
        urlOffset.value = (todoData.value.meta.limit * pageNum) - todoData.value.meta.limit;
        API.changePagination(urlOffset.value, errors, todoData, searchString.value);
      }
    }

    onMounted(() => API.getTodoData(todoData, errors, searchString.value, urlOffset.value));
    watchEffect(() => updatePagination());
    return {
      todoData,
      deleteTodoItem,
      updateStatus,
      newTodoDescription,
      onCreateNewTodo,
      searchString,
      search,
      clearSearch,
      changePage,
      errors,
      successMessage,
    };
  },
});
</script>

<style lang="scss">
  @import '@/assets/scss/app.scss';
  .container {
    width: 60vw;
    max-width: 100%;
    padding: $em-3;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .alert-popup {
    padding: 1em;
    border-radius: 0.5em;
    margin-bottom: 2em;
    &.alert-popup--error {
      background-color: $color-error-background;
      color: $color-error;
    }
    &.alert-popup--success {
      background-color: $color-success-background;
      color: $color-success;
    }
  }
  .search-input-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $em-2;
    padding: $em-half;
    background-color: $color-grey-dark;
    border-radius: $em-1;
    .search-input-wrapper__input {
      font-weight: 300;
      width: 100%;
      &::placeholder {
        color: $color-grey-darker;
      }
    }
  }
  .add-todo {
    display: flex;
    padding: $em-1 $em-1;
    background-color: $color-white;
    border-radius: $em-1 $em-1 0 0;
    border: 1px solid $color-grey;
    color: $color-grey;
    &.add-todo_bottom-round {
      border-radius: $em-3;
    }
    .add-todo__input {
      width: 100%;
      &::placeholder {
        color: $color-grey-dark;
      }
    }
  }
  .todos-wrapper {
    margin-bottom: $em-3;
    background-color: $color-white;
    border-radius: 0 0 $em-1 $em-1;
    border: 1px solid $color-grey;
    border-top: none;
  }
  .empty-list-msg {
    margin: $em-5;
    text-align: center;
    font-size: 2em;
  }
  .loader-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    .loader-wrapper__icon {
      width: 2em;
      margin-right: $em-1;
      animation: rotating 2s linear infinite;
    }
  }
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
