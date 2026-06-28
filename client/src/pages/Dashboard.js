import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  // Fetch all boards
  const fetchBoards = async () => {

    setLoading(true);

    try {

        const res = await API.get("/boards");

        setBoards(res.data);

        setError("");

    } catch (err) {

        console.log(err);

        setError("Unable to load boards.");

    }

    setLoading(false);
};

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/");
        return;
    }

    fetchBoards();
}, []);

  // Create board

  const createBoard = async () => {

    if(title.trim()===""){

        setError("Board title cannot be empty.");

        return;

    }

    setLoading(true);

    try{

        await API.post("/boards",{
            title,
            description
        });

        setTitle("");
        setDescription("");

        setMessage("Board created successfully.");

        setError("");

        fetchBoards();

    }
    catch(err){

        setError("Unable to create board.");

        setMessage("");

    }

    setLoading(false);

};
 


  // Delete board
  const deleteBoard = async(id)=>{

    setLoading(true);

    try{

        await API.delete(`/boards/${id}`);

        setMessage("Board deleted successfully.");

        setError("");

        fetchBoards();

    }
    catch(err){

        setError("Unable to delete board.");

        setMessage("");

    }

    setLoading(false);

};
  // Logout
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h1>TaskFlow Dashboard</h1>
      {loading && <p>Loading...</p>}

{message && (
    <p style={{color:"green"}}>
        {message}
    </p>
)}

{error && (
    <p style={{color:"red"}}>
        {error}
    </p>
)}

      <button onClick={logout}>Logout</button>

      <hr />

      <div className="form-box">
      <h2>Create Board</h2>

      <input
        type="text"
        placeholder="Board Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <textarea
        placeholder="Board Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <button onClick={createBoard}>Create Board</button>

      <hr />
      </div>

      <h2>Your Boards</h2>

      {boards.length === 0 ? (
        <div>

<h3>No Boards Yet 🚀</h3>

<p>Create your first board.</p>

</div>
      ) : (
        boards.map((board) => (
          <div className="card" key={board._id}>
            <h3>{board.title}</h3>

            <p>{board.description}</p>

            <button
              onClick={() => navigate(`/board/${board._id}`)}
            >
              Open Board
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteBoard(board._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;