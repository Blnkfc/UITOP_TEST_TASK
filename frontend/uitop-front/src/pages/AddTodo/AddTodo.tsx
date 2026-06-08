import axios from 'axios';
import { Category, Todo } from '../TodoList/TodoList';
import { useForm, SubmitHandler } from 'react-hook-form';

export type AddTodoFormInputs = {
  text: string;
  categoryName: string;
};

export const AddTodo = ({
  setTodos,
  setCategories,
}: {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddTodoFormInputs>();

  const handleCreate = async (data: AddTodoFormInputs) => {
    const response = await axios.post('http://localhost:3000/todos', {
      text: data.text,
      categoryName: data.categoryName,
      status: 'inProgress',
    });
    console.log('createTask res', response.data);
    setTodos((prevTodos) => [...prevTodos, response.data.data]);
    // Semi optimistic add category if new
    setCategories((prevCategories) => {
      const category = { id: response.data.data.categoryId, name: data.categoryName } as Category;
      if (category && !prevCategories.find((c) => c.id === category.id)) {
        return [...prevCategories, category];
      }
      return prevCategories;
    });
  };

  return (
    <div>
      Add todo
      <form onSubmit={handleSubmit(handleCreate)} action="">
        <div className="flex flex-col gap-2">
          <input {...register('text')} placeholder="Todo text" />
          <div className="flex gap-2">
            <input {...register('categoryName')} placeholder="Category name" />
            <button type="submit">Create</button>
          </div>
        </div>
      </form>
    </div>
  );
};
