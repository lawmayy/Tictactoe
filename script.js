var origBoard;
const humanPlayer = 'X';
const aiPlayer = 'O';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const cells = document.querySelectorAll('.cell');
startGame();


function startGame() {
    document.querySelector('.endgame').style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (var i=0; i<cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}


function turnClick(square){
    // if a spot has been clicked, cant be click again
    if (typeof origBoard[square.target.id] == 'number') {
        // console.log(square.target.id);
        turn(square.target.id, humanPlayer)
        // console.log(checkTie())

        // AI's turn
        if (!checkTie()) {

            // Added 0.5s delay
            setTimeout(function(){
                turn(bestSpot(), aiPlayer)
            }, 500); 
            
        };
    }
}


function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}


function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []) ;
    // console.log(plays)
    // a - accumulator returns value in the end, a is initialized with []
    // e - element in the board array that is iterated through
    // i - index
    // if e == player, add index(i) to accumulator(a)
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}


function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "lightblue" : "lightred";
        // console.log("gameOver",index);
    }
    for (var i=0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose!");
}


function checkTie() {
    if (emptySquares().length == 0){
        let gameWon = checkWin(origBoard, humanPlayer);
        if (gameWon) {
            gameOver(gameWon);
            return true;
        }
        else {
            for (var i=0; i<cells.length; i++) {
                cells[i].style.backgroundColor = "lightgreen";
                cells[i].removeEventListener('click', turnClick, false);
            }
            declareWinner("Tie Game!");
            return true;
        }
    }
    return false;
}


function bestSpot() {
    // return emptySquares()[0];
    return minimax(origBoard, aiPlayer).index;
}


function emptySquares() {
    return origBoard.filter(s => typeof s == "number");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}


// Minimax algorithm
function minimax(newBoard, player) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, humanPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 20};
    } else if (availSpots.length === 0){
        return {score: 0};
    }

    var moves = [];
    for (var i=0; i<availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]]
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }
        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i=0; i<moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
    var bestScore = 10000;
    for (var i=0; i<moves.length; i++) {
        if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
        }
    }
    }
    return moves[bestMove];
}