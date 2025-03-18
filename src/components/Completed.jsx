import React from "react";
import { useSelector } from "react-redux";
import Task from "./Task";

const Completed = () => {
  let tasks = useSelector((store) => store.task.items);
  let completedTasks = tasks.filter((task) => task.s);

  if (completedTasks.length === 0){
    return (<div>
      <img className="w-[600px]" src="https://i.pinimg.com/736x/dd/f6/1e/ddf61ecf5e9c505389367a63c8d663fe.jpg" alt="lol" />
    </div>)
  };

  return (
    <div>
      {completedTasks.map((task) => (
        <Task key={task.id} taskData={task} />
      ))}
    </div>
  );
};

export default Completed;
