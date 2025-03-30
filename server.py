from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
from algorithms.bfs import bfs
from algorithms.dfs import dfs
from algorithms.helper_methods.generate_maze import generate_maze

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/bfs', methods=['GET'])
def get_bfs():
    # Get maze size from query parameter, default to 'small' if not provided
    maze_size = request.args.get('size', 'small').lower()
    
    # Validate maze size to ensure it's one of the accepted values
    if maze_size not in ['small', 'medium', 'large']:
        return jsonify({"error": "Invalid maze size. Please choose 'small', 'medium', or 'large'."}), 400
    
    # Generate the maze based on the selected size
    maze = generate_maze(maze_size)
    
    # Run BFS to solve the maze
    maze_output = bfs(maze)
    
    # Return the maze output as JSON
    return jsonify(maze_output)  # Ensure response is JSON

@app.route('/dfs', methods=['GET'])
def get_dfs():
    # Get maze size from query parameter, default to 'small' if not provided
    maze_size = request.args.get('size', 'small').lower()
    print("Searching using DFS")
    # Validate maze size to ensure it's one of the accepted values
    if maze_size not in ['small', 'medium', 'large']:
        return jsonify({"error": "Invalid maze size. Please choose 'small', 'medium', or 'large'."}), 400
    
    # Generate the maze based on the selected size
    maze = generate_maze(maze_size)
    
    # Run BFS to solve the maze
    maze_output = dfs(maze)
    
    # Return the maze output as JSON
    return jsonify(maze_output)  # Ensure response is JSON


if __name__ == '__main__':
    app.run(debug=True)
