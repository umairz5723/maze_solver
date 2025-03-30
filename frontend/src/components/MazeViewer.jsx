import React, { useState, useEffect } from 'react';
import './MazeViewer.css';

const MazeViewer = () => {
  const [searchAlgorithm, setSearchAlgorithm] = useState('BFS');
  const [mazeSize, setMazeSize] = useState('Small');
  const [mazeOutput, setMazeOutput] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Track current step
  const [pathMessage, setPathMessage] = useState('');
  const [searching, setSearching] = useState(false); // Track if search is in progress

  useEffect(() => {
    if (mazeOutput.length > 0 && currentStep < mazeOutput.length - 2) {  // Stop at the last state of the board
      setSearching(true); // Set searching to true once search begins
      
      let stepDelay = 200; // Default for Small

      // Adjust delay based on maze size
      if (mazeSize === 'Medium') {
        stepDelay = 100; // Faster for Medium
      } else if (mazeSize === 'Large') {
        stepDelay = 50; // Even faster for Large
      }

      const timeout = setTimeout(() => {
        setCurrentStep((prevStep) => prevStep + 1); // Increment the current step
      }, stepDelay); // Use dynamic delay

      return () => clearTimeout(timeout);
    } else if (mazeOutput.length > 0 && currentStep >= mazeOutput.length - 2) {
      // Search completed
      setSearching(false);
    }
    console.log(currentStep);
  }, [currentStep, mazeOutput, mazeSize]); // Include mazeSize in dependencies

  const handleBegin = async () => {
    console.log("Starting search");
    setLoading(true);
    setSearching(true); // Set searching to true when starting
    
    // Convert the mazeSize to lowercase to match the backend parameter
    const sizeParam = mazeSize.toLowerCase();
    const algo = searchAlgorithm.toLowerCase(); // Use selected algorithm
    
    try {
      const response = await fetch(`http://localhost:5000/${algo}?size=${sizeParam}`);
      const data = await response.json();
      const pathData = data[data.length - 1];
      console.log("Path Data", pathData);
      setPathMessage(pathData);
      setMazeOutput(data); // Store all maze states
      setCurrentStep(0); // Start from the first step
      setLoading(false);

    } catch (error) {
      console.error("Error fetching maze data:", error);
      setLoading(false);
      setSearching(false); // Reset searching state on error
    }
  };

  const renderMazeOutput = () => {
    if (mazeOutput.length > 0) {
      return (
        <pre className="maze-text">
          {mazeOutput[currentStep].split("\n").map((line, rowIndex) => (
            <div key={rowIndex} className="maze-line">
              {line.split("").map((char, colIndex) => {
                let color = "black"; // Default for empty spaces
                if (char === "S") color = "green"; // Start
                else if (char === "E") color = "red"; // End
                else if (char === "X") color = "blue"; // Explored path
                else if (char === "1") color = "darkgray"; // Wall
  
                return (
                  <span
                    key={colIndex}
                    className={`maze-char maze-char-${color}`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          ))}
        </pre>
      );
    }
    return null;
  };

  // Function to get algorithm name in a more readable format
  const getAlgorithmName = () => {
    if (searchAlgorithm === 'BFS') return 'Breadth-First Search';
    if (searchAlgorithm === 'DFS') return 'Depth-First Search';
    return searchAlgorithm; // Default fallback
  };

  return (
    <div className="maze-container">
      <h1>Maze Solver</h1>
      
      {/* Status heading - show when loading or searching */}
      {(loading || searching || mazeOutput.length > 0) && (
        <h3 className="algorithm-status">
          {loading ? 'Generating Maze...' : 
           searching ? `Searching using ${getAlgorithmName()}` : 
           `Path found using ${getAlgorithmName()}`}
        </h3>
      )}
      
      <div className="maze-grid">
        {loading ? <p>Generating Maze...</p> : renderMazeOutput()}
      </div>
      
      {/* Only show pathMessage after the maze has finished rendering */}
      {currentStep === mazeOutput.length - 2 && pathMessage && (
        <div className="path-message">
          <p>{pathMessage}</p>
        </div>
      )}
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="search-select">Search Algorithm:</label>
          <select
            id="search-select"
            value={searchAlgorithm}
            onChange={(e) => setSearchAlgorithm(e.target.value)}
          >
            <option value="BFS">BFS</option>
            <option value="DFS">DFS</option>
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="size-select">Maze Size:</label>
          <select
            id="size-select"
            value={mazeSize}
            onChange={(e) => setMazeSize(e.target.value)}
          >
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
  );
};

export default MazeViewer;