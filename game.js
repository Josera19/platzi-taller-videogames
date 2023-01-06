const canvas = document.querySelector("#game");
const keyUp = document.querySelector('#up');
const keyDown = document.querySelector('#down');
const keyLeft = document.querySelector('#left');
const keyRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
const game = canvas.getContext("2d");

let canvasSize;
let elementSize;
let level = 0;
var lives = 3;
let timeStart;
let timePlayer;
let timeInterval;
var timeToShow;

var playerPosition = {
    x: undefined,
    y: undefined
};

var giftPosition = {
    x: undefined,
    y: undefined
};

var enemyPositions = [];

window.addEventListener("load", setCavnvasSize);
window.addEventListener("keydown", keyPress);
window.addEventListener("resize", setCavnvasSize);
keyUp.addEventListener('click', moveUp);
keyDown.addEventListener('click', moveDown);
keyLeft.addEventListener('click', moveLeft);
keyRight.addEventListener('click', moveRight);

function setCavnvasSize(){

    if (window.innerWidth > window.innerHeight) {
        
        canvasSize = window.innerHeight * 0.5;
    }else{
        
        canvasSize = window.innerWidth * 0.5;
    }

    
    console.log(canvasSize);
    canvas.setAttribute("width", canvasSize);
    canvas.setAttribute("height", canvasSize);
    elementSize = canvasSize/10.3;

    startGame();
    movePlayer();
}
function movePlayer(){
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);

    if( Math.round(playerPosition.x) == Math.round(giftPosition.x) && Math.round(playerPosition.y) == Math.round(giftPosition.y)){
        console.log("Subiste de Nivel");
        levelUp();
    }

    enemyColision = enemyPositions.find(enemy => {
        var enemyPositionX = enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
        var enemyPositionY = enemy.y.toFixed(2) == playerPosition.y.toFixed(2);
        return enemyPositionX && enemyPositionY;
    })

    if(enemyColision){
        console.log("Chocaste con una bomba :(");
        resetLevel();
    }
}
function startGame(){

    game.font = elementSize + "px Verdana";
    game.textAlign = "end";

    const map = maps[level];

    if(!map){
        gameWin();
        return;
    } 

    if(!timeStart){
        timeStart = Date.now();
        showRecord();
        timeInterval = setInterval(showTime,100);
    }

    showLives();

    const mapRows = map.trim().split('\n');
    const mapRowsCol = mapRows.map( row => row.trim().split(''));

    enemyPositions = [];
    game.clearRect(0,0,canvasSize,canvasSize);

    mapRowsCol.forEach( (row, rowIndex) => {
        row.forEach( (col, colIndex) => {
            const posX = 10 + elementSize * (colIndex + 1);
            const posY = elementSize * (rowIndex + 1);
            game.fillText(emojis[col], posX, posY);

            if(col === 'O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log({playerPosition});
                }
            }else if (col === 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            }else if(col == 'X'){
                enemyPositions.push({
                    x: posX,
                    y: posY
                });
            }
        })
    });
    // for (let row = 1; row <=10; row++) {
    //     for (let col = 1; col <= 10; col++) {
    //     game.fillText(emojis[mapRowsCol[col - 1][row - 1]], 10 + elementSize * row, elementSize * col);
    //     }
    // }
    // game.fillRect(0,0,100,100);
    // game.clearRect(0,0,100,50);
    // game.font = "25px Verdana";
    // game.fillStyle = "green";
    // game.textAlign = "center";
    // game.fillText("Platzi",55,55);

    movePlayer();
    
}
function moveUp() {
    if (Math.round(playerPosition.y) > Math.round(elementSize)){
        console.log("Me muevo a arriba");
        playerPosition.y -= elementSize;
        startGame();
    }
}
function moveDown() {
    if (playerPosition.y < (elementSize * 10)){
        console.log("Me muevo a abajo");
        playerPosition.y += elementSize;
        startGame();
    }
}
function moveLeft() {
    if (playerPosition.x > elementSize + 11){
    console.log("Me muevo a la izquierda");
    playerPosition.x -= elementSize;
    startGame();
    }
}
function moveRight() {
    if (playerPosition.x < elementSize * 10){
    console.log("Me muevo a la derecha");
    playerPosition.x += elementSize;
    startGame();
    }
}
function keyPress (evObject){
    const key = evObject.key;
     if (key === "ArrowUp") moveUp();
     else if (key === "ArrowDown") moveDown();
     else if (key === "ArrowLeft") moveLeft();
     else if (key === "ArrowRight") moveRight();
}
function levelUp(){
    level++;
    startGame();
}
function gameWin(){
    clearInterval(timeInterval);

    const record = localStorage.getItem("record");

    if (record > parseInt(timeToShow) || !record) {
        localStorage.setItem("record",parseInt(timeToShow));
        pResult.innerHTML = "Congrats, you have a new Record";
    }else{
        pResult.innerHTML = "Sorry, you dinnt beat the Record. Try Again :(";
    }
}
function resetLevel(){
    lives--;
    console.log(lives);
    if (lives == 0){
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}
function showLives() {
    spanLives.innerHTML = emojis['HEART'].repeat(lives);
//     const arrayLives = Array(lives).fill(emojis['HEART']);
//     console.log(arrayLives);

//     spanLives.innerHTML = "";    
//     arrayLives.forEach(hearth => {
//         console.log(hearth);
//         spanLives.append(hearth);
//         return hearth;
//     });
 }
 function showTime(){
    timeToShow = (Date.now() - timeStart) / 1000;
    spanTime.innerHTML = parseInt(timeToShow);
 }
 function showRecord(){
    if (!localStorage.getItem("record")) {
        spanRecord.innerHTML = "Aún no hay Records";
    }else{
        spanRecord.innerHTML = localStorage.getItem("record") + "seg";
    }
 }