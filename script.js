let videoContainer = document.querySelector(".video-container");
let container = document.querySelector(".container");
let myVideo = document.getElementById("my-video");
let rotateContainer = document.querySelector(".rotate-container");
let videoControls = document.querySelector(".controls");
let playButton = document.getElementById("play-btn");
let pauseButton = document.getElementById("pauseButton");
let volume = document.getElementById("volume");
let volumeRange = document.getElementById("volume-range");
let volumeNum = document.getElementById("volume-num");
let high = document.getElementById("high");
let low = document.getElementById("low");
let mute = document.getElementById("mute");
let sizeScreen = document.getElementById("size-screen");
let screenCompress = document.getElementById("screen-compress");
let screenExpand = document.getElementById("screen-expand");
const currentProgress = document.getElementById("current-progress");
const currentTimeRef = document.getElementById("current-time");
const maxDuration = document.getElementById("max-duration");
const progressBar = document.getElementById("progress-bar");
const playbackSpeedButton = document.getElementById("playback-speed-btn");
const playbackContainer = document.querySelector(".playback");
const playbackSpeedOptions = document.querySelector(".playback-options");

function slider() {
  valPercent = (volumeRange.value / volumeRange.max) * 100;
  volumeRange.style.background = `linear-gradient(to right, #2887e3 ${valPercent}%, #000000 ${valPercent}%)`;
}

//events object
let events = {
  mouse: {
    click: "click",
  },
  touch: {
    click: "touchstart",
  },
};

let deviceType = "";

//Detech touch device
const isTouchDevice = () => {
  try {
    //We try to create TouchEvent (it would fail for desktops and throw error)
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

//play and pause button
playButton.addEventListener("click", () => {
  myVideo.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

pauseButton.addEventListener(
  "click",
  (pauseVideo = () => {
    myVideo.pause();
    pauseButton.classList.add("hide");
    playButton.classList.remove("hide");
  })
);

//playback
playbackContainer.addEventListener("click", () => {
  playbackSpeedOptions.classList.remove("hide");
});

//if user clicks outside or on the option
window.addEventListener("click", (e) => {
  if (!playbackContainer.contains(e.target)) {
    playbackSpeedOptions.classList.add("hide");
  } else if (playbackSpeedOptions.contains(e.target)) {
    playbackSpeedOptions.classList.add("hide");
  }
});

//playback speed
const setPlayback = (value) => {
  playbackSpeedButton.innerText = value + "x";
  myVideo.playbackRate = value;
};

//mute video
const muter = () => {
  mute.classList.remove("hide");
  high.classList.add("hide");
  low.classList.add("hide");
  myVideo.volume = 0;
  volumeNum.innerHTML = 0;
  volumeRange.value = 0;
  slider();
};

//when user click on high and low volume then mute the audio
high.addEventListener("click", muter);
low.addEventListener("click", muter);

//for volume
volumeRange.addEventListener("input", () => {
  //for converting % to decimal values since video.volume would accept decimals only
  let volumeValue = volumeRange.value / 100;
  myVideo.volume = volumeValue;
  volumeNum.innerHTML = volumeRange.value;
  //mute icon, low volume, high volume icons
  if (volumeRange.value < 50) {
    low.classList.remove("hide");
    high.classList.add("hide");
    mute.classList.add("hide");
  } else if (volumeRange.value > 50) {
    low.classList.add("hide");
    high.classList.remove("hide");
    mute.classList.add("hide");
  }
});

//Screen size
screenExpand.addEventListener("click", () => {
  screenCompress.classList.remove("hide");
  screenExpand.classList.add("hide");
  
  // Request full screen and adjust styles
  videoContainer.requestFullscreen()
    .then(() => {
      videoContainer.style.display = "flex";
      videoContainer.style.justifyContent = "center";
      videoContainer.style.alignItems = "center";
    })
    .catch((err) => alert("Your device doesn't support full screen API"));
  
  if (isTouchDevice) {
    let screenOrientation =
      screen.orientation || screen.mozOrientation || screen.msOrientation;
    if (screenOrientation.type == "portrait-primary") {
      // Update styling for fullscreen
      pauseVideo();
      rotateContainer.classList.remove("hide");
      const myTimeout = setTimeout(() => {
        rotateContainer.classList.add("hide");
      }, 3000);
    }
  }
});


//if user presses escape the browser fire 'fullscreenchange' event
document.addEventListener("fullscreenchange", exitHandler);
document.addEventListener("webkitfullscreenchange", exitHandler);
document.addEventListener("mozfullscreenchange", exitHandler);
document.addEventListener("MSFullscreenchange", exitHandler);

function exitHandler() {
  //if fullscreen is closed
  if (
    !document.fullscreenElement &&
    !document.webkitIsFullScreen &&
    !document.mozFullScreen &&
    !document.msFullscreenElement
  ) {
    normalScreen();
  }
}

//back to normal screen
screenCompress.addEventListener(
  "click",
  (normalScreen = () => {
    screenCompress.classList.add("hide");
    screenExpand.classList.remove("hide");
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  })
);

//Format time
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

//Update progress every second
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(myVideo.currentTime);
  currentProgress.style.width =
    (myVideo.currentTime / myVideo.duration.toFixed(3)) * 100 + "%";
}, 1000);

//update timer
myVideo.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(myVideo.currentTime);
});

