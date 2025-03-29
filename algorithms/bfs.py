from typing import List
from collections import deque
from helper_methods.initalize_maze_from_file import load_maze_from_file
from helper_methods.find_start import find_starting_cell
from helper_methods.clear_screen import clear_screen
from helper_methods.generate_maze import generate_maze
from colorama import Fore, Style, init
import os  # Import os to clear the console
import time  # Import time for sleep

# Initialize colorama
init(autoreset=True)



def bfs(matrix: List[List[str]], delay: float = 0.5):
    rows = len(matrix)
    cols = len(matrix[0])

    queue = deque()

    # Use the helper method to find the starting cell which is at the border
    starting_cell = find_starting_cell(matrix)

    # Error handling if no starting point is found
    if not starting_cell:
        print("Generated Matrix doesn't have a valid starting point")
        return False
    
    # Place the starting position into the queue
    r, c = starting_cell
    queue.append((r, c))
    matrix[r][c] = 'X'  # Mark the start cell as visited
    
    # Coordinates to check the 4 neighbor cells
    neighbors = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    print("Beginning BFS search at ", queue[0])

    # Begin BFS Search
    while queue:
        r, c = queue.popleft()

        # Found the exit/goal of the maze
        if matrix[r][c] == 'E':
            print("We've made it to the end of the maze! At: ", '(', r, ',', c, ')')
            return True

        # Mark the current cell as visited
        matrix[r][c] = 'X'

        # Clear the screen before printing the maze
        clear_screen()
        print("\nExploring", "(", r, ",", c, ")")
        # Optionally print the current state of the maze with colored X's
        for row in matrix:
            colored_row = ''
            for cell in row:
                if cell == 'X':
                    colored_row += Fore.GREEN + cell + Style.RESET_ALL  # Green for path
                elif cell == '1':
                    colored_row += Fore.RED + cell + Style.RESET_ALL  # Red for walls
                elif cell == 'S':
                    colored_row += Fore.BLUE + cell + Style.RESET_ALL  # Blue for start
                elif cell == 'E':
                    colored_row += Fore.YELLOW + cell + Style.RESET_ALL  # Yellow for end
                else:
                    colored_row += cell  # Default for empty cells
            print(colored_row)

        # Add delay after printing the maze
        time.sleep(delay)  # Delay in seconds (default 0.5 seconds)

        # Explore neighbors (down, up, right, left)
        for row, col in neighbors:
            dr = r + row
            dc = c + col

            # Ensure the neighbor cell is within bounds and not a wall or already visited
            if 0 <= dr < rows and 0 <= dc < cols and matrix[dr][dc] != 'X' and matrix[dr][dc] != '1':
                queue.append((dr, dc))

    print("There is no path to the end of this maze")
    return False

'''
# Testing using static files
small_maze_file = '../mazes/small_maze.txt'
small_maze = load_maze_from_file(small_maze_file)

'''

small_generated = generate_maze("small")

# medium_generated = generate_maze("medium")
large_generated = generate_maze("large")

# bfs(small_generated, delay=1)  # You can set the delay time here (in seconds)
bfs(large_generated, delay=0.6)