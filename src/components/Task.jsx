import React from "react";
import { useDispatch } from "react-redux";
import { removeTask, updateTask, sortPendingTasks } from "../utils/TaskSlice";
import { setDes } from "../utils/DesSlice";
import { useSelector } from "react-redux";
import { decreaseCount, increaseCount } from "../utils/CountSlice";

const Task = ({ taskData }) => {
  const desTask = useSelector((store) => store.des.desTask);
  const tasks = useSelector((store) => store.task.items);
  const pindex = useSelector((store) => store.count.pendingCount);

  const dispatch = useDispatch();

  if (!taskData) {
    return null;
  }

  const { details, id, s, overdue } = taskData;

  const onchangeDetails = (event) => {
    const newDetails = event.target.value;
    dispatch(updateTask({ id, updatedTask: { details: newDetails } }));
  };

  const setDesTask = () => {
    dispatch(setDes(taskData));
  };

  const changeStatus = () => {
    const newStatus = !s;
    
    dispatch(updateTask({ id, updatedTask: { s: newStatus,  } }));

    if (!s) {
      
      dispatch(updateTask({id, updatedTask: {overdue: false}}))
      const start = Number(taskData.pindex) + 1;

      // dispatch(increaseCount('completed'));
      dispatch(decreaseCount("pending"));

      const pendingTasks = tasks.filter((task) => !task.s);
      const pendingTasksLength = pendingTasks.length;

      for (let i = start; i < pendingTasksLength; i++) {
        let taskD = tasks.find((task) => task.pindex === `${i}`);

        let newPindex = `${i - 1}`;
        dispatch(
          updateTask({ id: taskD.id, updatedTask: { pindex: newPindex } })
        );
      }

      dispatch(updateTask({ id, updatedTask: { pindex: "0" } }));
    } else if (s) {

      const taskoverdue = tasks.filter(
        (task) => new Date(task.deadline).getTime() < Date.now() && task.id === id
      );

      if(taskoverdue.length) {
        dispatch(updateTask({id, updatedTask: {overdue: true}}))
      }
      // dispatch(decreaseCount('completed'));
      dispatch(increaseCount("pending"));
      dispatch(updateTask({ id, updatedTask: { pindex } }));
      dispatch(sortPendingTasks());
    }
  };

  const deleteTask = () => {
    dispatch(removeTask(id));
    dispatch(decreaseCount("pending"));

    if (!taskData.s) {
      const start = Number(taskData.pindex) + 1;
      const pendingTasks = tasks.filter((task) => !task.s);
      const pendingTasksLength = pendingTasks.length;
      

      for (let i = start; i < pendingTasksLength; i++) {
        let taskD = tasks.find((task) => task.pindex === `${i}`);

        let newPindex = `${i - 1}`;
        // if(taskD)
        dispatch(
          updateTask({ id: taskD.id, updatedTask: { pindex: newPindex } })
        );
      }
    }
  };

  return (
    <div
      className={`${s ? "text-gray-300" : ""} flex items-center ${
        taskData.id === desTask?.id ? "bg-blue-50" : "hover:bg-gray-50"
      } rounded-lg w-full p-1 m-1 cursor-pointer h-[35px] border-b`}
    >
      <button onClick={changeStatus} className="rounded-md p-1">
        {s ? (
          <img
            src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_1280.png"
            alt="tick"
            className="w-[25px]"
          />
        ) : (
          `${
            taskData.p === "4-High"
              ? "🔴"
              : taskData.p === "3-Medium"
              ? "🟠"
              : taskData.p === "2-Low"
              ? "🟢"
              : "⚪️"
          }`
        )}
      </button>

      {/* Task Details Input */}
      <input
        onClick={setDesTask}
        className="flex-1 px-2 py-1 bg-transparent focus:outline-none border-transparent text-sm"
        value={details}
        onChange={onchangeDetails}
        placeholder="Task details..."
      />
      {overdue ? (<div className="text-rose-500 text-xs">overdue</div>) : ""}

      {/* Delete Button */}
      <button onClick={deleteTask} className="">
        <img
          src="https://pixsector.com/cache/6ecfa54e/avd0879fcbf810d38dc8e.png"
          alt="delete"
          className="w-[20px] bg-transparent"
        />
      </button>
    </div>
  );
};

export default Task;
