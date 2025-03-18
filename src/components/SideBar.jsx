import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SideBar = () => {
  const toggle = useSelector((store) => store.header.isToggle);
  const tasks = useSelector((store) => store.task.items);
  const [clicked, setClicked] = useState('all Tasks')
  const completedTasks = tasks.filter((task) => task.s);
  const today = new Date();

  const seventhDay = new Date(today);
  seventhDay.setDate(seventhDay.getDate() + 7);

  seventhDay.setHours(23);
  seventhDay.setMinutes(59);
  seventhDay.setSeconds(59);
  seventhDay.setMilliseconds(999);

  let seventhDayMs = new Date(seventhDay).getTime();

  // if (tasks.length === 0) return null;

  let seventhdayTasks = tasks.filter(
    (task) => seventhDayMs - new Date(task.deadline).getTime() > 0
  );

  today.setHours(23);
  today.setMinutes(59);
  today.setSeconds(59);
  today.setMilliseconds(999);

  let todayMs = new Date(today).getTime();

  let todayTasks = tasks.filter(
    (task) => todayMs - new Date(task.deadline).getTime() > 0
  );

  if (!toggle) return null;

  return (
    <div className="h-full">
      <div className="p-2">
        <Link to="/mainbar">
          <button onClick={() => {setClicked('all Tasks')}} className={`${clicked === 'all Tasks' ? 'bg-blue-100' : ''}  w-full px-2 py-3 rounded-md text-sm font-light text-s flex hover:bg-gray-200 text-gray-800 text-left`}>
            <img
              src="https://icons.veryicon.com/png/o/education-technology/guangzhou-baiyun-district-ecological/icon_-supervision-task-information-query.png"
              className="w-[20px]"
              alt="task"
            />
          All Tasks <div className="flex-1"></div><div className="text-gray-400">{`${tasks.length}`}</div>
          </button>
        </Link>
      </div>

      <div className="p-2">
        <Link to="/today">
          <button onClick={() => {setClicked('Today')}} className={`${clicked === 'Today' ? 'bg-blue-100' : ''} w-full px-2 py-3 rounded-md text-sm font-light text-s flex hover:bg-gray-200 text-gray-800 text-left`}>
            <img
              src="https://banner2.cleanpng.com/20190611/qki/kisspng-portable-network-graphics-computer-icons-clip-art-calendar-icon-best-wallpapers-5cff74a5dfe373.3505111715602454139171.jpg"
              alt="cla"
              className="w-[20px]"
            />
            Today <div className="flex-1"></div><div className="text-gray-400">{`${todayTasks.length}`}</div>
          </button>
        </Link>
      </div>

      <div className="p-2">
        <Link to="/next7days">
          <button onClick={() => {setClicked('Next')}} className={`${clicked === 'Next' ? 'bg-blue-100' : ''} w-full px-2 py-3 rounded-md text-sm font-light text-s flex hover:bg-gray-200 text-gray-800 text-left`}>
            <img
              src="https://cdn-icons-png.flaticon.com/256/2370/2370264.png"
              alt="calen"
              className="w-[20px]"
            />
            Next 7 Days <div className="flex-1"></div><div className="text-gray-400">{`${seventhdayTasks.length}`}</div>
          </button>
        </Link>
      </div>

      <div className="p-2">
        <Link to="/completed">
          <button onClick={() => {setClicked('Completed')}} className={`${clicked === 'Completed' ? 'bg-blue-100' : ''}   w-full px-2 py-3 rounded-md text-sm font-light text-s flex hover:bg-gray-200 text-gray-800 text-left`}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/8224/8224585.png"
              alt="com"
              className="w-[20px]"
            />
            Completed <div className="flex-1"></div><div className="text-gray-400">{`${completedTasks.length}`}</div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
