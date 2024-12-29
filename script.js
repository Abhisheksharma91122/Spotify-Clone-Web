console.log(`Let's write some javascript`);
// global variables
let songs;
let currentsong = new Audio();
let currfolder;

// minute second formate
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}


// getsong function
async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("128-")[1].split("128")[0])
        }
    }


    // add song in playlist 
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <div class="playbtnimg">
                                <img class="invert" src="svg/playbutton.svg" alt="">
                            </div>
                            <div class="songimg">
                                <img class="invert" src="svg/songimg.svg"
                                    alt="">
                            </div>
                            <div class="songinfo">
                                <h2>${song.replaceAll("%20", " ")}</h2>
                            </div>
                        </li>`
    }



    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".songinfo").getElementsByTagName("h2")[0].innerHTML)
            // console.log(e.querySelector(".songinfo").getElementsByTagName("h2")[0].innerHTML)

        })
    })

    return songs;

}


// play selected song
const playMusic = (track, paused = false) => {
    currentsong.src = `/${currfolder}/128-` + track + "128%20Kbps.mp3";
    console.log(currentsong.src)
    if (!paused) {
        currentsong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".topPart").querySelector(".playinfo").innerHTML = decodeURI(track);
}



async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/song/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchros = div.getElementsByTagName("a");
    let cardconatiner = document.querySelector(".cardcontainer")
    let array = Array.from(anchros)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/song")) {
            let folder = e.href.split("/").slice(-2)[0];
            // folder display the name of folder in the song
            // console.log(folder)
            // get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/song/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            cardconatiner.innerHTML = cardconatiner.innerHTML + `<div data-folder="${folder}" class="card">
                            <div class="playbutton">
                                <img src="svg/playbutton.svg" alt="">
                            </div>
                            <img class="songphoto"
                                src="/song/${folder}/cover.jpg" alt="">
                            <h2>${response.title}</h2>
                            <p>${response.discription}</p>
                        </div>`;
        }
    }


    // adding event to card 
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset.folder)
            songs = await getSongs(`song/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}


async function main() {
    await getSongs("song/new");
    // print songs src for programming
    // console.log(songs)

    playMusic(songs[0].replaceAll("%20", " "), true);

    //display all the albums
    displayAlbums();


    // Attach an event listener to play 
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
        } else {
            currentsong.pause();
            play.src = "play.svg";
        }
    })
    // update the time and circle in seekbar
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".playtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        if (currentsong.currentTime == currentsong.duration) {
            play.src = "play.svg";
        }
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
        console.log(Math.floor(percent));
    })


    // add an event listener to hamburger
    document.querySelectorAll(".hamburger").forEach((ham) => {
        ham.addEventListener("click", () => {
            document.querySelector(".left").style.left = "0";
        })
    })

    // add an event listener to close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = " -100%";
        // smooth translation 
        document.querySelector(".left").style.transition = "all 0.5s ease";
    })


    // add an event listener to previous button
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("128-").slice(-1)[0].split("128")[0]);
        console.log(songs, index)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
        // console.log(songs);

    })

    // add an event listener to next button
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("128-").slice(-1)[0].split("128")[0]);
        // debugging error
        // console.log(songs , index);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
        // console.log(songs);
    })



    // add event listener to volume
    let clickcount = 1;
    document.querySelector(".volume").addEventListener("click", () => {
        console.log("its work");
        document.querySelector(".volume-slider").style.display = "inline";
        clickcount++;
        if (clickcount % 2 !== 0) {
            document.querySelector(".volume-slider").style.display = "none";
        }
    })

    // adding event listener to volume slider 
    document.querySelector(".volume-slider").addEventListener("change", (e) => {
        console.log("setting volume to :", e.target.value, "/100");
        currentsong.volume = parseInt(e.target.value) / 100;
    })
}

main()
