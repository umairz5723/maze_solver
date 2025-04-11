import random
from typing import List, Tuple

def generate_dijkstra_maze(maze_type: str) -> List[List[str]]:
    sizes = {"small": (7, 7), "medium": (15, 15), "large": (25, 25)}
    
    if maze_type not in sizes:
        raise ValueError("Invalid maze type. Choose 'small', 'medium', or 'large'.")
    
    rows, cols = sizes[maze_type]

    # Initialize the maze full of walls ('1')
    maze = [['#' for _ in range(cols)] for _ in range(rows)]
    
    # Choose random odd column positions for start and exit
    start_col = random.choice(range(1, cols - 1, 2))
    end_col = random.choice(range(1, cols - 1, 2))

    maze[0][start_col] = 'S'  # Start at the top row
    maze[rows - 1][end_col] = 'E'  # Exit at the bottom row

    def carve_path(stack: List[Tuple[int, int]]):
        """Carve a guaranteed path using DFS-like approach."""
        while stack:
            r, c = stack.pop()
            directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
            random.shuffle(directions)

            for dr, dc in directions:
                nr, nc = r + dr * 2, c + dc * 2
                if 0 < nr < rows - 1 and 0 < nc < cols - 1 and maze[nr][nc] == '#':
                    weight = str(random.randint(1, 5))  # Random weights (1-5)
                    maze[r + dr][c + dc] = weight
                    maze[nr][nc] = weight
                    stack.append((nr, nc))

    # Ensure a direct path from S to E first
    path_r = 1
    path_c = start_col
    maze[path_r][path_c] = '0'
    while path_r < rows - 2:  # Move towards the exit
        direction = random.choice([(1, 0), (0, 1), (0, -1)])  # Down, Right, Left
        next_r, next_c = path_r + direction[0], path_c + direction[1]
        if 0 < next_r < rows - 1 and 0 < next_c < cols - 1:
            maze[next_r][next_c] = '0'
            path_r, path_c = next_r, next_c

    # Start carving additional paths from a guaranteed path
    carve_path([(1, start_col)])

    return maze
