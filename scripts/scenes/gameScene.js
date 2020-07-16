const MAP_SIZE = 5;
var info;
var timer;
var playerClick = 1;
var objsID = [];
var tempObj = {i: 0, j: 0};
var gameObjs;
var THIS;
var objsTitle = ['book', 'case', 'fish', 'money', 'fire', 'tent'];


class gameScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
        THIS = this;
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

    renderMap(MAP_SIZE, objsTitle, gameObjs, playerClick, objsID){
        console.log("player click", playerClick)
        let x = 25;
        let y = 25;

        for(let i = 0; i < MAP_SIZE; i++){
            y+=45;
            objsID[i] = [];
            for(let j = 0; j < MAP_SIZE; j++){
                x+=45;
                let objId = Math.round(Math.random()*5);
                objsID[i][j] = objId;

                let obj = this.add.sprite(x, y, objsTitle[objId]).setInteractive();
                obj.i = i;
                obj.j = j;
                
                obj.on('pointerdown', this.chooseObj, this.obj,);
                
                // obj.on('pointerout', function(){
                //     this.setTint(0xffffff);
                //     this.setScale(1);
                // })

                // obj.on('pointerover', function(){
                //     this.setTint(0xf0ff00);
                //     this.setScale(1.2);
                // })

                gameObjs.add(obj);
            }
            x = 25;
        }
    }

    deleteMap(){
        
    }

    create(){
        // background
        gameObjs = this.add.group();
        gameObjs.inputEnableChildren = true;

        // this.background =  this.add.tileSprite(0, 0, config.width, config.height, "background");
        // this.background.setOrigin(0,0);
        

        this.renderMap(MAP_SIZE, objsTitle, gameObjs, playerClick, objsID);
        console.log("groups = ", gameObjs.getLength());
        // console.log("groups first child = ", gameObjs.getFirst());
 

        // gameObjs.rotate(45, 2)
        // gameObjs.setVisible(false);
 
        // setTimeout(()=>{
        //     console.log("Перемешались");
        //     gameObjs.shuffle();
        //     // console.log("render map from setTimeOut");
        //     // this.renderMap(MAP_SIZE, objsTitle)
        // }, 3000);
        // this.add.text(config.width/2.4, config.height/20,"Welcom");


        // timer
        // info = this.add.text(config.width/2.4, 5, '', { font: '20px Arial', fill: '#ffff'});
        // timer = this.time.addEvent({ delay: 10000, callback: gameOver, callbackScope: this });
    }

    chooseObj(){    
        this.setTint(0xf0ff00);

        switch(playerClick){
            case 2:{
                playerClick++;
                console.log("Выбран второй объект");
                // this.i = tempObj.i;
                // this.j = tempObj.j;
                playerClick = 1;
                objsID = swapObjs(tempObj, this, objsID);
                updateMap(MAP_SIZE, objsID, gameObjs, THIS);
                
                break;
            }
            case 1:{
                playerClick++;
                console.log("Выбран первый объект");
                tempObj.i = this.i;
                tempObj.j = this.j;
                // objsID = swapObjs(tempObj, this, objsID)
                console.log("last id = ", objsID);
                

                // log
                console.log("Click i = " + this.i + ' j = ' + this.j);
                console.log("TempObj i = " + tempObj.i + ' tempObj.j = ' + tempObj.j);
                // console.log(tempObj);
                break;
            }
        }
        this.setScale(1.2)
    }

    update(){
        // this.background.tilePositionY -= 0.5;
        // info.setText('\nTime: ' + Math.floor(10000 - timer.getElapsed()));
    }

}

function gameOver(){
    console.log("Game over");
}

 function swapObjs(tempObj, thisObj, objsID){
    console.log('swap')
    // console.log('tempID = ',objsID[thisObj.i][thisObj.j]);
    // console.log('objsID[thisObj.i][thisObj.j] = ', objsID[thisObj.i][thisObj.j]);
    // console.log('objsID[tempObj.i][tempObj.j] = ', objsID[tempObj.i][tempObj.j]); 
    
    let tempID = objsID[thisObj.i][thisObj.j];
    // let tempID = 10000;
    
    objsID[thisObj.i][thisObj.j] = objsID[tempObj.i][tempObj.j];
    objsID[tempObj.i][tempObj.j] = tempID;
    
    console.log("swap" + objsID)
    return objsID;
}

function updateMap(MAP_SIZE, objsID, gameObjs, THIS){
    console.log("UpdateMap");
    let x = 25;
    let y = 25;
    console.log(`MAP_SIZE ${MAP_SIZE}, objsID ${objsID}, gameObjs ${gameObjs}`);
    gameObjs.clear();

    // gameObjs.delete();//не забыть очистить группу!
    for(let i = 0; i < MAP_SIZE; i++){
        y+=45;
        for(let j = 0; j < MAP_SIZE; j++){
            // gameObjs.destroy()
            x+=45;
    
            let obj = THIS.add.sprite(x, y, objsTitle[objsID[i][j]]).setInteractive();
            obj.i = i;
            obj.j = j;
            obj.setDepth(1);
            
            obj.on('pointerdown', THIS.chooseObj, THIS.obj);

            gameObjs.add(obj);
        }
        x = 25;
    }
    console.log("UpdateMap GameObj", gameObjs.getLength());
}

