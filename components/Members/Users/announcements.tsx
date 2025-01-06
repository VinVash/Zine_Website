import React, { useEffect, useState } from "react";
import Link from "next/link";
import SideNav from "../sidenav";
import ProtectedRoute from "./ProtectedRoute";
import styles from "../../../constants/styles";
import Image from "next/image";
import ZineBlog from "../../../images/admin/zineblog.png";
import { useAuth } from "../../../context/authContext";
// import { getRoom, fetchRoomsByUser } from "../../../apis/room";
import {
  checkHackathonRegistration,
  registerHackathon,
} from "../../../apis/users";
// import { Registration } from "../../Workshops";
// import { toast } from "react-toastify";
import Modal from "../modal";
// import { collection, getCountFromServer, query, where } from "firebase/firestore";
// import { db } from "../../../firebase";

interface ITimestamp {
  seconds: number;
  nanoseconds: number;
}

interface IMessageData {
  from: string;
  group: string;
  message: string;
  timeStamp: ITimestamp;
}

const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;

const timestampToHuman = (timeStamp: ITimestamp) => {
  const date = new Date(timeStamp.seconds * 1000);
  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    }),
  };
};

function RenderMessageWithLinks({ message }: { message: string }) {
  return (
    <div className="whitespace-pre-wrap break-words mt-4">
      {message.split("\n").map((line, index) => (
        <React.Fragment key={index}>
          {line.split(/\s+/g).map((word, wordIndex) =>
            word.match(URL_REGEX) ? (
              <a
                key={wordIndex}
                href={word}
                className="text-blue-500 underline"
                target="_blank"
              >
                {word}{" "}
              </a>
            ) : (
              <React.Fragment key={wordIndex}>{word} </React.Fragment>
            )
          )}
          <br />
        </React.Fragment>
      ))}
    </div>
  );
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<IMessageData[]>([]);
  const { authUser } = useAuth();
  const [isRegistered, setIsRegistered] = useState<boolean>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const date = new Date();
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const dayOfMonth = date.getDate();
  const suffixes = ["th", "st", "nd", "rd"];
  let suffix = "th";

  if (dayOfMonth >= 11 && dayOfMonth <= 13) {
    // For 11, 12, and 13, always use 'th' suffix
    suffix = "th";
  } else {
    // For other numbers, use the corresponding suffix
    const lastDigit = dayOfMonth % 10;
    suffix = suffixes[lastDigit] || "th";
  }

  useEffect(() => {
    //   registerHackathon().then((res) => {
    //     console.log("ann", res);
    // }) .catch((err) => {
    //   console.log("ann err", err);

    // })
    checkHackathonRegistration()
      .then((res) => {
        console.log("ann", res);
        if (res.status === "registered") setIsRegistered(true);
        else setIsRegistered(false);
      })
      .catch((err) => {
        console.log("ann err", err);
      });
  }, []);

  const _registerHackathon = async () => {
    try {
      registerHackathon().then((res) => {
        console.log("ann", res);
        if (res === true) setIsRegistered(true);
        else setIsRegistered(false);
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <ProtectedRoute>
      <div
        className="flex flex-col md:grid grid-cols-12 h-screen"
        style={{ background: "#EFEFEF" }}
      >
        <SideNav />

        <div className="md:col-span-9 px-4 md:px-12 flex flex-col overflow-y-scroll">
          <h1
            className="text-2xl md:text-4xl font-bold mt-14 md:mt-8"
            style={{ color: "#AAAAAA" }}
          >
            Dashboard
          </h1>
          <div className="grid grid-cols-9 my-4 gap-8">
            <div className="hidden md:flex flex-col col-span-3 row-span-4 bg-white rounded-3xl py-4 px-16 justify-center shadow-md">
              <h5
                className="text-xl text-right font-bold"
                style={styles.textPrimary}
              >
                {suffix}
              </h5>
              <h1
                className="text-7xl text-center font-extrabold"
                style={styles.textPrimary}
              >
                {date.getDate()}
              </h1>
              <h3
                className="text-3xl text-center mt-4 font-bold"
                style={styles.textNormal}
              >
                {months[date.getMonth()]}
              </h3>
            </div>

            <Link href="/blogs">
              <div className="hidden md:flex col-span-3 row-span-4 bg-white py-3 rounded-3xl items-center border-transparent border-2 hover:border-blue-400 cursor-pointer shadow-md">
                <Image src={ZineBlog} />
              </div>
            </Link>
            {isRegistered ? (
              <div
                className="flex flex-col col-span-9 md:col-span-3 row-span-4 rounded-3xl px-8 py-8 shadow-xl"
                style={{
                  background: "linear-gradient(to right, #003D63, #0C72B0)",
                }}
              >
                <div className="mt-24">
                  <h1 className="text-2xl text-white font-extrabold">
                    {authUser!.email?.split("@")[0].toUpperCase()}
                  </h1>
                  <h3 className="text-lg text-white">{authUser!.name} </h3>
                  <br />
                  <p className="text-lg text-white">Registered for Tank-Wars</p>
                </div>
              </div>
            ) : (
              // <Link href="/aptitudeForm">
              <div
                className="flex flex-col col-span-9 md:col-span-3 row-span-4 rounded-3xl px-8 py-8 hover:border-blue-400 cursor-pointer shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #9B9C9C 0%, #D4D4D4 100%)",
                }}
              >
                <div className="mt-24">
                  <h1 className="text-2xl text-white font-extrabold">
                    {authUser!.email?.split("@")[0].toUpperCase()}
                  </h1>
                  <h3 className="text-lg text-white">{authUser!.name} </h3>
                  <br />
                  <p className="text-lg text-white">
                    Not Registered for Tank-Wars
                  </p>
                </div>
                <button
                  className="mt-4 bg-blue2 text-white py-2 px-4 rounded-xl hover:bg-blue1"
                  onClick={() => setIsOpen(true)}
                >
                  Register
                </button>
              </div>
              // </Link>
            )}
          </div>

          {/* <h1 className="text-2xl md:text-4xl font-bold mt-8" style={{ color: "#AAAAAA" }}>
            Announcements
          </h1>
          <div className="flex flex-col my-4 gap-4">
            {announcements.map((msg) => {
              const date = timestampToHuman(msg.timeStamp);
              return (
                <div className="bg-white rounded-xl py-4 px-6 w-full shadow-md" key={msg.timeStamp.seconds}>
                  <p className="text-gray-500 text-sm">
                    {msg.from} | {date.time} {date.date}
                  </p>
                  //{" "}
                  <p className="whitespace-pre-wrap">
                    //{" "}
                    {msg.message.split(/\s+/g).map((word) =>
                      word.match(URL_REGEX) ? (
                        <>
                          <a href={word} className="text-blue-500 underline" target="_blank">
                            {word}
                          </a>{" "}
                        </>
                      ) : (
                        word + " "
                      )
                    )}
                    //{" "}
                  </p>
                  <RenderMessageWithLinks message={msg.message}></RenderMessageWithLinks>
                </div>
              );
            })}
          </div> */}
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
                Do you wish to register for Tank-Wars?
              </h3>
              <button
                type="button"
                className="text-white bg-blue2 hover:bg-blue1 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                onClick={() => {
                  _registerHackathon().then(() => {
                    setIsOpen(false);
                  });
                }}
              >
                Yes
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Announcements;
