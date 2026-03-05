function VideoCallTopBar() {
  return (
    <div className=" ml-5 mr-5 mt-10 flex">
      <span className="inline-block w-14 h-14 rounded-full bg-gray-300 mr-2"></span>
      <span className="block mt-2 mr-auto">
        <h5 className="text-sm">Larry Machigo</h5>
        <h5 className="text-sm text-gray-500">online</h5>
      </span>
      <span className="inline-block border-2 border-slate-500 p-3 rounded-full mr-1">
        <i className="fa fa-user text-blue-300 text-2xl"></i>
      </span>
      <span className="inline-block border-2 border-slate-500 p-3 rounded-full">
        <i className="fas fa-ellipsis-v  text-blue-300 text-2xl"></i>
      </span>
    </div>
  );
}
export default VideoCallTopBar;
