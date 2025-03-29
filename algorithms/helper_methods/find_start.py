from typing import List
from collections import deque

def find_starting_cell(matrix):
    rows = len(matrix)
    cols = len(matrix[0])

    # Find the starting point of the maze
    # Search the first and last column
    for r in range(rows):
        if matrix[r][0] == 'S':
            return (r,0)
        if matrix[r][cols-1] == 'S':
            return (r,cols-1)

    for c in range(cols):
        if matrix[0][c] == 'S':  # First row
            return (0,c)
        if matrix[rows - 1][c] == 'S':  # Last row
            return (rows-1,c)
    
    return None