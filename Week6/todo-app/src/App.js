import { useState } from "react";

import "./css/style.css";

import binImage from "./images/bin.png";


const initialTodos = [
    { task: "Take out the trash", completed: false },
    { task: "Walk the dog", completed: true },
    { task: "Do the weekly quizzes", completed: false },
];


function Todo({ task, completed, toggleCompleted, removeTodo }) {
    const taskStyle = () => {
        let result = { display: "inline-block" };
        if (completed) {
            result["textDecoration"] = "line-through";
        }
        return result;
    };

    return (
        <section>
            <div>
                <input type="checkbox" checked={completed} onChange={toggleCompleted} />
                <p style={taskStyle()}>
                    {task}
                </p>
            </div>
            <DeleteButton removeTodo={removeTodo} />
        </section >
    );
}


function DeleteButton({ removeTodo }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        removeTodo();
    };

    return (
        <form onSubmit={handleSubmit} className="delete">
            <button type="submit">
                <img src={binImage} height="20px" width="20px" alt="bin" />
            </button>
        </form>
    );
}


function NewTodoForm({ sortTodos, setTodos }) {
    const [task, setTask] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setTodos((todos) => [...todos, { task, completed: false }].sort(sortTodos));
        setTask("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="task">Task:</label>
            <input
                type="text"
                id="task"
                name="task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <button type="submit">Add Todo</button>
        </form>
    );
}


function App() {
    const sortTodos = (todo, otherTodo) => {
        if (todo.task < otherTodo.task) {
            return -1;
        }
        if (todo.task > otherTodo.task) {
            return 1;
        }
        return 0;
    };

    const [todos, setTodos] = useState(initialTodos.sort(sortTodos));

    const toggleCompleted = (todo) => {
        let result = todos.filter((_todo) => _todo.task !== todo.task);
        let sorted = [...result, { ...todo, completed: !todo.completed }].sort(sortTodos);
        setTodos(sorted);
    };

    const removeTodo = (todo) => {
        let result = todos.filter((_todo) => _todo.task !== todo.task);
        let sorted = result.sort(sortTodos);
        setTodos(sorted);
    };

    return (
        <>
            <header>
                <h1>Todo App</h1>
            </header>
            <main>
                <h2>List of Todos</h2>
                {todos.map(todo => (
                    <Todo
                        key={todo.task}
                        {...todo}
                        toggleCompleted={() => toggleCompleted(todo)}
                        removeTodo={() => removeTodo(todo)}
                    />
                ))}
                <NewTodoForm sortTodos={sortTodos} setTodos={setTodos} />
            </main>
        </>
    );
}


export default App;