import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // tasks are loaded from localStorage so they survive a page refresh
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: text.trim(), done: false }]);
    setText("");
  };

  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const visibleTasks = tasks.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done,
  );

  return (
    <div className="app">
      <h1>To-Do List</h1>

      <form onSubmit={addTask} className="add-form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit">Add</button>
      </form>

      <div className="filters">
        {["all", "pending", "done"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <ul>
        {visibleTasks.map((t) => (
          <li key={t.id} className={t.done ? "done" : ""}>
            <span onClick={() => toggleTask(t.id)}>{t.title}</span>
            <button className="del" onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <p className="count">
        {tasks.filter((t) => !t.done).length} task(s) remaining
      </p>
    </div>
  );
}

export default App;
