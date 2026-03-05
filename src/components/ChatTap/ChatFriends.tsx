import ChatMessage from "./ChatMessage";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { userAppContext } from "../AppContext/AppContext";
import { useNavigate } from "react-router-dom";

//*=============== type firendlist
type EchoNumber = {
  number?: string;
};
type EchoFriend = {
  _id?: string;
  __v?: number;
  friendNumber?: string;
  friendName?: string;
  friendMassages?: object[];
};
type Massage = {
  date: string;
  from: string;
  massage: string;
  time: string;
  type: string;
  url?: string | undefined;
};
type FriendListOfArrayObject = {
  _id?: string;
  __v?: number;
  friendNumber?: string;
  friendName?: string;
  friendMassages?: object[];
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
//*=============== connnect io to server
//! remove io server host url to real host
const socket = io("http://localhost:5000");

//
function ChatFriends() {
  const userDetails: UserDetails = userAppContext();
  const {
    userData,
    userFriendList,
    setUserFriendList,
    friendChat,
    setFriendChat,
  } = userDetails;
  //*=============== get friends list
  const [friendList, setFriendList] =
    useState<FriendListOfArrayObject[]>(userFriendList);
  const userNumber = userData ? userData.userLoginData.number : null;
  const setStoredFreindList = useRef(userFriendList);
  const urlNavigator = useNavigate();
  //*=============== load to massage box
  function massage(e: EchoFriend, setFriendChat): void {
    setFriendChat(e);
    const USER_FRIEND_CHAT = "User_Friend_Chat";
    localStorage.setItem(USER_FRIEND_CHAT, JSON.stringify(e));
    const url = "/massage";
    urlNavigator(url, { replace: true });
  }
  //*=============== func to store freind list
  useEffect(() => {
    if (userFriendList) {
      (() => {
        //*=============== call a function to store friends list
        setFriendList(userFriendList);
      })();
    }
  }, [userFriendList]);
  //
  useEffect(() => {
    socket.emit("join-room", userNumber);
  }, [userNumber]);
  //*=============== get new massage by non saved contact || get new friends massage
  function updateFriendList(friendData: EchoFriend, setUserFriendList) {
    setUserFriendList((PrevFriendList: FriendListOfArrayObject[]) => {
      const USER_FRIENDLIST = "User_FriendList";
      const dataMoreThenOne = [...PrevFriendList, friendData];
      const dataOne = [friendData];
      if (PrevFriendList.length !== 0) {
        localStorage.setItem(USER_FRIENDLIST, JSON.stringify(dataMoreThenOne));
        return dataMoreThenOne;
      } else {
        localStorage.setItem(USER_FRIENDLIST, JSON.stringify(dataOne));
        return dataOne;
      }
    });
  }
  //*=============== reacive new massages
  useEffect(() => {
    console.log("recie socket mounted");
    const reciveMassage = (massage: Massage) => {
      console.log("recive socket on");
      const senderNumber = massage.from;
      const massageData = massage;
      console.log(senderNumber, massageData);
      //*=============== if user have no friends
      if (friendList.length === 0) {
        console.log("no friends");

        const storedFriendList = friendList;
        console.log(storedFriendList);
        //*=============== send new contact massage
        const friendData: EchoFriend = {
          friendMassages: [massageData],
          friendName: senderNumber,
          friendNumber: senderNumber,
        };
        updateFriendList(friendData, setUserFriendList);
      }
      if (friendList.length === 0) return;
      for (let i = 0; i < friendList.length; i++) {
        console.log("new massage from", senderNumber);
        const friendsNumber = friendList[i].friendNumber;
        if (friendsNumber === senderNumber) return;
        if (i + 1 === friendList.length) {
          const storedFriendList = friendList;
          console.log(storedFriendList);
          //*=============== send new contact massage
          const friendData: EchoFriend = {
            friendMassages: [massageData],
            friendName: senderNumber,
            friendNumber: senderNumber,
          };
          updateFriendList(friendData, setUserFriendList);
        }
      }
    };
    socket.on("recive-massage", reciveMassage);
    return () => {
      console.log("recive socket off");
      socket.off("recive-massage", reciveMassage);
    };
  }, [userData, friendList]);

  return (
    <div>
      {friendList &&
        friendList.map((e, i) => {
          return (
            <div
              className="w-[90%] mr-5 ml-5 mt-2 mb-2 flex h-16"
              onClick={() => massage(e, setFriendChat)}
              key={i}
            >
              <span className="inline-block w-14 h-14 rounded-full bg-gray-300"></span>
              <ChatMessage body={e} />
            </div>
          );
        })}
    </div>
  );
}
export default ChatFriends;
