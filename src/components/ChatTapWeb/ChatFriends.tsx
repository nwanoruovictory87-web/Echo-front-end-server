import ChatMessage from "./ChatMessage";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

//*=============== type firendlist
type FriendListOfArrayObject = [
  {
    _id?: string;
    __v?: number;
    friendNumber?: string;
    friendName?: string;
    friendMassages?: object[];
  },
];
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
  type: string;
  from: string;
  massage: string;
  date: string;
  time: string;
  url?: string;
};
//*=============== connnect io to server
//! remove io server host url to real host
const socket = io("http://localhost:5000");
//*=============== Echo user number
const ECHO_Number = "Echo_Number";
const userValue: EchoNumber = JSON.parse(localStorage.getItem(ECHO_Number));
const userNumber = userValue ? userValue.number : null;

//
function ChatFriends(props) {
  //*=============== get friends list
  const [friendList, setFriendList] = useState<FriendListOfArrayObject>([]);
  const [numberInUse, setNumberInUse] = useState<string | null>("");
  const [chatIndex, setChatIndex] = useState<number>(0);
  //*=============== load to massage box
  function massage(e: EchoFriend, i: number): void {
    if (!e) return;
    props.body.ref.current = e;
    props.body.setData();
    setNumberInUse(e.friendNumber);
    setChatIndex((prevIndex) => (prevIndex = i));
  }
  //*=============== func to store freind list

  useEffect(() => {
    const Echo_FriendsList = "Echo_FriendsList";
    const stordFriendList: FriendListOfArrayObject = JSON.parse(
      localStorage.getItem(Echo_FriendsList),
    );
    if (stordFriendList) {
      (() => {
        //*=============== call a function to store friends list
        setFriendList((prevFriendList) => {
          if (stordFriendList) return [...stordFriendList];
        });
        massage(stordFriendList[0]);
      })();
    }
  }, []);
  //
  useEffect(() => {
    socket.emit("join-room", userNumber);
    //*=============== get new massage by non saved contact || get new friends massage
    //*=============== reacive new massages
    const reciveMassage = (massage: Massage) => {
      const senderNumber = massage.from;
      const massageData = massage;
      for (let i = 0; i < friendList.length; i++) {
        const friendsNumber = friendList[i]?.friendNumber;
        if (friendsNumber === senderNumber) return;
        if (i + 1 === friendList.length) {
          const Echo_FriendsList = "Echo_FriendsList";
          const storedFriendList = JSON.parse(
            localStorage.getItem(Echo_FriendsList),
          );
          //*=============== send new contact massage
          const friendData: EchoFriend = {
            friendMassages: [massageData],
            friendName: senderNumber,
            friendNumber: senderNumber,
          };
          setFriendList((prevFriendList) => {
            if (prevFriendList) return [...prevFriendList, friendData];
            return [friendData];
          });
          //updateFriendList(newFriendList);
        }
      }
    };
    socket.on("recive-massage", reciveMassage);
    return () => socket.off("recive-massage", reciveMassage);
  }, []);

  // console.log(numberInUse);
  return (
    <div>
      {friendList &&
        friendList.map((e, i) => {
          return (
            <div
              className="w-[90%] mr-5 ml-5 mt-2 mb-2 flex h-16"
              onClick={() => {
                massage(e, i);
              }}
              key={i}
            >
              <span className="inline-block w-14 h-14 rounded-full bg-gray-300"></span>
              <ChatMessage
                body={e}
                number={numberInUse}
                index={i}
                chatIndex={chatIndex}
              />
            </div>
          );
        })}
    </div>
  );
}
export default ChatFriends;
