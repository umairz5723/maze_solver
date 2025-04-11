import random
from typing import List

def generate_maze(maze_type: str) -> List[List[str]]:
    sizes = {"small": (7, 7), "medium": (15, 15), "large": (25, 25)}
    
    if maze_type not in sizes:
        raise ValueError("Invalid maze type. Choose 'small', 'medium', or 'large'.")
    
    rows, cols = sizes[maze_type]

    # Initialize the maze full of walls ('#')
    maze = [['#' for _ in range(cols)] for _ in range(rows)]
    
    # Randomize 'S' and 'E' positions within the first and last rows
    start_col = random.randint(0, cols - 1)
    end_col = random.randint(0, cols - 1)
    
    maze[0][start_col] = 'S'  # Start somewhere in the first row
    maze[rows - 1][end_col] = 'E'  # End somewhere in the last row

    def carve_path(r, c):
        """Iteratively carves a solvable maze using DFS with a stack."""
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # Right, Down, Left, Up
        stack = [(r, c)]  # Start the carving at the given position

        while stack:
            current_r, current_c = stack[-1]
            random.shuffle(directions)

            # Try all 4 directions
            moved = False
            for dr, dc in directions:
                nr, nc = current_r + dr * 2, current_c + dc * 2
                if 0 < nr < rows - 1 and 0 < nc < cols - 1 and maze[nr][nc] == '#':
                    maze[current_r + dr][current_c + dc] = '0'
                    maze[nr][nc] = '0'
                    stack.append((nr, nc))
                    moved = True
                    break  # Break after carving one path to continue in the maze

            # If no direction was valid, backtrack
            if not moved:
                stack.pop()

    # Start DFS from a random position near the start row
    start_r = 1 if rows > 2 else 0
    start_c = start_col if start_col % 2 == 1 else max(1, start_col)
    maze[start_r][start_c] = '0'
    carve_path(start_r, start_c)

    # Ensure at least one path from S to E
    if start_col > 0:
        maze[0][start_col - 1] = '0'
    if start_col < cols - 1:
        maze[0][start_col + 1] = '0'
    
    if end_col > 0:
        maze[rows - 1][end_col - 1] = '0'
    if end_col < cols - 1:
        maze[rows - 1][end_col + 1] = '0'
    
    return maze