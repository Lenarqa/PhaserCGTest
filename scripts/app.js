let mapSize = document.body.offsetWidth;
let isMobile = false;
if(mapSize < 700){
    mapSize = document.body.offsetWidth;
    isMobile = true;
    
}else{
    mapSize = 500;
}

var config = {
    width: mapSize,
    height: mapSize,
    scene: [gameScene],
    parent: 'mainGameScene',
    physics: {
        default: "arcade",
    },
    audio: {
        disableWebAudio: true
    }
}

window.onload = function(){
    var game = new Phaser.Game(config);
}