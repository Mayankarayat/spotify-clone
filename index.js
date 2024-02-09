let currentsong = new Audio();
let curfolder;
// let show = document.body.querySelector(".show");
let main = document.body.querySelector(".main-container-1");

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
// let a = 0;
// show.addEventListener("click", () => {
//   if(a==0){
//       main.style.overflow = "auto";
//       show.innerHTML= "Show less";
//       a=1;
//   }
//   else{
//       main.style.overflow = "hidden";
//       show.innerHTML= "Show More";
//       a=0;
//   }

//   a == 0
//     ? ((main.style.overflow = "auto"), (show.innerHTML = "Show less"), (a = 1))
//     : ((main.style.overflow = "hidden"),
//       (show.innerHTML = "Show More"),
//       (a = 0));
// });

async function getsong(folder) {
  curfolder = folder;
  let song = await fetch(
    `http://127.0.0.1:5501/songs/${folder}`
    // `https://github.com/Mayankarayat/spotify-clone/tree/main/songs/${folder}`
    // `/${folder}`
  );
  let response = await song.text();
  console.log(response);
  let div = document.createElement("div");  
  div.innerHTML = response;
  let a = div.getElementsByTagName("a");
  let all = [];
  for (let i = 0; i < a.length; i++) {
    let element = a[i];
    if (element.href.endsWith(".mp3")) {
      all.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let list = document.querySelector(".song-list");
  list.innerHTML = "";
  for (const i of all) {
    list.innerHTML =
      list.innerHTML +
      `<div class="song-card">
      <img class="invert" src="music.svg" alt="">
              <p class="name"> ${i.replaceAll("%20", " ")} </p>
              </div>`;
  }

  Array.from(list.getElementsByClassName("song-card")).forEach((e) => {
    e.addEventListener("click", (element) => {
      let name = e.querySelector(".name").innerHTML.trim();
      console.log(name);
      playmusic(name);
    });
  });

  return all;
}

let play = document.body.querySelector(".play");
let next = document.body.querySelector(".next");
let previous = document.body.querySelector(".previous");

const playmusic = (track, pause = false) => {
  currentsong.src = `songs/${curfolder}/` + track;
  if (!pause==false) {
    currentsong.play();
    play.src = "pause.svg";
  }
  else{
    currentsong.pause();
    play.src = "play.svg";
    document.body.querySelector(".circle").style.left = 0;
  }
  document.body.querySelector(".song-info").innerHTML = decodeURI(track);
  document.body.querySelector(".song-time").innerHTML = "00:00 / 00:00";
};

async function main1() {
  var song1=await(getsong("songs/shree_ram"));
  // playmusic(song1[0], true);
  let play1 = document.body.getElementsByClassName("card");
  // let play1 = document.body.querySelector(".card");
  let playbar = document.body.querySelector(".playbar");
  let lib_main = document.body.querySelector(".main");

  let menu = document.body.querySelector(".menu");
  let list = document.querySelector(".song-list");
  let close = document.body.querySelector(".close");
  let leftbar = document.body.querySelector(".left");

  Array.from(play1).forEach(e=>{
    console.log(e);
    
    e.addEventListener("click",()=>{
      if (leftbar.style.left == "-100%") {
        leftbar.style.left = "0";
        lib_main.style.display = "none";
        list.style.display = "block";
        playbar.style.display = "block";
        playmusic(song1[0], true);
          } else {
            lib_main.style.display = "none";
            list.style.display = "block";
            playbar.style.display = "block";
            playmusic(song1[0], true);
          }
    })
    
  })

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.body.querySelector(
      ".song-time"
    ).innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )}/${secondsToMinutesSeconds(currentsong.duration)}`;
    document.body.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
      if(currentsong.currentTime == currentsong.duration){
        let index = song1.indexOf(
          currentsong.src.split(`songs/${curfolder}/`).slice(-1)[0]
          );
          if (index + 1 < song1.length) {
            playmusic(song1[index + 1],true);
          }
          else if(index + 1 == song1.length){
            play.src = "play.svg";
          }
      }
  });

  let seekbar = document.body.querySelector(".seekbar");
  seekbar.addEventListener("click", (e) => {
    currentsong.currentTime =
      (e.offsetX / seekbar.offsetWidth) * currentsong.duration;
  });
  menu.addEventListener("click", () => {
    leftbar.style.left = "0";
  });

  close.addEventListener("click", () => {
    leftbar.style.left = "-100%";
  });

  let previous = document.body.querySelector(".previous");

  previous.addEventListener("click", () => {
    let index = song1.indexOf(
      currentsong.src.split(`songs/${curfolder}/`).slice(-1)[0]
    );
    console.log(index);
    if (index - 1 >= 0) {
      playmusic(song1[index - 1]);
    }
  });

  let next = document.body.querySelector(".next");
 

  next.addEventListener("click", () => {
    currentsong.pause();
    let index = song1.indexOf(
      currentsong.src.split(`songs/${curfolder}/`).slice(-1)[0]
    );
    console.log(song1);

    if (index + 1 < song1.length) {
      playmusic(song1[index + 1]);
    }
  });

  Array.from(document.body.getElementsByClassName("card")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      console.log(item.currentTarget.dataset.folder);
      song1 = await getsong(`${item.currentTarget.dataset.folder}`);

      playmusic(song1[0], true);
    });
  });


  // if (currentsong.currentTime == currentsong.duration) {
  //   playmusic(song1[index + 1]);
  // }
}
main1();