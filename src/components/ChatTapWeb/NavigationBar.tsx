import ChatFriends from "./ChatFriends";
//import ChatContactDiplay from "./ChatContactDisplay";
import { useRef, useEffect } from "react";
function NavigationBar(props) {
  const chatBox = useRef(null);
  const chatText = useRef(null);
  const groupsBox = useRef(null);
  const groupsText = useRef(null);
  const contactBox = useRef(null);
  const contactText = useRef(null);
  useEffect(() => {
    async function findFriends() {
      const ECHO_Number = "Echo_Number";
      const userData = JSON.parse(localStorage.getItem(ECHO_Number));
      const authorization = userData.authorization;
      const userNumber = userData.number;
      const data = {
        userNumber: userNumber,
        authorization: authorization,
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
        const friendsData = responods.friends;
        const Echo_FriendsList = "Echo_FriendsList";
        localStorage.setItem(Echo_FriendsList, JSON.stringify(friendsData));
      } catch (error) {
        console.log(error);
      }
    }
    findFriends();
  }, []);

  function chat() {
    //*=============== update navigation bar ui
    if (groupsBox.current)
      groupsBox.current.style.backgroundColor = "transparent";

    if (groupsText.current) groupsText.current.style.color = "black";
    if (contactBox.current)
      contactBox.current.style.backgroundColor = "transparent";

    if (contactText.current) contactText.current.style.color = "black";
    //*=============== main ui change
    if (chatBox.current) chatBox.current.style.backgroundColor = "#2563eb";

    if (chatText.current) chatText.current.style.color = "white";
  }
  function groups() {
    //*=============== update navigation bar ui
    if (chatBox.current) chatBox.current.style.backgroundColor = "transparent";
    if (chatText.current) chatText.current.style.color = "black";
    if (contactBox.current)
      contactBox.current.style.backgroundColor = "transparent";
    if (contactText.current) contactText.current.style.color = "black";
    //*=============== main ui change
    if (groupsBox.current) groupsBox.current.style.backgroundColor = "#2563eb";
    if (groupsText.current) groupsText.current.style.color = "white";
  }
  function contacts() {
    //*=============== update navigation bar ui
    if (chatBox.current) chatBox.current.style.backgroundColor = "transparent";
    if (chatText.current) chatText.current.style.color = "black";
    if (groupsBox.current)
      groupsBox.current.style.backgroundColor = "transparent";
    if (groupsText.current) groupsText.current.style.color = "black";
    //*=============== main ui change
    if (contactBox.current)
      contactBox.current.style.backgroundColor = "#2563eb";
    if (contactText.current) contactText.current.style.color = "white";
  }
  return (
    <>
      <div className="mt-6 mb-6">
        <div className="ml-5 flex bg-gray-200 mr-5 rounded-full">
          <span
            className=" w-[40%] bg-[#2563eb] rounded-full text-center pl-2 pr-2 pt-1.5 pb-1.5"
            onClick={chat}
            ref={chatBox}
          >
            <h5
              className="m-0 text-[16px] text-white font-[Inter] text-center"
              ref={chatText}
            >
              All Chats
            </h5>
          </span>
          <span
            className="w-[40%] rounded-full text-center pl-2 pr-2 pt-1.5 pb-1.5"
            onClick={groups}
            ref={groupsBox}
          >
            <h5
              className=" m-0 text-[16px] text-black font-[Inter] text-center"
              ref={groupsText}
            >
              Groups
            </h5>
          </span>
          <span
            className=" w-[40%] rounded-full text-center pl-2 pr-2 pt-1.5 pb-1.5"
            onClick={contacts}
            ref={contactBox}
          >
            <h5
              className="m-0 text-[16px] text-black font-[Inter] text-center"
              ref={contactText}
            >
              Contacts
            </h5>
          </span>
        </div>
      </div>
      <ChatFriends body={props.body} />
    </>
  );
}
export default NavigationBar;
