console.log(`Let's write some javascript`);
let currentsong = new Audio();
console.log(document.querySelector(".topPart").querySelector(".playinfo").innerHTML)
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/song/");
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("128-")[1].split("128")[0])
        }
    }
    return songs;
}


// play selected song

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

const playMusic = (track, paused = false) => {
    currentsong.src = "/song/128-" + track + "128%20Kbps.mp3";
    if (!paused) {
        currentsong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".topPart").querySelector(".playinfo").innerHTML = decodeURI(track);
    
}

async function main() {
    let songs = await getSongs();
    console.log(songs)

    playMusic(songs[0].replaceAll("%20", " "),true);
    // add song in playlist 
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {

        songUL.innerHTML = songUL.innerHTML + `<li>
                            <div class="playbtnimg">
                                <img class="invert" src="svg/playbutton.svg" alt="">
                            </div>
                            <div class="songimg">
                                <img src="https://c.saavncdn.com/890/Aaj-Ki-Raat-Bass-House-Mix-Hindi-2024-20240905133924-150x150.jpg"
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

    // Attach an event listener to play , next and previous 
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src = "pause.svg";
        } else {
            currentsong.pause();
            play.src = "play.svg";
        }
    })
    // update the time and circle in seekbar
    currentsong.addEventListener("timeupdate", ()=>{
        document.querySelector(".playtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) *100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
        console.log(Math.floor(percent));
    })
}

main()
