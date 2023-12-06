const container = document.querySelector(".video__section");
const mainVideo = container.querySelector("video");
const currentVideoTime = container.querySelector(".current-time");
const videoDuration = container.querySelector(".video-duration");
const body = document.querySelector("body");

let timer;
const hideControlls = () => {
  if (mainVideo.paused) return;

  timer = setTimeout(() => {
    container.classList.remove("show-controlls");
  }, 2000);
};
hideControlls();

container.addEventListener("mousemove", () => {
  container.classList.add("show-controlls");
  clearTimeout(timer);
  hideControlls();
});

// Buttons
const volumeButton = container.querySelector(".volume i");
const playPauseButton = container.querySelector(".play-pause i");
const stopButton = container.querySelector(".stop i");
const skipBackwardButton = container.querySelector(".skip-backward i");
const skipForwardButton = container.querySelector(".skip-forward i");
const speedButton = container.querySelector(".playback-speed i");
const speedOptions = container.querySelector(".speed-options");
const picInPicButton = container.querySelector(".pic-in-pic i");
const fullScreenButton = container.querySelector(".fullscreen i");
const themeButton = document.querySelector(".themeButton i");

// Sliders
const progressBar = container.querySelector(".progress-bar");
const videoTimeLine = container.querySelector(".video-timeline");
const volumeSlider = container.querySelector(".left input");

// Volume functionality
volumeButton.addEventListener("click", () => {
  if (volumeButton.classList.contains("fa-volume-xmark")) {
    mainVideo.volume = 0.5;
    volumeButton.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    mainVideo.volume = 0.0;
    volumeButton.classList.replace("fa-volume-high", "fa-volume-xmark");
  }

  volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", (event) => {
  mainVideo.volume = event.target.value;

  if (mainVideo.volume == 0) {
    volumeButton.classList.replace("fa-volume-high", "fa-volume-xmark");
  } else {
    volumeButton.classList.replace("fa-volume-xmark", "fa-volume-high");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    mainVideo.volume += 0.1;
    volumeSlider.value = mainVideo.volume + 0.1;

  } else if (event.key === "ArrowDown" && mainVideo.volume > 0) {
    mainVideo.volume -= 0.1;
    volumeSlider.value = mainVideo.volume - 0.1;


  } else if (event.key === "m" || event.key === "M") {
    if (mainVideo.volume === 0) {
      mainVideo.volume = 0.5;
      volumeSlider.value = 0.5;
      volumeButton.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
      mainVideo.volume = 0;
      volumeSlider.value = 0;
      volumeButton.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
  }

  if (event.key === " ") {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
  }

  if (event.key === "ArrowLeft") {
    mainVideo.currentTime -= 5;
  } else if (event.key === "ArrowRight") {
    mainVideo.currentTime += 5;
  }
});

// Play or Pause video functionality
playPauseButton.addEventListener("click", () => {
  mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("click", () => {
  mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {
  playPauseButton.classList.replace("fa-play", "fa-pause");
});

mainVideo.addEventListener("pause", () => {
  playPauseButton.classList.replace("fa-pause", "fa-play");
});

// Stop video functionality
stopButton.addEventListener("click", () => {
  mainVideo.pause();
  mainVideo.currentTime = 0;
});

// Video timeline functionality
const formatTime = (time) => {
  let seconds = Math.floor(time % 60);
  let minutes = Math.floor(time / 60) % 60;
  let hours = Math.floor(time / 3600);

  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (hours == 0) {
    return `${minutes}:${seconds}`;
  }

  return `${hours}:${minutes}:${seconds}`;
};

mainVideo.addEventListener("timeupdate", (event) => {
  let { currentTime, duration } = event.target;
  let percent = (currentTime / duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentVideoTime.innerText = formatTime(currentTime);
});

videoTimeLine.addEventListener("click", (event) => {
  let timelineWidth = videoTimeLine.clientWidth;
  mainVideo.currentTime = (event.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("loadeddata", (event) => {
  videoDuration.innerText = formatTime(event.target.duration);
});

const draggableProgressBar = (event) => {
  let timelineWidth = videoTimeLine.clientWidth;
  progressBar.style.width = `${event.offsetX}px`;
  mainVideo.currentTime = (event.offsetX / timelineWidth) * mainVideo.duration;
  currentVideoTime.innerText = formatTime(mainVideo.currentTime);
};

videoTimeLine.addEventListener("mousedown", () => {
  videoTimeLine.addEventListener("mousemove", draggableProgressBar);
});

container.addEventListener("mouseup", () => {
  videoTimeLine.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeLine.addEventListener("mousemove", (event) => {
  const progressTime = videoTimeLine.querySelector("span");
  let offsetX = event.offsetX;
  progressTime.style.left = `${offsetX}px`;
  let timelineWidth = videoTimeLine.clientWidth;
  let percent = (event.offsetX / timelineWidth) * mainVideo.duration;
  progressTime.innerText = formatTime(percent);
});

// Skip forward and backward functionality
skipBackwardButton.addEventListener("click", () => {
  mainVideo.currentTime -= 5;
});

skipForwardButton.addEventListener("click", () => {
  mainVideo.currentTime += 5;
});

// Video speed functionality
speedButton.addEventListener("click", () => {
  speedOptions.classList.toggle("show");
});

speedOptions.querySelectorAll("li").forEach((option) => {
  option.addEventListener("click", () => {
    mainVideo.playbackRate = option.dataset.speed;
    speedOptions.querySelector(".active").classList.remove("active");
    option.classList.add("active");
  });
});

document.addEventListener("click", (event) => {
  if (event.target.classList[1] !== "fa-gauge") {
    speedOptions.classList.remove("show");
  }
});

// Pic in Pic functionality
picInPicButton.addEventListener("click", () => {
  mainVideo.requestPictureInPicture();
});

// FullScreen functonality
fullScreenButton.addEventListener("click", () => {
  container.classList.toggle("fullscreen");

  if (document.fullscreenElement) {
    fullScreenButton.classList.replace("fa-compress", "fa-expand");
    return document.exitFullscreen();
  }

  fullScreenButton.classList.replace("fa-expand", "fa-compress");
  container.requestFullscreen();
});

mainVideo.addEventListener("dblclick", () => {
  container.classList.toggle("fullscreen");

  if (document.fullscreenElement) {
    fullScreenButton.classList.replace("fa-compress", "fa-expand");
    return document.exitFullscreen();
  }

  fullScreenButton.classList.replace("fa-expand", "fa-compress");
  container.requestFullscreen();
});

// Ligth and Dark Theme
themeButton.addEventListener("click", () => {
  const haedingSpan = document.querySelector(".heading span");

  if (themeButton.classList.contains("fa-sun")) {
    themeButton.classList.replace("fa-sun", "fa-moon");
    body.style.background = "black";
    container.style.border = "10px solid gray";
    container.style.background = "gray";
    haedingSpan.style.color = "salmon";
  } else {
    themeButton.classList.replace("fa-moon", "fa-sun");
    body.style.background = "bisque";
    container.style.border = "10px solid whitesmoke";
    container.style.background = "whitesmoke";
    haedingSpan.style.color = "cadetblue";
  }
});

// Heading change color funtionality
function changeHeadingColor() {
  const colorPicker = document.querySelector(".headingColor-input");
  const heading = document.querySelector(".heading");
  heading.style.color = colorPicker.value;
}
