import ChatFriends from "./ChatFriends";
//import ChatContactDiplay from "./ChatContactDisplay";
import { useState, useEffect, useRef } from "react";
import { userAppContext } from "../AppContext/AppContext";
//*=============== object type
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
function NavigationBar() {
  const userDetails: UserDetails = userAppContext();
  const chatBox = useRef(null);
  const chatText = useRef(null);
  const groupsBox = useRef(null);
  const groupsText = useRef(null);
  const contactBox = useRef(null);
  const contactText = useRef(null);
  const {
    userData,
    setUserData,
    friendChat,
    setFriendChat,
    userFriendList,
    setUserFriendList,
  } = userDetails;
  function updateUserFriendlist(
    friendsData: FriendListOfArrayObject[],
    setUserFriendList,
  ) {
    setUserFriendList(
      (prevFriendList: FriendListOfArrayObject[]) =>
        (prevFriendList = friendsData),
    );
    //console.log("enter setFriendlist");
    const USER_FRIENDLIST = "User_FriendList";
    localStorage.setItem(USER_FRIENDLIST, JSON.stringify(friendsData));
  }
  useEffect(() => {
    async function findFriends() {
      const userInfor: UserloginData = userData ? userData.userLoginData : null;
      if (!userInfor) return;
      const data = {
        userNumber: userInfor.number,
        authorization: userInfor.authorization,
      };
      try {
        const serverUrl = "http://localhost:5000/user/g/u/friends";
        const findFriendsList = await fetch(serverUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const responods = await findFriendsList.json();
        if (responods.status !== 200) return;
        const friendsData: FriendListOfArrayObject[] = responods.friends;
        updateUserFriendlist(friendsData, setUserFriendList);
      } catch (error) {
        console.log(error);
      }
    }
    findFriends();
  }, [userData]);

  function chat() {
    //*=============== navigation bar ui dom refrence
    //*=============== update navigation bar ui
    groupsBox.current.style.backgroundColor = "transparent";
    groupsText.current.style.color = "black";
    contactBox.current.style.backgroundColor = "transparent";
    contactText.current.style.color = "black";
    //*=============== main ui change
    chatBox.current.style.backgroundColor = "#2563eb";
    chatText.current.style.color = "white";
  }
  function groups() {
    //*=============== navigation bar ui dom refrence
    //*=============== update navigation bar ui
    chatBox.current.style.backgroundColor = "transparent";
    chatText.current.style.color = "black";
    contactBox.current.style.backgroundColor = "transparent";
    contactText.current.style.color = "black";
    //*=============== main ui change
    groupsBox.current.style.backgroundColor = "#2563eb";
    groupsText.current.style.color = "white";
  }
  function contacts() {
    //*=============== navigation bar ui dom refrence
    //*=============== update navigation bar ui
    chatBox.current.style.backgroundColor = "transparent";
    chatText.current.style.color = "black";
    groupsBox.current.style.backgroundColor = "transparent";
    groupsText.current.style.color = "black";
    //*=============== main ui change
    contactBox.current.style.backgroundColor = "#2563eb";
    contactText.current.style.color = "white";
  }
  return (
    <>
      <div className="mt-6 mb-6">
        <div className="ml-5 flex bg-gray-200 mr-5 rounded-full">
          <span
            className="chat-box w-[40%] bg-[#2563eb] rounded-full text-center pl-2 pr-2 pt-1.5 pb-1.5"
            onClick={chat}
            ref={chatBox}
          >
            <h5
              className="chat-text m-0 text-[16px] text-white font-[Inter] text-center"
              ref={chatText}
            >
              All Chats
            </h5>
          </span>
          <span
            className="groups-box w-[40%] rounded-full text-center pl-2 pr-2 pt-1.5 pb-1.5"
            onClick={groups}
            ref={groupsBox}
          >
            <h5
              className="groups-text m-0 text-[16px] text-black font-[Inter] text-center"
              ref={groupsText}
            >
              Groups
            </h5>
          </span>
          <span
            className="contact-box w-[40%] rounded-full text-center pl-2 pr-2 pt-1.5 pb-1.5"
            onClick={contacts}
            ref={contactBox}
          >
            <h5
              className="contact-text m-0 text-[16px] text-black font-[Inter] text-center"
              ref={contactText}
            >
              Contacts
            </h5>
          </span>
        </div>
      </div>
      <ChatFriends />;
    </>
  );
}
export default NavigationBar;
