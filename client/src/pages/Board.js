import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function Board() {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    estimatedHours: "",
  });

  const fetchTasks = useCallback(async () => {
  setLoading(true);

  try {
    const res = await API.get(`/tasks/${id}`);
    setTasks(res.data);
    setError("");
  } catch (err) {
    console.log(err);
    setError("Unable to load tasks.");
  }

  setLoading(false);
}, [id]);
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createTask = async () => {

  if (form.title.trim() === "") {
    setError("Task title is required.");
    return;
  }

  if (form.estimatedHours < 0) {
    setError("Estimated hours cannot be negative.");
    return;
  }

  setLoading(true);

  try {

    await API.post("/tasks", {
      ...form,
      board: id,
    });

    setForm({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
      estimatedHours: "",
    });

    setMessage("Task created successfully.");
    setError("");

    fetchTasks();

  } catch (err) {

    setError("Task creation failed.");
    setMessage("");

  }

  setLoading(false);
};

  const deleteTask = async (taskId) => {

  setLoading(true);

  try {

    await API.delete(`/tasks/${taskId}`);

    setMessage("Task deleted successfully.");
    setError("");

    fetchTasks();

  } catch (err) {

    setError("Unable to delete task.");
    setMessage("");

  }

  setLoading(false);
};
  
  const updateStatus = async (taskId, status) => {

  setLoading(true);

  try {

    await API.put(`/tasks/${taskId}`, {
      status,
    });

    setMessage("Task status updated.");
    setError("");

    fetchTasks();

  } catch (err) {

    setError("Unable to update task status.");
    setMessage("");

  }

  setLoading(false);
};
      const suggestEstimate = async () => {

  if (form.title.trim() === "") {

    setError("Enter task title first.");

    return;

  }

  setLoading(true);

  try {

    const res = await API.post("/ai/suggest", {
      title: form.title,
      description: form.description,
    });

    let text = res.data.suggestion;

    text = text.replace(/```json/g, "").replace(/```/g, "");

    const data = JSON.parse(text);

    setForm({
      ...form,
      estimatedHours: data.estimatedHours,
      priority: data.suggestedPriority,
    });

    setMessage("AI suggestion applied.");
    setError("");

  } catch (err) {

    setError("AI suggestion failed.");
    setMessage("");

  }

  setLoading(false);
};
                const editTask = async (task) => {

  const newTitle = prompt("Task Title", task.title);

  if (!newTitle) return;

  const newDescription = prompt(
    "Description",
    task.description
  );

  setLoading(true);

  try {

    await API.put(`/tasks/${task._id}`, {
      title: newTitle,
      description: newDescription,
    });

    setMessage("Task updated.");
    setError("");

    fetchTasks();

  } catch (err) {

    setError("Unable to update task.");
    setMessage("");

  }

  setLoading(false);
};
  const renderColumn = (status) => {
  const filteredTasks = tasks.filter(
    (task) => task.status === status
  );

  return (
    <div className="column">
      <h2>{status}</h2>

      {filteredTasks.length === 0 ? (
        <p>No Tasks</p>
      ) : (
        filteredTasks.map((task) => (
          <div className="card" key={task._id}>
            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>
              <b>Priority:</b> {task.priority}
            </p>

            <p>
              <b>Hours:</b> {task.estimatedHours}
            </p>

            <select
              value={task.status}
              onChange={(e) =>
                updateStatus(task._id, e.target.value)
              }
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <br />
            <br />

            <button onClick={() => editTask(task)}>
              Edit
            </button>

            {" "}

            <button onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};
  

  return (
    <div style={{ padding: "20px" }}>

      <h1>Board</h1>
      {loading && <p>Loading...</p>}

{message && (
  <p style={{ color: "green" }}>
    {message}
  </p>
)}

{error && (
  <p style={{ color: "red" }}>
    {error}
  </p>
)}

      <hr />

      <h2>Create Task</h2>

      <input
        name="title"
        placeholder="Task Title"
        value={form.title}
        onChange={handleChange}
      />

      <br /><br />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <br /><br />
      <label>Priority</label>
      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <br /><br />
      <label>Due Date</label>
      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="number"
        name="estimatedHours"
        placeholder="Estimated Hours"
        value={form.estimatedHours}
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={suggestEstimate}>
  🤖 AI Suggest Estimate
</button>

<br /><br /> 

      <button onClick={createTask}>
        Create Task
      </button>

      <hr />

      <div className="board-container">
        {renderColumn("To Do")}

        {renderColumn("In Progress")}

        {renderColumn("Done")}
      </div>

    </div>
  );
}

export default Board;