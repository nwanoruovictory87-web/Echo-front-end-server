import MassageVideoChat from "./MassageVideoChat";
import MassageBackButton from "./MassageBackButton";
import MassageText from "./MassageText";
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { userAppContext } from "../AppContext/AppContext";
import defultTypingSound from "../../assets/defult-typing-sound/typingiphone.mp3";
import { Emoji } from "emoji-mart";
import { Picker } from "emoji-mart";

//*=============== echo types
type EchoNumber = {
  number?: string | undefined;
};
type Typing = {
  typing: boolean;
  from: string;
};
type ChatData = {
  date: string;
  from: string;
  massage: string;
  time: string;
  type: string;
  url?: string | undefined;
};
type EchoFriend = {
  _id?: string;
  __v?: number;
  friendNumber?: string;
  friendName?: string;
  friendMassages?: ChatData[];
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
type Massage = {
  date: string;
  from: string;
  massage: string;
  time: string;
  type: string;
  url?: string | undefined;
};
type FriendListOfArrayObject = {
  userId: string;
  _id?: string;
  __v?: number;
  friendNumber?: string;
  friendName?: string;
  friendMassages?: ChatData[];
};
type UserloginData = {
  number: string;
  authorization: string;
  userName: string;
  userImage: string;
};
type UserData = {
  userLoginData: UserloginData;
  userMassageNotificationTon: string;
  userCallRingintone: string;
};
type UserDetails = {
  friendChat: EchoFriend | undefined;
  setFriendChat: void;
  setUserData: void;
  setUserFriendList: void;
  userData: UserData;
  userFriendList: FriendListOfArrayObject[];
};

//*=============== connect socket once on render
const socket = io("http://localhost:5000");

function MassageBackgroundUi() {
  const [chat, setChat] = useState<ChatData[] | undefined>([]);
  const [input, setInput] = useState<string>("");
  const [fileInput, setFileInput] = useState("");
  const [fileView, setFileView] = useState();
  const [typingState, setTypingState] = useState(false);
  const typingBox = useRef(null);
  const typingSoundAudio = useRef(null);
  const userDetails: UserDetails = userAppContext();
  const { userData, userFriendList, setUserFriendList, friendChat } =
    userDetails;
  const friendValue = friendChat;
  const userValue = userData && userData.userLoginData.number;
  //*=============== connnect to users room
  useEffect(() => {
    const userNumber = userValue;
    //console.log(userNumber);
    socket.emit("join-room", userNumber);
  }, [userValue]);
  //*=============== get chat history on render once
  useEffect(() => {
    const oldChatHistory = friendValue && friendValue.friendMassages;
    if (oldChatHistory) {
      (() => {
        setChat((prevChat) => (prevChat = oldChatHistory));
      })();
    }
  }, [friendValue]);
  //*=============== scroll to the bottom of chat
  useEffect(() => {
    setTimeout(() => {
      const chatEndScroll = document.querySelector(".chat-end");
      chatEndScroll?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 800);
  }, []);
  //*=============== typing sound func

  //*=============== typing animation func
  useEffect(() => {
    if (!typingState) return;
    if (!typingBox.current) return;
    typingBox.current.style.display = "flex";
    //*=============== typing sound func
    const audio = new Audio(defultTypingSound);
    if (!typingSoundAudio.current) {
      typingSoundAudio.current = audio;
      typingSoundAudio.current.play();
      setTimeout(() => {
        if (!typingSoundAudio.current) return;
        typingSoundAudio.current.pause();
        return (typingSoundAudio.current = null);
      }, 7000);
    }
    const chatEndScroll = document.querySelector(".chat-end");
    chatEndScroll?.scrollIntoView({ behavior: "smooth", block: "end" });
    setTimeout(() => {
      if (!typingBox.current) return;
      typingBox.current.style.display = "none";
      setTypingState((prevtypingState: boolean) => (prevtypingState = false));
    }, 7000);
    //
  }, [typingState, typingBox]);

  //*=============== recive typing data
  useEffect(() => {
    const reciveTypingData = (data: Typing) => {
      const isTyping: boolean = data.typing;
      const from: string = data.from;
      if (from !== friendValue.friendNumber) return;
      if (isTyping) {
        setTypingState((prevtypingState: boolean) => (prevtypingState = true));
      }
    };
    socket.on("is-typing", reciveTypingData);
    return () => {
      socket.off("is-typing", reciveTypingData);
    };
  }, []);
  //*=============== get old chat and update chat history
  function updateFriendList(
    newFriendList: FriendListOfArrayObject[],
    setUserFriendList,
  ) {
    setUserFriendList(
      (prevFriendList: FriendListOfArrayObject[]) =>
        (prevFriendList = newFriendList),
    );
    const USER_FRIENDLIST = "User_FriendList";
    localStorage.setItem(USER_FRIENDLIST, JSON.stringify(newFriendList));
  }
  //*=============== get old chat and update chat history
  function updateChatHistory(m: ChatData, n: string | undefined) {
    const senderNumber = n;
    const massageData = m;
    //*=============== get old massage and update to new one
    const friendValue = userFriendList;
    //*=============== if friends does exist
    if (friendValue) {
      //*=============== get index of friend massage in friend list & upadate friend massage
      let chatTobeUpdatted = 0;
      const friendListUpdated = [];
      const friendMassagesUpdated = [];
      for (let i = 0; i < friendValue.length; i++) {
        if (friendValue[i].friendNumber === senderNumber) {
          chatTobeUpdatted = i;
          const oldChatHistory = friendValue[i].friendMassages;
          const newChatHostory =
            oldChatHistory.length !== 0
              ? [...oldChatHistory, massageData]
              : [massageData];
          friendMassagesUpdated.push(newChatHostory);
        }
      }
      //*=============== update friend list back to original form
      for (let i = 0; i < friendValue.length; i++) {
        if (i === chatTobeUpdatted) {
          const friendData = {
            friendMassages: friendMassagesUpdated[0],
            friendName: friendValue[chatTobeUpdatted].friendName,
            friendNumber: friendValue[chatTobeUpdatted].friendNumber,
            userId: friendValue[chatTobeUpdatted].userId,
            __v: friendValue[chatTobeUpdatted].__v,
            _id: friendValue[chatTobeUpdatted]._id,
          };
          friendListUpdated.push(friendData);
        } else {
          friendListUpdated.push(friendValue[i]);
        }
      }
      //*=============== update friend data
      updateFriendList(friendListUpdated, setUserFriendList);
    }
  }
  //*=============== get new text masssage
  useEffect(() => {
    const reciveMassage = (massage: Massage) => {
      const from = massage.from;
      //*=============== recive new massages from friends  //*=============== recive new massages from friends
      if (from !== friendValue.friendNumber) {
        //*=============== recive new massage from friends and update friend chat
        console.log("none-frendChat", from);
        for (let i = 0; i < userFriendList.length; i++) {
          const numberOfEachFriend = userFriendList[i].friendNumber;
          if (numberOfEachFriend === from) {
            //console.log("found user", numberOfEachFriend, from);
            updateChatHistory(massage, from);
          }
        }
      }
      if (from !== friendValue.friendNumber) return;
      //*=============== stop typing animation on new massage
      typingBox.current.style.display = "none";
      if (typingSoundAudio.current) {
        typingSoundAudio.current.pause();
        typingSoundAudio.current = null;
      }
      //*================= update chat
      setChat((prevChat) => {
        if (prevChat.length !== 0) return [...prevChat, massage];
        return [massage];
      });
      updateChatHistory(massage, from);
      //*=============== move new massage to top after 300ms
      setTimeout(() => {
        const chatEndScroll = document.querySelector(".chat-end");
        chatEndScroll?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 300);
      //console.log("new massage");
    };
    socket.on("recive-massage", reciveMassage);
    return () => {
      socket.off("recive-massage", reciveMassage);
    };
  }, []);

  //*================= update input onchange
  function sendTypingMassage() {
    const room = friendValue.friendNumber;
    //console.log("typing");
    const data = {
      typing: true,
      from: userValue,
    };
    socket.emit("user-typing", data, room);
  }
  function storeInput(e): void {
    setInput(e.target.value);
    sendTypingMassage();
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
      from: userValue,
      massage: input,
      url: fileView,
      date: `${day}/${month}/${year}`,
      time: `${hour}:${minite}${amOrPm}`,
    };
    setInput("");
    //*=============== update chat
    //*=============== send text massage
    socket.emit("send-massage", data, room);
    const storedChat: ChatData[] = chat.length !== 0 ? [...chat, data] : [data];
    setChat(storedChat);
    updateChatHistory(data, room);
    //*=============== move new massage to top after 300ms
    setTimeout(() => {
      const chatEndScroll = document.querySelector(".chat-end");
      chatEndScroll?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 300);
    setFileView(undefined);
  }
  return (
    <div className="">
      <div className="relative">
        <div className="w-full h-[40.2px] bg-[#f9f9f9] fixed z-10 top-0 "></div>
        <span className="block fixed w-screen h-[105.5px] bg-[#2563eb] mt-[40px] z-10"></span>
        <div className="w-[140px] h-[100px] bg-[#f9f9f9] rounded-bl-[85px] fixed z-10 mt-9 right-0">
          <span className="block w-[140px] h-[80px] rounded-bl-[40px] bg-[#f9f9f9]">
            <MassageVideoChat />
          </span>
          <span className="block w-[140px] h-[30px] rounded-tr-[80px] bg-[#2563eb]"></span>
        </div>
        <span className="block fixed w-[100%] h-[30px] bg-[#f9f9f9] right-0 mt-9"></span>
        <span className="block fixed w-[50%] h-[27px] rounded-tl-[60px] rounded-tr-[80px] bg-[#2563eb] right-0 mr-[140.5px] mt-[20px] z-10"></span>
        <span className="block fixed w-[50%] h-[27px] rounded-tl-[60px] rounded-tr-[80px] bg-[#2563eb] left-0 mr-[10px] mt-[20px] z-10"></span>
        <span className="fixed z-10 ">
          <MassageBackButton body={friendValue} />
        </span>
      </div>
      <div className="bg-[#2563eb] absolute w-[100%] min-h-screen max-h-fit rounded-tl-[40px]">
        <div className="mt-40 ml-7 mr-7 w-[87%] h-fit pb-28">
          <MassageText body={chat} />
          <div
            className=" hidden mb-6 mt-3 bg-[#f1f1f1] w-36 p-[12px] pl-[15px] pr-[15px] rounded-bl-[30px] rounded-e-3xl overflow-hidden text-box-right"
            ref={typingBox}
          >
            <span className="">
              <h5 className="text-[#242222c5]">Typing</h5>
            </span>
            <span className="ml-1 flex mt-2 typing-animation-box">
              <span className="inline-block w-3 h-3 rounded-full bg-[#2563eb] ml-1"></span>
              <span className="inline-block w-3 h-3 rounded-full bg-[#2563eb] ml-1"></span>
              <span className="inline-block w-3 h-3 rounded-full bg-[#2563eb] ml-1"></span>
            </span>
          </div>
          <div className="chat-end pb-72 absolute "></div>
        </div>
        <div className="fixed bottom-0 bg-[#2563eb] pt-2 pb-8 w-[100%] pr-12 ">
          <div className="w-full ml-7 mr-7 flex">
            <span className="flex w-full h-14 pl-4 pr-4 pt-1 pb-1  rounded-full bg-[#f9f9f9] items-center">
              <i className="fas fa-microphone text-gray-400 mr-2 text-2xl"></i>
              <i className="fas fa-smile text-gray-400 mr-2 text-2xl"></i>
              <span></span>
              <input
                className="w-full h-12 pl-2 text-black border-l-2 border-gray-400 massage-in-test"
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
  );
}
export default MassageBackgroundUi;
