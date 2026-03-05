import { useState, useRef } from "react";
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
function ChatAddContact() {
  const urlNavigator = useNavigate();
  const userDetails: UserDetails = userAppContext();
  const { userData, userFriendList, setUserFriendList } = userDetails;
  function back() {
    const url = "/chat";
    urlNavigator(url, { replace: true });
  }
  const [inputName, setInputName] = useState<string>("");
  const [inputNumber, setInputNumber] = useState<string>("");
  const userNmaeErrorUi = useRef(null);
  const phoneErrorUi = useRef(null);
  const saveContactErrorUi = useRef(null);
  //*=============== store validet username
  function storeInputName(e) {
    const data = e.target.value;
    const splitData = data.split("");
    if (splitData.length < inputName.split("").length)
      return (
        (userNmaeErrorUi.current.style.borderColor = "red"),
        setInputName(data)
      );
    if (data.trim() === "")
      return (userNmaeErrorUi.current.style.borderColor = "red");
    userNmaeErrorUi.current.style.borderColor = "blue";
    setInputName(data);
  }
  //*=============== store validet and formart input to Echo standerd Number formart
  function storeInputNumber(e) {
    const data = e.target.value;
    const splitData = data.split("");
    //*=============== cansule input before it gets to being formated
    if (splitData.length < inputNumber.split("").length) {
      setInputNumber(data);
      return;
    }
    if (splitData[0] !== "0") {
      if (!Number(splitData[0]))
        return (phoneErrorUi.current.style.borderColor = "red");
    }
    if (data.trim() === "")
      return (phoneErrorUi.current.style.borderColor = "red");
    phoneErrorUi.current.style.borderColor = "blue";
    if (splitData.length === 2) {
      const formartTwo = `${data}-`;
      setInputNumber(formartTwo);
    } else if (splitData.length === 7) {
      const formartFour = `${data}-`;
      setInputNumber(formartFour);
    } else if (splitData.length === 12) {
      setInputNumber(data);

      return;
    } else if (splitData.length > 12) {
      //12-3456-787866
      const tembData = [];
      for (let i = 0; i < 12; i++) {
        tembData.push(splitData[i]);
      }
      setInputNumber(tembData.join(""));
      return;
    } else {
      setInputNumber(data);
    }
  }
  //*============ save validate and contact
  async function saveContact() {
    if (inputName.trim() === "" && inputNumber.trim() === "")
      return (
        (userNmaeErrorUi.current.style.borderColor = "red"),
        (phoneErrorUi.current.style.borderColor = "red")
      );
    if (inputName.trim() === "") return;
    userNmaeErrorUi.current.style.borderColor = "red";

    if (inputNumber.trim() === "") return;
    phoneErrorUi.current.style.borderColor = "red";

    userNmaeErrorUi.current.style.borderColor = "blue";
    phoneErrorUi.current.style.borderColor = "blue";
    //*=============== get user number
    const userValue = userData ? userData.userLoginData : null;
    const data = {
      userNumber: userValue.number,
      friendName: inputName,
      friendNumber: inputNumber,
    };
    try {
      const url = "http://localhost:5000/user/a/contact";
      const saveFriendContact = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responds = await saveFriendContact.json();
      if (responds.status !== 200)
        return (
          (saveContactErrorUi.current.textContent = responds.massage),
          (saveContactErrorUi.current.style.color = "red")
        );
      const friendData = responds.friendData;
      const USER_FRIENDLIST = "User_FriendList";
      const updateUserFriendList = (setUserFriendList) => {
        setUserFriendList((prevFriendList) => {
          if (prevFriendList.length === 0) {
            const data = [friendData];
            localStorage.setItem(USER_FRIENDLIST, JSON.stringify(data));
            return data;
          } else {
            const data = [...prevFriendList, friendData];
            localStorage.setItem(USER_FRIENDLIST, JSON.stringify(data));
            return data;
          }
        });
      };
      updateUserFriendList(setUserFriendList);

      return (
        (saveContactErrorUi.current.style.color = "green"),
        (saveContactErrorUi.current.textContent = responds.massage)
      );
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="w-full h-screen">
      <span className="flex ml-4 pt-8">
        <i className="fa fa-arrow-left text-2xl mt-1" onClick={back}></i>
        <h5 className="font-semibold text-xl ml-4">New Contact</h5>
      </span>
      <div className="flex">
        <div className="flex flex-col ml-8 mr-8 mt-24 w-full">
          <span className="flex gap-4 w-full">
            <i className="fa fa-user text-3xl text-gray-300"></i>
            <input
              className=" border-b-2 border-blue-700 w-full"
              placeholder="Username"
              value={inputName}
              onChange={storeInputName}
              ref={userNmaeErrorUi}
            ></input>
          </span>
          <span className="flex gap-4 mt-12">
            <i className="fa fa-phone text-3xl text-gray-300"></i>
            <input
              className=" border-b-2 border-blue-700 w-full"
              placeholder="Phone"
              value={inputNumber}
              onChange={storeInputNumber}
              ref={phoneErrorUi}
            ></input>
          </span>
          <span className="mt-12">
            <h5 className="font-medium " ref={saveContactErrorUi}></h5>
          </span>
          <span className="mt-24">
            <button
              className="w-full h-12 bg-[#2563eb] text-xl font-medium text-white rounded-full"
              onClick={saveContact}
            >
              Save
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
export default ChatAddContact;
