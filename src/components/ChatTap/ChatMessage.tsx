import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import ChatTime from "./ChatTime";
import defultMassageSound from "../../assets/defult-massage-sound/Messenger-Notification-Sound.mp3";
import { userAppContext } from "../AppContext/AppContext";

//*================== connnect io to server
//! remove io server host url to real host
const socket = io("http://localhost:5000");
//*=============== chatmassage props types
type ChatMessageProp = {
  body: {
    _id?: string;
    __v?: number;
    friendNumber?: string;
    friendName?: string;
    friendMassages?: ChatData[];
  };
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
type Massage = {
  date: string;
  from: string;
  massage: string;
  time: string;
  type: string;
  url?: string | undefined;
};
type ChatData = {
  type: string;
  from?: string;
  massage: string;
  url?: string;
  date: string;
  time: string;
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
  friendChat: object[] | undefined;
  setFriendChat: void;
  setUserData: void;
  setUserFriendList: void;
  userData: UserData;
  userFriendList: FriendListOfArrayObject[];
};
type Typing = {
  typing: boolean;
  from: string;
};
function ChatMessage(props: ChatMessageProp) {
  const color: string = "";
  const [textMassage, setTextMassage] = useState<string>("online");
  const [textMassageCount, setTextMassageCount] = useState<number>(0);
  const [lastMassageTime, setLasMassageTime] = useState<string>("");
  const [typingState, setTypingState] = useState(false);
  const userDetails: UserDetails = userAppContext();
  const { userData, userFriendList, setUserFriendList } = userDetails;
  const userNumber = userData.userLoginData.number;
  const name = props.body ? props.body.friendName : null;
  const friendNumber = props.body ? props.body.friendNumber : null;
  useEffect(() => {
    socket.emit("join-room", userNumber);
  }, []);
  useEffect(() => {
    if (typingState) {
      setTimeout(() => {
        setTypingState((prevtypingState: boolean) => (prevtypingState = false));
      }, 7000);
    }
  }, [typingState]);
  //*=============== recive typing data
  useEffect(() => {
    const reciveTypingData = (data: Typing) => {
      const isTyping: boolean = data.typing;
      const from: string = data.from;
      if (from !== friendNumber) return;
      if (isTyping) {
        if (!typingState) {
          setTypingState(
            (prevtypingState: boolean) => (prevtypingState = true),
          );
        }
      }
    };
    socket.on("is-typing", reciveTypingData);
    return () => {
      socket.off("is-typing", reciveTypingData);
    };
  }, []);
  //*=============== get new massage count
  function massageCount() {
    setTextMassageCount((prevTextMassageCount) => prevTextMassageCount + 1);
  }
  //*=============== massage defult sound notification
  async function defultMassageNotification() {
    try {
      await new Audio(defultMassageSound).play();
    } catch (error) {
      console.log(error);
    }
  }
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
  function updateChatHistory(m: ChatData, n: string) {
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

  //*=============== reacive new massages
  useEffect(() => {
    const reciveMassage = (massage: Massage) => {
      const senderNumber = massage.from;
      if (senderNumber !== friendNumber) return;
      //*=============== stop tying animation
      setTypingState((prevtypingState: boolean) => (prevtypingState = false));
      const senderMassage = massage.massage;
      //console.log(massage);
      const massageData: ChatData = massage;
      updateChatHistory(massageData, senderNumber);
      setTextMassage(senderMassage);
      massageCount();
      defultMassageNotification();
    };
    socket.on("recive-massage", reciveMassage);
    return () => {
      socket.off("recive-massage", reciveMassage);
    };
  }, [userFriendList]);
  //*=============== update online status to last chat once on each render
  useEffect(() => {
    const friendValue: FriendListOfArrayObject[] = userFriendList;
    if (friendValue.length === 0) return;
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
        {textMassage === "" ? "photo" : textMassage}
      </h5>
    );
  return (
    <>
      <span className="flex flex-col ml-1.5 mt-2 mr-auto">
        <span className="inline-block overflow-hidden ">
          {textColor}
          {typingState ? (
            <h5 className="text-sm text-gray-500 w-32 h-6 font-[Inter]">
              Typing...
            </h5>
          ) : (
            statusColor
          )}
        </span>
      </span>
      <span className="mr-1.5">
        <ChatTime body={chatTimeProps} />
      </span>
    </>
  );
}
export default ChatMessage;
