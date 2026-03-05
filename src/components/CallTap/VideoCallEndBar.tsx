function VideoCallEndBar() {
  return (
    <div className="video-call-end-bar ml-5 mr-5 mt-10 flex p-3 pl-0 pr-0 rounded-full">
      <span className="inline-block ml-auto border-2 p-3 pt-4 rounded-full mr-auto bg-bl">
        <i className="fa fa-video-slash text-white text-2xl"></i>
      </span>
      <span className="inline-block border-2 p-3 pt-4 mr-auto rounded-full">
        <i className="fas fa-microphone-slash  text-white text-2xl"></i>
      </span>
      <span className="inline-block border-2 p-3 pt-4 rounded-full mr-auto">
        <i className="fa fa-volume-high text-white text-2xl"></i>
      </span>
      <span className="phone inline-block border-2 p-3 pt-4 mr-auto rounded-full">
        <i className="fas fa-phone  text-white text-2xl"></i>
      </span>
    </div>
  );
}
export default VideoCallEndBar;
