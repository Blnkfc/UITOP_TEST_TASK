import axios from 'axios';
import { useEffect } from 'react';
import { Todo } from '../pages/TodoList/TodoList';

type PendingDeleteItem = { todo: Todo; deleteAt: Date };

export const useDelayedDelete = (
  items: PendingDeleteItem[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setPendingDelete: React.Dispatch<React.SetStateAction<PendingDeleteItem[]>>,
) => {
  useEffect(() => {
    if (items.length === 0) return;

    const nextDeleteAt = Math.min(...items.map((item) => item.deleteAt.getTime()));
    const delay = Math.max(0, nextDeleteAt - Date.now());

    const timeoutId = setTimeout(async () => {
      const now = new Date();
      const toDelete = items.filter((item) => item.deleteAt <= now);

      for (const item of toDelete) {
        try {
          const response = await axios.delete(`http://localhost:3000/todos/${item.todo.id}`);
          if (response.status === 200) {
            setTodos((prev) => prev.filter((todo) => todo.id !== item.todo.id));
          }
        } catch (error) {
          console.error('Failed to delete todo', error);
        }
      }

      setPendingDelete((prev) => prev.filter((item) => item.deleteAt > now));
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [items, setPendingDelete, setTodos]);
};
