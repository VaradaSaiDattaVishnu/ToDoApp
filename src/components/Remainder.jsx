import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { sortPendingTasks, updateTask } from "../utils/TaskSlice";
import { Modal as BaseModal } from "@mui/base/Modal";
import { styled, css } from "@mui/system";

const Remainder = ({ taskData, toggleModal }) => {
  const dispatch = useDispatch();

  if (!taskData) {
    return null;
  }

  const { id, details, deadline} = taskData;


  const handleClose = () => {
    const updatedTask = {
      id,
      updatedTask: {
        s: false,
        overdue: true,
      },
    };
    dispatch(updateTask(updatedTask))
    toggleModal();
  };

  const updateStatus = () => {
    const updatedTask = {
      id,
      updatedTask: {
        s: true,
      },
    };
    dispatch(sortPendingTasks())
    dispatch(updateTask(updatedTask));
    toggleModal();
  };

  const updateRemainder = () => {
    const newDeadline = new Date(deadline).getTime() + 1000 * 60 * 10;
    const updatedTask = {
      id,
      updatedTask: {
        deadline: new Date(newDeadline),
      },
    };

    dispatch(updateTask(updatedTask));
    toggleModal();
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={true}
      onClose={handleClose}
      closeAfterTransition
    >
      <ModalContent sx={{ width: 400 }}>
        <div className=" bg-white rounded-lg p-4 shadow-lg">
          <div className="text-center">
           
             
              <button className="" onClick={handleClose}>❌</button>
           
            <div className="p-1 m-1">
              The following task - {details} is pending.
            </div>
            <div className="p-1 m-1">Have you completed the task?</div>

            <Button onClick={updateStatus} className="ml-2">
              Yes
            </Button>
            <Button onClick={updateRemainder}>Snooze</Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

export default Remainder;
