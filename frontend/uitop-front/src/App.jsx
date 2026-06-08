import { Link, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { TodoList } from './pages/TodoList/TodoList'
import { AddTodo } from './pages/AddTodo/AddTodo'

function HomePage() {
  return <h1>Todo List</h1>
}

function AboutPage() {
  return <h1>About</h1>
}

function App() {
  return (
    <div className="">
      <nav className="nav">
        <Link to="/">TODO List</Link>
        {/* <Link to="/add">Add Todo</Link> */}
      </nav>

      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/add" element={<AddTodo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
