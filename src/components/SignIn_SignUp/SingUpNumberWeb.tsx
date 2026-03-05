import { useEffect } from "react";

type Number = {
  body: string;
};

function SingUpNumber(props: Number) {
  console.log(props);
  useEffect(() => {
    const ECHO = "Echo_Number";
    const userNumber = {
      number: props.body,
    };
    localStorage.setItem(ECHO, JSON.stringify(userNumber));
  }, [props.body]);
  function chat() {
    const url = "/chat/web";
    window.location.assign(url);
  }
  return (
    <div className="w-full">
      <span className="flex justify-center">
        <h5 className="mt-20 text-4xl font-bold text-blue-700">{props.body}</h5>
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
      <div className="absolute w-full bottom-0 mb-6">
        <span className="flex justify-center">
          <h5 className="text-3xl font-bold text-blue-700">Echo</h5>
        </span>
      </div>
    </div>
  );
}
export default SingUpNumber;
