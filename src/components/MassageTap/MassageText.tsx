import { userAppContext } from "../AppContext/AppContext";
import { useRef } from "react";
//*=============== echo types
type ChatData = {
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

function MassageText(props: { body: ChatData[] | undefined }) {
  const currentChatDate = useRef(null);
  const userDetails: UserDetails = userAppContext();
  const { userData } = userDetails;
  //*=============== get user number
  const userNumber = userData && userData.userLoginData.number;
  const chat: ChatData[] | undefined = props.body;
  const fullDate = new Date();
  const dataDay = fullDate.getDate();
  const dateMonth = fullDate.getMonth() + 1;
  const dateYear = fullDate.getFullYear();
  //console.log(typeof dataDay);
  //*=============== func to check chat date and chat text
  const dayUi = (day: string, key: number) => {
    if (day === dataDay.toString()) {
      return (
        <span className=" bg-transparent flex justify-center" key={key + 0.2}>
          <span className=" dateUi w-fit bg-[#2859c5b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
            <h5 className="text-gray-200 text-xl font-[Inter] break-words">
              today
            </h5>
          </span>
        </span>
      );
    } else if (
      day !== dataDay.toString() &&
      (Number(day) + 1).toString() === dataDay.toString()
    ) {
      return (
        <span className=" bg-transparent flex justify-center" key={key + 0.2}>
          <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
            <h5 className="text-gray-200 text-xl font-[Inter] break-words">
              yesterday
            </h5>
          </span>
        </span>
      );
    } else if (
      day !== dataDay.toString() &&
      (Number(day) + 2).toString() === dataDay.toString()
    ) {
      return (
        <span className=" bg-transparent flex justify-center" key={key + 0.2}>
          <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
            <h5 className="text-gray-200 text-xl font-[Inter] break-words">
              2 days ago
            </h5>
          </span>
        </span>
      );
    } else if (
      day !== dataDay.toString() &&
      (Number(day) + 3).toString() === dataDay.toString()
    ) {
      return (
        <span className=" bg-transparent flex justify-center" key={key + 0.2}>
          <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
            <h5 className="text-gray-200 text-xl font-[Inter] break-words">
              3 days ago
            </h5>
          </span>
        </span>
      );
    } else if (
      day !== dataDay.toString() &&
      (Number(day) + 4).toString() === dataDay.toString()
    ) {
      return (
        <span className=" bg-transparent flex justify-center" key={key + 0.2}>
          <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
            <h5 className="text-gray-200 text-xl font-[Inter] break-words">
              4 days ago
            </h5>
          </span>
        </span>
      );
    } else if (
      day !== dataDay.toString() &&
      (Number(day) + 5).toString() === dataDay.toString()
    ) {
      <span className=" bg-transparent flex justify-center" key={key + 0.2}>
        <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
          <h5 className="text-gray-200 text-xl font-[Inter] break-words">
            5 days ago
          </h5>
        </span>
      </span>;
    } else if (
      day !== dataDay.toString() &&
      (Number(day) + 6).toString() === dataDay.toString()
    ) {
      <span className=" bg-transparent flex justify-center" key={key + 0.2}>
        <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
          <h5 className="text-gray-200 text-xl font-[Inter] break-words">
            6 days ago
          </h5>
        </span>
      </span>;
    } else if (
      day !== dataDay.toString() &&
      (Number(day) + 7).toString() <= dataDay.toString()
    ) {
      <span className=" bg-transparent flex justify-center" key={key + 0.2}>
        <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
          <h5 className="text-gray-200 text-xl font-[Inter] break-words">
            recently
          </h5>
        </span>
      </span>;
    }
  };
  function monthUi(month: string, key: number) {
    if ((Number(month) + 1).toString() === dateMonth.toString()) {
      return (
        <span className=" bg-transparent flex justify-center" key={key + 0.2}>
          <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
            <h5 className="text-gray-200 text-xl font-[Inter] break-words">
              1 month ago
            </h5>
          </span>
        </span>
      );
    } else if ((Number(month) + 2).toString() === dateMonth.toString()) {
      return (
        <span className=" bg-transparent flex justify-center" key={key + 0.2}>
          <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
            <h5 className="text-gray-200 text-xl font-[Inter] break-words">
              2 month ago
            </h5>
          </span>
        </span>
      );
    } else if ((Number(month) + 3).toString() === dateMonth.toString()) {
      return (
        <span className=" bg-transparent flex justify-center" key={key + 0.2}>
          <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
            <h5 className="text-gray-200 text-xl font-[Inter] break-words">
              3 month ago
            </h5>
          </span>
        </span>
      );
    } else if ((Number(month) + 4).toString() === dateMonth.toString()) {
      return (
        <span className=" bg-transparent flex justify-center" key={key + 0.2}>
          <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
            <h5 className="text-gray-200 text-xl font-[Inter] break-words">
              4 month ago
            </h5>
          </span>
        </span>
      );
    } else if ((Number(month) + 5).toString() === dateMonth.toString()) {
      return (
        <span className=" bg-transparent flex justify-center" key={key + 0.2}>
          <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
            <h5 className="text-gray-200 text-xl font-[Inter] break-words">
              5 month ago
            </h5>
          </span>
        </span>
      );
    } else if ((Number(month) + 6).toString() <= dateMonth.toString()) {
      return (
        <span className=" bg-transparent flex justify-center" key={key + 0.2}>
          <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
            <h5 className="text-gray-200 text-xl font-[Inter] break-words">
              few month ago
            </h5>
          </span>
        </span>
      );
    }
  }
  const yearUi = (key: number) => {
    return (
      <span className=" bg-transparent flex justify-center" key={key + 0.2}>
        <span className="dateUi w-fit bg-[#2b58b8b7] pl-5 pr-5 pt-0.5 pb-0.5 text-center rounded-full">
          <h5 className="text-gray-200 text-xl font-[Inter] break-words">
            few years ago
          </h5>
        </span>
      </span>
    );
  };
  const dateUiFuc = (chatDate: string, key: number) => {
    const day = Number(chatDate.split("/")[0]).toString();
    const month = Number(chatDate.split("/")[1]).toString();
    const year = chatDate.split("/")[2];
    if (month === dateMonth.toString() && year === dateYear.toString()) {
      return dayUi(day, key);
    } else if (month !== dateMonth.toString() && year === dateYear.toString()) {
      return monthUi(month, key);
    } else if (year !== dateYear.toString()) {
      return yearUi(key);
    }
  };
  const upDateChatUi = () => {
    let chatDate = null;
    let tembChatDate: string | null = null;
    const data = chat.map((e: ChatData, i: number) => {
      const image = e.url;
      chatDate = e.date;
      const dateUiCall =
        chatDate && tembChatDate !== chatDate
          ? ((tembChatDate = chatDate), dateUiFuc(chatDate, i))
          : null;

      if (e.from !== userNumber && e.type === "text") {
        return (
          <>
            {dateUiCall}
            <span
              className="block w-fit max-w-[300px] h-fit bg-[#f1f1f1] p-[12px] pl-[15px] pr-[15px] rounded-bl-[30px] rounded-e-3xl overflow-hidden text-box-right"
              key={i}
            >
              <h5 className="text-[#242222c5] text-xl font-[Inter] break-words">
                {e.massage}
              </h5>
              <h5 className="text-[#242222c5] text-sm font-[Inter] pt-2 mb-[-5px]">
                {e.time}
              </h5>
            </span>
          </>
        );
      } else if (e.type === "image") {
        if (e.from === userNumber) {
          return (
            <>
              {dateUiCall}
              <span
                className="ml-auto block w-fit h-38 max-w-[300px] max-h-38 overflow-hidden text-image rounded-xl p-0.5 bg-blue-500"
                key={i}
              >
                <img
                  src={image}
                  className="w-[300px] h-38 rounded-xl"
                  alt="image"
                ></img>
                <h5 className="text-[#f9f9f9] text-sm font-[Inter] pt-1.5 pl-1.5">
                  {e.time}
                </h5>
              </span>
            </>
          );
        } else if (e.from !== userNumber) {
          return (
            <>
              {dateUiCall}
              <span
                className="block w-fit h-38 max-w-[300px] max-h-38 overflow-hidden text-image rounded-xl p-0.5 bg-[#f1f1f1]"
                key={i}
              >
                <img
                  src={image}
                  className="w-[300px] h-38 rounded-xl"
                  alt="image"
                ></img>
                <h5 className="text-[#242222c5] text-sm font-[Inter] pt-1.5 pl-1.5">
                  {e.time}
                </h5>
              </span>
            </>
          );
        }
      } else if (e.type === "mixed") {
        if (e.from === userNumber) {
          return (
            <>
              {dateUiCall}
              <span
                className="ml-auto block w-fit h-38 max-w-[300px] max-h-38 overflow-hidden text-image rounded-xl p-0.5 bg-blue-500"
                key={i}
              >
                <img
                  src={image}
                  className="w-[300px] h-38 rounded-xl"
                  alt="image"
                ></img>
                <h5 className="text-[#f9f9f9] text-sm font-[Inter] pt-1.5 pl-1.5">
                  {e.time}
                </h5>
              </span>
              <span
                className="ml-auto block w-fit max-w-[300px] h-fit bg-blue-500 p-[12px] pl-[15px] pr-[15px] rounded-br-[30px] rounded-s-3xl overflow-hidden text-box-left"
                key={i + 0.5}
              >
                <h5 className="text-[#f9f9f9] text-xl font-[Inter] break-words">
                  {e.massage}
                </h5>
                <h5 className="text-[#f9f9f9] text-sm font-[Inter] pt-2 mb-[-5px]">
                  {e.time}
                </h5>
              </span>
            </>
          );
        } else {
          return (
            <>
              {dateUiCall}
              <span
                className="block w-fit h-38 max-w-[300px] max-h-38 overflow-hidden text-image rounded-xl p-0.5 bg-[#f1f1f1]"
                key={i}
              >
                <img
                  src={image}
                  className="w-[300px] h-38 rounded-xl"
                  alt="image"
                ></img>
                <h5 className="text-[#242222c5] text-sm font-[Inter] pt-1.5 pl-1.5">
                  {e.time}
                </h5>
              </span>
              <span
                className="block w-fit max-w-[300px] h-fit bg-[#f1f1f1] p-[12px] pl-[15px] pr-[15px] rounded-bl-[30px] rounded-e-3xl overflow-hidden text-box-right"
                key={i + 0.5}
              >
                <h5 className="text-[#242222c5] text-xl font-[Inter] break-words">
                  {e.massage}
                </h5>
                <h5 className="text-[#242222c5] text-sm font-[Inter] pt-2 mb-[-5px]">
                  {e.time}
                </h5>
              </span>
            </>
          );
        }
      } else if (e.from === userNumber) {
        if (e.type === "text") {
          return (
            <>
              {dateUiCall}
              <span
                className="ml-auto block w-fit max-w-[300px] h-fit bg-blue-500 p-[12px] pl-[15px] pr-[15px] rounded-br-[30px] rounded-s-3xl overflow-hidden text-box-left"
                key={i}
              >
                <h5 className="text-[#f9f9f9] text-xl font-[Inter] break-words">
                  {e.massage}
                </h5>
                <h5 className="text-[#f9f9f9] text-sm font-[Inter] pt-2 mb-[-5px]">
                  {e.time}
                </h5>
              </span>
            </>
          );
        }
      }
    });
    return data;
  };
  const chatUPdate = upDateChatUi();
  //console.log(fullDate.getFullYear());
  const startNewMassageUi = () => {
    return (
      <div className="flex justify-center mt-10">
        <span className="inline-block bg-[#f1f1f1] w-fit pl-5 pr-4 pt-2 pb-2 rounded-full no-massage-box">
          <h5 className="text-[#161616c5] text-xl font-[Inter]">
            No Massages. Say Hi👋
          </h5>
        </span>
      </div>
    );
  };
  const knowMassageUi = chat?.length !== 0 ? null : startNewMassageUi();
  return (
    <div className="flex flex-col gap-[10px]">
      {knowMassageUi ? knowMassageUi : chatUPdate}
    </div>
  );
}
export default MassageText;
