import React, { useEffect, useState } from "react";
import './App.css';

const App = () => {
  const [ipvalue, setipvalue] = useState("");
  const [lists, setlists] = useState([]);
  const [editid, seteditid] = useState(null);
  const [error, setError] = useState(null); // Added error state

  const getdata = async () => {
    try {
      const response = await fetch("https://todolist-kzlu.onrender.com");
      const result = await response.json();
      if (result.status === 200) {
        setlists(result.data);
      } else {
        setError("Error fetching data");
      }
    } catch (error) {
      setError("Fetch error: " + error.message);
    }
  };

  const postdata = async () => {
    if (!ipvalue.trim()) {
      alert("Input cannot be empty");
      return;
    }

    try {
      const response = await fetch("https://todolist-kzlu.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ipvalue }),
      });
      if (response.ok) {
        setipvalue("");
        getdata();
      } else {
        setError("Error posting data");
      }
    } catch (error) {
      setError("Fetch error: " + error.message);
    }
  };

  const putdata = async (index) => {
    if (!ipvalue.trim()) {
      alert("Input cannot be empty");
      return;
    }

    try {
      const response = await fetch(`https://todolist-kzlu.onrender.com?index=${index}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ipvalue }),
      });
      if (response.ok) {
        seteditid(null);
        setipvalue("");
        getdata();
      } else {
        setError("Error updating data");
      }
    } catch (error) {
      setError("Fetch error: " + error.message);
    }
  };

  const deletedata = async (index) => {
    try {
      await fetch(`https://todolist-kzlu.onrender.com/${index}`, { // Corrected URL
        method: "DELETE",
      });
      getdata();
    } catch (error) {
      setError("Fetch error: " + error.message);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  return (
    <>
      <div className="container">
        <h1>TODO LISTS</h1>
        <input
          value={ipvalue}
          onChange={(e) => setipvalue(e.target.value)}
          type="text"
        />
        {editid !== null ? (
          <button onClick={() => putdata(editid)} className="edit">Update</button>
        ) : (
          <button onClick={postdata}>Add</button>
        )}
        {error && <p className="error">{error}</p>} {/* Display error messages */}
      </div>
      <ul>
        {lists.map((item) => (
          <li key={item._id}>
            {item.ipvalue} 
            <button onClick={() => { seteditid(item._id); setipvalue(item.ipvalue); }} className="edit">Edit</button> 
            <button onClick={() => deletedata(item._id)} className="delete">Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
