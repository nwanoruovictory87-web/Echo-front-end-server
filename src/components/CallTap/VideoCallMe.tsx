import testImage from "../../assets/test2/test.jpg";
function VideoCallMe() {
  return (
    <div>
      <video
        src={testImage}
        className="me-video-end w-40 h-60 border-2 rounded-3xl border-blue-700"
      ></video>
    </div>
  );
}
export default VideoCallMe;
