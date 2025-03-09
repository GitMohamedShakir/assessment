"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

export interface IWebSocketProps {
  socketData: any;
  sendMessage: (message: any) => void;
}

const withWebSocket = (WrappedComponent: any) => {
  return function WebSocketComponent(props: any) {
    const [data, setData] = useState(null);
    const ws = useRef<WebSocket | null>(null);
    const reconnectInterval = useRef<NodeJS.Timeout | null>(null);

    const onOpenHandler = useCallback(() => {
      console.log("WebSocket connected");
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
        reconnectInterval.current = null;
      }
    }, []);

    const onMessageHandler = useCallback((event: MessageEvent) => {
      try {
        setData(JSON.parse(event.data));
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
      }
    }, []);

    const onErrorHandler = useCallback((error: Event) => {
      console.error("WebSocket Error:", error);
    }, []);

    const onCloseHandler = useCallback(() => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      if (!reconnectInterval.current) {
        reconnectInterval.current = setInterval(() => {
          console.log("Reconnecting WebSocket...");
            connectWebSocket();
        }, 3000);
      }
    }, []);

    const connectWebSocket = useCallback(() => {
      const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL as string;

      ws.current = new WebSocket(url);

      ws.current.onopen = onOpenHandler;

      ws.current.onmessage = onMessageHandler;

      ws.current.onerror = onErrorHandler;

      ws.current.onclose = onCloseHandler;
    }, [onOpenHandler, onMessageHandler, onErrorHandler, onCloseHandler]);

    useEffect(() => {
      connectWebSocket();
      return () => {
        if (ws.current) {
          ws.current.close();
        }
        if (reconnectInterval.current) {
          clearInterval(reconnectInterval.current);
        }
      };
    }, [connectWebSocket]);

    const sendMessage = (message: any) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message));
      } else {
        console.warn("WebSocket not connected. Message not sent.");
      }
    };

    return (
      <WrappedComponent
        {...props}
        socketData={data}
        sendMessage={sendMessage}
      />
    );
  };
};

export default withWebSocket;
