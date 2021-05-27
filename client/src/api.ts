import { Ref } from '@vue/composition-api';

import { TodoList, TodoItem } from '@/interfaces';

const apiUrl = 'http://localhost:3000/api/v1';

export function getTodoData(
  variable: Ref<TodoList | null>,
  searchString: string,
  offset: number,
) {
  fetch(`${apiUrl}/todo?offset=${offset}&description=${searchString}`)
    .then((response) => response.json())
    .then((j: TodoList) => variable.value = j)
    .catch((error) => console.log(error)); // eslint-disable-line no-console
}

export function deleteTodo(id: string, onSuccess: () => void) {
  fetch(`${apiUrl}/todo/${id}`, {
    method: 'DELETE',
  })
    .then((r) => {
      if (r.ok) {
        onSuccess();
      }
    })
    .catch((error) => console.log(error)); // eslint-disable-line no-console
}

export function updateStatus(item: TodoItem, onSuccess: () => void) {
  fetch(`${apiUrl}/todo/${item._id}`, { // eslint-disable-line no-underscore-dangle
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      done: !item.done,
    }),
  })
    .then((r) => {
      if (r.ok) {
        onSuccess();
      }
    })
    .catch((error) => console.log(error)); // eslint-disable-line no-console
}

export function createNewTodo(descr: string, onSuccess: () => void) {
  fetch(`${apiUrl}/todo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      description: descr,
    }),
  })
    .then((r) => {
      if (r.ok) {
        return r.json();
      }

      return null;
    })
    .then(() => onSuccess())
    .catch((error) => console.log(error)); // eslint-disable-line no-console
}

export function changePagination(
  offset: number,
  variable: Ref<TodoList | null>,
  searchString: string,
) {
  fetch(`${apiUrl}/todo?offset=${offset}&description=${searchString}`)
    .then((response) => response.json())
    .then((j: TodoList) => variable.value = j)
    .catch((error) => console.log(error)); // eslint-disable-line no-console
}
