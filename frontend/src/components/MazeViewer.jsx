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
  const [start, setStart] = useState('0,0'); // Default start position (0,0)
  const [end, setEnd] = useState('0,0'); // Default end position (0,0)
  const [pathMessage, setPathMessage] = useState('');
  const [searching, setSearching] = useState(false);
  const [inputError, setInputError] = useState('');
  const [searchComplete, setSearchComplete] = useState(false); // Track if search is complete

  // Define maze size dimensions
  const mazeSizes = {
    "Small": { rows: 7, cols: 7 },
    "Medium": { rows: 15, cols: 15 },
    "Large": { rows: 25, cols: 25 }
  };

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
      setSearchComplete(true); // Mark search as complete when animation finishes
    }
  }, [currentStep, mazeOutput, mazeSize]);

  // Validate coordinates against the current maze size
  const validateCoordinates = (coordStr) => {
    // Check for proper format (x,y)
    const coordPattern = /^\d+,\d+$/;
    if (!coordPattern.test(coordStr)) {
      return false;
    }

    const [x, y] = coordStr.split(',').map(Number);
    const currentSizeObj = mazeSizes[mazeSize];
    
    // Check if coordinates are within bounds
    return x >= 0 && x < currentSizeObj.cols && y >= 0 && y < currentSizeObj.rows;
  };

  // Handle algorithm change with proper state reset
  const handleAlgorithmChange = (e) => {
    const newAlgorithm = e.target.value;
    
    // Clear any maze output and reset search state
    setMazeOutput([]);
    setCurrentStep(0);
    setSearchComplete(false);
    setSearching(false);
    setInputError('');
    
    // Reset coordinates when switching between A* and other algorithms
    if (searchAlgorithm === 'A*' || newAlgorithm === 'A*') {
      setStart('0,0');
      setEnd('0,0');
    }
    
    setSearchAlgorithm(newAlgorithm);
  };

  const handleSearch = async () => {
    // If a search is already completed, reset state to allow a new search
    if (searchComplete && searchAlgorithm === 'A*') {
      setSearchComplete(false);
      setMazeOutput([]);
    }
    
    // Validate coordinates for A* algorithm
    if (searchAlgorithm === 'A*') {
      // Check if start and end are the same
      if (start === end) {
        setInputError('Start and end coordinates cannot be the same');
        return;
      }
      
      if (!validateCoordinates(start) || !validateCoordinates(end)) {
        setInputError(`Coordinates must be between (0,0) and (${mazeSizes[mazeSize].cols - 1},${mazeSizes[mazeSize].rows - 1})`);
        return;
      }
      setInputError(''); // Clear error if validation passes
    }

    // Reset current step and set loading state
    setCurrentStep(0);
    setLoading(true);
    setSearching(true);
    setSearchComplete(false);

    const sizeParam = mazeSize.toLowerCase();
    const algo = searchAlgorithm.toLowerCase();

    try {
      // Construct the API URL conditionally based on the algorithm selected
      let url = `${import.meta.env.VITE_API_URL}/${algo}?size=${sizeParam}`;
      console.log(url)

      if (searchAlgorithm === 'A*') {
        // For A*, add start and end coordinates to the URL
        url += `&start=${start}&end=${end}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setMazeOutput(data.maze_output || []);
      setOptimalPathCells(data.path_cells || []);
      
      // Only update start/end from data if not A*
      if (searchAlgorithm !== 'A*') {
        setStart(data.start || '0,0');
        setEnd(data.end || '0,0');
      }
      
      setPathMessage(data.message || '');
      setCurrentStep(0);
      setLoading(false);

      // If the Maze couldn't generate an existing path from S to E, regenerate it again
      if (data.path_cells && data.path_cells.length === 0) {
        setTimeout(() => {
          handleSearch();
          console.log("Unreachable exit in Maze detected");
        }, 10); // Delay before re-trying
      }
    } catch (error) {
      console.error("Error fetching maze data:", error);
      setLoading(false);
      setSearching(false);
      setSearchComplete(false);
    }
  };

  // Handle coordinate input change with validation
  const handleCoordinateChange = (e, setter) => {
    const value = e.target.value;
    setter(value);
    
    // Clear error message when user is typing
    if (inputError) {
      setInputError('');
    }
    
    // Reset search complete flag when user changes coordinates
    setSearchComplete(false);
  };

  // Handle size change with coordinate validation for current algorithm
  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setMazeSize(newSize);
    setSearchComplete(false);
    
    // If using A*, validate that current coordinates are still valid with new size
    if (searchAlgorithm === 'A*') {
      const newSizeObj = mazeSizes[newSize];
      
      // Reset coordinates if they would be out of bounds in the new size
      if (!validateCoordinates(start) || !validateCoordinates(end)) {
        setStart('0,0');
        setEnd('0,0');
      }
    }
    
    // Clear any existing output
    setMazeOutput([]);
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

  // Set the algorithm using the selected drop-down menu item
  const getAlgorithmName = () => {
    const algoNames = { BFS: 'Breadth-First Search', DFS: 'Depth-First Search', DIJKSTRA: 'Dijkstra Search', 'A*': 'A*' };
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
            <select 
              id="search-select" 
              value={searchAlgorithm} 
              onChange={handleAlgorithmChange}
            >
              <option value="BFS">BFS</option>
              <option value="DFS">DFS</option>
              <option value="DIJKSTRA">DIJKSTRA</option>
              <option value="A*">A*</option>
            </select>
          </div>
          <div className="control-group">
            <label htmlFor="size-select">Maze Size:</label>
            <select 
              id="size-select" 
              value={mazeSize} 
              onChange={handleSizeChange}
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          {searchAlgorithm === 'A*' && (
            <>
              <div className="control-group coordinate-input">
                <label htmlFor="start-input">Start (x,y):</label>
                <input
                  type="text"
                  id="start-input"
                  value={start}
                  onChange={(e) => handleCoordinateChange(e, setStart)}
                  placeholder="0,0"
                  maxLength={5}
                  className="coordinate-field"
                />
              </div>
              <div className="control-group coordinate-input">
                <label htmlFor="end-input">End (x,y):</label>
                <input
                  type="text"
                  id="end-input"
                  value={end}
                  onChange={(e) => handleCoordinateChange(e, setEnd)}
                  placeholder="0,0"
                  maxLength={5}
                  className="coordinate-field"
                />
              </div>
              <div className="coordinates-help">
                <small>Max: ({mazeSizes[mazeSize].cols - 1},{mazeSizes[mazeSize].rows - 1})</small>
              </div>
            </>
          )}

          <div className="button-container">
            <button onClick={handleSearch}>Begin/Regenerate</button>
          </div>
        </div>
        
        {/* Error message using CSS class instead of inline styling */}
        {inputError && (
          <div className="input-error-container">
            {inputError}
          </div>
        )}
      </div>
      <MazeLegend />
    </div>
  );
};

export default MazeViewer;