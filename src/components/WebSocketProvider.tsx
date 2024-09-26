import React, { createContext, useContext, useState, ReactNode } from "react";

type Candlestick = {
  t: number; 
  o: string; 
  h: string; 
  l: string; 
  c: string; 
  v: string; 
};

type WebSocketContextType = {
  data: { [symbol: string]: Candlestick[] };
  subscribe: (symbol: string, interval: string) => WebSocket;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [data, setData] = useState<{ [symbol: string]: Candlestick[] }>({});

  const subscribe = (symbol: string, interval: string): WebSocket => {
    const wsSymbol = symbol.toLowerCase(); 
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${wsSymbol}@kline_${interval}`);

    ws.onopen = () => {
      console.log(`WebSocket connected for: ${symbol} at interval: ${interval}`);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.k) {
        const { s: msgSymbol, k: candlestick } = message; 

        console.log(`Received candlestick data for ${msgSymbol}:`, candlestick);

        const newCandlestick: Candlestick = {
          t: candlestick.t,
          o: candlestick.o,
          h: candlestick.h,
          l: candlestick.l,
          c: candlestick.c,
          v: candlestick.v,
        };

        setData((prevData) => {
          const existingData = prevData[msgSymbol] || [];
          const updatedData = [...existingData, newCandlestick];

          const MAX_CANDLES = 500;
          if (updatedData.length > MAX_CANDLES) {
            updatedData.shift(); 
          }

          return {
            ...prevData,
            [msgSymbol]: updatedData,
          };
        });
      } else {
        console.log("Received unexpected message:", message);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log(`WebSocket closed for: ${symbol} at interval: ${interval}. Code: ${event.code}, Reason: ${event.reason}`);
    };

    return ws;
  };

  return (
    <WebSocketContext.Provider value={{ data, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useWebSocket must be used within WebSocketProvider");
  return context;
};
