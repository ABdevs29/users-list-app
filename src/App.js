import './App.css';
import { useEffect, useReducer, useState } from "react";

const initialState = {
  bgcolor: "bisque",
  cardcolor: "darkkhaki",
  cardborder: "black",
  cardtext: "whitesmoke"
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_THEME":
      return {
        bgcolor: action.payload1,
        cardcolor: action.payload2,
        cardborder: action.payload3,
        cardtext: action.payload4
      };
      break;
    default:
      return state;
      break;
  }
};

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [toAddUser, setToAddUser] = useState(true);
  const [editId, setEditId] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [darkmode, setDarkmode] = useState(true);
  console.log(state);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    fetch("https://6120b10224d11c001762ed42.mockapi.io/ABdevs29/users", {
      method: "GET"
    })
      .then((data) => data.json())
      .then((users) => setProfiles(users));
  };

  const addUser = () => {
    fetch("https://6120b10224d11c001762ed42.mockapi.io/ABdevs29/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        pic: image
      })
    }).then(() => getUsers());
  };
  const editUser = (id) => {
    fetch("https://6120b10224d11c001762ed42.mockapi.io/ABdevs29/users/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        pic: image
      })
    }).then(() => {
      getUsers();
      setToAddUser(true);
    });
  };

  return (
    <div className="App" style={{ backgroundColor: state.bgcolor }}>
      <div className="user-form">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter Name"
        ></input>
        <input
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="Enter Pic URL"
        ></input>
        <button
          className="button"
          onClick={() => {
            // setProfiles([...profiles, { name: name, pic: image }]);
            toAddUser ? addUser() : editUser(editId);
            setName("");
            setImage("");
          }}
        >
          {toAddUser ? "Add User" : "Edit User"}
        </button>
      </div>
      <button
        onClick={() => {
          setDarkmode(!darkmode);
          dispatch(
            darkmode
              ? {
                  type: "CHANGE_THEME",
                  payload1: "grey",
                  payload2: "darkgray",
                  payload3: "white",
                  payload4: "black"
                }
              : {
                  type: "CHANGE_THEME",
                  payload1: "bisque",
                  payload2: "darkkhaki",
                  payload3: "black",
                  payload4: "whitesmoke"
                }
          );
        }}
      >
        {darkmode ? "☉ Light" : "☽ Dark"}
      </button>
      <div className="card-container">
        {profiles.map((el) => (
          <User
            username={el.name}
            pic={el.pic}
            key={el.id}
            userId={el.id}
            getUsers={getUsers}
            setToAddUser={setToAddUser}
            setEditId={setEditId}
            profiles={profiles}
            name={name}
            setName={setName}
            image={image}
            setImage={setImage}
            state={state}
          />
        ))}
      </div>
    </div>
  );
}

function User({
  username,
  pic,
  userId,
  getUsers,
  setToAddUser,
  setEditId,
  profiles,
  setName,
  name,
  image,
  setImage,
  state
}) {
  const deleteUser = (userId) => {
    fetch(
      "https://6120b10224d11c001762ed42.mockapi.io/ABdevs29/users/" + userId,
      {
        method: "DELETE"
      }
    ).then(() => getUsers());
  };
  return (
    <div
      className="card"
      style={{
        backgroundColor: state.cardcolor,
        borderColor: state.cardborder,
        color: state.cardtext
      }}
    >
      <img src={pic} alt="profile pic" className="profile-pic" />
      <div>
        <p className="profile-name">{username}</p>
        <button
          onClick={() => {
            setToAddUser(false);
            setEditId(userId);
            setName(username);
            setImage(pic);
          }}
        >
          Edit
        </button>{" "}
        {/* editUser(userId)*/}
        <button onClick={() => deleteUser(userId)}>Delete</button>
      </div>
    </div>
  );
}