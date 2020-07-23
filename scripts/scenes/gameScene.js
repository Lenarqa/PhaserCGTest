//game config vars
var bestScore;
var MAP_SIZE = 8;
var playerClick = 1;
var objsID = [];//двумерный массив с id каждого объекта
var tempObj = {i: 0, j: 0};
var gameObjs; //Phaser group
var THIS;
var objsTitle =     ['', 'case', 'fish', 'money', 'fire', 'tent', 'book'];
var objScorePoint = [0,   300,    10,      200,     100,     50,   150];
var circleGoodText = ['Неплохо!', 'Вот это поворот!', 'Ты молодец!', 'Хороший ход!', 
                        'Отличное решение!', 'Невероятно!', 'Как ты это делаешь?!', 'Вот это да!'];
var circleNoGoodText = ['Плохой ход', 'Ну и что ты делаешь?', 'Не очень хорошее решение', 'Эхх неудача'];
var circleClickText = ['Не тыкай меня!', 'Лучше ищи три в ряд!', 'Я шарик!', 'Меня зовут Эрни', 'Собери побольше очков!',
                            'Помни время ограничено!']
var isNear = false;
var isGameOver = false;
var gameTime = 5000;// в мл cек
var isMute = true;
var masksArr = [];//трехмерный массив масок
var masksArrSize = [];//двумерный массив
var circle;
var question;
var questionIsVisible = false;

// text
var info;
var scoreText;
var circleText;

// stats
var timer;
var playerStepNum = 0;//коилиство ходов игрока
var score = 0;

