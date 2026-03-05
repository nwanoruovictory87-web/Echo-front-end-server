import VideoCallTopBar from "./VideoCallTopBar";
import VideoCallEndBar from "./VideoCallEndBar";
import testImage from "../../assets/test/test.jpg";
import { io } from "socket.io-client";
import { useRef, useEffect } from "react";

// ================= Socket.io connection
const socket = io("http://localhost:5000");

// ================= Load user number from localStorage
const ECHO_Number = "Echo_Number";
const userValue: EchoNumber = JSON.parse(localStorage.getItem(ECHO_Number));

// ================= Load friend number from localStorage
const ECHO_Friend = "Friend_Chat";
const friendValue = JSON.parse(localStorage.getItem(ECHO_Friend));
const friendNumber = friendValue ? friendValue.friendNumber : null;
const userNumber = userValue ? userValue.number : null;

function VideoCall() {
  // ================= PeerConnection stored in a ref so it persists across renders
  const pearRef = useRef<RTCPeerConnection | null>(null);
  if (!pearRef.current) {
    pearRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
  }
  const pear = pearRef.current;

  // ================= Clean up PeerConnection when component unmounts
  useEffect(() => {
    return () => {
      pearRef.current?.close();
      pearRef.current = null;
    };
  }, []);

  // ================= Join the room via Socket.io
  useEffect(() => {
    socket.emit("join-room", userNumber);
  }, []);

  // ================= Local video/audio setup
  useEffect(() => {
    const getLocalStream = async () => {
      try {
        // Request camera + microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Set local video element to show our camera
        const meVideo = document.querySelector(
          ".me-video-end",
        ) as HTMLVideoElement;
        meVideo.srcObject = stream;
        meVideo.muted = true; // mute local video to avoid feedback
        meVideo.onloadedmetadata = () => meVideo.play();

        // Add tracks to PeerConnection so remote peer can receive them
        stream.getTracks().forEach((track) => pear.addTrack(track, stream));

        // If this user is the caller, create an offer after tracks are added
        if (userNumber === "41-1818-1652" && friendNumber) {
          const offer = await pear.createOffer();
          await pear.setLocalDescription(offer);
          console.log("After local offer:", pear.signalingState);
          socket.emit("offer", offer, friendNumber);
        }
      } catch (err) {
        console.error("Error accessing camera/mic:", err);
      }
    };

    getLocalStream();
  }, [pear]);

  // ================= Remote video/audio setup
  useEffect(() => {
    const remoteStream = new MediaStream();

    // Video element for remote video
    const friendVideo = document.querySelector(
      ".friend-video-end",
    ) as HTMLVideoElement;

    // Audio element for remote audio
    const friendAudio = document.createElement("audio");
    friendAudio.autoplay = true;
    friendAudio.srcObject = remoteStream;
    document.body.appendChild(friendAudio); // hidden audio element

    friendVideo.srcObject = remoteStream;

    // Handle incoming tracks
    pear.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
        console.log("Remote track received:", track.kind);
      });

      // Play video/audio safely
      friendVideo.onloadedmetadata = () =>
        friendVideo
          .play()
          .then(() => console.log("Remote video playing"))
          .catch(() =>
            console.warn(
              "Autoplay blocked. Click anywhere to start remote video/audio.",
            ),
          );
    };

    // Fallback: click anywhere to play remote video/audio if autoplay blocked
    const startPlayback = () => {
      friendVideo.play().catch(() => {});
      friendAudio.play().catch(() => {});
      window.removeEventListener("click", startPlayback);
    };
    window.addEventListener("click", startPlayback);
  }, [pear]);

  // ================= ICE Candidate Handling
  useEffect(() => {
    // When this peer finds a candidate, send it to the other peer
    pear.onicecandidate = (event) => {
      if (event.candidate && friendNumber) {
        socket.emit("ice-candidate", event.candidate, friendNumber);
      }
    };

    // Listen for ICE candidates from the remote peer
    const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
      try {
        await pear.addIceCandidate(candidate);
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    };

    socket.on("ice-candidate", handleIceCandidate);

    return () => socket.off("ice-candidate", handleIceCandidate);
  }, [pear]);

  // ================= Answer listener (for caller)
  useEffect(() => {
    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
      console.count("ANSWER HANDLER CALLED");

      // Only apply answer if we are in 'have-local-offer' state
      if (pear.signalingState !== "have-local-offer") {
        console.warn("IGNORED duplicate or invalid answer");
        return;
      }

      try {
        await pear.setRemoteDescription(answer);
        console.log("APPLIED answer");
      } catch (err) {
        console.error("Error applying remote answer:", err);
      }
    };

    socket.off("answer");
    socket.on("answer", handleAnswer);

    return () => socket.off("answer", handleAnswer);
  }, [pear]);

  // ================= Offer listener (for callee)
  useEffect(() => {
    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
      try {
        console.log("Callee BEFORE setRemote:", pear.signalingState);
        await pear.setRemoteDescription(offer);
        console.log("Callee AFTER setRemote:", pear.signalingState);

        // Create answer after remote offer is applied
        const answer = await pear.createAnswer();
        await pear.setLocalDescription(answer);
        console.log("Callee AFTER answer:", pear.signalingState);

        if (friendNumber) socket.emit("answer", answer, friendNumber);
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    socket.off("offer");
    socket.on("offer", handleOffer);

    return () => socket.off("offer", handleOffer);
  }, [pear, friendNumber]);

  // ================= Render UI
  return (
    <div>
      {/* Remote video */}
      <video
        src={testImage}
        className="friend-video-end w-full h-screen"
      ></video>

      {/* Top bar */}
      <div className="absolute w-full top-0">
        <VideoCallTopBar />
      </div>

      {/* Local video */}
      <div className="absolute bottom-0 right-0 mr-7 mb-36">
        <video className="me-video-end w-40 h-60 border-2 rounded-3xl border-blue-500 object-cover"></video>
      </div>

      {/* Bottom call control bar */}
      <div className="fixed w-full bottom-0 mb-8 p-2">
        <VideoCallEndBar />
      </div>
    </div>
  );
}

export default VideoCall;
