oubreakSource = document.getElementById("osImg");
imgArray = ["os0-small.gif","os1-small.gif","os2-small.gif"]

function titleShuffle(){
    rollNum = Math.floor(Math.random() * 6);
    console.log(rollNum)
    if (rollNum > imgArray.length){
        console.log(imgArray[rollNum])
        outbreakSource.src = "assets/image/title_animations/" + imgArray[rollNum];
    }
    else{
        titleShuffle()
    }
}

console.log("running shuffle")
setInterval(function() {titleShuffle();}, 3000)