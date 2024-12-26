console.log(`Let's write some javascript`);


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/song/");
    let response = await a.text();
    console.log(response)
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
async function main() {
    let songs = await getSongs();
    console.log(songs)

    var audio = new Audio(songs[0]);
    // audio.play();


    const extractSongName = (url) => {
        const parts = url.split('/').pop(); 
        const decodedParts = decodeURIComponent(parts);
        const [bitrate, songWithMovie] = decodedParts.split('-');

        if (songWithMovie) {
            const songName = songWithMovie.trim();
            const movieName = decodedParts.match(/- (.*?) \d+/)?.[1]; 
            return {
                songName,
                movieName: movieName || "Unknown Movie"
            };
        }

        return { songName: "Unknown Song", movieName: "Unknown Movie" };
    };

    // let songname1 = extractSongName(songs[4]);
    // console.log(songsname1.songName);
    // console.log(songsname1.movieName);


    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]

    for (const song of songs) {

        let name = extractSongName(song);
        console.log(name.songName);
        console.log(name.movieName);


        songUL.innerHTML = songUL.innerHTML + `<li>
                            <div class="playbtnimg">
                                <img class="invert" src="svg/playbutton.svg" alt="">
                            </div>
                            <div class="songimg">
                                <img src="https://c.saavncdn.com/890/Aaj-Ki-Raat-Bass-House-Mix-Hindi-2024-20240905133924-150x150.jpg"
                                    alt="">
                            </div>
                            <div class="songinfo">
                                <h2>${name.songName} - ${name.movieName}</h2>
                            </div>
                        </li>`
    }



}

main()