// sounds
var bgMusic;
var theEndMusic;
var goodChoiceSound;
var noGoodChoiceSound;
var woohooSound;

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

        // circle
        this.load.image('circle', "assets/img/circle.png")

        //sounds btn
        this.load.image('sound_on', 'assets/img/sound_on.png');
        this.load.image('sound_off', 'assets/img/sound_off.png');

        //question btn
        this.load.image('question', 'assets/img/question.png');


        // audio 
        this.load.audio('mainBgSound', 'assets/sounds/bgMusic.mp3');
        this.load.audio('GoodChoice', 'assets/sounds/GoodChoice.mp3');
        this.load.audio('noGoodChoice', 'assets/sounds/noGoodChoice.mp3');
        this.load.audio('theEnd', 'assets/sounds/theEnd.mp3');
        this.load.audio('woohoo', 'assets/sounds/woohoo.mp3');
    }

    create(){
        // background
        this.background =  this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);
        
        //group with game objects
        gameObjs = this.add.group();
        gameObjs.inputEnableChildren = true;

        if(isMobile){
            MAP_SIZE = 6;
        }

        // create map
        this.renderMap(MAP_SIZE, objsTitle, gameObjs, playerClick, objsID);
        

        //sound_on and sound_off
        let sound_on;
        let sound_off;
        if(isMobile){
            sound_on = this.add.image(config.width * 0.08, config.height * 0.08, "sound_on");
            sound_off = this.add.image(config.width * 0.08, config.height * 0.08, "sound_off");
        }else{
            sound_on = this.add.image(config.width * 0.05, config.height * 0.05, "sound_on");
            sound_off = this.add.image(config.width * 0.05, config.height * 0.05, "sound_off");
        }
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

        // woohoo sound
        woohooSound = this.sound.add('woohoo', {
            volume: 0.7,
            loop: false
        });

        // magic circle
        if(isMobile){
            circle = this.physics.add.sprite(config.width * 0.05, config.height * 0.9, 'circle').setInteractive();
            circleText = this.add.text(config.width * 0.1, config.height * 0.9, '', { font: '20px Arial', fill: '#ffff'})
        }else{
            circle = this.physics.add.sprite(config.width * 0.1, config.height * 0.9, 'circle').setInteractive();;
            circleText = this.add.text(config.width * 0.15, config.height * 0.87, '', { font: '20px Arial', fill: '#ffff'})
        }
        circle.setScale(2);
        circle.on('pointerdown', this.circleClick, this);
        circle.maxY = config.height * 0.85;
        circle.minY = config.height * 0.9;
        circle.speed = 0.5;

        // scoreText
        scoreText = this.add.text(config.width/6, 5, '0', { font: '20px Arial', fill: '#ffff'});

        // timer
        if(isMobile){
            info = this.add.text(config.width * 0.6, 5, '', { font: '20px Arial', fill: '#ffff'});
        }else{
            info = this.add.text(config.width/2.4, 5, '', { font: '20px Arial', fill: '#ffff'});
        }
        timer = this.time.addEvent({ delay: gameTime, callback: gameOver, callbackScope: this });

        // question
        if(isMobile){
            question = this.add.image(config.width * 0.078, config.height * 0.22, 'question').setInteractive();
        }else{
            question = this.add.image(config.width * 0.05, config.height * 0.17, 'question').setInteractive();
        }
        question.on('pointerdown', this.questionClick, this);
        question.setTintFill(0xffffff);

        //question bg
        if(isMobile){
            this.helpBg =this.add.rectangle(config.width * 0.42, config.height * 0.5, 210, 300, 0xffffff);
        }else{
            this.helpBg =this.add.rectangle(config.width * 0.3, config.height * 0.4, 210, 300, 0xffffff);
        }
        this.helpBg.setVisible(false);

        //question text
        this.helpText = [];

        if(isMobile){
            this.helpText.push(this.add.text(config.width * 0.3, config.height * 0.1,'HELP',{ font: '30px Arial', fill: '#000000'}));
            this.helpText.push(this.add.text(config.width * 0.15, config.height * 0.2,'№1 Collect 3 \nidentical elements\nvertically or\nhorizontally',{ font: '20px Arial', fill: '#000000'}));
            this.helpText.push(this.add.text(config.width * 0.15, config.height * 0.48,'№2 For every three\ncollected, you get\n100 points',{ font: '20px Arial', fill: '#000000'}));
            this.helpText.push(this.add.text(config.width * 0.15, config.height * 0.7,'№3 Сollect maximum \npoints',{ font: '20px Arial', fill: '#000000'}));
        }else{
            this.helpText.push(this.add.text(config.width * 0.2, config.height * 0.1,'HELP',{ font: '30px Arial', fill: '#000000'}));
            this.helpText.push(this.add.text(config.width * 0.1, config.height * 0.2,'№1 Collect 3 \nidentical elements\nvertically or\nhorizontally',{ font: '20px Arial', fill: '#000000'}));
            this.helpText.push(this.add.text(config.width * 0.1, config.height * 0.4,'№2 For every three\ncollected, you get\n100 points',{ font: '20px Arial', fill: '#000000'}));
            this.helpText.push(this.add.text(config.width * 0.1, config.height * 0.55,'№3 Сollect maximum \npoints',{ font: '20px Arial', fill: '#000000'}));
        }

        this.helpText.forEach((el)=>{
            el.setVisible(false);
            el.setDepth(2);
        });
    }

    questionClick(){
        if(questionIsVisible){
            console.log("не видно");            
            this.helpBg.setVisible(false);
            questionIsVisible = false;
            this.helpText.forEach((el)=>{
                el.setVisible(false);
            });
            console.log(this.helpText.length)
        }else{
            this.helpText.forEach((el)=>{
                el.setVisible(true);
            });
            console.log("видно");
            this.helpBg.setVisible(true);
            questionIsVisible = true;
           
            // console.log('question Click');
            // bg = this.add.rectangle(config.width * 0.45, config.height * 0.45, 300, 300, 0xffffff);
            
        }
    }

    circleClick(){
        circleText.setText(circleClickText[Math.round(Math.random() * circleClickText.length)]);
    }

    update(){

        //
        circle.y += circle.speed;

        if(circle.y >= circle.minY && circle.speed > 0){
            circle.speed *= -1;
        }else if(circle.y <= circle.maxY && circle.speed < 0){
            circle.speed *= -1;
        }

        // bg animation
        this.background.tilePositionY -= 0.5;

        // scoreText
        scoreText.setText('Score : ' + score);
        
        // timer
        info.setText('Time: ' + Math.round(Math.floor(gameTime - timer.getElapsed())/1000));
    }

    chooseObj(){    
        this.setTint(0xf0ff00);
        // this.setTint(0xFFFF00);

        switch(playerClick){
            case 2:{
                playerClick++;
                console.log("Выбран второй объект");

                playerClick = 1;

                if(isNearTest(tempObj, this) && isThree(tempObj, this)){
                    score += 100;
                    playerStepNum++;
                    if(!isMute){
                        // goodChoiceSound.play();
                        woohooSound.play(); //второй вариант звука при уничтожении тройки.
                    }

                    objsID = swapObjs(tempObj, this, objsID);
                    updateMap(MAP_SIZE, objsID, gameObjs, THIS);
                    objsID = changeObjects();//удаляем 3
                    objsID = nullInTop(objsID);//сдвигаем все элементы вниз
                    objsID = addNewElementsID(objsID);//заменяем id 0 на новый.
                    
                    circleText.setText(circleGoodText[Math.round(Math.random() * circleGoodText.length)]);

                    updateMap(MAP_SIZE, objsID, gameObjs, THIS);
                }else{
                    playerStepNum++;
                    if(!isMute){
                        noGoodChoiceSound.play()
                    }

                    circleText.setText(circleNoGoodText[Math.round(Math.random() * circleNoGoodText.length)]);

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
            if(isMobile){
                y+=50;
            }else{
                y+=45;
            }
            objsID[i] = [];
            for(let j = 0; j < MAP_SIZE; j++){
                if(isMobile){
                    x+=50
                }else{
                    x+=45;
                }
                let objId = Math.round(Math.random() * (6-1) + 1);
                objsID[i][j] = objId;
                
                let obj = {};
                obj.i = i;
                obj.j = j;

                objId = AnalizHorizontalMap(objsID, obj);//убираем 3 в ряд по горизонтали при создании карты
                objId = AnalizVerticalMap(objsID, obj);//убираем 3 в ряд по вертикали при создании карты
                
                obj = this.add.sprite(x, y, objsTitle[objId]).setInteractive();
                
                if(isMobile){
                    obj.setScale(1.3);
                }
                
                obj.on('pointerdown', this.chooseObj, this.obj);
                
                obj.on('pointerout', function(){
                    if(isMobile){
                        this.setScale(1.3)
                    }else{
                        this.setScale(1);
                    }
                })

                obj.on('pointerover', function(){
                    if(isMobile){
                        this.setScale(1.3);
                    }else{
                        this.setScale(1.2);
                    }
                })

                gameObjs.add(obj);
            }
            x = 25;
        }
        
        // Кастыль
        /* Чтобы в конце игры, игрок не видел поля сгенерированного в первый раз, 
            мы удаляем поле через после окончания таймера.*/
        setTimeout(()=>{
            gameObjs.clear(true);
        }, gameTime);
    }
}

function changeObjects(){
    // let tempIdObjs = 0;
    // let tempIdObjs2 = 0;
    
    for (let i = 0; i < objsID.length; i++) {
        for (let j = 0; j < objsID[i].length; j++) {
            if(objsID[i][j] == objsID[i][j+1] && objsID[i][j] == objsID[i][j+2]){
                // objsID[i][j] = Math.round(Math.random() * (6-4) + 1);//уменьшаем вероятность выпадения 3 одинаковых элементов сдвинув min на 4
                // objsID[i][j+1] = Math.round(Math.random() * (6-1) + 1);
                // objsID[i][j+2] = Math.round(Math.random() * (6-1) + 1);
                // tempIdObjs = objsID[i][j];
               

                objsID[i][j] = 0;
                objsID[i][j+1] = 0;
                objsID[i][j+2] = 0;

            }
        }
    }

    for (let i = 0; i < objsID.length; i++) {
        for (let j = 0; j < objsID[i].length-2; j++) {
            if(objsID[j][i] == objsID[j+1][i] && objsID[j][i] == objsID[j+2][i]){
                // objsID[j][i] = Math.round(Math.random() * (6-4) + 1);//уменьшаем вероятность выпадения 3 одинаковых элементов сдвинув min на 4
                // objsID[j+1][i] = Math.round(Math.random() * (6-1) + 1);
                // objsID[j+2][i] = Math.round(Math.random() * (6-1) + 1);
                // tempIdObjs2 = objsID[i][j];
                
                objsID[j][i] = 0;//уменьшаем вероятность выпадения 3 одинаковых элементов сдвинув min на 4
                objsID[j+1][i] = 0;
                objsID[j+2][i] = 0;

            }
        }
    }

    // score += objScorePoint[tempIdObjs];
    // score += objScorePoint[tempIdObjs2];
    // tempIdObjs = 0;
    // tempIdObjs2 = 0;
    // console.log(objsID);
    // console.log(objScorePoint[tempIdObjs]);
    return objsID;
}

function gameOver(){
    gameObjs.clear(true);
    THIS.background.setDepth(2).setInteractive();

    SaveBestResult(score);

    
    THIS.add.text(config.width * 0.30, config.height * 0.1,"Game Over", {font: "40px Arial", fill: "#fff"}).setDepth(10);
    THIS.add.text(config.width * 0.40, config.height * 0.2,"Results:", {font: "35px Arial", fill: "#fff"}).setDepth(10);
    THIS.add.text(config.width * 0.42, config.height * 0.3,`Score: ${score}`, {font: "30px Arial", fill: "#fff"}).setDepth(10);
    THIS.add.text(config.width * 0.40, config.height * 0.4,`Swipes: ${playerStepNum}`, {font: "30px Arial", fill: "#fff"}).setDepth(10);
    THIS.add.text(config.width * 0.35, config.height * 0.5,`Best score: ${bestScore}`, {font: "30px Arial", fill: "#fff"}).setDepth(10);
    
    let restart = THIS.add.text(config.width * 0.36, config.height * 0.6,"RESTART", {font: "35px Arial", fill: "#fff"}).setDepth(10);
    restart.setInteractive();
    restart.setDepth(10);

    restart.on('pointerdown', Restart, this);
                
    restart.on('pointerout', function(){
        this.setTint(0xffffff);
    })

    restart.on('pointerover', function(){
        this.setTint(0xf0ff00);
    })

    if(!isMute){
        bgMusic.pause();
        theEndMusic.play();

        // выкл фоновую музыку на время проигрывания музыки конца игры
        setTimeout(() => {
            bgMusic.resume();
        }, 2800);
    }
}

function SaveBestResult(score){
    
    if(localStorage.getItem('bestScore') === null){
        bestScore = 0;
    }else{
        bestScore = JSON.parse(localStorage.getItem('bestScore'));
    }

    if(score > bestScore){
        bestScore = score;
        localStorage.setItem('bestScore', JSON.stringify(bestScore));
    }else{
        return;
    }
}

function isThree(tempObj, thisObj){

    let col = 0;
    
    let tempObjsID = objsID.map(function(arr) {
        return arr.slice();
    });

    tempObjsID = swapObjs(tempObj, thisObj, tempObjsID);
    
    for (let i = 0; i < tempObjsID.length; i++) {
        for (let j = 0; j < tempObjsID[i].length; j++) {
            if(tempObjsID[i][j] == tempObjsID[i][j+1] && tempObjsID[i][j] == tempObjsID[i][j+2]){
                // console.log("три в ряд горизонталь");
                col++;
            }
        }
    }

    for (let i = 0; i < tempObjsID.length; i++) {
        for (let j = 0; j < tempObjsID[i].length-2; j++) {
            if(tempObjsID[j][i] == tempObjsID[j+1][i] && tempObjsID[j][i] == tempObjsID[j+2][i]){
                // console.log("три в ряд вертикаль");
                col++;
            }
        }
    }

    if(col > 0){

        return true;
    }else{
        return false;
    }
}

function addNewElementsID(objsID){
    for (let i = 0; i < objsID.length; i++) {
        for (let j = 0; j < objsID.length; j++) {
            if(objsID[i][j] == 0){
                objsID[i][j] = Math.round(Math.random() * (6-1) + 1);
            }

            if(objsID[i][j] == objsID[i][j+1] == objsID[i][j+2]){
                objsID[i][j] = objsID[i][j] = Math.round(Math.random() * (6-1) + 1);
            }
        }
    }
    return objsID;
}

function nullInTop(objsID){
    let pos = objsID.length - 1;
    for (let i = 0; i < objsID.length; i++) {
        pos = objsID.length-1;
        for (let j = objsID.length-1; j >= 0; j--) {
            if(objsID[j][i] != 0){
                objsID[pos][i] = objsID[j][i];
                pos--;
            }
        }
        while(pos > -1){
            objsID[pos--][i] = 0
        }
    }
    return objsID;
}

function Restart(){
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
        
        if(isMobile){
            y+=50;
        }else{
            y+=45;
        }

        for(let j = 0; j < MAP_SIZE; j++){
            if(isMobile){
                x+=50;
            }else{
                x+=45;
            }
    
            let obj = THIS.add.sprite(x, y, objsTitle[objsID[i][j]]).setInteractive();

            if(isMobile){
                obj.setScale(1.3);
            }

            obj.i = i;
            obj.j = j;
            
            obj.on('pointerdown', THIS.chooseObj, THIS.obj);
            obj.on('pointerout', function(){
                if(isMobile){
                    this.setScale(1.3);
                }else{
                    this.setScale(1);
                }
            })

            obj.on('pointerover', function(){
                if(isMobile){
                    this.setScale(1.5);
                }else{
                    this.setScale(1.2);
                }
            })

            gameObjs.add(obj);
        }
        x = 25;
    }
}

