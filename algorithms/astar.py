import heapq
from typing import List, Dict, Tuple
from algorithms.helper_methods.find_start import find_starting_cell
from algorithms.helper_methods.reconstruct_optimal_path import reconstruct_optimal_path
from algorithms.helper_methods.generate_astar_maze import generate_astar_maze

def a_star(matrix: List[List[str]], start: Tuple, end: Tuple) -> Dict:
    rows, cols = len(matrix), len(matrix[0])
    
    # Find the starting position
    starting_cell = find_starting_cell(matrix)
    if not starting_cell:
        return {"message": "Generated Matrix doesn't have a valid starting point"}

    # Helper function for the Manhattan distance heuristic
    def heuristic(a: Tuple[int, int], b: Tuple[int, int]) -> int:
        return abs(a[0] - b[0]) + abs(a[1] - b[1])

    pq = []
    r, c = starting_cell
    heapq.heappush(pq, (0 + heuristic(start, end), 0, r, c))  # (f_cost, g_cost, row, col)
    distances = { (r, c): 0 }
    parents = { (r, c): None }  # Track the optimal path
    neighbors = [(1, 0), (-1, 0), (0, 1), (0, -1)]  # Right, Left, Down, Up
    maze_output = []
    visited = set()

    # Locate the end position
    end_cell = None
    for i in range(rows):
        for j in range(cols):
            if matrix[i][j] == 'E':
                end_cell = (i, j)

    while pq:
        _, cost, r, c = heapq.heappop(pq)  # Get the node with the lowest f_cost
        visited.add((r, c))  # Mark as visited

        # If we reach the exit, backtrack and mark the path
        if (r, c) == end_cell:
            path_cells = reconstruct_optimal_path(parents, (r, c), matrix)
            maze_output.append("\n".join("".join(row) for row in matrix))  # Append final state
            
            return {
                "maze_output": maze_output,
                "path_cells": path_cells,
                "start": starting_cell,
                "end": end_cell,
                "message": f"We've reached the end at {end_cell}!"
            }

        if matrix[r][c] not in {'S', 'E'}:
            matrix[r][c] = 'X'  # Mark the current cell as visited

        # Store the current state of the maze
        maze_output.append("\n".join("".join(row) for row in matrix))

        # Explore neighbors
        for dr, dc in neighbors:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited and matrix[nr][nc] not in {'X', 'S'}:
                new_cost = cost + (int(matrix[nr][nc]) if matrix[nr][nc].isdigit() else 1)
                f_cost = new_cost + heuristic((nr, nc), end)
                
                if (nr, nc) not in distances or new_cost < distances[(nr, nc)]:
                    distances[(nr, nc)] = new_cost
                    parents[(nr, nc)] = (r, c)  # Track the path
                    heapq.heappush(pq, (f_cost, new_cost, nr, nc))

    return {
        "maze_output": maze_output,
        "path_cells": [],
        "start": starting_cell,
        "end": end_cell,
        "message": "There is no path to the end of this maze"
    }

