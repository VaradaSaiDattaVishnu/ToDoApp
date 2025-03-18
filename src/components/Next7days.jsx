import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Task from "./Task";

const Next7days = () => {
  let tasks = useSelector((store) => store.task.items);

  const today = new Date();

  const seventhDay = new Date(today);
  seventhDay.setDate(seventhDay.getDate() + 7);

  seventhDay.setHours(23);
  seventhDay.setMinutes(59);
  seventhDay.setSeconds(59);
  seventhDay.setMilliseconds(999);

  let seventhDayMs = new Date(seventhDay).getTime();

  if (tasks.length === 0) {return (<div>
    <img className="w-[600px]" src="https://static.vecteezy.com/system/resources/previews/014/814/192/non_2x/creatively-designed-flat-conceptual-icon-of-no-task-vector.jpg" alt="hi"/>
  </div>)};

  let seventhdayTasks = tasks.filter(
    (task) => seventhDayMs - new Date(task.deadline).getTime() > 0
  );

  

  return (
    <div>
      {seventhdayTasks.map((task) => (
        <Task key={task.id} taskData={task} />
      ))}
    </div>
  );
};

export default Next7days;
