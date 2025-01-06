import { useEffect, useState } from "react";
import SideNav from "../sidenav";
// import styles from "../../../constants/styles";
import ProtectedRoute from "./ProtectedRoute";
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../../../firebase";
import Checkpoints from "../checkpoints";
// import Comments from "../comments";
import Modal from "../modal";
// import { ICheckPoint, IProject, IUserProject, deleteProject } from "../../../apis/projects";
// import { ITaskData, fetchTasks } from "../../../apis/tasks";
import { ToastContainer, toast } from "react-toastify";
// import { IUser } from "../../../apis/users";
import {
  deleteInstances,
  getAllInstances,
  // getInstancesByTask,
  ITaskInstanceData,
  // updateInstance,
  updateStatus,
} from "../../../apis/tasks/taskInstances";
import {
  ITaskInstanceData as IUserInstanceData,
  ITaskData as IUserTaskData,
} from "../../../apis/tasks";
// import { set } from "react-hook-form";
import Comments from "../comments";

//sort by checkpoints timestamps

// function sortTimestamps(a: ICheckPoint[], b: ICheckPoint[]) {
//   // console.log("A", a?.length, "B", b?.length);

//   return a?.length || b?.length ? (!a?.length ? -1 : !b?.length ? 1 : a?.slice(-1)[0].timeDate.seconds - b.slice(-1)[0].timeDate.seconds) : 0;
// }

