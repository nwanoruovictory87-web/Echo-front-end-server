import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import ChatTime from "./ChatTime";
//*================== connnect io to server
//! remove io server host url to real host
const socket = io("http://localhost:5000");
const ECHO_Number = "Echo_Number";
const userValue = JSON.parse(localStorage.getItem(ECHO_Number));
const userNumber = userValue ? userValue.number : null;
//*=============== chatmassage props types
type ChatMessageProp = {
  body: {
    _id?: string;
    __v?: number;
    friendNumber?: string;
    friendName?: string;
    friendMassages?: object[];
  };
  number: string | null;
  index: number;
  chatIndex: number | undefined;
};
//*=============== chat time prop
type ChatTimeProps = {
  textMassageCount: number;
  lastMassageTime: string;
};
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

type Massage = {
  type: string;
  from: string;
  massage: string;
  date: string;
  time: string;
  url?: string;
};
function ChatMessage(props: ChatMessageProp) {
  const color: string = "";
  const [textMassage, setTextMassage] = useState<string>("online");
  const [textMassageCount, setTextMassageCount] = useState<number>(0);
  const [lastMassageTime, setLasMassageTime] = useState<string>("");
  const [numberInUse, setNumberInUse] = useState<string | null>("");
  const name = props.body.friendName;
  const friendNumber = props.body.friendNumber;
  useEffect(() => {
    socket.emit("join-room", userNumber);
  }, []);

  useEffect(() => {
    if (props.number !== numberInUse) {
      (() => {
        setNumberInUse(props.number);
      })();
    }
  }, [props.number]);
  //*=============== get new massage count
  function massageCount() {
    setTextMassageCount((prevTextMassageCount) => prevTextMassageCount + 1);
  }
  //*=============== get old chat and update chat history
  function updateChatHistory(m: ChatData, n: string) {
    const senderNumber = n;
    const massageData = m;
    //*=============== get old massage and update to new one
    const Echo_FriendsList = "Echo_FriendsList";
    const friendValue = JSON.parse(localStorage.getItem(Echo_FriendsList));
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
            __v: friendValue[chatTobeUpdatted]._v,
            _id: friendValue[chatTobeUpdatted]._id,
          };
          friendListUpdated.push(friendData);
        } else {
          friendListUpdated.push(friendValue[i]);
        }
      }
      //*=============== update friend data
      const Echo_FriendsList = "Echo_FriendsList";
      localStorage.setItem(Echo_FriendsList, JSON.stringify(friendListUpdated));
    }
  }
  //*=============== reacive new massages
  useEffect(() => {
    function upDateNewMassage(massage: Massage) {
      const senderNumber = massage.from;
      if (numberInUse === senderNumber)
        if (senderNumber !== friendNumber) return;
      const senderMassage = massage.massage;
      console.log(massage);
      const massageData: ChatData = massage;
      updateChatHistory(massageData, senderNumber);
      setTextMassage(senderMassage);
      massageCount();
    }
    if (numberInUse) {
      socket.on("recive-massage", upDateNewMassage);
    }
    return () => {
      socket.off("recive-massage", upDateNewMassage);
      console.log("off recive-massage number-" + numberInUse);
    };
  }, [numberInUse]);
  //*=============== update online status to last chat once on each render
  useEffect(() => {
    const Echo_FriendsList = "Echo_FriendsList";
    const friendValue = JSON.parse(localStorage.getItem(Echo_FriendsList));
    for (let i = 0; i < friendValue.length; i++) {
      if (friendValue[i].friendNumber === friendNumber) {
        const lastMassageIndex =
          friendValue[i].friendMassages.length > 0
            ? friendValue[i].friendMassages.length - 1
            : friendValue[i].friendMassages.length;
        const lastMassage =
          lastMassageIndex !== 0
            ? friendValue[i].friendMassages[lastMassageIndex].massage
            : "online";
        const lastMassageTimeText =
          lastMassageIndex !== 0
            ? friendValue[i].friendMassages[lastMassageIndex].time
            : "";
        (() => {
          setLasMassageTime(lastMassageTimeText);
          setTextMassage(lastMassage);
        })();
      }
    }
  }, []);
  //*=============== props data for new massage & last massage
  const chatTimeProps: ChatTimeProps = {
    textMassageCount: textMassageCount,
    lastMassageTime: lastMassageTime,
  };
  //
  const textColor =
    color === "text-white" ? (
      <h5 className="friend-name text-white text-sm font-bold">{name}</h5>
    ) : (
      <h5 className="friend-name text-sm font-bold">{name}</h5>
    );

  const statusColor =
    color === "text-white" ? (
      <h5 className="text-sm text-white font-[Inter]">online</h5>
    ) : (
      <h5 className="text-sm text-gray-500 w-32 h-6 font-[Inter]">
        {textMassage}
      </h5>
    );
  return (
    <>
      <span className="flex flex-col ml-1.5 mt-2 mr-auto">
        <span className="inline-block overflow-hidden ">
          {textColor}
          {statusColor}
        </span>
      </span>
      <span className="mr-1.5">
        <ChatTime
          body={chatTimeProps}
          index={props.index}
          chatIndex={props.chatIndex}
        />
      </span>
    </>
  );
}
export default ChatMessage;
