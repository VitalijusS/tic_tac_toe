

const scoresDOM = document.querySelectorAll('.scoreBoard > p');
const tilesDOM = document.querySelectorAll('.tile');
const winMessageDOM = document.querySelector('.winMessageContainer');

let nextMove = "X";
let xSquares = [];
let oSquares = [];
let isGameOver = false;
let localData = [0, 0];
if (localStorage.getItem('score') !== null) {
    localData = JSON.parse(localStorage.getItem('score'));
}
localStorage.setItem('score', JSON.stringify(localData));
showScore();
for (let i = 0; i < tilesDOM.length; i++) {
    tilesDOM[i].addEventListener('click', () => {
        if (tilesDOM[i].textContent === '' && !isGameOver) {
            tilesDOM[i].textContent = add();
            checkIfNoWinner();
            checkIfWin();
        }
    })
    document.querySelector('body').addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            reset();
        }
    })

    function add() {
        if (nextMove === 'X') {
            nextMove = 'O';
            xSquares.push(i);
            console.log(xSquares);
            return "X";
        }
        if (nextMove === 'O') {
            nextMove = "X";
            oSquares.push(i);
            console.log(oSquares);
            return 'O';
        }
    }
    function checkIfWin() {

        if (check(xSquares)) {
            localData[0]++;
            localStorage.setItem('score', JSON.stringify(localData));
            showScore();
        }
        if (check(oSquares)) {
            localData[1]++;
            localStorage.setItem('score', JSON.stringify(localData));
            showScore();
        }
    }

    function check(squareList) {
        const winCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (const winCombination of winCombinations) {
            if (squareList.filter(num => num === winCombination[0]
                || num === winCombination[1]
                || num === winCombination[2]).length >= 3) {
                console.log('winner');
                weHaveAWinner(winCombination);
                isGameOver = true;
                return true;
            }
        }
        return false;
    }
    function weHaveAWinner(list) {
        for (const num of list) {
            tilesDOM[num].style.color = 'red';
        }
        winMessageDOM.innerHTML = ` 
            <p>${tilesDOM[list[0]].textContent} IS THE WINNER!!!</p>
            <button>Reset</button>
            `;
        winMessageDOM.addEventListener('click', reset)
    }
    function reset() {
        for (const tile of tilesDOM) {
            tile.style.color = 'white';
            tile.textContent = '';
        }
        isGameOver = false;
        oSquares = [];
        xSquares = [];
        nextMove = 'X';
        winMessageDOM.innerHTML = '';
    }
    function checkIfNoWinner() {
        if (oSquares.length === 4 && xSquares.length === 5) {
            winMessageDOM.innerHTML = ` 
            <p>Game ended in a draw :(</p>
            <button>Reset</button>
            `;
            winMessageDOM.addEventListener('click', reset);
        }
    }
}
function showScore() {
    scoresDOM[0].textContent = localData[0];
    scoresDOM[1].textContent = localData[1];
}
