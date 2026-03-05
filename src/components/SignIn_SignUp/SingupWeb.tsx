import { useState, useRef } from "react";
import Login from "./LoginWeb";
import SingUpNumber from "./SingUpNumberWeb";

function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userNumber, setUserNumber] = useState<string>("");
  const loginWeb = useRef(null);
  const signUpWeb = useRef(null);
  const signUpNumberWeb = useRef(null);
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
    const userData = {
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
        body: JSON.stringify(userData),
      });
      const res = await data.json();
      if (res.status !== 201) return;
      setUserNumber(res.number);
      signUpWeb ? (signUpWeb.current.style.display = "none") : null;
      signUpNumberWeb
        ? (signUpNumberWeb.current.style.display = "block")
        : null;
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
    signUpWeb ? (signUpWeb.current.style.display = "none") : null;
    loginWeb ? (loginWeb.current.style.display = "block") : null;
  }
  /*
  useImperativeHandle(ref, () => ({
    displaySingup() {
      signUpWeb ? (signUpWeb.current.style.display = "block") : null;
      loginWeb ? (loginWeb.current.style.display = "none") : null;
    },
  }));
  */
  return (
    <div className="w-full">
      <div ref={signUpWeb}>
        <span className="flex justify-center pt-20">
          <h2 className="text-3xl mt-3">Your Profile</h2>
        </span>
        <div className="flex justify-center mt-20 ml-14 mr-14">
          <span className="inline-block w-16 h-16 rounded-full bg-gray-300 mr-2">
            <h5 className="p-5 pl-4 text-white text-[17px]">Add</h5>
          </span>
          <span className="flex w-[80%] flex-col gap-2">
            <input
              className="user-name border-b-2 border-blue-700 bg-[#f9f9f9]"
              placeholder="Username"
              value={username}
              onChange={usernameF}
            ></input>
            <input
              className="user-password border-b-2 border-blue-700 bg-[#f9f9f9]"
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
      <div className="hidden" ref={loginWeb}>
        <Login loginWeb={loginWeb} signUpWeb={signUpWeb} />
      </div>
      <div className="hidden" ref={signUpNumberWeb}>
        <SingUpNumber body={userNumber} />
      </div>
    </div>
  );
}
export default SignUp;
