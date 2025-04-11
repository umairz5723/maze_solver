from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
from algorithms.bfs import bfs
from algorithms.dfs import dfs
from algorithms.dijkstra import dijkstra
from algorithms.astar import a_star
from algorithms.helper_methods.generate_maze import generate_maze
from algorithms.helper_methods.generate_dijkstra import generate_dijkstra_maze
from algorithms.helper_methods.generate_astar_maze import generate_astar_maze

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def process_search(algorithm, maze_generator):
    """Helper function to process BFS, DFS, or Dijkstra"""
    # Get maze size from query parameters (default: 'small')
    maze_size = request.args.get('size', 'small').lower()

    # Validate maze size
    if maze_size not in ['small', 'medium', 'large']:
        return jsonify({"error": "Invalid maze size. Please choose 'small', 'medium', or 'large'."}), 400

    # Generate the maze
    maze = maze_generator(maze_size)

    # Run the chosen algorithm (BFS, DFS, or Dijkstra)
    result = algorithm(maze)

    # Return structured JSON response
    return jsonify(result)

@app.route('/api/bfs', methods=['GET'])
def get_bfs():
    return process_search(bfs, generate_maze)

@app.route('/api/dfs', methods=['GET'])
def get_dfs():
    return process_search(dfs, generate_maze)

@app.route('/api/dijkstra', methods=['GET'])
def get_dijkstra():
    return process_search(dijkstra, generate_dijkstra_maze)


@app.route('/api/a*', methods=['GET'])
def get_astar():
    # Get start and end from query parameters, defaulting to (0, 0) and (rows-1, cols-1) if not provided
    start = request.args.get('start', '0,0')
    end = request.args.get('end', '0,0')
    
    # Convert start and end to tuples
    start = tuple(map(int, start.split(',')))
    end = tuple(map(int, end.split(',')))
    
    # Get maze size from query parameters (default: 'small')
    maze_size = request.args.get('size', 'small').lower()

    # Validate maze size
    if maze_size not in ['small', 'medium', 'large']:
        return jsonify({"error": "Invalid maze size. Please choose 'small', 'medium', or 'large'."}), 400

    # Generate the maze
    maze = generate_astar_maze(maze_size, start, end)

    # Run the A* algorithm
    result = a_star(maze, start, end)

    # Return structured JSON response
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