function isNearTest(tempObj, thisObj){
    if((Math.abs(tempObj.i - thisObj.i) == 1) ||  (Math.abs(tempObj.j - thisObj.j) == 1)){
        if((tempObj.i == thisObj.i) || (tempObj.j == thisObj.j)){
            return true;
        }
    }
}

function AnalizHorizontalMap(objsID, obj){

    if(obj.j == 0 || obj.j == 1){
        return  objsID[obj.i][obj.j];
    }else if((objsID[obj.i][obj.j-1] == objsID[obj.i][obj.j]) && (objsID[obj.i][obj.j-2] == objsID[obj.i][obj.j])){
        if(objsID[obj.i][obj.j] == objsTitle.length){
            objsID[obj.i][obj.j]--;
            return objsID[obj.i][obj.j];
        }else if(objsID[obj.i][obj.j] == 1 || objsID[obj.i][obj.j] < objsTitle.length-1){
            objsID[obj.i][obj.j]++;
            return objsID[obj.i][obj.j];
        }
    }else{
        return objsID[obj.i][obj.j];
    }
}

function AnalizVerticalMap(objsID, obj){
    if(obj.i == 0 || obj.i == 1){
        return  objsID[obj.i][obj.j];
    }else if((objsID[obj.i-1][obj.j] == objsID[obj.i][obj.j]) && (objsID[obj.i-2][obj.j] == objsID[obj.i][obj.j])){
        if(objsID[obj.i][obj.j] == objsTitle.length){
            objsID[obj.i][obj.j]--;
            return objsID[obj.i][obj.j];
        }else if(objsID[obj.i][obj.j] == 1 || objsID[obj.i][obj.j] < objsTitle.length-1){
            objsID[obj.i][obj.j]++;
            return objsID[obj.i][obj.j];
        }
    }else{
        return objsID[obj.i][obj.j];
    }
}

