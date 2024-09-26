import React from "react";
import './ToggleDropdown.css'; 

interface ToggleDropdownProps {
  selectedSymbol: string;
  onSymbolChange: (symbol: string) => void;
  selectedInterval: string;
  onIntervalChange: (interval: string) => void;
}

const ToggleDropdown: React.FC<ToggleDropdownProps> = ({
  selectedSymbol,
  onSymbolChange,
  selectedInterval,
  onIntervalChange,
}) => {
  return (
    <div className="toggle-dropdown-container">
      <div className="dropdown">
        <label htmlFor="symbol-select">Select Coin:</label>
        <select
          id="symbol-select"
          value={selectedSymbol}
          onChange={(e) => onSymbolChange(e.target.value.toUpperCase())} 
        >
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="BNBUSDT">BNB/USDT</option>
          <option value="DOTUSDT">DOT/USDT</option>
        </select>
      </div>
      <div className="dropdown">
        <label htmlFor="interval-select">Select Interval:</label>
        <select
          id="interval-select"
          value={selectedInterval}
          onChange={(e) => onIntervalChange(e.target.value)}
        >
          <option value="1m">1 Minute</option>
          <option value="3m">3 Minutes</option>
          <option value="5m">5 Minutes</option>
        </select>
      </div>
    </div>
  );
};

export default ToggleDropdown;
