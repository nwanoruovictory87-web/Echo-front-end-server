import { useState, useEffect } from "react";
//*=============== chat time prop
type ChatTimeProps = {
  textMassageCount: number;
  lastMassageTime: string;
};

function ChatTime(props: {
  body: ChatTimeProps;
  index: number;
  chatIndex: number | undefined;
}) {
  const [isNewMassage, setIsNewMassage] = useState<boolean>(false);
  const [count, setCount] = useState(0);
  const lastSeenText = props.body.lastMassageTime;
  useEffect(() => {
    if (count !== 0) {
      (() => {
        setIsNewMassage(true);
      })();
    }
  }, [count]);
  useEffect(() => {
    //console.log(props.body.textMassageCount);
    if (props.body.textMassageCount !== 0) {
      (() => {
        setCount((prevCount) => prevCount + 1);
      })();
    }
  }, [props.body.textMassageCount]);
  const lastSeenAndNewMassage = isNewMassage ? (
    <span className="inline-block mt-2 bg-[#2563eb] pt-1 pb-1 pl-2.5 pr-2.5 rounded-full">
      <h5 className="text-sm text-white">{count}</h5>
    </span>
  ) : (
    <span className="inline-block mt-2">
      <h5 className="text-gray-600 text-sm">{lastSeenText}</h5>
    </span>
  );
  const isActive = props.index === props.chatIndex ? true : false;
  useEffect(() => {
    if (isActive) {
      (() => {
        setCount((prevCount) => {
          return (prevCount = 0);
        });
        setIsNewMassage(false);
      })();
    }
  }, [isActive]);
  return (
    <>
      {isActive ? (
        <span className="inline-block mt-2">
          <h5 className="text-gray-600 text-sm">{lastSeenText}</h5>
        </span>
      ) : (
        lastSeenAndNewMassage
      )}
    </>
  );
}
export default ChatTime;
