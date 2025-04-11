
def reconstruct_optimal_path(parents, end_pos, matrix):
    """Backtrack from the end position to reconstruct and mark the path"""
    path_cells = []
    current = end_pos
    while current:
        r, c = current
        if matrix[r][c] not in {'S', 'E'}:
            matrix[r][c] = '*'  # Mark optimal path
        path_cells.append(current)  # Store path cell
        current = parents.get(current)  # Move to the parent node
    path_cells.reverse()  # Reverse to show start → end order
    return path_cells