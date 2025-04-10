from typing import List
from collections import deque

def find_starting_cell(matrix):
    rows = len(matrix)
    cols = len(matrix[0])

    # Find the starting point of the maze
    # Search the first and last column
    for r in range(rows):
        for c in range(cols):
            if matrix[r][c] == 'S':
                return (r,c)

    return None