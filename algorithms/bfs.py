from typing import List, Dict
from collections import deque
from algorithms.helper_methods.find_start import find_starting_cell
from algorithms.helper_methods.reconstruct_optimal_path import reconstruct_optimal_path

def bfs(matrix: List[List[str]]) -> Dict:
    rows = len(matrix)
    cols = len(matrix[0])

    queue = deque()
    parents = {}

    # Find the starting position
    starting_cell = find_starting_cell(matrix)
    if not starting_cell:
        return {"message": "Generated Matrix doesn't have a valid starting point"}

    r, c = starting_cell
    queue.append((r, c))
    matrix[r][c] = 'S'  # Mark start

    # Locate the end position
    end_cell = None
    for i in range(rows):
        for j in range(cols):
            if matrix[i][j] == 'E':
                end_cell = (i, j)

    # Movement directions: Down, Up, Right, Left
    neighbors = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    maze_output = []
    visited = set()

    while queue:
        r, c = queue.popleft()
        visited.add((r, c))  # Mark cell as visited

        if (r, c) == end_cell:
            path_cells = reconstruct_optimal_path(parents, (r, c), matrix)  # Backtrack the optimal path
            maze_output.append("\n".join("".join(row) for row in matrix))  # Append final state

            return {
                "maze_output": maze_output,
                "path_cells": path_cells,
                "start": starting_cell,
                "end": end_cell,
                "message": f"We've reached the end at {end_cell}!"
            }

        if matrix[r][c] not in {'S', 'E'}:
            matrix[r][c] = 'X'  # Mark explored cell

        # Store the maze state
        maze_output.append("\n".join("".join(row) for row in matrix))

        for dr, dc in neighbors:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols 
                and (nr, nc) not in visited 
                and matrix[nr][nc] not in {'X', 'S', '#'}):
                queue.append((nr, nc))
                parents[(nr, nc)] = (r, c)  # Store parent for backtracking

    return {
        "maze_output": maze_output,
        "path_cells": [],
        "start": starting_cell,
        "end": end_cell,
        "message": "There is no path to the end of this maze"
    }
