import React from 'react';
import './MazeLegend.css';

const MazeLegend = () => {
  const legendItems = [
    { symbol: '#', description: 'Obstruction', color: 'darkgray' },
    { symbol: 'X', description: 'Visited Path', color: 'blue' },
    { symbol: '*', description: 'Optimal Path', color: 'green' },
    { symbol: 'S', description: 'Starting Point', color: 'green' },
    { symbol: 'E', description: 'End of Maze', color: 'red' }
  ];

  return (
    <div className="maze-legend">
      <h3>Legend</h3>
      <div className="legend-items">
        {legendItems.map((item, index) => (
          <div key={index} className="legend-item">
            <span className={`legend-symbol legend-symbol-${item.color}`}>
              {item.symbol}
            </span>
            <span className="legend-description">{item.description}</span>
          </div>
        ))}
      </div>
      <h5>• Numbers represent the cost to go to a given cell</h5>
    </div>
  );
};

export default MazeLegend;