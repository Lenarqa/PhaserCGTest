//game config vars
const MAP_SIZE = 8;
var playerClick = 1;
var objsID = [];
var tempObj = {i: 0, j: 0};
var gameObjs;
var THIS;
var objsTitle = ['book', 'case', 'fish', 'money', 'fire', 'tent','book'];
var isNear = false;
var isGameOver = false;
var gameTime = 5000;
var isMute = true;

// text
var info;
var gameOverText = [];

// stats
var timer;
var playerStepNum = 0;//коилиство ходов игрока
var score = 0;


// sounds
var bgMusic;
var goodChoiceSound;
var noGoodChoiceSound;
var theEndMusic;



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

        //sounds btn
        this.load.image('sound_on', 'assets/img/sound_on.png');
        this.load.image('sound_off', 'assets/img/sound_off.png');


        // audio 
        this.load.audio('mainBgSound', 'assets/sounds/bgMusic.mp3');
        this.load.audio('GoodChoice', 'assets/sounds/GoodChoice.mp3');
        this.load.audio('noGoodChoice', 'assets/sounds/noGoodChoice.mp3');
        this.load.audio('theEnd', 'assets/sounds/theEnd.mp3');
    }

    create(){
        // background
        this.background =  this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);
        
        //group with game objects
        gameObjs = this.add.group();
        gameObjs.inputEnableChildren = true;

        // create map
        this.renderMap(MAP_SIZE, objsTitle, gameObjs, playerClick, objsID);
        

        //sound_on and sound_off
        let sound_on = this.add.image(25, 70, "sound_on");
        let sound_off = this.add.image(25, 70, "sound_off");
        bgMusic = this.sound.add('mainBgSound', {
            volume: 0.5,
            loop: true
        });

        sound_on.setScale(0.3);
        sound_on.setDepth(10);
        sound_on.setInteractive();
        sound_off.setVisible(false);

        sound_off.setScale(0.3);
        sound_off.setDepth(10);
        sound_off.setInteractive();
        
        sound_off.on('pointerdown', ()=>{
            sound_off.setVisible(false);
            sound_on.setVisible(true);
            isMute = true;
            bgMusic.stop();
        });
        
        sound_on.on('pointerdown', ()=>{
            sound_on.setVisible(false);
            sound_off.setVisible(true);
            isMute = false;
            bgMusic.play();
        });

        // noGoodChoiceSound
        noGoodChoiceSound = this.sound.add('noGoodChoice', {
            volume: 1,
            loop: false
        });

        // GoodChoiceSound
        goodChoiceSound = this.sound.add('GoodChoice', {
            volume: 1,
            loop: false
        });

        // theEndMusic
        theEndMusic = this.sound.add('theEnd', {
            volume: 1,
            loop: false
        });



        // console.log("groups = ", gameObjs.getLength());

        // gameObjs.rotate(45, 2)
        // gameObjs.setVisible(false);
 
        // setTimeout(()=>{
        //     console.log("Перемешались");
        //     gameObjs.shuffle();
        //     // console.log("render map from setTimeOut");
        //     // this.renderMap(MAP_SIZE, objsTitle)
        // }, 3000);

        // timer
        info = this.add.text(config.width/2.4, 5, '', { font: '20px Arial', fill: '#ffff'});
        timer = this.time.addEvent({ delay: gameTime, callback: gameOver, callbackScope: this });
    }

    update(){
        // bg animation
        this.background.tilePositionY -= 0.5;
        
        // timer
        info.setText('Time: ' + Math.floor(gameTime - timer.getElapsed()));
    }

    chooseObj(){    
        this.setTint(0xf0ff00);

        switch(playerClick){
            case 2:{
                playerClick++;
                console.log("Выбран второй объект");

                playerClick = 1;

                if(isNearTest(tempObj, this)){
                    playerStepNum++;
                    if(!isMute){
                        goodChoiceSound.play();
                    }
                    objsID = swapObjs(tempObj, this, objsID);
                    updateMap(MAP_SIZE, objsID, gameObjs, THIS); 
                }else{
                    if(!isMute){
                        noGoodChoiceSound.play()
                    }
                    updateMap(MAP_SIZE, objsID, gameObjs, THIS);
                }
                break;
            }
            case 1:{
                playerClick++;
                console.log("Выбран первый объект");
                tempObj.i = this.i;
                tempObj.j = this.j;
                
                // test logs
                // objsID = swapObjs(tempObj, this, objsID)
                // console.log("last id = ", objsID);
                // console.log("Click i = " + this.i + ' j = ' + this.j);
                // console.log("TempObj i = " + tempObj.i + ' tempObj.j = ' + tempObj.j);
                break;
            }
        }
    }

    renderMap(MAP_SIZE, objsTitle, gameObjs, playerClick, objsID){
        let x = 25;
        let y = 25;

        for(let i = 0; i < MAP_SIZE; i++){
            y+=45;
            objsID[i] = [];
            for(let j = 0; j < MAP_SIZE; j++){
                x+=45;
                let objId = Math.round(Math.random() * (6-1) + 1);
                objsID[i][j] = objId;

                let obj = this.add.sprite(x, y, objsTitle[objId]).setInteractive();
                obj.i = i;
                obj.j = j;
                
                obj.on('pointerdown', this.chooseObj, this.obj,);
                
                obj.on('pointerout', function(){
                    this.setScale(1);
                })

                obj.on('pointerover', function(){
                    this.setScale(1.2);
                })

                gameObjs.add(obj);
            }
            x = 25;
        }
        
        // Кастыль
        /* Чтобы в конце игры игрок не видел поля сгенерированного в первый раз, 
            мы удаляем поле через после окончания таймера.*/

        setTimeout(()=>{
            gameObjs.clear(true);
        }, gameTime-2);

        // AnalizMap(objsID, MAP_SIZE);//пока что не работает 
        // console.log("objsID", objsID)
    }
}

