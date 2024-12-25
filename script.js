console.log(`Let's write some javascript`);


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/song/");
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    console.log(as)
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    return songs;
}
async function main(){
    let song = await getSongs();
    console.log(song)

    var audio = new Audio(song[0]);
    // audio.play();


    const extractSongName = (url) => {
        const parts = url.split('/').pop(); // Get the last part of the URL
        const songNameWithExtension = decodeURIComponent(parts);
        const songName = songNameWithExtension.split('-')[1]?.trim(); // Extract "Aaj Ki Raat"
        return songName || "Unknown Song";
    };

    let songname1 = extractSongName(song[0]);
    console.log(songname1);
}

main()