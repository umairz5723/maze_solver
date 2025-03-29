from typing import List

def load_maze_from_file(file_path: str) -> List[List[str]]:
    """
    Loads a maze from a text file and returns it as a 2D list of strings.
    """
    with open(file_path, 'r') as f:
        print("Loading", file_path)
        return [line.strip().split() for line in f.readlines()]
