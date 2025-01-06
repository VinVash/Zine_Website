import styles from "../../constants/styles";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  ICheckpointData,
  ILinkData,
  ITaskInstanceData,
  fetchCheckpoints,
  fetchLinks,
  addCheckpoint,
  addLink,
  ILinkCreateData,
  ICheckpointCreateData,
} from "../../apis/tasks";
import {
  IMessageData,
  fetchRoomMessages,
  sendMessage,
  updateLastSeen,
} from "../../apis/room";
import SockJS from "sockjs-client";
import { Stomp, Client } from "@stomp/stompjs";
// import { auth } from "../../firebase";

const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;

const Checkpoints = ({ instanceData }: { instanceData: ITaskInstanceData }) => {
  const { authUser } = useAuth();
  const [checkpointMessage, setCheckpointMessage] = useState("");
  const [panel, setPanel] = useState("checkpoints");
  const [messages, setMessages] = useState<IMessageData[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const [url, setURL] = useState("");
  const [urlType, setURLType] = useState("GitHub");

  const [checkpoints, setCheckpoints] = useState<ICheckpointData[]>([]);
  const [links, setLinks] = useState<ILinkData[]>([]);

  const [stompClient, setStompClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  //   const roomName = `${projectData.taskData.title.split(" ")[0]}-${project.usersData[0].email.slice(4).split("@")[0]}`;
  useEffect(() => {
    connect();
    displayRoomMessages(instanceData.roomId);
    fetchCheckpoints(instanceData.id).then((res) => {
      setCheckpoints(res);
    });
    fetchLinks(instanceData.id).then((res) => {
      setLinks(res);
    });
  }, []);

  useEffect(() => {
    let subscription: any;
    if (isConnected && stompClient !== null) {
      subscription = stompClient.subscribe(
        "/room/" + instanceData.roomId,
        (msg: any) => {
          let body = JSON.parse(msg.body) as IMessageData;
          setMessages((prev) => [...prev, body]);
          if (authUser) updateLastSeen(authUser?.email, instanceData.roomId);
        }
      );
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isConnected]);

  useEffect(() => {
    // console.log("tasks",checkpoints, links, messages);
  }, [checkpoints, links]);

  const onSubmit = () => {
    if (!inputMessage) return;
    const msgBody = {
      type: "text",
      content: inputMessage,
      sentFrom: authUser?.id,
      roomId: instanceData.roomId,
      replyTo: null,
      contentUrl: null,
    };
    if (msgBody.sentFrom) {
      stompClient.publish({
        destination: "/app/message",
        headers: {},
        body: JSON.stringify(msgBody),
      });
    }
    setInputMessage("");
  };

  const displayRoomMessages = (id: number) => {
    fetchRoomMessages(id).then((res) => {
      // console.log("messages",res);
      // setMessages(res);
    });
  };

  const connect = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const client = new Client({
        webSocketFactory: () =>
          new SockJS(process.env.NEXT_PUBLIC_API_URL + "/ws", null, {
            withCredentionals: false,
          }),
        connectHeaders: { Authorization: `Bearer ${token}` },
        debug: (str: any) => {
          // console.log(str);
        },
        onConnect: (msg: any) => {
          // console.log(msg)
          setIsConnected(true);
        },
        onStompError: (err: any) => {
          // console.log(err);
        },
        reconnectDelay: 10000,
      });
      client.activate();
      setStompClient(client);
    }
  };

  const handleAddCheckpoint = () => {
    let data: ICheckpointCreateData = {
      remark: authUser?.type == "admin",
      content: checkpointMessage,
      sentFromId: authUser?.id as number,
    };
    addCheckpoint(instanceData.id, data).then((res) => {
      if (res) setCheckpoints((prev) => [...prev, res]);
    });
    setCheckpointMessage("");
  };

  const handleAddLink = () => {
    if (!authUser) return;
    let data: ILinkCreateData = {
      type: urlType,
      link: url,
      sentFromId: authUser?.id,
    };
    // console.log("link",data);

    addLink(instanceData.id, data).then((res) => {
      if (res) setLinks((prev) => [...prev, res]);
    });
    setURL("");
  };

  const monthDay = (timestamp: number) => {
    let dataObj = new Date(timestamp);
    return dataObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };
  const hourMinute = (timestamp: number) => {
    let dataObj = new Date(timestamp);
    return dataObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="">
      <h2 className="text-3xl font-bold my-2" style={styles.textPrimary}>
        {instanceData?.task.title}
      </h2>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
        <h2 className="text-2xl font-bold" style={styles.textPrimary}>
          {instanceData?.name}
        </h2>
        <div className="flex gap-2 justify-between md:justify-start">
          <a
            className="text-white rounded-xl px-3 py-2 font-bold text-center cursor-pointer shadow-md"
            style={{ background: "#0C72B0" }}
            href={
              instanceData.task.psLink ? "//" + instanceData.task.psLink : ""
            }
            target="_blank"
          >
            Problem Statement
          </a>
          <div className="bg-white px-2 pt-3 pb-1 rounded-xl border text-gray-500 relative shadow-md text-center">
            <p className="absolute top-0 left-7 font-semibold text-xs text-gray-500">
              Due Date
            </p>
            <p className="font-bold">{monthDay(instanceData?.task.dueDate)}</p>
            {/* <p className="font-bold">{hourMinute(instanceData.task.dueDate)}</p> */}
          </div>
        </div>
      </div>
      <div
        className="flex flex-col bg-white rounded-xl shadow-md"
        style={{ minHeight: "50vh" }}
      >
        <div className="flex">
          <button
            className="w-full p-2 font-bold rounded-tl-xl shadow-md"
            style={
              panel === "checkpoints"
                ? { background: "white", color: "#0C72B0" }
                : { background: "#0C72B0", color: "white" }
            }
            onClick={() => setPanel("checkpoints")}
          >
            Checkpoints
          </button>
          <div className="h-full w-3"></div>
          <button
            className="w-full p-2 font-bold shadow-md"
            style={
              panel === "messages"
                ? { background: "white", color: "#0C72B0" }
                : { background: "#0C72B0", color: "white" }
            }
            onClick={() => setPanel("messages")}
          >
            Messages
          </button>
          <div className="h-full w-3"></div>
          <button
            className="w-full p-2 font-bold rounded-tr-xl shadow-md"
            style={
              panel === "links"
                ? { background: "white", color: "#0C72B0" }
                : { background: "#0C72B0", color: "white" }
            }
            onClick={() => setPanel("links")}
          >
            Links
          </button>
        </div>
        <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
          {panel === "checkpoints" && !checkpoints.length && (
            <div
              className="px-4 mt-2 flex-1 text-normal md:text-lg"
              style={{ color: "#AAAAAA" }}
            >
              <p className="text-center">
                Add all the checkpoints, challenges faced with brief description
                for your project here
              </p>
              <p className="text-center">
                Make sure to update your project checkpoint everyday
              </p>
              <p className="text-center mt-2">
                Start by adding your github repository link here
              </p>
            </div>
          )}
          {panel === "checkpoints" &&
            checkpoints.map((checkpoint) => (
              <div
                key={checkpoint.timestamp}
                className="flex flex-1 flex-wrap flex-col md:flex-row my-2"
              >
                <div
                  className="text-xs md:text-sm md:w-2/12 flex gap-4 md:gap-0 md:flex-col"
                  style={{ color: "#8D989F" }}
                >
                  <p className="font-bold">{monthDay(checkpoint.timestamp)}</p>
                  <p className="font-bold text-xs">
                    {hourMinute(checkpoint.timestamp)}
                  </p>
                  <p className="">{checkpoint.sentFrom}</p>
                </div>
                <div className="text-sm md:text-normal break-words w-full md:w-10/12 md:ml-auto">
                  <p>
                    {checkpoint.content.split(/\s+/g).map((word) =>
                      word.match(URL_REGEX) ? (
                        <>
                          <a
                            href={word}
                            className="text-blue-500 underline"
                            target="_blank"
                          >
                            {word}
                          </a>{" "}
                        </>
                      ) : (
                        word + " "
                      )
                    )}
                  </p>
                </div>
              </div>
            ))}

          {panel === "messages" && (
            <div className="text-xs md:text-sm text-blue-500 text-center">
              View these messages on the Zine App!
            </div>
          )}
          {panel === "messages" &&
            messages.map((message) => (
              <div
                key={message.timestamp}
                className="flex flex-1 flex-wrap flex-col md:flex-row my-2"
              >
                <div
                  className="text-xs md:text-sm md:w-2/12 flex gap-4 md:gap-0 md:flex-col"
                  style={{ color: "#8D989F" }}
                >
                  <p className="font-bold">{monthDay(message.timestamp)}</p>
                  <p className="font-bold text-xs">
                    {hourMinute(message.timestamp)}
                  </p>
                  <p className="">{message.sentFrom.name}</p>
                </div>
                <div className="text-sm md:text-normal break-words w-full md:w-10/12 md:ml-auto">
                  <p>
                    {message.content.split(/\s+/g).map((word) =>
                      word.match(URL_REGEX) ? (
                        <>
                          <a
                            href={word}
                            className="text-blue-500 underline"
                            target="_blank"
                          >
                            {word}
                          </a>{" "}
                        </>
                      ) : (
                        word + " "
                      )
                    )}
                  </p>
                </div>
              </div>
            ))}

          {panel === "checkpoints" && (
            <div className="flex mt-auto flex-col md:flex-row gap-4">
              <textarea
                rows={3}
                className="w-full rounded-xl p-2 focus:outline-none shadow-md"
                value={checkpointMessage}
                placeholder="Add checkpoints here"
                onChange={(e) => setCheckpointMessage(e.target.value)}
                style={{
                  background: "#EFEFEF",
                  outline: "0.5px #808080 solid",
                }}
              />
              <button
                className="font-bold p-2 rounded-xl cursor-pointer hover:opacity-80 shadow-md"
                style={{ ...styles.textPrimary, background: "#C2FFF4" }}
                onClick={() => handleAddCheckpoint()}
              >
                Add Checkpoint
              </button>
            </div>
          )}

          {panel === "messages" && (
            <div className="flex mt-auto flex-col md:flex-row gap-4">
              <textarea
                rows={3}
                className="w-full rounded-xl p-2 focus:outline-none shadow-md"
                value={inputMessage}
                placeholder="Write your message here"
                onChange={(e) => setInputMessage(e.target.value)}
                style={{
                  background: "#EFEFEF",
                  outline: "0.5px #808080 solid",
                }}
              />
              <button
                className="font-bold p-2 rounded-xl cursor-pointer hover:opacity-80 shadow-md"
                style={{ ...styles.textPrimary, background: "#C2FFF4" }}
                onClick={() => onSubmit()}
              >
                Send Message
              </button>
            </div>
          )}
        </div>
        {panel === "links" && (
          <div className="" style={{}}>
            {
              <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
                {links?.map((ele) => {
                  return (
                    <div
                      key={ele.timestamp}
                      className="flex flex-1 flex-wrap flex-col md:flex-row my-2"
                    >
                      <div
                        className="text-xs md:text-sm md:w-2/12 flex gap-4 md:gap-0 md:flex-col"
                        style={{ color: "#8D989F" }}
                      >
                        <p className="font-bold">{monthDay(ele.timestamp)}</p>
                        <p className="font-bold text-xs">
                          {hourMinute(ele.timestamp)}
                        </p>
                        <p className="">{ele.sentFrom.split(" ")[0]}</p>
                      </div>
                      <div className="text-sm md:text-normal break-words w-full md:w-10/12 md:ml-auto">
                        <p>
                          {ele.link.split(/\s+/g).map((word) =>
                            word.match(URL_REGEX) ? (
                              <>
                                <a
                                  href={word}
                                  className="text-blue-500 underline"
                                  target="_blank"
                                >
                                  {word}
                                </a>{" "}
                              </>
                            ) : (
                              word + " "
                            )
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div className="flex mt-auto flex-col md:flex-row gap-4">
                  <input
                    className="rounded-xl w-11/12 p-2 focus:outline-none shadow-md"
                    placeholder="For example www.github.com"
                    style={{
                      background: "#EFEFEF",
                      outline: "0.5px #808080 solid",
                    }}
                    onChange={(e) => setURL(e.target.value)}
                    value={url}
                  />
                  <select
                    className="focus:outline-none shadow-md rounded-xl px-2"
                    style={{ outline: "0.5px #808080 solid" }}
                    value={urlType}
                    onChange={(e) => setURLType(e.target.value)}
                  >
                    <option>GitHub</option>
                    <option>Figma</option>
                    <option>Deployment</option>
                    <option>Miscellaneous</option>
                  </select>
                  <button
                    className="font-bold p-2 rounded-xl cursor-pointer hover:opacity-80 shadow-md"
                    style={{ ...styles.textPrimary, background: "#C2FFF4" }}
                    onClick={() => handleAddLink()}
                  >
                    Add Link
                  </button>
                </div>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkpoints;
