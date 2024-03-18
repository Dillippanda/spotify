console.log("Hello World")
let currentSong = new Audio();

var songs;
let curfolder;
function secondsToMinutesSeconds(seconds) {
if (isNaN(seconds)||seconds<0){
return "00:00";
}

   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = Math.floor(seconds % 60);

    const FM=String(minutes).padStart(2,'0')
    const FS=String(remainingSeconds).padStart(2,'0');
    return `${FM}:${FS}`;
}


async function getSongs(folder) {
    curfolder=folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
   songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            //  const Mp3 = element.href.replace(".mp3", "");
            //  const Mp2 = Mp3.replace("_320(PaglaSongs)", "");

            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    let songsOL = document.querySelector(".songlist").getElementsByTagName("ol")[0]
    songsOL.innerHTML=""
    for (const song of songs){
        console.log("DKKP")
        songsOL.innerHTML = songsOL.innerHTML + `<li> <img class="invert" src="img/music.svg" alt="M">
         <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Dillip</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="img/play.svg" alt="" class="invert">
                            </div></li>`;
                            // console.log("DKPp")
    }
    //play the first song
    // var audio = new Audio(songs[3]);
    // audio.play();
    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    })
    })

//add an event listener to previous and next
var length=songs.length;
document.getElementById('previous'). addEventListener("click",()=>{
     console.log("previous clicked")
     
     let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
if((index-1)>=0){
    playMusic(songs[index-1])
}
else{
    playMusic(songs[length-1])
}

 })

 document.getElementById('next').addEventListener("click",()=>{
     console.log("next clicked")
     let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
console.log("hi"+index)
     if((index)<length-1){
        console.log(index)
        console.log("gh"+length)

    playMusic(songs[index+1])
    
}
else{
    playMusic(songs[index-length+1])
}

    })

    //Listin for time update event
currentSong.addEventListener("timeupdate",()=>{
    // console.log(currentSong.currentTime,currentSong.duration)
    document.querySelector(".songTime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".seek_circle").style.left=(currentSong.currentTime/currentSong.duration)*49.4 +"%"
    document.querySelector(".dseek").style.width=(currentSong.currentTime/currentSong.duration)*100 +"%"
    let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
    if(currentSong.currentTime==currentSong.duration){
         playm.src="img/playm.svg"
         if((index)<length-1){
    
        playMusic(songs[index+1])
        
    }
    else{
        playMusic(songs[index-length+1])
    }
    
    }
})
    return songs
}
const playMusic=(track,pause=false)=>{
     currentSong.src=`/${curfolder}/`+track;
    console.log("dgdgsg "+currentSong.src)
    if(!pause){

        currentSong.play()
        playm.src="img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML=decodeURI(track).split('.').slice(0)[0]
    document.querySelector(".songTime").innerHTML="00:00/00:00"
}
async function displayAlbums(){
    
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors =div.getElementsByTagName("a")
    let cardContener=document.querySelector(".cardContener");
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if(e.href.includes("/songs/")){
           let folder=e.href.split("/").slice(-1)[0]
          console.log(" dffdff"+folder)
          if (!folder.startsWith("_")) {
            // If it doesn't, add it to the non-underscore folders array
            
        
           //get the metadata of the folder
           let a = await fetch(`/songs/${folder}/info.json`)
    let response = await a.json();
    console.log(response)
    cardContener.innerHTML=cardContener.innerHTML+`<div data-folder="${folder}" class="card rounded ">
    <div class="play">
        <svg width="65" height="65" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="35" fill="#1ED760" />
            <polygon points="43,37 43,63 65,50" fill="#000000" />
        </svg>
    </div>
    <img class="rounded " src="/songs/${folder}/cover.jpg"
        alt="card">
    <h3>${response.title}</h3>
    <p>${response.description}</p>
</div>`
        }
    }
    }

    //load the librery playlist whenever card is clicked

Array.from( document.getElementsByClassName("card")).forEach(e=>{
    console.log(e)
     e.addEventListener("click",async item=>{
         console.log(item,item.currentTarget.dataset)
 songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
 playMusic(songs[0])
 
         
     })
 })
}

async function main() {
await getSongs("songs/ncs")
playMusic(songs[0],true)
// display all the albums on the page
    
displayAlbums();

    //Attach an event listner to play ,next and previous
    playm.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            playm.src="img/pause.svg"
            
        }
        else{
            currentSong.pause()
            playm.src="img/playm.svg"

        }
    })

    //  audio.addEventListener("loadeddata", () => {
    //      let duration = audio.duration;
    //      console.log(duration)
    //      // The duration variable now holds the duration (in seconds) of the audio clip
    //  });



 document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=( e.offsetX / e.target.getBoundingClientRect().width)*50;
   document.querySelector(".seek_circle").style.left=percent+"%"
   currentSong.currentTime=((currentSong.duration)*percent)/50
 })



 //add an event listner for hamburger
 document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
 })

 document.querySelector(".close53").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%"
 })

 
// add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log(e,e.target,e.target.value)
    currentSong.volume=parseInt(e.target.value)/100
    // document.getElementById('vol').addEventListener("click",()=>{
      
    //     vol.src = "mute.svg"
    //     e.target.value=0;
    //     currentSong.volume=0;
    // })
    
    

     if(e.target.value==0){
         vol.src="img/mute.svg"
     }
     else if(e.target.value<=50){
         vol.src="img/volume-low.svg"
     }
     else{
         vol.src="img/volume.svg"
    }
})
// mute and un mute
document.querySelector(".volume>img").addEventListener("click",e=>{
    if(document.querySelector(".range").getElementsByTagName("input")[0].value >= 50){
        e.target.src=e.target.src.replace("img/volume.svg","img/mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else if(document.querySelector(".range").getElementsByTagName("input")[0].value > 0){
        e.target.src=e.target.src.replace("img/volume-low.svg","img/mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src=e.target.src.replace("img/mute.svg","img/volume.svg")
        currentSong.volume=.50;
        document.querySelector(".range").getElementsByTagName("input")[0].value=50;

    }
})
//Show all
let isHidden = false;

document.querySelector(".show").addEventListener("click", () => {
    const elements = document.querySelectorAll(".none");
    elements.forEach((element, index) => {
        setTimeout(() => {
            if (isHidden) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        }, index * 1);
    });
    
    
    // Toggle the text content of the <p> element between "Show more" and "Show less"
    const showButton = document.querySelector(".show p");
    showButton.textContent = isHidden ? "Show all" : "Show less";

    // Toggle the state flag
    isHidden = !isHidden;
});



}
main()