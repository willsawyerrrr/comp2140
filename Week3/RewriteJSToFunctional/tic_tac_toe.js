const prompt = require("prompt-sync")({ sigint: true });

function main() {
    const BOARD_LENGTH = 3;
    const PLAYER_ONE = "X";
    const PLAYER_TWO = "O";
    const EMPTY = " ";

    // Messages
    const MOVE_PROMPT = (player) => `Player ${player}, please enter the index of your next move: `;
    const INVALID_INPUT = "Wrong input. Please try again";
    const OUT_OF_BOUNDS = "Position out of bounds. Please try again.";
    const POSITION_FILLED = "Position already filled. Please try again.";
    const DRAW_MESSAGE = "The game ended in a draw.";
    const WIN_MESSAGE = (player) => `\nPlayer ${player} has won the game!!`;
    const REPLAY_PROMPT = "Do you wish to play again? [y/N] ";

    // Trios of indices which form a winning line on the board
    const WINNING_TRIOS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    function encodeGameBoard(board, padding = 1) {
        let horizontalDivider = "-".repeat(BOARD_LENGTH * (2 * padding + 1) + 2);

        function encodeRow(needsDivider, row) {
            let result = needsDivider ? horizontalDivider : "";
            result += row.map(value => `${EMPTY.repeat(padding)}${value}${EMPTY.repeat(padding)}`);
            return result
        }

        let rowIndexes = Array(BOARD_LENGTH).fill(0).map((_, i) => i); // range from 0 to BOARD_LENGTH - 1
        let rows = rowIndexes.map(index => board.slice(index * BOARD_LENGTH, (index + 1) * BOARD_LENGTH));

        let encodedRows = rows.map((row, index) => encodeRow(index != 0, row));

        return encodedRows.join("|") + "\n";
    }

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

    function getNextMove(playerOnesTurn, showError = false) {
        if (showError) {
            console.log(INVALID_INPUT);
        }

        let move = prompt(MOVE_PROMPT(getCurrentPlayer(playerOnesTurn)));

        // If valid, return; otherwise, recurse
        return /^\d$/.test(move) ? parseInt(move) : getNextMove(playerOnesTurn, true);
    }

    function checkWin(board, playerOnesTurn) {
        // Get all player owned indices
        let positions = board.filter((value, index) => value == getCurrentPlayer(playerOnesTurn)).map((_, index) => index);

        return WINNING_TRIOS.map(trio => trio.every(value => positions.contains(value))).some(value => value);
    }

    let getCurrentPlayer = (playerOnesTurn) => playerOnesTurn ? PLAYER_ONE : PLAYER_TWO;

    let reset = () => [new Array(BOARD_LENGTH ** 2).fill(EMPTY), null, true];

    let hasDrawn = (board) => !board.includes(EMPTY);

    let isOver = (board, winner) => hasDrawn(board) || winner != null;

    let displayWinnerInfo = (winner) => (winner == null) ? DRAW_MESSAGE : WIN_MESSAGE(winner);

    do {
        let [board, winner, playerOnesTurn] = reset();
        winner = play(board, winner, playerOnesTurn);
        console.log(displayWinnerInfo(winner));
    } while (/^"y"$/.test(prompt(REPLAY_PROMPT).toLowerCase()));
}

main();
