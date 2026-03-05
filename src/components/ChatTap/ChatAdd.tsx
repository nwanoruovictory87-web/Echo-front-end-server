function ChatAdd() {
  function addContact() {
    const url = "/chat/add/contact";
    window.location.assign(url);
  }
  return (
    <div className="fixed right-0 mr-5 bottom-0 mb-10 z-10">
      <span
        className="bg-blue-700 w-14 h-14 rounded-full inline-block"
        onClick={addContact}
      >
        <span className="inline-block w-8 h-8 rounded-full mt-3 ml-3 border-4 border-l-blue-700  border-r-blue-700 ">
          <span className="inline-block absolute left-0 mt-[1.5px] ml-[12.5px] w-[30px] h-[20.5px] rounded-full border-4 border-t-blue-700  border-b-blue-700"></span>
        </span>
      </span>
    </div>
  );
}
export default ChatAdd;
