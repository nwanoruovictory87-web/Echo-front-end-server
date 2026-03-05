import { useState } from "react";

function ChatAddContact() {
  function back() {
    const url = "/chat";
    window.location.replace(url);
  }
  const [inputName, setInputName] = useState<string>("");
  const [inputNumber, setInputNumber] = useState<string>("");
  //*=============== store validet username
  function storeInputName(e) {
    const data = e.target.value;
    const userNmaeErrorUi = document.querySelector(".userName-in");
    if (data.trim() === "") return (userNmaeErrorUi.style.borderColor = "red");
    userNmaeErrorUi.style.borderColor = "blue";
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
    const phoneErrorUi = document.querySelector(".phone-in");
    if (splitData[0] !== "0") {
      if (!Number(splitData[0]))
        return (phoneErrorUi.style.borderColor = "red");
    }
    if (data.trim() === "") return (phoneErrorUi.style.borderColor = "red");
    phoneErrorUi.style.borderColor = "blue";
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
    const userNmaeErrorUi = document.querySelector(".userName-in");
    const phoneErrorUi = document.querySelector(".phone-in");
    if (inputName.trim() === "" && inputNumber.trim() === "")
      return (
        (userNmaeErrorUi.style.borderColor = "red"),
        (phoneErrorUi.style.borderColor = "red")
      );
    if (inputName.trim() === "") return;
    userNmaeErrorUi.style.borderColor = "red";

    if (inputNumber.trim() === "") return;
    phoneErrorUi.style.borderColor = "red";

    userNmaeErrorUi.style.borderColor = "blue";
    phoneErrorUi.style.borderColor = "blue";
    //*=============== get user number
    const ECHO_Number = "Echo_Number";
    const userValue = JSON.parse(localStorage.getItem(ECHO_Number));
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
      const saveContactErrorUi = document.querySelector(".status-massage");
      if (responds.status !== 200)
        return (
          (saveContactErrorUi.textContent = responds.massage),
          (saveContactErrorUi.style.color = "red")
        );
      return (
        (saveContactErrorUi.style.color = "green"),
        (saveContactErrorUi.textContent = responds.massage)
      );
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="w-full h-screen min-w-[300px]">
      <span className="flex ml-4 pt-8">
        <i className="fa fa-arrow-left text-2xl mt-1" onClick={back}></i>
        <h5 className="font-semibold text-xl ml-4">New Contact</h5>
      </span>
      <div className="flex">
        <div className="flex flex-col ml-8 mr-8 mt-24 w-full">
          <span className="flex gap-4 w-full">
            <i className="fa fa-user text-3xl text-gray-300"></i>
            <input
              className="userName-in border-b-2 border-blue-700 w-full"
              placeholder="Username"
              value={inputName}
              onChange={storeInputName}
            ></input>
          </span>
          <span className="flex gap-4 mt-12">
            <i className="fa fa-phone text-3xl text-gray-300"></i>
            <input
              className="phone-in border-b-2 border-blue-700 w-full"
              placeholder="Phone"
              value={inputNumber}
              onChange={storeInputNumber}
            ></input>
          </span>
          <span className="mt-12">
            <h5 className="font-medium status-massage"></h5>
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