function gameOver(){
    console.log("Game over");
    gameObjs.clear(true);

    
    gameOverText[0] = THIS.add.text(config.width * 0.30, config.height * 0.1,"Game Over", {font: "40px Arial", fill: "#fff"});
    gameOverText[1] =THIS.add.text(config.width * 0.40, config.height * 0.2,"Results:", {font: "35px Arial", fill: "#fff"});
    gameOverText[3] =THIS.add.text(config.width * 0.42, config.height * 0.3,`score: ${score}`, {font: "30px Arial", fill: "#fff"});
    gameOverText[4] =THIS.add.text(config.width * 0.40, config.height * 0.4,`swipes: ${playerStepNum}`, {font: "30px Arial", fill: "#fff"});
    
    let restart = THIS.add.text(config.width * 0.36, config.height * 0.55,"RESTART", {font: "35px Arial", fill: "#fff"});
    restart.setInteractive();
    gameOverText[5] = restart;

    restart.on('pointerdown', Restart, this);
                
    restart.on('pointerout', function(){
        this.setTint(0xffffff);
    })

    restart.on('pointerover', function(){
        this.setTint(0xf0ff00);
    })

    if(!isMute){
        bgMusic.stop();
        theEndMusic.play();
    }
}

function Restart(){
    // gameOverText.forEach(e => {
    //     e.destroy();
    // });
    if(!isMute){
        goodChoiceSound.play();
    }
    
    score = 0;
    playerStepNum = 0;
    THIS.scene.start('gameScene');
}

 function swapObjs(tempObj, thisObj, objsID){
    // test logs
    // console.log('swap')
    // console.log('tempID = ',objsID[thisObj.i][thisObj.j]);
    // console.log('objsID[thisObj.i][thisObj.j] = ', objsID[thisObj.i][thisObj.j]);
    // console.log('objsID[tempObj.i][tempObj.j] = ', objsID[tempObj.i][tempObj.j]); 
    // console.log("swap" + objsID)
    
    let tempID = objsID[thisObj.i][thisObj.j];  
    
    objsID[thisObj.i][thisObj.j] = objsID[tempObj.i][tempObj.j];
    objsID[tempObj.i][tempObj.j] = tempID;

    return objsID;
}

function updateMap(MAP_SIZE, objsID, gameObjs, THIS){

    let x = 25;
    let y = 25;
    // console.log(`MAP_SIZE ${MAP_SIZE}, objsID ${objsID}, gameObjs ${gameObjs}`);

    gameObjs.clear(true);

    for(let i = 0; i < MAP_SIZE; i++){
        y+=45;
        for(let j = 0; j < MAP_SIZE; j++){
            x+=45;
    
            let obj = THIS.add.sprite(x, y, objsTitle[objsID[i][j]]).setInteractive();
            // obj.clearTint();
            obj.i = i;
            obj.j = j;
            // obj.setDepth(1);
            
            obj.on('pointerdown', THIS.chooseObj, THIS.obj);
            obj.on('pointerout', function(){
                // this.setTint(0xffffff);
                this.setScale(1);
            })

            obj.on('pointerover', function(){
                // this.setTint(0xf0ff00);
                this.setScale(1.2);
            })

            gameObjs.add(obj);
        }
        x = 25;
    }
    console.log("UpdateMap GameObj", gameObjs.getLength());
}

function isNearTest(tempObj, thisObj){
    if((Math.abs(tempObj.i - thisObj.i) == 1) ||  (Math.abs(tempObj.j - thisObj.j) == 1)){
        if((tempObj.i == thisObj.i) || (tempObj.j == thisObj.j)){
            return true;
        }
    }
}

function AnalizMap(objsID, MAP_SIZE){
    // console.log("welcom to analiz");
    // console.log("analiz MAP_SIZE = ", MAP_SIZE);

    let colObj = 0;//количество подряд идущих объектов в группе
    let colID = 0; //количесво групп (факел, палатка и т.д)
    let goodGroup = 0;//готовые группы (>2 идущих подрят объектов)

    for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            if(x == 0){
                colID = objsID[y][x];
            }
            if(colID == objsID[y][x]){

                // console.log("Повтор " + colID + " objID = "+ objsID[y][x])
            }
        }
        
    }
}
    // for (let y = 0; y < MAP_SIZE; y++) {
    //     colObj = 0;
    //     for (let x = 0; x < MAP_SIZE; x++) {
    //         if(x == 0){
    //             colID = Math.abs(objsID[x][y]);
    //             console.log("colID = ", colID);
    //         }
            
    //         if(colID == Math.abs(objsID[x][y])){
    //             colObj++;
    //         }else if(colObj > 2){
    //             goodGroup++;

    //             for (let z = 0; z < colObj-1; z++) {//точно ли минус один?
    //                 // console.log(objsID[Math.abs(x-colObj+z)][y]);
    //                 let x1 = x - colObj + z;
    //                 objsID[x1][y] = Math.abs(objsID[x][y]) * (-1);
    //             }
    //             console.log("good group = ", goodGroup);
    //             colID = objsID[x][y];
    //             colObj = 1;
    //         }
    //         if((y == MAP_SIZE) && colObj > 2){
    //             goodGroup++;

    //             for (let z = 0; z < colObj; z++) {//точно ли минус один?
    //                 let x1 = x - colObj + z;
    //                 objsID[x1][y] = Math.abs(objsID[x][y]) * (-1);
    //             }
    //         }
    //     }  
//     }

//     console.log(goodGroup);
//     console.log("analiz objsID = ", objsID);


// }

