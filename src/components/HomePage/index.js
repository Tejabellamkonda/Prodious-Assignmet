import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./index.css";
import TodoItem from "./todoItem";

const Home = () => {
  const [todo, setTodo] = useState("");

  const [todosData, setTodosData] = useState([]);

  const getAllTodos = async () => {
    const token = Cookies.get("jwt_token");
    const url = "http://localhost:5002/";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();

    setTodosData(data);
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  const onAddTodo = () => {
    const addTodo = async () => {
      const token = Cookies.get("jwt_token");
      const todos = { todo };
      console.log(todos);
      const url = "http://localhost:5002/add";
      const options = {
        method: "POST",
        body: JSON.stringify(todos),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.status === 201) {
        alert("Added Successfully");
        getAllTodos();
      }
    };

    addTodo();
  };

  const token = Cookies.get("jwt_token");
  if (token === undefined) {
    return <Navigate replace to="/login" />;
  }

  const onChangeTask = (event) => {
    setTodo(event.target.value);
  };

  return (
    <div className="todos-bg-container">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="todos-heading">Todos</h1>
            <h1 className="create-task-heading">
              Create <span className="create-task-heading-subpart">Task</span>
            </h1>
            <input
              type="text"
              className="todo-user-input"
              placeholder="What needs to be done?"
              onChange={onChangeTask}
            />
            <button className="button" onClick={onAddTodo}>
              Add
            </button>
            <h1 className="todo-items-heading">
              My <span className="todo-items-heading-subpart">Tasks</span>
            </h1>
            <ul className="todo-items-container">
              {todosData.map((each) => (
                <TodoItem
                  key={each._id}
                  task={each}
                  getAllTodos={getAllTodos}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
