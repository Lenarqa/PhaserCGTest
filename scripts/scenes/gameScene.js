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
        this.load.image("tent", "assets/img/objects/tent.png");


        //ships
        // this.load.spritesheet("ship", "assets/spritesheets/ship.png", {frameWidth: 16, frameHeight: 16});
    }

    create(){
        // background
        this.background =  this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);

        let objsTitle = ['book', 'case', 'fish', 'money', 'fire', 'tent'];
        let objs =[]

        let x = 25;
        let y = 25;
        for(let i = 0; i < 8; i++){
            y+=45;
            for(let j = 0; j < 8; j++){
                x+=45;
                this.button = this.add.sprite(x, y, objsTitle[Math.round(Math.random()*5)]).setInteractive();
                // this.add.sprite(xy.x, xy.y - 96, 'start').setInteractive();
                // this.button.on('pointerover', function(){this.button.setTint(0xf0ff00);}, this)
                // this.button.on('pointerout', function(){this.button.setTint(0xffffff);}, this)
                this.button.on('pointerdown', function(){
                   console.log("good", this);
                   this.setTint(0xf0ff00);
                });
            }
            x = 25;
        }

        this.button.emit('pointerdown');
        // console.log(objs)
        // add some obj
        // this.book = this.add.sprite(50, 125,'book').setInteractive();
        
        // ob.on('pointerdown', function(){
        //     console.log("Book work")            
        // });

            // this.book =this.add.sprite(70, 70,'case')
            // this.book =this.add.sprite(115, 70,'fish')
            // this.book =this.add.sprite(70, 115,'money')
            // this.book =this.add.sprite(250, 125,'fire')
            // this.book =this.add.sprite(300, 125,'tent')

        this.anims.create({
            key: "object1",
            frames: this.anims.generateFrameNumbers("gameObjects"),
            frameRate: 20,
            repeat: -1  
        });

        this.add.text(config.width/2.4, config.height/8,"Welcom");
    }

}