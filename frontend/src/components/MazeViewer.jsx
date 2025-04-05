import React, { useState, useEffect } from 'react';
import './MazeViewer.css';
import MazeLegend from './MazeLegend'; // Import the legend component

const MazeViewer = () => {
  const [searchAlgorithm, setSearchAlgorithm] = useState('BFS');
  const [mazeSize, setMazeSize] = useState('Small');
  const [mazeOutput, setMazeOutput] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [optimalPathCells, setOptimalPathCells] = useState([]); // Store optimal path cells
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [pathMessage, setPathMessage] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (mazeOutput.length > 0 && currentStep < mazeOutput.length - 1) { 
      setSearching(true);

      let stepDelay = mazeSize === 'Small' ? 200 : mazeSize === 'Medium' ? 100 : 50;
      
      const timeout = setTimeout(() => {
        setCurrentStep((prevStep) => prevStep + 1);
      }, stepDelay);

      return () => clearTimeout(timeout);
    } else if (mazeOutput.length > 0 && currentStep === mazeOutput.length - 1) {
      setSearching(false);
    }
  }, [currentStep, mazeOutput, mazeSize]);

  const handleSearch = async () => {
    setLoading(true);
    setSearching(true);

    const sizeParam = mazeSize.toLowerCase();
    const algo = searchAlgorithm.toLowerCase();

    try {
      // Construct the API using the algorithm and size
      const response = await fetch(`http://3.86.243.196:5000/${algo}?size=${sizeParam}`);
      const data = await response.json();
      
      setMazeOutput(data.maze_output || []);
      setOptimalPathCells(data.path_cells || []);
      setStart(data.start || null);
      setEnd(data.end || null);
      setPathMessage(data.message || '');
      setCurrentStep(0);
      setLoading(false);

      // If the Maze couldn't generate an existing path from S to E, regenerate it again
      if (data.path_cells && data.path_cells.length === 0) {
        // Trigger the button click again if no path was found
        setTimeout(() => {
          handleSearch();
          console.log("Unreachable exit in Maze detected")
        }, 10); // Delay before re-trying
      }

    } catch (error) {
      console.error("Error fetching maze data:", error);
      setLoading(false);
      setSearching(false);
    }
  };

  const renderMazeOutput = () => {
    if (mazeOutput.length === 0) return null;

    return (
      <pre className="maze-text">
        {mazeOutput[currentStep].split("\n").map((line, rowIndex) => (
          <div key={rowIndex} className="maze-line">
            {line.split("").map((char, colIndex) => {
              let color = "black"; // Default empty space
              if (char === "S") color = "green"; // Start
              else if (char === "E") color = "red"; // End
              else if (char === "#") color = "darkgray"; // Obstruction
              else if (char === "X") color = "blue"; // Explored path
              else if (char === "*") color = "green"; // Optimal Path
              

              return (
                <span key={colIndex} className={`maze-char maze-char-${color}`}>
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </pre>
    );
  };

  // Set the algorithmn using the selected drop-down menu item
  const getAlgorithmName = () => {
    const algoNames = { BFS: 'Breadth-First Search', DFS: 'Depth-First Search', DIJKSTRA: 'Dijkstra Search' };
    return algoNames[searchAlgorithm] || searchAlgorithm;
  };

  return (
    <div className="maze-viewer-wrapper">
      <div className="maze-container">
        <h1>Maze Solver</h1>

        {(loading || searching || mazeOutput.length > 0) && (
          <h3 className="algorithm-status">
            {loading ? 'Generating Maze...' : searching ? `Searching using ${getAlgorithmName()}` : `Path found using ${getAlgorithmName()}`}
          </h3>
        )}

        <div className="maze-grid">
          {loading ? <p>Generating Maze...</p> : renderMazeOutput()}
        </div>

        {currentStep === mazeOutput.length - 1 && pathMessage && (
          <div className="path-message">
            <p>{pathMessage}</p>
          </div>
        )}

        <div className="controls">
          <div className="control-group">
            <label htmlFor="search-select">Search Algorithm:</label>
            <select id="search-select" value={searchAlgorithm} onChange={(e) => setSearchAlgorithm(e.target.value)}>
              <option value="BFS">BFS</option>
              <option value="DFS">DFS</option>
              <option value="DIJKSTRA">DIJKSTRA</option>
            </select>
          </div>
          <div className="control-group">
            <label htmlFor="size-select">Maze Size:</label>
            <select id="size-select" value={mazeSize} onChange={(e) => setMazeSize(e.target.value)}>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
          <div className="button-container"> 
            <button onClick={handleSearch}>Begin/Regenerate</button>
          </div>
        </div>
      </div>
      <MazeLegend />
    </div>
  );
};

export default MazeViewer;
