from typing import List

BOARD_LENGTH = 3
PLAYER_ONE = 'X'
PLAYER_TWO = 'O'
EMPTY = ' '

# Messages
MOVE_PROMPT = 'Player {}, please enter the index of your next move: '
INVALID_INPUT = 'Wrong input. Please try again'
OUT_OF_BOUNDS = 'Position out of bounds. Please try again.'
POSITION_FILLED = 'Position already filled. Please try again.'
DRAW_MESSAGE = 'The game ended in a draw.'
WIN_MESSAGE = '\nPlayer {} has won the game!!'
REPLAY_PROMPT = 'Do you wish to play again? [y/N] '

WINNING_TRIOS = (
    (0, 1, 2), (3, 4, 5), (6, 7, 8), 
    (0, 3, 6), (1, 4, 7), (2, 5, 8), 
    (0, 4, 8), (2, 4, 6)
)

def print_game_board(board: List[str], padding: int=1) -> None:
    """Prints the current board out to the terminal.
    
    Parameters:
        board: A list containing the values for each position on the board.
        padding: How many spaces should appear either side of the values.
    
    """
    horizontal_divider = '-' * (BOARD_LENGTH * (2 * padding + 1) + 2)

    for row_index in range(BOARD_LENGTH):
        if row_index != 0:
            print(horizontal_divider)

        start = row_index * BOARD_LENGTH
        row = board[start: start + BOARD_LENGTH]
        row = [f'{EMPTY * padding}{value}{EMPTY * padding}' for value in row]

        print('|'.join(row))

    print()


class Game:
    """A class which represents a single tic-tac-toe game."""

    def __init__(self) -> None:
        self.reset()

    def reset(self) -> None:
        """Returns the game to a valid starting state."""
        self._player_ones_turn = True
        self._board = [EMPTY for _ in range(BOARD_LENGTH ** 2)]
        self._winner = None

    def play(self) -> None:
        """Plays a tic-tac-toe game through to completion."""
        while not self.is_over():
            print_game_board(self._board)

            # Prompt the next player for a move
            index = self.get_next_move()

            # Perform out of bounds checks
            if not (0 <= index < BOARD_LENGTH ** 2):
                print(OUT_OF_BOUNDS)
                continue

            # Check if position already filled
            if self._board[index] != EMPTY:
                print(POSITION_FILLED)
                continue

            # Enact the move on the board
            self._board[index] = self.get_current_player()

            # Check for end game conditions
            if self.check_win():
                self._winner = self.get_current_player()
                return

            # Flip the turn
            self._player_ones_turn = not self._player_ones_turn
        
    def get_next_move(self) -> int:
        """Repeatedly prompts the user for their next move until they give a
        numerical index, which it returns.
        
        Doesn't perform out of bounds validity checks on the supplied index.
        """
        while True:
            move = input(MOVE_PROMPT.format(self.get_current_player()))

            # Check validity and return the move if true
            if move.isnumeric():
                return int(move)
            
            print(INVALID_INPUT)

    def get_current_player(self) -> str:
        """Get the string corresponding to the player whose turn it is."""
        return PLAYER_ONE if self._player_ones_turn else PLAYER_TWO

    def check_win(self) -> bool:
        """Check if the current player has won the game."""
        # Get all player owned indices
        positions = [i for (i, value) in enumerate(self._board) 
                     if value == self.get_current_player()]

        for winning_trio in WINNING_TRIOS:
            # Check if the player is at all indicies in a winning trio
            if all(index in positions for index in winning_trio):
                return True
        return False 

    def has_drawn(self) -> bool:
        """Returns true iff neither player is able to make a move."""
        return EMPTY not in self._board

    def is_over(self) -> bool:
        """Returns true iff the game is over."""
        return self.has_drawn() or self._winner is not None

    def display_winner_info(self) -> None:
        """Prints winning or drawing info after the game has completed."""
        if self._winner is None:
            print(DRAW_MESSAGE)
        else:
            print(WIN_MESSAGE.format(self._winner))

            
def main():
    game = Game()
    while True:
        game.play()
        game.display_winner_info()
        
        # Ask user if they want to play again
        if input(REPLAY_PROMPT) != 'y':
            break

        game.reset()
            
if __name__ == "__main__":
    main()
