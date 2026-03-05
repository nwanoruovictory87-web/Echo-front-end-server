function MassageVideoChat() {
  function videoCall() {
    const url = "video/call";
    window.location.replace(url);
  }
  function audioCall() {
    const url = "audio/call";
    window.location.replace(url);
  }
  return (
    <span className="flex w-32 h-20 justify-center items-center">
      <span className="inline-block border-2 border-slate-500 p-2 pt-3 rounded-full mr-1">
        <i
          className="fa fa-video text-blue-300 text-2xl"
          onClick={videoCall}
        ></i>
      </span>
      <span className="inline-block border-2 border-slate-500 p-2 pt-3 rounded-full">
        <i
          className="fa fa-phone text-blue-300 text-2xl"
          onClick={audioCall}
        ></i>
      </span>
    </span>
  );
}
export default MassageVideoChat;
