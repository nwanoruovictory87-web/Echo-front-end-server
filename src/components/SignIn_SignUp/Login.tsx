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
  friendChat: object[] | undefined;
  setFriendChat: void;
  setUserData: void;
  setUserFriendList: void;
  userData: UserData;
  userFriendList: FriendListOfArrayObject[];
};
function Login() {
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [phoneCanculeInput, setPhoneCanculeInput] = useState<number>(0);
  const userDetails: UserDetails = userAppContext();
  const { setUserData, setUserFriendList, setFriendChat } = userDetails;
  const urlNavigator = useNavigate();
  //*================= store an validate phone input
  function phoneF(e) {
    const data = e.target.value;
    const splitData = data.split("");
    //*=============== cansule input before it gets to being formated
    if (splitData.length < phoneCanculeInput) {
      setPhoneInput(data);
      setPhoneCanculeInput(splitData.length);
      return;
    } else {
      setPhoneCanculeInput(splitData.length);
    }
    //*============== validate phone input
    const phoneBoderUi = document.querySelector(".phone-in");
    if (!Number(splitData[0])) return (phoneBoderUi.style.borderColor = "red");
    phoneBoderUi.style.borderColor = "blue";
    //*================ format input to Echo standerd number
    if (splitData.length === 2) {
      const format2 = `${data}-`;
      setPhoneInput(format2);
    } else if (splitData.length === 7) {
      const format4 = `${data}-`;
      setPhoneInput(format4);
    } else if (splitData.length === 12) {
      setPhoneInput(data);
    } else if (splitData.length > 12) {
      //12-34567-891099
      const format10Digits = [];
      for (let i = 0; i < 12; i++) {
        format10Digits.push(splitData[i]);
      }
      const format10 = format10Digits.join("");
      setPhoneInput(format10);
      return;
    } else {
      setPhoneInput(data);
    }
  }

  function PasswordF(e) {
    const data = e.target.value;
    const splitData = data.split("");
    //*============== validate password input !== null
    const passwordBoderUi = document.querySelector(".password-in");
    if (data.trim() === "") {
      if (splitData.length !== 0) {
        //*=============== only validate on splace '' and not value
        return (passwordBoderUi.style.borderColor = "red");
      }
    }
    passwordBoderUi.style.borderColor = "blue";
    setPasswordInput(data);
  }
  //*=============== validate user login requst
  async function login() {
    const phoneBoderUi = document.querySelector(".phone-in");
    const passwordBoderUi = document.querySelector(".password-in");
    //*=============== validate phone and password !==  null
    if (phoneInput.trim() === "" && passwordInput.trim() === "")
      return (
        (phoneBoderUi.style.borderColor = "red"),
        (passwordBoderUi.style.borderColor = "red")
      );
    if (phoneInput.trim() === "")
      return (phoneBoderUi.style.borderColor = "red");
    if (passwordInput.trim() === "")
      return (passwordBoderUi.style.borderColor = "red");
    phoneBoderUi.style.borderColor = "blue";
    passwordBoderUi.style.borderColor = "blue";
    //*=============== send user login requst
    const data = {
      userNumber: phoneInput,
      userPassword: passwordInput,
    };
    try {
      const serverUrl = "http://localhost:5000/user/v/login";
      const loginUser = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responds = await loginUser.json();
      const loginErrorUi = document.querySelector(".login-error-ui");
      if (responds.status !== 200)
        return (
          (loginErrorUi.textContent = responds.massage),
          (loginErrorUi.style.color = "red")
        );
      loginErrorUi.textContent = "";
      const userLoginData: UserloginData = {
        number: responds.number,
        authorization: responds.authorization,
        userName: responds.userName,
        userImage: "",
      };
      const userData = {
        userLoginData: userLoginData,
        userMassageNotificationTon: null,
        userCallRingintone: null,
      };
      setUserData((prevUserData: UserData) => (prevUserData = userData));
      const USER_DATA = "User_Data";
      localStorage.setItem(USER_DATA, JSON.stringify(userData));
      const USER_FRIENDLIST = "User_FriendList";
      localStorage.setItem(USER_FRIENDLIST, JSON.stringify([]));
      const USER_FRIEND_CHAT = "User_Friend_Chat";
      localStorage.setItem(USER_FRIEND_CHAT, JSON.stringify(null));
      const url = "/chat";
      urlNavigator(url, { replace: true });
    } catch (error) {
      console.log(error);
    }
  }
  function signUp() {
    const url = "/sign/up";
    urlNavigator(url, { replace: true });
  }

  return (
    <div className="w-full h-screen">
      <span className="flex justify-center">
        <h2 className="text-3xl mt-36">Welcome back</h2>
      </span>
      <div className="flex justify-center mt-20 ml-14 mr-14">
        <span className="inline-block w-16 h-16 rounded-full bg-gray-300 mr-2">
          <h5 className="p-5 pl-4 text-white text-[17px]">Edit</h5>
        </span>
        <span className="flex w-[80%] flex-col gap-2">
          <input
            className="phone-in border-b-2 border-blue-700"
            placeholder="Echo Number"
            value={phoneInput}
            onChange={phoneF}
          ></input>
          <input
            className="password-in border-b-2 border-blue-700"
            placeholder="Password"
            value={passwordInput}
            onChange={PasswordF}
          ></input>
        </span>
      </div>
      <span className="block text-center mt-4">
        <h5 className="login-error-ui"></h5>
      </span>
      <div className="text-center mt-12">
        <h5 className="mr-14 ml-14 text-center text-[16px] font-medium">
          Login to connnect with friends and family
        </h5>
      </div>
      <div className=" flex justify-center ml-14 mr-14">
        <span className="w-full mt-14">
          <button
            className="w-full  h-12 rounded-xl text-xl border-2 text-green-400 border-green-400"
            onClick={login}
          >
            Continue
          </button>
          <button
            className="w-full  mt-7 h-12 rounded-xl text-xl bg-blue-700 text-white"
            onClick={signUp}
          >
            Sign up
          </button>
        </span>
      </div>
    </div>
  );
}
export default Login;
