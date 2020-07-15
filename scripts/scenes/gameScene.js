var info;
var timer;

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
    }

    static renderMap(MAP_SIZE, objsId, objsTitle){
        let x = 25;
        let y = 25;
    
        for(let i = 0; i < MAP_SIZE; i++){
            y+=45;
            for(let j = 0; j < MAP_SIZE; j++){
                x+=45;
                this.button = this.add.sprite(x, y, objsTitle[objsId[i][j]]).setInteractive();          
            }
            x = 25;
        }
    }

    create(){
        let MAP_SIZE = 8;
        // background
        this.background =  this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);

        let objsTitle = ['book', 'case', 'fish', 'money', 'fire', 'tent'];
        let objsId = new Array();

        let playerClick = 0;
        let tempObj = {i: 0, j: 0};

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
                    
                    switch(playerClick){
                        case 2:{
                            playerClick++;
                            console.log("Выбран второй объект");
                            playerClick = 0;
                            break;
                        }
                        case 1:{
                            playerClick++;
                            console.log("Выбран первый объект");
                            tempObj.i = this.i;
                            tempObj.j = this.j;
                            console.log(tempObj);
                            break;
                        }
                        case 0: {
                            playerClick++;
                            console.log("Объект не выбран")
                            break;
                        }
                    }
                    // console.log(playerClick);
                    console.log(`obj = ${objsTitle[this.id]} x = ${this.i} y = ${this.j}`);//test log
                    console.log(this)
                    // this.setTint(0xf0ff00);
                });
            }
            x = 25;
        }



        info = this.add.text(config.width/2.4, 5, '', { font: '20px Arial', fill: '#ffff'});
        timer = this.time.addEvent({ delay: 10000, callback: gameOver, callbackScope: this });
    }

    update(){
        this.background.tilePositionY -= 0.5;
        info.setText('\nTime: ' + Math.floor(10000 - timer.getElapsed()));
    }

}

function gameOver(){
    console.log("Game over")
}

function changeObjs(obj1, obj2){
    let tempI = 0;
    let tempJ = 0;

    tempI = obj1.i;
    tempJ = obj1.j;

    obj1.i = obj2.i;
    obj1.j = obj2.j;

    obj2.i = tempI;
    obj2.j = tempJ;    
}