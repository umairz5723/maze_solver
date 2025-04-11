import random
from typing import Tuple, List

def generate_astar_maze(maze_type: str, start: Tuple, end: Tuple) -> List[List[str]]:
    sizes = {"small": (7, 7), "medium": (15, 15), "large": (25, 25)}
    
    if maze_type not in sizes:
        raise ValueError("Invalid maze type. Choose 'small', 'medium', or 'large'.")
    
    rows, cols = sizes[maze_type]

    # Initialize the maze with random weights between 0 and 9
    maze = [[str(random.randint(0, 9)) for _ in range(cols)] for _ in range(rows)]
    
    # Initialize the starting and ending points
    start_x, start_y = start
    end_x, end_y = end
    maze[start_x][start_y] = 'S'  # Start point
    maze[end_x][end_y] = 'E'      # End point

    return maze

