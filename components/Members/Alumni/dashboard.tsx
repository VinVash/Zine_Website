import React, { useEffect, useState } from "react";
import SideNav from "../sidenav";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
// import {
//   collection,
//   doc,
//   getCountFromServer,
//   getDocs,
//   orderBy,
//   query,
// } from "firebase/firestore";
// import { db } from "../../../firebase";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../constants/styles";

const Donate = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [recruitment, setRecruitment] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<number>();
  const [tasks, setTasks] = useState<number>();
  const [users, setUsers] = useState<number>();

  useEffect(() => {
    const getEvents = async () => {
      try {
        // const q = query(collection(db, "events"), orderBy("timeDate"));
        // const data = await getDocs(q);
        // const regCount = await getCountFromServer(
        //   collection(db, "registrations")
        // );
        // const tasksCount = await getCountFromServer(collection(db, "tasks"));
        // const userCount = await getCountFromServer(collection(db, "users"));
        // setEvents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        // setRegistrations(regCount.data().count);
        // setTasks(tasksCount.data().count);
        // setUsers(userCount.data().count);
        //// console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id})))
      } catch (error) {
        // console.log("error fetching events", error)
      }
    };
    getEvents();
  }, []);

  useEffect(() => {
    var w: any = [];
    var r: any = [];
    events.forEach((e) => {
      if (e.stage == 2 && !e.isHeading) {
        w.push(e);
        // console.log("pushing")
      }
      if (e.isHeading === true) {
        r.push(e);
      }
      // console.log(w)
      // console.log(r)
      setWorkshops(w);
      setRecruitment(r);
    });
  }, [events]);
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
        className="flex flex-col md:grid grid-cols-12 h-auto min-h-screen"
        style={{ background: "#EFEFEF" }}
      >
        <SideNav />
        <div className="col-span-9 px-12 flex-1 flex-col">
          <h1 className="text-4xl font-bold mt-8" style={{ color: "#AAAAAA" }}>
            Alumni
          </h1>
          <div className="flex flex-col md:flex-row grid-cols-6 bg-white rounded-xl my-3 w-full shadow-md">
            <div className=" w-full md:w-1/6 rounded-t-xl md:rounded-t-none md:rounded-l-xl flex flex-col justify-center bg-blue2 p-2">
              <h1 className="text-3xl md:text-5xl text-center text-white font-extrabold p-1">
                {recruitment.length}
              </h1>
              <h5 className="text-xl text-center font-bold mt-2 p-1 text-white">
                Stages
              </h5>
            </div>
            <div className=" bg-white md:w-5/6 rounded-b-xl md:rounded-r-xl">
              <div>
                <h1 className="text-xl text-center md:text-right text-blue2 pr-5 pt-2 font-bold">
                  Recruitment '23
                </h1>
              </div>
              <div
                className={`grid grid-cols-${
                  recruitment.length > 3 ? 3 : recruitment.length
                } md:grid-cols-${
                  recruitment.length > 8 ? 8 : recruitment.length
                } flex flex-wrap flex-row justify-evenly p-2 mx-auto my-1`}
              >
                {recruitment.map((element) => {
                  return (
                    <div className=" col-span-1 flex-col p-2 ">
                      <div className="col-span-1 h-12 w-12 rounded-xl bg-blue2 p-1 mx-auto">
                        <Image
                          src={element.image}
                          className=""
                          width={50}
                          height={50}
                          alt="missing"
                        ></Image>
                      </div>
                      <h1 className="text-center font-bold text-sm text-blue2">
                        {element.name}
                      </h1>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row grid-cols-6 bg-white rounded-xl my-3 w-full shadow-md">
            <div className=" bg-white w-full md:w-5/6 rounded-b-xl md:rounded-l-xl">
              <div>
                <h1 className="text-xl text-center md:text-left text-blue2 pl-5 pt-2 font-bold">
                  Workshops '23
                </h1>
              </div>
              <div
                className={`grid grid-cols-${
                  workshops.length > 3 ? 3 : workshops.length
                } md:grid-cols-${
                  workshops.length > 8 ? 8 : workshops.length
                } flex flex-wrap flex-row justify-evenly p-2 mx-auto my-1`}
              >
                {workshops.map((element) => {
                  return (
                    <div className=" flex-col col-span-1 p-2 ">
                      <div className="col-span-1 h-12 w-12 rounded-xl bg-blue2 mx-auto p-1">
                        <Image
                          src={element.image}
                          width={50}
                          height={50}
                          alt="missing"
                        />
                      </div>
                      <h1 className="text-center font-bold text-sm text-blue2">
                        {element.name}
                      </h1>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-span-1 w-full md:w-1/6 rounded-t-xl md:rounded-t-none md:rounded-r-xl flex flex-col justify-center p-2 bg-blue2">
              <h1 className="text-3xl md:text-5xl text-center font-extrabold p-1 text-white">
                {registrations}
              </h1>{" "}
              {/* to be updated to reflect all events later*/}
              <h5 className="text-xl text-center font-bold mt-2 p-1 text-white">
                Registered
              </h5>
            </div>
          </div>
          <div className="grid grid-cols-6 md:grid-cols-9 grid-rows-10 gap-4 md:gap-8 flex-1 mb-3">
            <div className="col-span-3 row-span-4 bg-white shadow-md cursor-pointer rounded-xl py-4 border-transparent border-2 hover:border-blue-400 flex flex-col justify-center ">
              <h1
                className="text-3xl md:text-7xl text-center font-extrabold"
                style={styles.textPrimary}
              >
                {workshops.length}
              </h1>{" "}
              {/* to be updated to reflect all events later*/}
              <div className="text-center mt-4">
                <FontAwesomeIcon
                  icon={faCalendar}
                  size="2x"
                  style={styles.textSecondary}
                />
              </div>
              <h5
                className="text-2xl text-center font-bold mt-2"
                style={styles.textSecondary}
              >
                Events
              </h5>
            </div>
            <div className="col-span-3 row-span-4 bg-white shadow-md cursor-pointer rounded-xl py-4 border-transparent border-2 hover:border-blue-400 flex flex-col justify-center ">
              <h1
                className="text-3xl md:text-7xl text-center font-extrabold"
                style={styles.textPrimary}
              >
                {tasks}
              </h1>{" "}
              {/* to be updated to reflect all events later*/}
              <div className="text-center mt-4">
                <FontAwesomeIcon
                  icon={faCalendar}
                  size="2x"
                  style={styles.textSecondary}
                />
              </div>
              <h5
                className="text-2xl text-center font-bold mt-2"
                style={styles.textSecondary}
              >
                Tasks
              </h5>
            </div>
            <div className="col-span-3 row-span-4 bg-white shadow-md cursor-pointer rounded-xl py-4 border-transparent border-2 hover:border-blue-400 flex flex-col justify-center ">
              <h1
                className="text-3xl md:text-7xl text-center font-extrabold"
                style={styles.textPrimary}
              >
                {users}
              </h1>{" "}
              {/* to be updated to reflect all events later*/}
              <div className="text-center mt-4">
                <FontAwesomeIcon
                  icon={faCalendar}
                  size="2x"
                  style={styles.textSecondary}
                />
              </div>
              <h5
                className="text-2xl text-center font-bold mt-2"
                style={styles.textSecondary}
              >
                Users
              </h5>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Donate;
