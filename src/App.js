import "./App.css";
import SideBar from "./components/SideBar";
import store from "./utils/Store";
import { Provider, useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./components/Main";
import { Outlet } from "react-router-dom";
import Today from "./components/today";
import Next7days from "./components/Next7days";
import Completed from "./components/Completed";
import TaskDes from "./components/TaskDes";

const HomePage = () => {
  const desTask = useSelector((store) => store.des.desTask);
  const toggle = useSelector((store) => store.header.isToggle);

  // Update state with the new items orde

  return (
    <div className="flex h-screen overflow-hidden">
      {toggle && (
        <div className=" w-[200px] border solid">
          <SideBar />
        </div>
      )}

      <div className="flex-auto p-5 border solid overflow-y-auto">
        <Outlet />
      </div>

      <div className="w-4/9   overflow-y-auto">
        <TaskDes taskData={desTask} />
      </div>
    </div>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "/mainbar",
        element: <Main />,
      },
      {
        path: "/today",
        element: <Today />,
      },
      {
        path: "/next7days",
        element: <Next7days />,
      },
      {
        path: "/completed",
        element: <Completed />,
      },
    ],
  },

  {},
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
