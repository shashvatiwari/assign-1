// App.tsx
import React, { useState } from "react";
import { WebSocketProvider } from "./components/WebSocketProvider";
import ToggleDropdown from "./components/ToggleDropdown";
import ChartComponent from "./components/ChartComponent";
import './App.css'; // Your global styles

const App: React.FC = () => {
  const [symbol, setSymbol] = useState<string>("ETHUSDT"); // Default symbol in uppercase
  const [interval, setInterval] = useState<string>("1m"); // Default interval

  return (
    <WebSocketProvider>
      <div className="app-container">
        <h1>Binance Market Data</h1>
        <ToggleDropdown 
          selectedSymbol={symbol} 
          onSymbolChange={setSymbol} 
          selectedInterval={interval} 
          onIntervalChange={setInterval} 
        />
        <ChartComponent symbol={symbol} interval={interval} />
      </div>
    </WebSocketProvider>
  );
};

export default App;
