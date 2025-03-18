import { updateTask } from "../utils/TaskSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { useState, useEffect, useRef } from "react";

const TaskDes = ({ taskData }) => {
  const tasks = useSelector((store) => store.task.items);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (priority) => {
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {

    //   return;

    // }
    dispatch(updateTask({ id, updatedTask: { p: priority } }));

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

  if (tasks.length === 0 || !taskData) {
    return (
      <div className="h-screen p-1 m-1 text-xs flex items-center justify-center">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/007/145/308/small/customizable-hand-drawn-icon-of-task-available-for-premium-use-vector.jpg"
          className=" justify-center items-center w-[100px]"
          alt="task "
        />
        <div className="">
          No task selected. Click on the task to view details.
        </div>
      </div>
    );
  }

  const task = tasks.find((task) => task.id === taskData.id);

  if (!task) {
    return (
      <div className="h-screen flex p-1 m-1  text-xs items-center justify-center">
        <div className="">
          No task selected. Click on the task to view details.
        </div>
      </div>
    );
  }

  const { id } = taskData;

  const addDes = (event) => {
    const des = event.target.value;
    dispatch(updateTask({ id, updatedTask: { des } }));
  };

  const setTaskDeadline = (newValue) => {
    let deadline = newValue.$d.toString();
    if(new Date(newValue.$d.toString()).getTime() + 1000*60*60*24 > Date.now())
      {
        dispatch(updateTask({ id, updatedTask: { deadline, overdue: false } }));
      }
   else {
    alert('enter correct deadline')
   }
  };

  const changeStatus = () => {
    const newStatus = !task.s;
    dispatch(updateTask({ id, updatedTask: { s: newStatus } }));
  };

  return (
    <div className="w-[400px]">
      <div className="flex border-b py-2 px-3">
        <button onClick={changeStatus} className="p-1 rounded-md ">
          {task.s ? (
            <img
              className="w-[30px]"
              src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_1280.png"
              alt="tick"
            />
          ) : task.p === "4-High" ? (
            "🔴"
          ) : task.p === "3-Medium" ? (
            "🟠"
          ) : task.p === "2-Low" ? (
            "🟢"
          ) : (
            "⚪️"
          )}
        </button>

        <div className="flex-1"></div>
        <div>
          <Stack direction="row" spacing={2}>
            <div>
              <Button
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <img
                  src="https://png.pngtree.com/png-vector/20190307/ourmid/pngtree-vector-flag-icon-png-image_762945.jpg"
                  alt="flag"
                  className="w-[20px]"
                />
              </Button>
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
                        >
                          <MenuItem
                            onClick={() => {
                              handleClose("4-High");
                            }}
                          >
                            <button>🔴</button>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleClose("3-Medium");
                            }}
                          >
                            <button>🟠</button>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleClose("2-Low");
                            }}
                          >
                            <button>🟢</button>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleClose("1-None");
                            }}
                          >
                            <button>⚪️</button>
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
      <div className="h-screen flex flex-col">
        <div className="p-4 bg-white border-b border-gray-200">
          <h2 className=" font-semibold">{task.details}</h2>
          <p className={`text-gray-500 text-xs ${taskData.overdue ? 'text-red-400': ''} `}>{task.deadline.toString()}</p>
        </div>

        <div className="p-4  border-b border-gray-200">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="rounded-2xl"
              label="Controlled picker"
              onChange={(newValue) => setTaskDeadline(newValue)}
            />
          </LocalizationProvider>
        </div>

        <div className="flex-1 p-4 text-xs bg-white overflow-y-auto">
          <textarea
            className="w-full h-full border border-transparent rounded-lg focus:outline-none"
            value={task?.des ? task?.des : ""}
            onChange={addDes}
            placeholder="Add description..."
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDes;
