import { useState } from "react";

const initialTodos = [
    { task: "Take out the trash", completed: false },
    { task: "Walk the dog", completed: true },
    { task: "Do the weekly quizzes", completed: false },
];

function Todo({ task, completed, toggleCompleted }) {
    const taskStyle = () => {
        let result = { display: "inline-block" };
        if (completed) {
            result["text-decoration"] = "line-through";
        }
        return result;
    };

    return (
        <section>
            <input type="checkbox" checked={completed} onChange={toggleCompleted} />
            <p style={taskStyle()}>
                {task}
            </p>
        </section>
    );
}

function App() {
    const [todos, setTodos] = useState(initialTodos);

    const sortTodos = (todo, otherTodo) => {
        if (todo.task < otherTodo.task) {
            return -1;
        }
        if (todo.task > otherTodo.task) {
            return 1;
        }
        return 0;
    };

    const toggleCompleted = (todo) => {
        let result = todos.filter((_todo) => _todo.task !== todo.task);
        let sorted = [...result, { ...todo, completed: !todo.completed }].sort(sortTodos);
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
                    />
                ))}
            </main>
        </>
    );
}

export default App;