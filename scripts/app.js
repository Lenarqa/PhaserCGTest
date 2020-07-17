console.log("Начало всего");

var config = {
    width: 500,
    height: 500,
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