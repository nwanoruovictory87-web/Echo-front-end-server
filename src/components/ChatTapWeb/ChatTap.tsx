import TopBar from "./TopBar";
import NavigationBar from "./NavigationBar";
import ChatAdd from "./ChatAdd";
import MassageTapWeb from "../MassageTapWeb/MassageTap";
import ChatAddContact from "./ChatAddContact";
import { useState, useRef, useEffect } from "react";

function ChatTap() {
  const [friendData, setFriendData] = useState();
  const friendDataRef = useRef(null);
  const friendMassageData = {
    setData: () => setFriendData(friendDataRef.current),
    ref: friendDataRef,
  };
  return (
    <div className="flex massage-web-body min-w-[1000px] ">
      <div className="w-[30%] min-w-[300px] ">
        <div className="fixed z-10 w-[30%] min-w-[300px]">
          <TopBar />
          <NavigationBar body={friendMassageData} />
          <div className="flex justify-end mr-4">
            <div className="fixed bottom-0 mb-10">
              <ChatAdd />
            </div>
          </div>
        </div>
      </div>
      <div className="w-[40%] min-w-[340px]">
        <div className="">
          <MassageTapWeb body={friendData} />
        </div>
      </div>
      <div className="w-[30%] min-w-[300px]">
        <div className="fixed w-[30%] min-w-[300px] z-10">
          <ChatAddContact />
        </div>
      </div>
    </div>
  );
}
export default ChatTap;
