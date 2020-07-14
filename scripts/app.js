console.log("Начало всего");

var config = {
    width: 500,
    height: 500,
    // scene: [MenuScene, GameScene],
    parent: 'mainGameScene',
    physics: {
        default: "arcade",
    }
}

window.onload = function(){
    var game = new Phaser.Game(config);
}