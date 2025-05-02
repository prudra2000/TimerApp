"use client";

import { useEffect, useCallback, useState } from "react";
import { useTimer } from "@/context/TimerContext";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Clock,
  HelpCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface TimerControlsProps {
  fullscreen?: boolean;
}

export default function TimerControls({
  fullscreen = false,
}: TimerControlsProps) {
  const {
    time,
    setTime,
    isRunning,
    setIsRunning,
    textColor,
    titleColor,
    timeFormat,
    textSize,
    timerMode,
    countdownTime,
    setCountdownTime,
    title,
    customFont,
    completionMessage,
  } = useTimer();
  const [isCountdownSet, setIsCountdownSet] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    switch (timeFormat) {
      case "HH:MM:SS":
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      case "MM:SS":
        const totalMinutes = Math.floor(seconds / 60);
        return `${totalMinutes.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`;
      case "SS":
        return seconds.toString().padStart(2, "0");
      default:
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        if (timerMode === "countdown") {
          if (time > 0) {
            setTime((prevTime: number) => prevTime - 1);
          } else {
            setIsRunning(false);
          }
        } else {
          setTime((prevTime: number) => prevTime + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, setTime, time, timerMode]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          setIsRunning(!isRunning);
          break;
        case "r":
          if (timerMode === "countdown") {
            setTime(countdownTime);
          } else {
            setTime(0);
          }
          setIsRunning(false);
          break;
        case "]":
          if (timerMode === "countdown" && !isRunning) {
            setCountdownTime((prev) => prev + 60);
          } else {
            setTime((prev: number) => prev + 60);
          }
          break;
        case "[":
          if (timerMode === "countdown" && !isRunning) {
            setCountdownTime((prev) => Math.max(0, prev - 60));
          } else {
            setTime((prev: number) => Math.max(0, prev - 60));
          }
          break;
        case "h":
          setShowHelp((prev) => !prev);
          break;
        case "Escape":
          if (fullscreen) {
            document.exitFullscreen();
          }
          break;
      }
    },
    [fullscreen, isRunning, setIsRunning, setTime, timerMode, countdownTime]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handleCountdownStart = () => {
    setTime(countdownTime);
    setIsCountdownSet(true);
    setIsRunning(true);
  };

  const handleReset = () => {
    if (timerMode === "countdown") {
      setTime(countdownTime);
    } else {
      setTime(0);
    }
    setIsRunning(false);
  };

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <style>
          {customFont &&
            `
            @font-face {
              font-family: 'CustomFont';
              src: url(${customFont}) format('woff2');
            }
          `}
        </style>
        <div className="flex flex-col items-center justify-center">
          {isMounted && title && (
            <h1
              className="text-5xl font-bold mb-6 text-center"
              style={{
                color: titleColor,
                fontFamily: customFont ? "CustomFont, sans-serif" : undefined,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {title}
            </h1>
          )}
          {isMounted && (
            <div
              className="font-mono relative"
              style={{
                color: textColor,
                fontSize: `${textSize}px`,
                fontWeight: "bold",
                fontFamily: customFont ? "CustomFont, monospace" : undefined,
                minWidth: "400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="relative">
                <div className="">
                  {formatTime(time)}
                </div>
              </div>
            </div>
          )}
          {isMounted && showHelp && (
            <div
              className="mt-8 text-sm rounded-xl bg-white/90 backdrop-blur-sm shadow-lg"
              style={{
                color: "rgba(0, 0, 0, 0.9)",
                padding: "1rem 2rem",
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex gap-6 justify-center">
                <span className="font-medium">
                  "Space": {isRunning ? "Pause" : "Start"}
                </span>
                <span className="font-medium">"R": Reset</span>
                <span className="font-medium">"[": Add 1min</span>
                <span className="font-medium">"]": Subtract 1min</span>
                <span className="font-medium">"H": Help</span>
                <span className="font-medium">Esc: Exit</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isMounted) {
    return <div className="space-y-4" />;
  }

  return (
    <div className="space-y-6">
      {timerMode === "countdown" && !isCountdownSet && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="number"
              value={Math.floor(countdownTime / 60)}
              onChange={(e) => setCountdownTime(Number(e.target.value) * 60)}
              placeholder="Enter countdown time in minutes"
              className="font-mono bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button 
            onClick={handleCountdownStart} 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md"
          >
            <Clock className="h-4 w-4 mr-2" />
            Start Countdown
          </Button>
        </div>
      )}
      <div
        className="text-7xl font-bold text-center py-4 px-6 rounded-xl bg-white outline outline-gray-200"
        style={{ color: textColor }}
      >
        {formatTime(time)}
      </div>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md"
        >
          {isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span className="ml-2">{isRunning ? "Pause" : "Start"}</span>
        </Button>
        <Button 
          onClick={handleReset} 
          size="lg" 
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-md"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="ml-2">Reset</span>
        </Button>
        {(!isRunning || timerMode === "regular") && (
          <>
            <Button
              onClick={() => {
                if (timerMode === "countdown" && !isRunning) {
                  setCountdownTime((prev) => prev + 60);
                } else {
                  setTime((prev: number) => prev + 60);
                }
              }}
              size="lg"
              className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="ml-2">+1min</span>
            </Button>
            <Button
              onClick={() => {
                if (timerMode === "countdown" && !isRunning) {
                  setCountdownTime((prev) => Math.max(0, prev - 60));
                } else {
                  setTime((prev: number) => Math.max(0, prev - 60));
                }
              }}
              size="lg"
              className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
            >
              <Minus className="h-4 w-4" />
              <span className="ml-2">-1min</span>
            </Button>
          </>
        )}
        <Button 
          onClick={() => setShowHelp((prev) => !prev)} 
          size="lg"
          className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="ml-2">Help (H)</span>
        </Button>
      </div>
      {showHelp && (
        <div className="flex flex-row gap-3 items-center justify-center bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <span className="text-gray-700">
            "Space": {isRunning ? "Pause" : "Start"}
          </span>
          <span className="text-gray-700">"R": Reset</span>
          <span className="text-gray-700">"[": + 1 Min</span>
          <span className="text-gray-700">"]": - 1 Min</span>
          <span className="text-gray-700">"H": Help</span>
          <span className="text-gray-700">Esc: Exit</span>
        </div>
      )}
    </div>
  );
}
