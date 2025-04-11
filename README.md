# 🧭 Pathfinding Visualizer

This project is a visual demonstration of four fundamental pathfinding algorithms: **Breadth-First Search (BFS)**, **Depth-First Search (DFS)**, **Dijkstra’s Algorithm**, and **A\***. Each algorithm explores a maze and finds a path from the starting point to the goal using different strategies.

---

## 🔍 Algorithms Explained

- **Breadth-First Search (BFS):**  
  Explores all nodes at the current depth before moving to the next level. BFS guarantees the shortest path in an unweighted graph but may be slower on large grids.

- **Depth-First Search (DFS):**  
  Explores as far as possible along each branch before backtracking. DFS is generally faster than BFS but does not guarantee the shortest path.

- **Dijkstra’s Algorithm:**  
  Uses a priority queue to explore the shortest known distance from the starting node. It guarantees the shortest path in weighted graphs and is more efficient than BFS in many cases.

- **A\* Search (A-Star):**  
  Combines the advantages of Dijkstra’s Algorithm with a heuristic to guide the search, making it faster and more intelligent. It’s one of the most efficient and widely used pathfinding algorithms.

---

## 🕹️ How to Use the Webpage

### BFS / DFS / Dijkstra’s:
1. Select the algorithm from the dropdown menu.
2. Choose the maze size (Small, Medium, Large).
3. Press **"Begin/Regenerate"** to watch the algorithm in action.

### A\* (A-Star):
1. Select **A\*** from the dropdown.
2. Choose the maze size.
3. Enter a **starting(x,y)** and **ending(x,y)** coordinate in the input fields (e.g., `0,0` and `9,9`).
4. Press **"Begin/Regenerate"** to see the optimal path.

---

## ⚙️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/umairz5723/maze_solver.git
cd maze_solver
```

### 2. Install Frontend Dependencies
- Navigate to the ***frontend folder** and run:
```bash
npm install
```

### 3. Install Python Backend Dependencies
- In the root folder ***maze_solver*** run:
```bash
pip install -r requirements.txt
```

### 4. Run the Flask Backend
- In the root folder ***maze_solver*** run:
```bash
python server.py
```

### 5. Run the React-Vite Frontend
- Navigate to the src folder ***frontend/src*** and run:
```bash
npm run dev
```
The frontend will be available at http://localhost:5173/ unless otherwise configured.
--- 

✅ **Live Demo:** The project is currently being hosted at:  
[http://maze-solver.duckdns.org/](http://maze-solver.duckdns.org/)
