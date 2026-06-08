import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Check, ListX, Trash } from 'lucide-react';
import { AddTodo } from '../AddTodo/AddTodo';
import { useDelayedDelete } from '../../hooks/useDelayedDelete';

type TodoStatus = 'inProgress' | 'completed';

export interface Todo {
  id: number;
  text: string;
  status: TodoStatus;
  categoryId: number | null;
}

export interface Category {
  id: number;
  name: string;
}

const TodoItem = ({
  todo,
  toggleStatus,
  categories,
  handleDelete,
}: {
  todo: Todo;
  toggleStatus: () => void;
  categories: Category[];
  handleDelete: () => void;
}) => {
  console.log('todo.status', categories);

  const category = categories.find((c) => c.id === todo.categoryId);

  return (
    <div className="relative flex flex-col items-start w-full min-h-[80px] border border-emerald-400 rounded-2xl px-7 py-3">
      <div className="absolute bottom-3 left-3">{category ? category.name : 'No Category'}</div>
      <div className="absolute top-3 right-3 text-red-500" onClick={handleDelete}>
        <Trash />
      </div>

      <div className="py-4">{todo.text}</div>
      <div
        className={`self-end w-8 h-8 rounded-lg ${todo.status === 'inProgress' ? 'border border-neutral-500' : 'border-2 border-emerald-400'}`}
      >
        <div
          className={`w-full h-full flex items-center justify-center ${todo.status === 'inProgress' ? 'opacity-0' : 'opacity-100'}`}
          onClick={toggleStatus}
        >
          {todo.status === 'completed' && <Check />}
        </div>
      </div>
    </div>
  );
};

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');
  const [categories, setCategories] = useState<Category[]>([]);
  const [pendingDelete, setPendingDelete] = useState<{ todo: Todo; deleteAt: Date }[]>([]);
  const [loading, setLoading] = useState(true);
  useDelayedDelete(pendingDelete, setTodos, setPendingDelete);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get('http://localhost:3000/todos');
      setTodos(response.data.data);
    };
    const fetchCategories = async () => {
      const response = await axios.get('http://localhost:3000/categories');
      setCategories(response.data.data);
    };
    const fetchData = async () => {
      await fetchTodos();
      await fetchCategories();
      setLoading(false);
    };
    fetchData();
  }, []);

  console.log('todos', todos);
  console.log('categories', categories);

  const toggleStatus = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newStatus = todo.status === 'inProgress' ? 'completed' : 'inProgress';
    const response = await axios.patch(`http://localhost:3000/todos/${id}`, { status: newStatus });
    if (response.status !== 200) {
      console.error('Failed to update todo');
      return;
    }
    if (newStatus === 'completed') {
      setPendingDelete((prev) => {
        if (prev && prev.some((t) => t.todo.id === id)) {
          return prev.filter((t) => t.todo.id !== id);
        }
        return [...prev, { todo, deleteAt: new Date(Date.now() + 5000) }];
      });
    }
    const updatedTodo = response.data.data;
    const resolvedTodoList = todos
      .map((t) => (t.id === id ? updatedTodo : t))
      .filter((t) => {
        return t.status !== 'completed';
      });
    setTodos(resolvedTodoList);
  };

  const handleDelete = async (id: number) => {
    const response = await axios.delete(`http://localhost:3000/todos/${id}`);
    if (response.status !== 200) {
      console.error('Failed to delete todo');
      return;
    }

    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUndo = () => {
    const todosToRestore = pendingDelete.map((item) => item.todo);
    console.log('todosToRestore', todosToRestore);

    setPendingDelete([]);
    setTodos((prev) => {
      const updated = prev.map((t) => {
        t.status = 'inProgress';
        return t;
      });
      return [...updated, ...todosToRestore];
    });
  };

  const filteredTodos = useMemo(() => {
    if (selectedCategory === 'ALL') {
      return todos;
    }
    return todos.filter((todo) => todo.categoryId === selectedCategory);
  }, [todos, selectedCategory]);

  const deferredTodos = useDeferredValue(filteredTodos);

  return (
    <div className="flex px-4 flex-col w-full">
      {pendingDelete.length > 0 && (
        <div className="fixed bottom-24 left-4 right-4 z-20 rounded-lg bg-slate-900/95 border border-slate-700 p-3 flex items-center justify-between">
          <span className="text-sm text-slate-100">Todo deleted</span>
          <button
            type="button"
            className="px-3 py-1 text-sm font-semibold rounded-md bg-emerald-500 text-slate-950"
            onClick={handleUndo}
          >
            Undo
          </button>
        </div>
      )}
      {loading && <div>Loading...</div>}

      <div className="flex items-center gap-2 mt-4">
        Filter by category:
        <select
          onChange={(e) => {
            const categoryId = Number(e.target.value);
            const categoryName = categories.find((c) => c.id === categoryId)?.name;
            console.log('FILTERING', categoryName, categoryId);

            if (e.target.value === 'ALL') {
              setSelectedCategory('ALL');
            } else {
              setSelectedCategory(categoryId);
            }
          }}
          className="border border-slate-700 rounded-md px-2 py-1 bg-slate-800 text-slate-100"
        >
          <option value="ALL">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {!loading && deferredTodos.length === 0 && (
        <div className="flex w-full justify-center items-center gap-2 py-5">
          No todos yet <ListX />
        </div>
      )}
      <div className="flex flex-col gap-2 mb-[200px] mt-4 w-full">
        {deferredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleStatus={() => toggleStatus(todo.id)}
            categories={categories}
            handleDelete={() => handleDelete(todo.id)}
          />
        ))}
      </div>
      <div className="fixed bottom-2 left-0 mt-4 bg-slate-800 w-full rounded-md">
        <AddTodo setTodos={setTodos} setCategories={setCategories} />
      </div>
    </div>
  );
};
