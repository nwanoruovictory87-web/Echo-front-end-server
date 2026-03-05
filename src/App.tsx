import { useEffect } from "react";
import "./fonts/css/all.css";
import ChatTap from "./components/ChatTap/ChatTap";
import ChatAddContact from "./components/ChatTap/ChatAddContact";
import MassageTap from "./components/MassageTap/MassageTap";
import Welcome from "./components/SignIn_SignUp/Welcome";
import SignUp from "./components/SignIn_SignUp/SingUp";
import Login from "./components/SignIn_SignUp/Login";
import VideoCall from "./components/CallTap/VideoCall";
import AudioCall from "./components/CallTap/AudioCall";
import SingUpNumber from "./components/SignIn_SignUp/SingUpNumber";
//*=============== mobile
import ChatTapWeb from "./components/ChatTapWeb/ChatTap";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { userAppContext } from "./components/AppContext/AppContext";

//*=============== object type
//*=============== type
type UserloginData = {
  number: string;
  authorization: string;
  userName: string;
  userImage: string;
};
type UserData = {
  userLoginData: UserloginData;
  userMassageNotificationTon: string | null;
  userCallRingintone: string | null;
};
type FriendListOfArrayObject = {
  _id?: string;
  __v?: number;
  friendNumber?: string;
  friendName?: string;
  friendMassages?: object[];
};
type UserDetails = {
  friendChat: EchoFriend | undefined;
  setFriendChat: void;
  setUserData: void;
  setUserFriendList: void;
  userData: UserData;
  userFriendList: FriendListOfArrayObject[];
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
function App() {
  const locationPath = window.location.pathname;
  const userDetails: UserDetails = userAppContext();
  function setUserDataIfLost(userInfo: UserData, setUserData) {
    setUserData((prevUserData: UserData) => (prevUserData = userInfo));
  }
  function setFriendsListIfLost(
    friendsData: FriendListOfArrayObject[],
    setUserFriendList,
  ) {
    setUserFriendList(
      (prevFriendsData: FriendListOfArrayObject[]) =>
        (prevFriendsData = friendsData),
    );
  }
  function setFriendChatIfLost(friendChat: EchoFriend, setFriendChat) {
    setFriendChat(
      (prevFriendChat: EchoFriend) => (prevFriendChat = friendChat),
    );
  }
  useEffect(() => {
    const AppPath = {
      welcome: "/",
      login: "/login",
      signUp: "/sign/up",
    };
    const { userData, setUserData, setUserFriendList, setFriendChat } =
      userDetails;
    if (
      AppPath.welcome !== locationPath ||
      AppPath.signUp !== locationPath ||
      AppPath.login !== locationPath
    ) {
      if (!userData) {
        const USER_DATA = "User_Data";
        const userInfo: UserData = JSON.parse(localStorage.getItem(USER_DATA));
        if (userInfo) {
          //console.log(userInfo);
          setUserDataIfLost(userInfo, setUserData);
          const USER_FRIENDLIST = "User_FriendList";
          const friendsData = JSON.parse(localStorage.getItem(USER_FRIENDLIST));
          if (friendsData) {
            setFriendsListIfLost(friendsData, setUserFriendList);
          }
          const USER_FRIEND_CHAT = "User_Friend_Chat";
          const friendChat = JSON.parse(localStorage.getItem(USER_FRIEND_CHAT));
          if (friendChat) {
            setFriendChatIfLost(friendChat, setFriendChat);
          }
        }
      }
    }
  }, []);
  useEffect(() => {
    const head = document.querySelector("head");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./fonts/css/all.css";
    link.type = "text/css";
    head?.appendChild(link);
  }, []);
  //
  const router = createBrowserRouter([
    { path: "/", element: <Welcome /> },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sign/up",
      element: <SignUp />,
    },
    {
      path: "/sign/up/number",
      element: <SingUpNumber />,
    },
    {
      path: "/chat",
      element: <ChatTap />,
    },
    {
      path: "/chat/web",
      element: <ChatTapWeb />,
    },
    {
      path: "/chat/add/contact",
      element: <ChatAddContact />,
    },
    {
      path: "/massage",
      element: <MassageTap />,
    },
    {
      path: "/video/call",
      element: <VideoCall />,
    },
    {
      path: "/audio/call",
      element: <AudioCall />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
