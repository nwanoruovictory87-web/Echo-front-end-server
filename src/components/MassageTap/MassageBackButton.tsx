import { useNavigate } from "react-router-dom";
//*=============== object type
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
function MassageBackButton(props: { body: EchoFriend | undefined }) {
  const propsValue = props.body;
  const color: string = "text-white";
  const urlNavigator = useNavigate();

  function back() {
    const url = "/chat";
    urlNavigator(url, { replace: true });
  }
  const data = {
    friendName: propsValue ? propsValue.friendName : "Gust",
    color: color,
  };
  return (
    <div>
      <div className="flex items-center h-16 mt-[45px] ml-7">
        <span className="">
          <i
            className="fa fa-arrow-left text-2xl text-white mr-1"
            onClick={back}
          ></i>
        </span>
        <span className="inline-block w-14 h-14 rounded-full bg-gray-300 mr-2"></span>
        <span className="">
          <span className="flex flex-col ml-1.5 mr-auto">
            <span className="inline-block">
              <h5 className="friend-name text-white text-sm font-bold">
                {data.friendName}
              </h5>
              <h5 className="text-sm text-white">online</h5>
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
export default MassageBackButton;
