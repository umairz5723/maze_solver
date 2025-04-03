import React, { useState, useEffect } from 'react';
import './MazeViewer.css';
import MazeLegend from './MazeLegend'; // Import the legend component

const MazeViewer = () => {
  const [searchAlgorithm, setSearchAlgorithm] = useState('BFS');
  const [mazeSize, setMazeSize] = useState('Small');
  const [mazeOutput, setMazeOutput] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pathCells, setPathCells] = useState([]); // Store optimal path cells
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

  const handleBegin = async () => {
    setLoading(true);
    setSearching(true);

    const sizeParam = mazeSize.toLowerCase();
    const algo = searchAlgorithm.toLowerCase();

    try {
      const response = await fetch(`http://localhost:5000/${algo}?size=${sizeParam}`);
      const data = await response.json();
      
      setMazeOutput(data.maze_output || []);
      setPathCells(data.path_cells || []);
      setStart(data.start || null);
      setEnd(data.end || null);
      setPathMessage(data.message || '');
      setCurrentStep(0);
      setLoading(false);

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
              else if (char === "#") color = "darkgray";
              else if (char === "X") color = "blue"; // Explored path
              else if (char === "*") color = "green";
              

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
            <button onClick={handleBegin}>Begin/Regenerate</button>
          </div>
        </div>
      </div>
      <MazeLegend />
    </div>
  );
};

export default MazeViewer;