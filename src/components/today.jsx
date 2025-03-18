import React from "react";
import { useSelector } from "react-redux";
import Task from "./Task";

const Today = () => {
  const tasks1 = useSelector((store) => store.task.items);

  const today = new Date();

  today.setHours(23);
  today.setMinutes(59);
  today.setSeconds(59);
  today.setMilliseconds(999);

  let todayMs = new Date(today).getTime();

  let todayTasks = tasks1.filter(
    (task) => todayMs - new Date(task.deadline).getTime() > 0
  );

  if (todayTasks.length === 0) 
    {return (
      <div>
        <img className="items-center align-middle" src="https://img.freepik.com/premium-vector/no-pending-task_585024-51.jpg" alt="today"/>
      </div>)
    }

  return (
    <div>
      {todayTasks.map((task) => (
        <Task key={task.id} taskData={task} />
      ))}
    </div>
  );
};

export default Today;
