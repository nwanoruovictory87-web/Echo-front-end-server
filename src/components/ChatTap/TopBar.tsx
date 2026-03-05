import { userAppContext } from "../AppContext/AppContext";
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
function TopBar() {
  const userDetails: UserDetails = userAppContext();
  const { userData } = userDetails;
  const name = userData ? userData.userLoginData.userName : null;
  return (
    <div className="flex bg-white">
      <span className="ml-5 mt-5 mr-auto">
        <h3 className="font-mono text-[16px]">Hello</h3>
        <h2 className="font-bold text-lg">{name && name}</h2>
      </span>
      <span className="mt-7 mr-5">
        <span className="inline-block border-2 border-slate-500 p-2 pt-3 rounded-full mr-1">
          <i className="fa fa-search text-blue-300 text-2xl"></i>
        </span>
        <span className="inline-block border-2 border-slate-500 p-2 pt-3 rounded-full mr-1">
          <i className="fas fa-ellipsis-v  text-blue-300 text-2xl"></i>
        </span>
      </span>
    </div>
  );
}
export default TopBar;
