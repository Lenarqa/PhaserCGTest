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
        let MAP_SIZE = 8;
        // background
        this.background =  this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);

        let objsTitle = ['book', 'case', 'fish', 'money', 'fire', 'tent'];
        let objsId = new Array();

        let x = 25;
        let y = 25;
        for(let i = 0; i < MAP_SIZE; i++){
            y+=45;
            objsId[i] = new Array(); 
            for(let j = 0; j < MAP_SIZE; j++){
                x+=45;
                let objId = Math.round(Math.random()*5);
                objsId[i][j] = objId;
                this.button = this.add.sprite(x, y, objsTitle[objId]).setInteractive();
                this.button.id = objId;
                this.button.i = i;
                this.button.j = j;
                this.button.on('pointerover', function(){
                    this.setTint(0xf0ff00);
                    this.setScale(1.2);
                })
                this.button.on('pointerout', function(){
                    this.setTint(0xffffff);
                    this.setScale(1);
                })
                this.button.on('pointerdown', function(){
                    console.log(`obj = ${objsTitle[this.id]} x = ${this.i} y = ${this.j}`);
                //    console.log("good " +  this.id, + "x = " + this.i  + "y = " + this.i);
                //    this.setTint(0xf0ff00);
                });
            }
            x = 25;
        }

        console.log(objsId)
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

        this.add.text(config.width/2.4, config.height/20,"Welcom");
    }

}