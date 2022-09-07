const initialTodos = [
    { task: "Take out the trash", completed: false },
    { task: "Walk the dog", completed: true },
    { task: "Do the weekly quizzes", completed: false },
];

function Todo({ task, completed }) {
    return (
        <section>
            <input type="checkbox" checked={completed} />
            <p style={{ display: "inline-block" }}>
                {task}
            </p>
        </section>
    );
}

function App() {
    return (
        <>
            <header>
                <h1>Todo App</h1>
            </header>
            <main>
                <h2>List of Todos</h2>
                {initialTodos.map(todo => (
                    <Todo key={todo.task} {...todo} />
                ))}
            </main>
        </>
    );
}

export default App;