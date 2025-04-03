var video;
var bandwidth;
var conference;
var pin;

var rtc = null;

/* ~~~ SETUP AND TEARDOWN ~~~ */

function finalise(event) {
  rtc.disconnect();
  video.src = "";
}

function remoteDisconnect(reason) {
  //cleanup();
  //alert(reason);
  window.removeEventListener("beforeunload", finalise);
  //window.close();

  // Hide the footer when disconnected
  document.getElementById("controls").style.display = "none"; // Hide the footer
  
  // Optionally, you can log the reason for disconnection
  console.log("Disconnected: " + reason);
}

function doneSetup(videoURL, pin_status) {
  console.log("PIN status: " + pin_status);
  rtc.connect(pin);
}

function connected(videoURL) {
  video.poster = "";

  // Make sure the video element is visible again
  video.style.display = "block"; // Show the video element
  
  if (typeof MediaStream !== "undefined" && videoURL instanceof MediaStream) {
    video.srcObject = videoURL;
  } else {
    video.src = videoURL;
  }
  // Show the footer controls when connected
  document.getElementById("controls").style.display = "block"; // Show the footer
}

function feccHandler(signal) {
  console.log("WHAT THE FECC YO");
  onFecc(signal);
}

function handleApplicationMessage(message) {
  handleFeecMessage(message, rtc);
}

function initialise(
  node,
  conference,
  userbw,
  name,
  userpin,
  registration_token,
  oneTimeToken
) {
  video = document.getElementById("video");
  console.log("Bandwidth: " + userbw);
  console.log("Conference: " + conference);

  pin = userpin;
  bandwidth = parseInt(userbw);

  rtc = new PexRTC();
  rtc.registration_token = registration_token;
  rtc.oneTimeToken = oneTimeToken;
  //console.log('LOOK HERE', videoSelect.value);
  rtc.fecc_supported = true;
  rtc.video_source = videoSelect.value;
  window.addEventListener("beforeunload", finalise);

  rtc.onSetup = doneSetup;
  rtc.onConnect = connected;
  rtc.onError = remoteDisconnect;
  rtc.onDisconnect = remoteDisconnect;
  rtc.onFECC = feccHandler;
  rtc.onApplicationMessage = handleApplicationMessage;

  rtc.makeCall(node, conference, name, bandwidth);
}

try {
  const stream = navigator.mediaDevices.getUserMedia({
    video: { pan: true, tilt: true, zoom: true },
  });
} catch (error) {
  console.log(error);
}


function endCall() {
  console.log("User wants to end the call.");
  rtc.disconnect();
  video = document.querySelector('video#video.mediastream');
  // video.srcObject = "";
  video.style.display="none";
  // Hide the footer controls
  document.getElementById("controls").style.display = "none"; // Hide the footer
}
