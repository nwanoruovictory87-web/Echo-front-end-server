import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAppContext } from "../AppContext/AppContext";
//*=============== type
type UserloginData = {
  number: string;
  authorization: string;
  userName: string;
  userImage: string;
};
type UserData = {
  userLoginData: UserloginData;
  userMassageNotificationTon?: string;
  userCallRingintone?: string;
};
function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const userDetails = userAppContext();
  const { userData, setUserData } = userDetails;
  const urlNavigator = useNavigate();
  function signUpNumber() {
    const firstNBackground = document.querySelector(
      ".user-name",
    ) as HTMLInputElement;
    const lastNBackground = document.querySelector(
      ".user-password",
    ) as HTMLInputElement;
    //*=============== validate Username !== null && Password !== null
    if (username.trim() === "" && password.trim() === "")
      return (
        (firstNBackground.style.borderColor = "red"),
        (lastNBackground.style.borderColor = "red")
      );
    //*=============== validate Username !== null
    if (username.trim() === "")
      return (firstNBackground.style.borderColor = "red");
    //*=============== validate Password !== null
    if (password.trim() === "")
      return (lastNBackground.style.borderColor = "red");
    //*=============== return Password UI to Previous state
    if (lastNBackground) lastNBackground.style.borderColor = "blue";
    //*=============== return fistName UI to Previous state
    if (username) firstNBackground.style.borderColor = "blue";
    //!
    register();
  }
  //*=============== register user
  async function register() {
    const userDataSingUp = {
      username: username,
      password: password,
    };
    const serverUrl = "http://localhost:5000/user/register";
    try {
      const data = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDataSingUp),
      });
      const res = await data.json();
      //const ECHO = "Echo_Number";
      if (res.status !== 201) return;
      const userLoginData: UserloginData = {
        number: res.number,
        authorization: res.authorization,
        userName: userDataSingUp.username,
        userImage: "",
      };
      const userDataRes = {
        userLoginData: userLoginData,
        userMassageNotificationTon: null,
        userCallRingintone: null,
      };
      //console.log(userDataRes);
      setUserData((prevUserData: UserData) => (prevUserData = userDataRes));
      //console.log(userData);
      //
      const USER_DATA = "User_Data";
      localStorage.setItem(USER_DATA, JSON.stringify(userDataRes));
      const USER_FRIENDLIST = "User_FriendList";
      localStorage.setItem(USER_FRIENDLIST, JSON.stringify([]));
      const USER_FRIEND_CHAT = "User_Friend_Chat";
      localStorage.setItem(USER_FRIEND_CHAT, JSON.stringify(null));
      const clientUrl = "/sign/up/number";
      urlNavigator(clientUrl, { replace: true });
    } catch (error) {
      console.log(error);
    }
  }
  function usernameF(e: object): void {
    const data = e.target.value;
    setUsername(data);
  }
  function PasswordF(e: object): void {
    const data = e.target.value;
    setPassword(data);
  }
  function login() {
    const url = "/login";
    urlNavigator(url, { replace: true });
  }
  return (
    <div className="w-full h-screen">
      <span className="flex justify-center">
        <h2 className="text-3xl mt-36">Your Profile</h2>
      </span>
      <div className="flex justify-center mt-20 ml-14 mr-14">
        <span className="inline-block w-16 h-16 rounded-full bg-gray-300 mr-2">
          <h5 className="p-5 pl-4 text-white text-[17px]">Add</h5>
        </span>
        <span className="flex w-[80%] flex-col gap-2">
          <input
            className="user-name border-b-2 border-blue-700"
            placeholder="Username"
            value={username}
            onChange={usernameF}
          ></input>
          <input
            className="user-password border-b-2 border-blue-700"
            placeholder="Password"
            value={password}
            onChange={PasswordF}
          ></input>
        </span>
      </div>
      <div className="text-center mt-14">
        <h5 className="mr-14 ml-14 text-center text-[16px] font-medium">
          Edit Your Profile info, which will be visible to your friends
        </h5>
      </div>
      <div className=" flex justify-center ml-14 mr-14">
        <span className="w-full mt-14">
          <button
            className="w-full bg-blue-700 h-12 rounded-xl text-xl text-white"
            onClick={signUpNumber}
          >
            Continue
          </button>
          <button
            className="w-full border-2 mt-7 h-12 rounded-xl text-xl text-green-400 border-green-400"
            onClick={login}
          >
            Login
          </button>
        </span>
      </div>
    </div>
  );
}
export default SignUp;
