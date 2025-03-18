import { setToggle } from "../utils/ToggleSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  addTask,
  dndTasks,
  setTask,
  sortPendingTasks,
} from "../utils/TaskSlice";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Remainder from "./Remainder";
import { useEffect } from "react";
import axios from "axios";
import Task from "./Task";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { increaseCount, setPendingCount } from "../utils/CountSlice";



const Main = () => {

  const API_BASE_URL = "https://todoappserver-ten.vercel.app";

  const [vis, setvis] = useState(false)
  const [priority, setPriority] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);
  const [taskDeadline, setTaskDeadline] = useState(null);
  const [remainderTasks, setRemaindertasks] = useState(null);
  const [redSelected, setRedSelected] = useState(false);
  const [greenSelected, setGreenSelected] = useState(false);
  const [whiteSelected, setWhiteSelected] = useState(false);
  const [yellowSelected, setYellowSelected] = useState(false);
  let tasks = useSelector((store) => store.task.items);
  const [modalOpen, setModalOpen] = useState(false);
  let pindex = useSelector((store) => store.count.pendingCount);
  const dispatch = useDispatch();
  let pendingTasks = [];
  let completedTasks = [];
  const [compT, setCompT] = useState(true);
  const [penT, setPenT] = useState(true);
  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState(false);
  const anchorRef = useRef(null);


  const handleToggle2 = () => {
    setOpen((prevOpen) => !prevOpen);
  };


  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };


  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }


  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const fetchData = async () => {

    const response = await axios.post(`${API_BASE_URL}/getTasks`, {
      hello: "hi iam posting to server",
    });

    response.data.forEach((task) => {
      task.deadline = (new Date(task.deadline)).toString();
    });

    dispatch(setTask(response.data));
    dispatch(sortPendingTasks());
    setFlag(true);
   
  };

  useEffect(() => {

    fetchData();
  }, []);


  const handleDragEnd = (result) => {
   
    if (result?.destination?.index !== undefined)
      dispatch(
        dndTasks({
          startIndex: result.source.index,
          endIndex: result.destination.index,
        })
      );
    //dispatch(sortTasks())
  };


  let taskId = Math.trunc(Math.random() * 10000);

  useEffect(() => {
    const interval = setInterval(() => {
      const filteredTasks = tasks.filter(
        (task) => new Date(task.deadline).getTime() < Date.now() && !task.s && (!task.overdue)
      );
      setRemaindertasks(filteredTasks);

      if (filteredTasks.length > 0) {
        setModalOpen(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [tasks]);


  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };


  const handleToggle = () => {
    dispatch(setToggle());
  };
  // console.log(tasks)


  dispatch(setPendingCount(tasks.filter((task) => !task.s).length));


  const handleAddTask = (
    taskId,
    taskDetails,
    taskDeadline,
    priority,
    status,
    description,
    pindex,
    overdue
  ) => {
    dispatch(
      addTask({
        id: taskId,
        details: taskDetails,
        deadline: taskDeadline,
        p: priority,
        s: status,
        des: description,
        pindex: pindex,
        overdue: overdue
      })
    );

    dispatch(increaseCount("pending"));

  };



  pendingTasks = tasks.filter((task) => task.s === false);

  completedTasks = tasks.filter((task) => task.s === true);

  return (
    flag && (
      <div className=" rounded-2xl w-full h-full">
        <div className="flex ">
          <img
            onClick={handleToggle}
            className="w-10"
            src="https://static.thenounproject.com/png/4659785-200.png"
            alt="sidebar"
          />
          <div className="p-2 m-2">👋🏻Welcome</div>
        </div>

        <div>
          <div className="relative ">
            <div className=" cursor-pointer">
              <input
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    if (
                      taskDetails &&
                      taskDeadline &&
                      priority &&
                      new Date(taskDeadline).getTime() > Date.now()
                    ) {
                       await axios.post(
                        `${API_BASE_URL}/saveTask`,
                        {
                          details: taskDetails,
                          deadline: taskDeadline.$d.toString(),
                          p: priority,
                          id: taskId,
                          s: false,
                          des: "description-",
                          pindex: `${pindex}`,
                          overdue: false
                        }
                      );

                      handleAddTask(
                        taskId,
                        taskDetails,
                        taskDeadline.$d.toString(),
                        priority,
                        false,
                        "description-",
                        `${pindex}`,
                        false
                      );
                    } else {
                      if (new Date(taskDeadline).getTime() < Date.now())
                        alert("enter valid deadline");
                      else alert("enter all details");
                    }
                  }
                }}
                className=" rounded-lg w-full p-1 m-1 bg-gray-50 relative focus:outline-blue-300 h-[40px]"
                placeholder={priority ? priority : "+ Add Task"}
                onChange={(e) => {
                  setTaskDetails(e.target.value);
                }}
              ></input>
            </div>

            <div className="">
              <Stack direction="row" spacing={2}>
                <div>
                  <button
                    ref={anchorRef}
                    className="absolute top-0 right-0 bg-transparent px-2 py-1"
                    id="composition-button"
                    aria-controls={open ? "composition-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle2}
                  >
                    ⌄
                  </button>
                  <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement="bottom-start"
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === "bottom-start"
                              ? "left top"
                              : "left bottom",
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList
                              autoFocusItem={open}
                              id="composition-menu"
                              aria-labelledby="composition-button"
                              onKeyDown={handleListKeyDown}
                              className='cursor-pointer'
                            >
                              <MenuItem>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DateTimePicker
                                    className="rounded-2xl"
                                    label="Controlled picker"
                                    onChange={(newValue) =>
                                      setTaskDeadline(newValue)
                                    }
                                  />
                                </LocalizationProvider>
                              </MenuItem>
                              <MenuItem>
                                <button
                                  className={`p-3 ${
                                    redSelected ? "bg-slate-200" : "bg-white"
                                  } hover:bg-slate-50`}
                                  onClick={() => {
                                    setPriority("4-High");
                                    setRedSelected(true);
                                    setYellowSelected(false);
                                    setGreenSelected(false);
                                    setWhiteSelected(false);
                                  }}
                                >
                                  🔴
                                </button>
                                <button
                                  className={`p-3  ${
                                    yellowSelected ? "bg-slate-200" : "bg-white"
                                  } hover:bg-slate-50`}
                                  onClick={() => {
                                    setPriority("3-Medium");
                                    setRedSelected(false);
                                    setYellowSelected(true);
                                    setGreenSelected(false);
                                    setWhiteSelected(false);
                                  }}
                                >
                                  🟠
                                </button>
                                <button
                                  className={`p-3 ${
                                    greenSelected ? "bg-slate-200" : "bg-white"
                                  } hover:bg-slate-50`}
                                  onClick={() => {
                                    setPriority("2-Low");
                                    setRedSelected(false);
                                    setYellowSelected(false);
                                    setGreenSelected(true);
                                    setWhiteSelected(false);
                                  }}
                                >
                                  🟢
                                </button>
                                <button
                                  className={`p-3 ${
                                    whiteSelected ? "bg-slate-200" : "bg-white"
                                  } hover:bg-slate-50`}
                                  onClick={() => {
                                    setPriority("1-None");
                                    setRedSelected(false);
                                    setYellowSelected(false);
                                    setGreenSelected(false);
                                    setWhiteSelected(true);
                                  }}
                                >
                                  ⚪️
                                </button>
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
              </Stack>
            </div>
          </div>
        </div>

        {modalOpen && remainderTasks && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <Remainder
                taskData={
                  remainderTasks && remainderTasks.length > 0
                    ? remainderTasks[0]
                    : null
                }
                toggleModal={toggleModal}
              />
            </div>
          </div>
        )}

        <div>
          <div className="text-gray-500 text-sm p-3 align-middle m-2 flex">
            <button
              onClick={() => {
                setPenT(!penT);
              }}
              className="cursor-pointer"
            >
              {/* {penT ? '⌄' : '˲'}
               */}
              {penT ? <img
                className="w-[20px]  "
                src="https://static.thenounproject.com/png/3318744-200.png"
                alt="acc"
              /> : <img
              className="w-[20px]  "
              src="https://www.clipartmax.com/png/middle/319-3199123_left-wing-alone-unfold-alone-animal-icon-side-arrow-icon.png"
              alt="acc"
            />}
            </button>
            <div>Pending</div>
          </div>
          {/* {penT && pendingTasks.length
            ? pendingTasks.map((task) => <Task taskData={task} />)
            : ""} */}

          {pendingTasks.length === 0 ? (<div className="text-xs text-gray-300 pl-6">No pending tasks</div>) : penT && pendingTasks.length && (
            <div className="App">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppablePending">
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className=""
                    >
                      {pendingTasks.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={`${item.id}`}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className=""
                            >
                              

                              
                                <div className=" flex" onMouseLeave={() => {setvis(false)}} onMouseOver={() => {setvis(true)}}>
                                 {vis && <img
                                 {...provided.dragHandleProps}
                                 src="https://www.svgrepo.com/show/459043/drag-handle.svg"
                                 alt="drag"
                                 className="w-[20px]"
                               />}
                                <Task className='w-full' key={item.id} taskData={item} />
                                </div>
                           
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </div>

        <div>
          <div className="text-gray-500 text-sm p-3 align-middle m-2 flex">
            <button
              onClick={() => {
                setCompT(!compT);
              }}
              className="cursor-pointer"
            >
              {/* {compT ?'⌄' : '˲' } */}
              {compT ? <img
                className="w-[20px]  "
                src="https://static.thenounproject.com/png/3318744-200.png"
                alt="acc"
              /> : <img
              className="w-[20px]  "
              src="https://www.clipartmax.com/png/middle/319-3199123_left-wing-alone-unfold-alone-animal-icon-side-arrow-icon.png"
              alt="acc"
            />}
            </button>
            <div>Completed</div>
          </div>

          {compT && completedTasks.length
            ? completedTasks.map((task) => (
                <Task key={task.id} taskData={task} />
              ))
            : ""}
        </div>
      </div>
    )
  );
};

export default Main;