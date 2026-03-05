import { useState, useEffect } from "react";
//*=============== chat time prop
type ChatTimeProps = {
  textMassageCount: number;
  lastMassageTime: string;
};
function ChatTime(props: { body: ChatTimeProps }) {
  const [isNewMassage, setIsNewMassage] = useState<boolean>(false);
  const count = props.body.textMassageCount;
  const lastSeenText = props.body.lastMassageTime;
  useEffect(() => {
    if (count !== 0) {
      (() => {
        setIsNewMassage(true);
      })();
    }
  }, [count]);
  const lastSeenAndNewMassage = isNewMassage ? (
    <span className="inline-block mt-2 bg-[#2563eb] pt-1 pb-1 pl-2.5 pr-2.5 rounded-full">
      <h5 className="text-sm text-white">{count}</h5>
    </span>
  ) : (
    <span className="inline-block mt-2">
      <h5 className="text-gray-600 text-sm">{lastSeenText}</h5>
    </span>
  );
  return <>{lastSeenAndNewMassage}</>;
}
export default ChatTime;
