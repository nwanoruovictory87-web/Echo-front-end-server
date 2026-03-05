import MassageVideoChat from "./MassageVideoChat";
import MassageBackButton from "./MassageBackButton";
import MassageText from "./MassageText";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";

//*=============== echo types
type EchoNumber = {
  number?: string;
};

type ChatData = {
  type: string;
  from?: string;
  massage: string;
  url?: string;
  date: string;
  time: string;
};
/*
type EchoFriend = {
  _id?: string;
  __v?: number;
  friendNumber?: string;
  friendName?: string;
  friendMassages?: string[];
};
*/
//*=============== connect socket once on render
const socket = io("http://localhost:5000");

//*=============== get user number
const ECHO_Number = "Echo_Number";
const userValue: EchoNumber = JSON.parse(localStorage.getItem(ECHO_Number));
//*=============== get friend data
const ECHO_Friend = "Friend_Chat";

const Echo_FriendsList = "Echo_FriendsList";
const storedFriendList = JSON.parse(localStorage.getItem(Echo_FriendsList));
function MassageBackgroundUi(props) {
  //*=============== get friend data from props
  const [friendValue, setFriendValue] = useState();
  const [chat, setChat] = useState<object[]>([]);
  const [input, setInput] = useState<string>("");
  const [fileInput, setFileInput] = useState("");
  const [fileView, setFileView] = useState();
  //*=============== connnect to users room
  useEffect(() => {
    const userNumber = userValue.number;
    socket.emit("join-room", userNumber);
  }, []);

  //*=============== get chat history on render once and clean up
  useEffect(() => {
    // console.log(props.body, "props change");
    const friendData = props.body;
    const handelIncomingMassage = (data) => {
      const from = data.from;
      console.log(from);
      console.log("new massage");
      if (from !== friendData.friendNumber) return;
      const storedChat = [...chat, data];
      console.log(storedChat);
      //*================= update chat
      setChat((prevChat) => {
        if (prevChat.length !== 0) return [...prevChat, data];
        if (prevChat.length === 0) return [data];
      });
      //updateLocalChatStorage();
      //*=============== move new massage to top after 300ms
      setTimeout(() => {
        const chatEndScroll = document.querySelector(".chat-end");
        chatEndScroll?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 300);
    };
    if (props.body) {
      console.log("inside render");
      (() => {
        const oldMassage = props.body && props.body.friendMassages;
        setChat((c) => oldMassage);
        setFriendValue(props.body);
        //*=============== scroll to the bottom of chat
        setTimeout(() => {
          const chatEndScroll = document.querySelector(".chat-end");
          chatEndScroll?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 800);
      })();

      socket.on("recive-massage", handelIncomingMassage);
    }
    return () => {
      socket.off("recive-massage", handelIncomingMassage);
      console.log(`off ${props.body && props.body.friendNumber}`);
    };
  }, [props.body]);
  /*if (chat) {
    console.log("outside render");
    console.log(props.body);
    if (renderSwicth) {
      if (props.body) {
        console.log("inside render");
        setRenderSwicth(false);
        upDateChat();
      }
    }
    if (!renderSwicth) {
      if (props.body._id !== friendValue._id) {
        if (props.body) {
          upDateChat();
        }
      }
    }
  }
    */

  /*if (chat.length === 0) {
    upDateChat();
  }*/
  function updateLocalChatStorage() {}
  //*=============== get new text masssage

  /*
  if (props.body) {
    if (chat) {
      setUpdateChat(true);
    }
  }
  */

  //*================= update input onchange
  function storeInput(e): void {
    setInput(e.target.value);
  }
  //*=============== store file input
  function storeFileInput(e) {
    const data = e.target.files[0];
    const cheackType = data.type;
    if (cheackType.split("/")[0] !== "image") return;
    //setFileInput(data);
    //console.log(e.target.files[0]);
    viewFilew(data);
  }
  //*=============== view file & read file
  function viewFilew(e: string) {
    const file = e;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const readerResult = reader.result;
      setFileView(readerResult);
    };
  }
  function focusFileOnClick() {
    const fileElement = document.querySelector(".file-in");
    if (fileElement) return fileElement.click();
  }
  //*================= send text massage funtion
  function sendMassage(): void {
    if (!fileView) {
      if (input.trim() === "") return;
    }
    if (!fileView) {
      if (input.trim() !== "") {
        sendFormatedMassage("text");
      }
    }
    if (fileView) {
      if (input.trim() === "") {
        sendFormatedMassage("image");
      }
    }
    if (fileView) {
      if (input.trim() !== "") {
        sendFormatedMassage("mixed");
      }
    }
  }
  function sendFormatedMassage(massageType: string) {
    const type = massageType;
    //*================= format text massage to user send
    const room = friendValue.friendNumber;
    const date = new Date();
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const month =
      date.getMonth() + 1 > 10
        ? date.getMonth() + 1
        : `0${date.getMonth() + 1}`;
    const year = date.getFullYear();
    const minite =
      date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const hour =
      date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const amOrPm = Number(hour) < 12 ? "AM" : "PM";
    const data: ChatData = {
      type: type,
      from: userValue.number,
      massage: input,
      url: fileView,
      date: `${day}/${month}/${year}`,
      time: `${hour}:${minite}${amOrPm}`,
    };
    //console.log(data);
    setInput("");
    //*=============== update chat
    //*=============== send text massage
    socket.emit("send-massage", data, room);
    setChat((prevChat) => {
      if (prevChat.length !== 0) return [...prevChat, data];
      if (prevChat.length === 0) return [data];
    });
    //*=============== move new massage to top after 300ms
    setTimeout(() => {
      const chatEndScroll = document.querySelector(".chat-end");
      chatEndScroll?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 300);
    setFileView(undefined);
  }
  return (
    <div className="flex min-w-[380px]">
      <div className="relative ">
        <div className=" h-[40.2px] w-[40%] min-w-[380px] fixed z-10 top-0 pr-[19px] bg-transparent">
          <div className="bg-[#f9f9f9] h-[40.2px]  "></div>
        </div>
        <div className="fixed w-[40%] min-w-[380px] h-[105.5px] mt-[40px] z-10 pr-[19px] bg-transparent">
          <span className="block bg-[#2563eb] h-[105.5px] "></span>
        </div>

        <div className="fixed w-[40%] min-w-[380px] z-10 mt-9 flex justify-end pr-[19px] bg-transparent">
          <div className="w-[140px] h-[100px] bg-[#f9f9f9] rounded-bl-[85px] ">
            <span className="block w-[140px] h-[80px] rounded-bl-[40px] bg-[#f9f9f9]">
              <MassageVideoChat />
            </span>
            <span className="block w-[140px] h-[30px] rounded-tr-[80px] bg-[#2563eb] pr-5"></span>
          </div>
        </div>

        <div className="">
          <div className="fixed w-[40%] pr-[160px] z-10  min-w-[380px]">
            <span className="block  w-full  h-[27px] rounded-tl-[60px] rounded-tr-[80px] bg-[#2563eb]  mr-[140.5px] mt-[20px] z-10 "></span>
          </div>
        </div>
        <span className="fixed z-10 min-w-[380px] ">
          <MassageBackButton body={friendValue} />
        </span>
      </div>
      <div className="bg-[#2563eb] fixed overflow-y-scroll w-[40%] min-h-screen max-h-screen rounded-tl-[40px] min-w-[380px] masssage-div">
        <div className="relative">
          <div className="mt-40 ml-7 mr-7 w-[87%]  h-fit pb-28 ">
            <MassageText body={chat} />
            <div className="chat-end pb-72 absolute "></div>
          </div>
          <div className="fixed bottom-0 w-[40%] min-w-[380px] pr-5 bg-transparent">
            <div className="bg-[#2563eb] pt-2 pb-8   ">
              <div className=" ml-7 mr-7 flex">
                <span className="flex w-full h-14 pl-4 pr-4 pt-1 pb-1  rounded-full bg-[#f9f9f9] items-center min-w-[230px]">
                  <i className="fas fa-microphone text-gray-400 mr-2 text-2xl"></i>
                  <i className="fas fa-smile text-gray-400 mr-2 text-2xl"></i>

                  <input
                    className=" h-12 w-full pl-2 text-black border-l-2 border-gray-400 massage-in-test"
                    placeholder="Whats on your mind?"
                    value={input}
                    onChange={storeInput}
                  ></input>
                  <i
                    className="fa-solid fa-paperclip text-gray-400 ml-2 text-2xl"
                    onClick={focusFileOnClick}
                  ></i>
                  <input
                    className="absolute file-in"
                    type="file"
                    value={fileInput}
                    onChange={storeFileInput}
                  ></input>
                </span>
                <span className="ml-3 bg-[#f9f9f9] rounded-full pl-3 pb-3 pr-4">
                  <i
                    className="fa-solid fa-paper-plane mt-4  text-[25px] text-[#2563eb]"
                    onClick={sendMassage}
                  ></i>
                </span>
                {fileView && (
                  <span className="absolute right-28 w-48 h-38 bottom-[88px] rounded-xl">
                    <img src={fileView} className="w-48 h-38 rounded-xl"></img>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MassageBackgroundUi;
