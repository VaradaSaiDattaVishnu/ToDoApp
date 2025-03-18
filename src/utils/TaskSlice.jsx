import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const taskSlice = createSlice({
  name: "task",
  initialState: {
    items: [],
  },

  reducers: {
    setTask: (state, action) => {
      state.items = [...action.payload];
    },

    addTask: (state, action) => {
      state.items.push(action.payload);
    },

    removeTask: (state, action) => {
      const pendingTasks = state.items.filter((task) => !task.s);
      const completedTasks = state.items.filter((task) => task.s);
      const pendingCount = pendingTasks.length;
      const completedCount = completedTasks.length;
      const id = action.payload;

      const task = state.items.find((task) => task.id === id);

      state.items = state.items.filter((task) => task.id !== action.payload);
      const deleteTaskIndb = async () => {
        await axios.post("http://localhost:3003/deleteTask", {
          id,
          tasksLength: task.s ? completedCount : pendingCount,
          s: task.s,
        });
      };
      deleteTaskIndb();
    },

    updateTask: (state, action) => {
      const { id, updatedTask } = action.payload;
      const existingTask = state.items.find((task) => task.id === id);
      if (existingTask) {
        Object.assign(existingTask, updatedTask);
      }

      try {
        const updateTaskIndb = async () => {
          await axios.post("http://localhost:3003/updateTask", {
            id,
            updatedTask,
          });
        };
        updateTaskIndb();
      } catch (er) {
        console.log(er);
      }
    },
    sortPendingTasks: (state) => {
      const pendingTasks = state.items.filter((item) => item.s === false);

      pendingTasks.sort((a, b) => {
        let num1 = Number(a.pindex);
        let num2 = Number(b.pindex);
        return num1 - num2;
      });

      state.items = [...pendingTasks,
        ...state.items.filter((item) => item.s !== false)
        
      ];


  
    },

    dndTasks: (state, action) => {
      const { startIndex, endIndex } = action.payload;
      const [removed] = state.items.splice(startIndex, 1);
      const { id, s } = removed;
      state.items.splice(endIndex, 0, removed);
      // console.log(s)

      const updateTasksInDb = async () => {
        await axios.post("http://localhost:3003/updateTasksInDb", {
          id,
          s,
          startIndex,
          endIndex,
        });
      };
      updateTasksInDb();
    },
  },
});

export const {
  addTask,
  removeTask,
  updateTask,
  setTask,
  sortPendingTasks,
  dndTasks,
} = taskSlice.actions;
export default taskSlice.reducer;
