import { userAppContext } from "../AppContext/AppContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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
function SingUpNumber() {
  const userDetails: UserDetails | null = userAppContext();
  const { userData } = userDetails;
  const urlNavigator = useNavigate();
  console.log(userDetails);
  const echoNumber = userData && userData.userLoginData.number;
  const userNumber = echoNumber ? echoNumber : null;
  console.log(userNumber);
  function chat() {
    const url = "/chat";
    urlNavigator(url, { replace: true });
  }

  return (
    <div className="w-full h-screen">
      <span className="flex justify-center">
        <h5 className="mt-32 text-4xl font-bold text-blue-700">{userNumber}</h5>
      </span>
      <span className="flex mt-10 justify-center mr-7 ml-7 text-center">
        <h5 className="text-xl font-semibold">
          This is your Echo Number Continue into your account or you will lose
          access to your account
        </h5>
      </span>
      <span className="flex mr-12 ml-12 text-center mt-20">
        <h5 className="text-lg font-medium text-gray-500">
          Use your Echo Number to text calls and connect to friends on Echo
        </h5>
      </span>
      <span className="flex mr-12 ml-12 text-center mt-24">
        <button
          className="w-full bg-blue-700 h-12 rounded-md text-lg text-white"
          onClick={chat}
        >
          Continue
        </button>
      </span>
      <div className="absolute w-full bottom-0 mb-16">
        <span className="flex justify-center">
          <h5 className="text-3xl font-bold text-blue-700">Echo</h5>
        </span>
      </div>
    </div>
  );
}
export default SingUpNumber;