const TaskInstances = () => {
  const [instances, setInstances] = useState<ITaskInstanceData[]>([]);
  const [userInstance, setUserInstance] = useState<IUserInstanceData>();
  const [state, setState] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  //   const userTasksCollection = collection(db, "userTasks");
  const onSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setState(e.target.value);
  };

  const onStatusChange = (status: string) => {
    if (!userInstance) return;
    updateStatus(userInstance.task.id, userInstance.id, status).then((res) => {
      if (res === false) {
        toast.error("Error updating status");
        return;
      }
      setUserInstance({ ...userInstance, status: status });
    });
  };

  const deleteUserInstance = async () => {
    if (!userInstance) return;
    setConfirmDelete(false);
    await toast.promise(
      deleteInstances(userInstance.task.id, [userInstance.id]),
      {
        pending: "Deleting project",
        success: "Project deleted successfully",
        error: "An error occurred. Contact Zine team",
      }
    );
    setUserInstance(undefined);
  };

  useEffect(() => {
    getAllInstances().then((instances) => {
      if (instances === undefined) {
        toast.error("Error fetching instances");
        return;
      }
      // const taskInstances: { [key: number]: ITaskInstanceData } = {};
      // instances.forEach((d) => {
      //   taskInstances[d.id] = d.data() as ITaskData;
      // });
      setInstances(instances);
    });
    //   .then((taskInstances) => {
    //     // console.log(taskInstances);
    //     getDocs(userTasksCollection).then((snapshots) => {
    //       snapshots.forEach(async (d) => {
    //         const userProject = d.data() as IUserProject;
    //         const puser = await getDoc(userProject.users[0]);
    //         const { name, email, type, uid } = puser.data() as IUser;
    //         const project = {
    //           ...userProject,
    //           usersData: [{ name, email, type, uid, roomids: [] }],
    //           taskData: taskInstances[userProject.task?.id],
    //           id: d.id,
    //           comments: userProject.comments,
    //           links: userProject.links,
    //         };

    //         setInstances((state) => [...state, project]);
    //         if (!project.task) // console.log(project.usersData[0].email, project.id);
    //       });
    //     });
    //   });
  }, []);

  return (
    <ProtectedRoute>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div
        className="grid grid-cols-12 h-screen"
        style={{ background: "#EFEFEF" }}
      >
        <SideNav />
        <div className="col-span-12 md:col-span-9 px-6 md:px-12 flex flex-col overflow-y-scroll">
          <h1 className="text-4xl font-bold mt-8" style={{ color: "#AAAAAA" }}>
            Projects
          </h1>

          {!userInstance && (
            <div className="my-8">
              <div className="flex flex-col">
                <label className="text-gray-500">Search</label>
                <input
                  id="search"
                  type="text"
                  className="text-lg p-2 bottom-border"
                  onChange={onSearchChange}
                  placeholder="Search email ID or name or project or status"
                  value={state}
                />
              </div>
              <div className="grid grid-cols-1 text-center md:grid-cols-3 gap-6 mt-2">
                {instances
                  .filter(
                    (p) =>
                      !state ||
                      p.name.toLowerCase().includes(state.toLowerCase()) ||
                      p.taskId.title
                        .toLowerCase()
                        .includes(state.toLowerCase()) ||
                      p.status.toLowerCase().includes(state.toLowerCase())
                  )
                  //   .sort((a, b) => sortTimestamps(b.checkpoints, a.checkpoints))
                  .map((p) => (
                    <div
                      key={p.taskInstanceId}
                      className="bg-white rounded-xl flex flex-col justify-center py-2 cursor-pointer"
                      onClick={() => {
                        let task: IUserTaskData = {
                          id: p.taskId.id,
                          createdDate: p.taskId.createdDate,
                          title: p.taskId.title,
                          subtitle: p.taskId.subtitle,
                          description: p.taskId.description,
                          dueDate: Number(p.taskId.dueDate.toString()),
                          psLink: p.taskId.psLink,
                          submissionLink: p.taskId.submissionLink,
                          type: p.taskId.type,
                          recruitment: p.taskId.recruitment,
                          visible: p.taskId.visible,
                        };
                        let data: IUserInstanceData = {
                          id: p.taskInstanceId,
                          type: p.type,
                          name: p.name,
                          status: p.status,
                          completionPercentage: p.completionPercentage,
                          task: task,
                          roomId: p.roomId.id,
                          roomName: p.roomId.name,
                        };
                        setUserInstance(data);
                      }}
                    >
                      <div
                        className="mt-4 p-3 text-white font-extrabold text-3xl"
                        style={{ background: "#0C72B0" }}
                      >
                        <p>{p.taskId?.title}</p>
                      </div>
                      <h3
                        className="mt-4 text-2xl font-bold"
                        style={{ color: "#95C5E2" }}
                      >
                        {p.name}
                      </h3>
                      {/* <p className="mt-1 mb-4 text-lg font-bold" style={styles.textGray}>
                        {p.usersData[0].email}
                      </p> */}
                      <div
                        className="my-4 p-2 text-white font-bold text-xl"
                        style={{ background: "#0C72B0" }}
                      >
                        <p>{p.status}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {userInstance && (
            <>
              <Checkpoints instanceData={userInstance} />
              <div className="flex justify-between text-white my-2 gap-2 text-sm md:text-normal">
                <button
                  className="bg-white text-gray-500 border hover:bg-gray-100 py-2 px-5 rounded-xl shadow-md"
                  onClick={() => setUserInstance(undefined)}
                >
                  Back
                </button>
                <button
                  className="bg-red-500 py-2 px-5 rounded-xl font-bold shadow-md"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete Project
                </button>
                <select
                  className="rounded-xl py-2 px-5 text-center font-bold shadow-md"
                  value={userInstance.status}
                  onChange={(e) => onStatusChange(e.target.value)}
                  style={{ background: "#0C72B0" }}
                >
                  <option>Assigned</option>
                  <option>Stage 1</option>
                  <option>Stage 2</option>
                  <option>Stage 3</option>
                  <option>Setup</option>
                  <option>In Review</option>
                  <option>Finished</option>
                </select>
              </div>
              <Comments instanceData={userInstance} />
            </>
          )}
        </div>
      </div>

      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <div className="p-4 md:p-5 text-center">
          <svg
            className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 className="mb-5 text-lg font-normal text-gray-500">
            Are you sure you want to delete this project?
          </h3>
          <button
            type="button"
            className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
            onClick={() => deleteUserInstance()}
          >
            Delete
          </button>
          <button
            type="button"
            className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border ml-2 border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900"
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </ProtectedRoute>
  );
};

export default TaskInstances;
