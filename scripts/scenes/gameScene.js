class gameScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }
    
    preload(){
        //background
        this.load.image("background", "assets/img/bg.png");
        
        //game objects
        this.load.image("book", "assets/img/objects/book.png");
        this.load.image("case", "assets/img/objects/case.png");
        this.load.image("fish", "assets/img/objects/fish.png");
        this.load.image("money", "assets/img/objects/money.png");
        this.load.image("fire", "assets/img/objects/fire.png");
        this.load.image("palatka", "assets/img/objects/palatka.png");


        //ships
        // this.load.spritesheet("ship", "assets/spritesheets/ship.png", {frameWidth: 16, frameHeight: 16});
    }

    create(){
        // background
        this.background =  this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);

        // add some obj
        this.book = this.add.sprite(50, 125,'book').setInteractive();
        
        this.book.on('pointerdown', function(){
            console.log("Book work")            
        });


        this.book =this.add.sprite(100, 125,'case')
        this.book =this.add.sprite(150, 125,'fish')
        this.book =this.add.sprite(200, 125,'money')
        this.book =this.add.sprite(250, 125,'fire')
        this.book =this.add.sprite(300, 125,'palatka')

        this.anims.create({
            key: "object1",
            frames: this.anims.generateFrameNumbers("gameObjects"),
            frameRate: 20,
            repeat: -1  
        });

        this.add.text(config.width/2.4, config.height/8,"Welcom");
    }

}