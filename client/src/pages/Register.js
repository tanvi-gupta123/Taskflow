import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post("/auth/register", form);

      alert("Registration Successful");

      navigate("/");

    } catch (err) {

      alert(err.response?.data?.message || "Registration Failed");

    }
  };

  return (
    <div style={{ width: "350px", margin: "100px auto" }}>

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit">
          Register
        </button>

      </form>

      <br />

      <Link to="/">
        Already have an account?
      </Link>

    </div>
  );
}

export default Register;