from typing import List
from collections import deque
from algorithms.helper_methods.find_start import find_starting_cell
from algorithms.helper_methods.clear_screen import clear_screen
from algorithms.helper_methods.generate_maze import generate_maze
import time  # Import time for sleep



def dfs(matrix: List[List[str]]):
    rows = len(matrix)
    cols = len(matrix[0])

    stack = deque()

    # Use the helper method to find the starting cell which is at the border
    starting_cell = find_starting_cell(matrix)

    # Error handling if no starting point is found
    if not starting_cell:
        return "Generated Matrix doesn't have a valid starting point"

    # Place the starting position into the stack
    r, c = starting_cell
    stack.append((r, c))
    matrix[r][c] = 'X'  # Mark the start cell as visited

    # Coordinates to check the 4 neighbor cells
    neighbors = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    maze_output = []  # This will store the maze state at each step

    # Begin DFS search
    while stack:
        r, c = stack.pop()

        # Found the exit/goal of the maze
        if matrix[r][c] == 'E':
            maze_output.append(f"We've made it to the end of the maze! At: ({r}, {c})")
            return maze_output

        # Mark the current cell as visited
        matrix[r][c] = 'X'

        # Store the current state of the maze as a string
        maze_state = ""
        for row in matrix:
            row_str = ''
            for cell in row:
                if cell == 'X':
                    row_str += 'X'  # Path
                elif cell == '1':
                    row_str += '1'  # Wall
                elif cell == 'S':
                    row_str += 'S'  # Start
                elif cell == 'E':
                    row_str += 'E'  # End
                else:
                    row_str += '.'  # Empty cell
            maze_state += row_str + "\n"

        maze_output.append(maze_state)
        
        # Explore neighbors (down, up, right, left)
        for row, col in neighbors:
            dr = r + row
            dc = c + col

            # Ensure the neighbor cell is within bounds and not a wall or already visited
            if 0 <= dr < rows and 0 <= dc < cols and matrix[dr][dc] != 'X' and matrix[dr][dc] != '1':
                stack.append((dr, dc))

    maze_output.append("There is no path to the end of this maze")
    return maze_output
