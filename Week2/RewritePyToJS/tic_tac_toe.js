const prompt = require("prompt-sync")({ sigint: true });

const BOARD_LENGTH = 3;
const PLAYER_ONE = "X";
const PLAYER_TWO = "O";
const EMPTY = " ";

// Messages
const MOVE_PROMPT = "Player {}, please enter the index of your next move: ";
const INVALID_INPUT = "Wrong input. Please try again";
const OUT_OF_BOUNDS = "Position out of bounds. Please try again.";
const POSITION_FILLED = "Position already filled. Please try again.";
const DRAW_MESSAGE = "The game ended in a draw.";
const WIN_MESSAGE = "\nPlayer {} has won the game!!";
const REPLAY_PROMPT = "Do you wish to play again? [y/N] ";

const WINNING_TRIOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];


/**
 * Prints the current board out to the terminal.
 * 
 * @param {List[str]} board the values for each position on the baord
 * @param {int} padding how many spaces should appear either side of the values; defaults to 1
 */
function printGameBoard(board, padding = 1) {
    let horizontalDivider = "-".repeat(BOARD_LENGTH * (2 * padding + 1) + 2);

    for (let i = 0; i < BOARD_LENGTH; i++) {
        if (i != 0) {
            console.log(horizontalDivider);
        }

        let start = i * BOARD_LENGTH;
        let row = board.slice(start, start + BOARD_LENGTH);
        row = row.map(value => `${EMPTY.repeat(padding)}${value}${EMPTY.repeat(padding)}`);

        console.log(row.join("|"));
    }

    console.log("\n");
}


/**
 * A class which represents a single tic-tac-toe game.
 */
class Game {
    #playerOnesTurn;
    #board;
    #winner;

    constructor() {
        this.reset();
    }

    /**
     * Returns the game to a valid starting state.
     */
    reset() {
        this.#playerOnesTurn = true;
        this.#board = new Array(BOARD_LENGTH ** 2).fill(EMPTY);
        this.#winner = null;
    }

    /**
     * Plays a tic-tac-toe game through to completion.
     */
    play() {
        while (!this.isOver()) {
            printGameBoard(this.#board);

            // Prompt the next player for a move
            let index = this.getNextMove();

            // Perform out of bounds check
            if (!(0 <= index < BOARD_LENGTH ** 2)) {
                console.log(OUT_OF_BOUNDS);
                continue;
            }

            // Check if position already filled
            if (this.#board[index] != EMPTY) {
                console.log(POSITION_FILLED);
                continue;
            }

            // Enact the move on the board
            this.#board[index] = this.getCurrentPlayer();

            // Check for end game conditions
            if (this.checkWin()) {
                this.#winner = this.getCurrentPlayer();
                return;
            }

            // Flip the turn
            this.#playerOnesTurn = !this.#playerOnesTurn;
        }
    }

    /**
     * Repeatedly prompts the user for their next move until they give a
     * numerical index, which it returns.
     * 
     * Doesn't perform out bounds validity checks on the supplied index.
     */
    getNextMove() {
        while (true) {
            let move = prompt(MOVE_PROMPT.replace("{}", this.getCurrentPlayer()));

            // Check vlaidity and return the move if true
            if (/\d/.test(move)) {
                return parseInt(move);
            }

            console.log(INVALID_INPUT);
        }
    }

    /**
     * Get the string corresponding to the player whose turn it is.
     */
    getCurrentPlayer() {
        return this.#playerOnesTurn ? PLAYER_ONE : PLAYER_TWO;
    }

    /**
     * Check if the current player has won the game.
     */
    checkWin() {
        // Get all player owned indices
        let positions = this.#board.map((value, index) => [value, index]).filter(pair => (pair[0] == this.getCurrentPlayer()));

        for (let winningTrio of WINNING_TRIOS) {
            // Check if the player is at all indicies in a winning trio
            if (positions.every(pair => winningTrio.includes(pair[0]))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns true iff neither player is able to make a move.
     */
    hasDrawn() {
        return !this.#board.includes(EMPTY);
    }

    /**
     * Returns true iff the game is over.
     */
    isOver() {
        return this.hasDrawn() || this.#winner != null;
    }

    /**
     * Prints winning or drawing info after the game has completed.
     */
    displayWinnerInfo() {
        if (this.#winner == null) {
            console.log(DRAW_MESSAGE);
        } else {
            console.log(WIN_MESSAGE.replace("{}", this.#winner));
        }
    }
}


let game = new Game();
while (true) {
    game.play();
    game.displayWinnerInfo();

    // Ask user if they want to play agin
    if (prompt(REPLAY_PROMPT) != "y") {
        break;
    }

    game.reset();
}
