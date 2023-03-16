import "./index.css";
import Cookies from "js-cookie";
import { useState } from "react";

const TodoItem = (props) => {
  const { task, getAllTodos } = props;

  console.log(task);
  const [edit, setEdit] = useState(false);
  const [upDatetodo, setUpdatedTodo] = useState(task.todo);

  const onEdit = () => {
    setEdit(true);
  };

  const onChangeEdit = (e) => {
    setUpdatedTodo(e.target.value);
  };

  const onUpdateTodo = () => {
    console.log(upDatetodo);
    console.log("trigger");

    const upDateTodoAPi = async (upDateTodo) => {
      const token = Cookies.get("jwt_token");
      const todos = { upDateTodo };
      console.log(todos);
      const url = `http://localhost:5002/${task._id}`;
      const options = {
        method: "PUT",
        body: JSON.stringify(todos),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.status === 201) {
        alert("Updated Successfully");
        setEdit(false);
      }
    };

    upDateTodoAPi(upDatetodo);
  };

  const onDelete = () => {
    const delTodo = async () => {
      const token = Cookies.get("jwt_token");

      const url = `http://localhost:5002/${task._id}`;
      const options = {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.status === 200) {
        alert("Deleted Successfully");
        getAllTodos();
      }
    };
    delTodo();
  };

  if (edit) {
    return (
      <>
        <input
          type="text"
          className="todo-user-input"
          placeholder="What needs to be done?"
          value={upDatetodo}
          onChange={onChangeEdit}
        />
        <button className="button" onClick={onUpdateTodo}>
          Update
        </button>
      </>
    );
  }
  return (
    <li className="todo-item-container d-flex flex-row">
      <div className="label-container d-flex flex-row">
        <label className="checkbox-label">{task.todo}</label>
        <div className="delete-icon-container">
          <button className="edit" type="button" onClick={onEdit}>
            Edit
          </button>
        </div>
        <div className="delete-icon-container">
          <button className="delete" type="button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