//If user click on progress bar
isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
  //start of progressbar
  let coordStart = progressBar.getBoundingClientRect().left;
  //mouse click position
  let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;
  //set width to progress
  currentProgress.style.width = progress * 100 + "%";
  //set time
  myVideo.currentTime = progress * myVideo.duration;
  //play
  myVideo.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

window.onload = () => {
  //display duration
  myVideo.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(myVideo.duration);
  };
  slider();
};

const dropZone = document.getElementById('dropZone');
const videoPlayer = document.getElementById('my-video');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight the drop zone when a draggable item is dragged over it
['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, highlight, false);
});

// Remove the highlight when a draggable item is dragged outside the drop zone
['dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, unhighlight, false);
});

// Handle the dropped file and play it in the video player
dropZone.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight() {
  dropZone.classList.add('highlight');
}

function unhighlight() {
  dropZone.classList.remove('highlight');
}

function handleDrop(e) {
  const { files } = e.dataTransfer;
  if (files.length > 0) {
    const videoFile = files[0];
    if (videoFile.type.includes('video')) {
      const videoURL = URL.createObjectURL(videoFile);
      videoPlayer.src = videoURL;
      videoPlayer.load();
      videoPlayer.play();
    } else {
      alert('Invalid file format. Please drop a valid video file.');
    }
  }
}

document.body.addEventListener("keydown", (event) => {
    if (event.keyCode === 32) {
      // Space bar keycode is 32
      if (myVideo.paused) {
        myVideo.play();
        pauseButton.classList.remove("hide");
        playButton.classList.add("hide");
      } else {
        myVideo.pause();
        pauseButton.classList.add("hide");
        playButton.classList.remove("hide");
      }
    }
  });
  
  // Right arrow key to skip forward 10 seconds
  document.body.addEventListener("keydown", (event) => {
    if (event.keyCode === 39) {
      // Right arrow key keycode is 39
      myVideo.currentTime += 10;
    }
  });
  
  // Left arrow key to skip backward 10 seconds
  document.body.addEventListener("keydown", (event) => {
    if (event.keyCode === 37) {
      // Left arrow key keycode is 37
      myVideo.currentTime -= 10;
    }
  });
  
  // Full screen on "F" key press
  document.body.addEventListener("keydown", (event) => {
    if (event.keyCode === 70) {
      // "F" key keycode is 70
      if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch((err) => {
          alert("Your device doesn't support full screen API");
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }
  });

/*
// Replace 'VIDEO_ID' with the actual YouTube video ID
var videoId = 'h6Ol3eprKiw&pp=ygUNbmV2ZXIgZ2l2ZSB1cA%3D%3D';

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: videoId,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  // Handle video state changes if needed
}
*/

