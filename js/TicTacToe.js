export class TicTacToe {
    constructor() {
        this.scoresDOM = document.querySelectorAll('.scoreBoard > p');
        this.tilesDOM = document.querySelectorAll('.tile');
        this.winMessageDOM = document.querySelector('.winMessageContainer');

        this.nextMove = "X";
        this.xSquares = [];
        this.oSquares = [];
        this.isGameOver = false;
        this.localData = [0, 0];

        this.run();
    }

    run() {
        if (localStorage.getItem('score') !== null) {
            this.localData = JSON.parse(localStorage.getItem('score'));
        }
        localStorage.setItem('score', JSON.stringify(this.localData));

        this.showScore();
        if (localStorage.getItem('xSquares') === null || localStorage.getItem('oSquares') === null) {
            localStorage.setItem('xSquares', JSON.stringify([]))
            localStorage.setItem('oSquares', JSON.stringify([]))
        } else {
            if (JSON.parse(localStorage.getItem('xSquares')).length !== 0
                || JSON.parse(localStorage.getItem('oSquares')).length !== 0) {
                this.displayOldGame();
            }

        }

        for (let i = 0; i < this.tilesDOM.length; i++) {
            this.tilesDOM[i].addEventListener('click', () => {
                if (this.tilesDOM[i].textContent === '' && !this.isGameOver) {
                    this.tilesDOM[i].textContent = this.add(i);
                    this.checkIfNoWinner();
                    this.checkIfWin();
                }
            })
            document.querySelector('body').addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    this.resetGame(this.tilesDOM);
                }
            })
        }
    }

    weHaveAWinner(list) {
        for (const num of list) {
            this.tilesDOM[num].style.color = 'red';
        }
        this.winMessageDOM.innerHTML = ` 
            <p>${this.tilesDOM[list[0]].textContent} IS THE WINNER!!!</p>
            <button class="resetGameBtn">Play again</button>
            <button class="resetScoreBtn">Reset score</button>
            `;
        document.querySelector('.resetGameBtn').addEventListener('click', () => this.resetGame())
        document.querySelector('.resetScoreBtn').addEventListener('click', () => this.resetScore())
    }

    check(squareList) {
        const winCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (const winCombination of winCombinations) {
            if (squareList.filter(num => num === winCombination[0]
                || num === winCombination[1]
                || num === winCombination[2]).length >= 3) {
                console.log('winner');
                this.weHaveAWinner(winCombination);
                this.isGameOver = true;
                return true;
            }
        }
        return false;
    }

    checkIfWin(refresh = false) {
        if (this.check(this.xSquares)) {
            refresh ? false : this.localData[0]++;
            localStorage.setItem('score', JSON.stringify(this.localData));
            this.showScore();
        }
        if (this.check(this.oSquares)) {
            refresh ? false : this.localData[1]++;
            localStorage.setItem('score', JSON.stringify(this.localData));
            this.showScore();
        }
    }

    resetGame() {
        for (const tile of this.tilesDOM) {
            tile.style.color = 'white';
            tile.textContent = '';
        }
        this.isGameOver = false;
        this.oSquares = [];
        this.xSquares = [];
        this.nextMove = 'X';
        this.winMessageDOM.innerHTML = '';
        localStorage.setItem('xSquares', JSON.stringify([]))
        localStorage.setItem('oSquares', JSON.stringify([]))
    }

    add(i) {
        if (this.nextMove === 'X') {
            this.nextMove = 'O';
            this.xSquares.push(i);
            localStorage.setItem('xSquares', JSON.stringify(this.xSquares))
            return "X";
        }
        if (this.nextMove === 'O') {
            this.nextMove = "X";
            this.oSquares.push(i);
            localStorage.setItem('oSquares', JSON.stringify(this.oSquares))
            return 'O';
        }
    }

    checkIfNoWinner() {
        if (this.oSquares.length === 4 && this.xSquares.length === 5) {
            this.winMessageDOM.innerHTML = ` 
                <p>Game ended in a draw :(</p>
                <button class="resetGameBtn">Restart game</button>
                <button class="resetScoreBtn">Reset score</button>
            `;
            document.querySelector('.resetGameBtn').addEventListener('click', () => this.resetGame())
            document.querySelector('.resetScoreBtn').addEventListener('click', () => this.resetScore())
        }
    }

    showScore() {
        this.scoresDOM[0].textContent = this.localData[0];
        this.scoresDOM[1].textContent = this.localData[1];
    }

    resetScore() {
        this.localData = [0, 0];
        localStorage.setItem('score', JSON.stringify(this.localData));
        this.showScore();
        this.resetGame();
    }

    displayOldGame() {
        this.xSquares = JSON.parse(localStorage.getItem('xSquares'));
        this.oSquares = JSON.parse(localStorage.getItem('oSquares'));
        this.xSquares.forEach(index => this.tilesDOM[index].textContent = 'X')
        this.oSquares.forEach(index => this.tilesDOM[index].textContent = 'O')
        this.checkIfNoWinner();
        this.checkIfWin(true);
        if (this.xSquares.length > this.oSquares.length) {
            this.nextMove = 'O';
        }
    }

}