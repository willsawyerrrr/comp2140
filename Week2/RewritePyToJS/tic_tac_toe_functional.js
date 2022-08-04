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
 * Returns a string representation of the current board.
 * 
 * @param {List[str]} board the values for each position on the baord
 * @param {int} padding how many spaces should appear either side of the values; defaults to 1
 */
function encodeGameBoard(board, padding = 1) {
    let horizontalDivider = "-".repeat(BOARD_LENGTH * (2 * padding + 1) + 2);

    let result = "";

    for (let i = 0; i < BOARD_LENGTH; i++) {
        if (i != 0) {
            result += horizontalDivider + "\n";
        }

        let start = i * BOARD_LENGTH;
        let row = board.slice(start, start + BOARD_LENGTH);
        row = row.map(value => `${EMPTY.repeat(padding)}${value}${EMPTY.repeat(padding)}`);

        result += row.join("|") + "\n";
    }

    return result;
}

/**
 * Returns objects used to reset the game to a valid starting state.
 */
function reset() {
    board = new Array(BOARD_LENGTH ** 2).fill(EMPTY);
    winner = null;
    playerOnesTurn = true;

    return [board, winner, playerOnesTurn];
}

/**
 * Plays a tic-tac-toe game through to completion.
 */
function play(board, winner, playerOnesTurn) {
    while (!isOver(board, winner)) {
        console.log(encodeGameBoard(board));

        // Prompt the next player for a move
        let index = getNextMove();

        // Perform out of bounds check
        if (!(0 <= index < BOARD_LENGTH ** 2)) {
            console.log(OUT_OF_BOUNDS);
            continue;
        }

        // Check if position already filled
        if (board[index] != EMPTY) {
            console.log(POSITION_FILLED);
            continue;
        }

        // Enact the move on the board
        board[index] = getCurrentPlayer(playerOnesTurn);

        // Check for end game conditions
        if (checkWin(board, playerOnesTurn)) {
            winner = getCurrentPlayer(playerOnesTurn);
            return winner;
        }

        // Flip the turn
        playerOnesTurn = !playerOnesTurn;
    }
}


/**
 * Repeatedly prompts the user for their next move until they give a
 * numerical index, which it returns.
 * 
 * Doesn't perform out bounds validity checks on the supplied index.
 */
function getNextMove(playerOnesTurn) {
    while (true) {
        let move = prompt(MOVE_PROMPT.replace("{}", getCurrentPlayer(playerOnesTurn)));

        // Check validity and return the move if true
        if (/\d/.test(move)) {
            return parseInt(move);
        }

        console.log(INVALID_INPUT);
    }
}


/**
 * Gets the string corresponding to the player whose turn it is.
 */
function getCurrentPlayer(playerOnesTurn) {
    return playerOnesTurn ? PLAYER_ONE : PLAYER_TWO;
}


/**
 * Check if the given player has won the game.
 */
function checkWin(board, playerOnesTurn) {
    // Get all player owned indices
    let positions = board.map((value, index) => [value, index]).filter(pair => (pair[0] == getCurrentPlayer(playerOnesTurn)));

    for (let winningTrio of WINNING_TRIOS) {
        // Check if the player is at all indicies in a winning trio
        if (winningTrio.every(index => positions.some(pair => pair[1] == index))) {
            // for every index in winningTrio, it also exists as an index in positions
            return true;
        }
    }

    return false;
}


/**
 * Returns true if and only if neither player is able to make a move.
 */
function hasDrawn(board) {
    return !board.includes(EMPTY);
}


/**
 * Returns true if and only if the game is over.
 */
function isOver(board, winner) {
    return hasDrawn(board) || winner != null;
}


/**
 * Returns winning or drawing info after the game has completed.
 */
function displayWinnerInfo(winner) {
    if (winner == null) {
        return DRAW_MESSAGE;
    } else {
        return WIN_MESSAGE.replace("{}", winner);
    }
}


do {
    let [board, winner, playerOnesTurn] = reset();
    winner = play(board, winner, playerOnesTurn);
    console.log(displayWinnerInfo(winner));
} while (prompt(REPLAY_PROMPT) == "y");
