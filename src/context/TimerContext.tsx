'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type TimeFormat = 'HH:MM:SS' | 'MM:SS' | 'SS';
export type TimerMode = 'countdown' | 'regular';

interface TimerContextType {
  time: number;
  isRunning: boolean;
  backgroundImage: string | null;
  textColor: string;
  titleColor: string;
  timeFormat: TimeFormat;
  textSize: number;
  timerMode: TimerMode;
  title: string;
  countdownTime: number;
  targetScreen: number | null;
  customFont: string | null;
  completionMessage: string;
  setTime: (time: number | ((prev: number) => number)) => void;
  setIsRunning: (isRunning: boolean) => void;
  setBackgroundImage: (image: string | null) => void;
  setTextColor: (color: string) => void;
  setTitleColor: (color: string) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setTextSize: (size: number) => void;
  setTimerMode: (mode: TimerMode) => void;
  setTitle: (title: string) => void;
  setCountdownTime: (time: number | ((prev: number) => number)) => void;
  setTargetScreen: (screen: number | null) => void;
  setCustomFont: (font: string | null) => void;
  setCompletionMessage: (message: string) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [time, setTime] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timer-time');
      return saved ? Number(saved) : 0;
    }
    return 0;
  });
  const [isRunning, setIsRunning] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timer-running');
      return saved === 'true';
    }
    return false;
  });
  const [backgroundImage, setBackgroundImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timer-background');
    }
    return null;
  });
  const [textColor, setTextColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timer-textColor') || '#ffffff';
    }
    return '#ffffff';
  });
  const [titleColor, setTitleColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timer-titleColor') || '#ffffff';
    }
    return '#ffffff';
  });
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('timer-format') as TimeFormat) || 'HH:MM:SS';
    }
    return 'HH:MM:SS';
  });
  const [textSize, setTextSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timer-textSize');
      return saved ? Number(saved) : 6;
    }
    return 6;
  });
  const [timerMode, setTimerMode] = useState<TimerMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('timer-mode') as TimerMode) || 'regular';
    }
    return 'regular';
  });
  const [title, setTitle] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timer-title') || '';
    }
    return '';
  });
  const [countdownTime, setCountdownTime] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timer-countdown');
      return saved ? Number(saved) : 0;
    }
    return 0;
  });
  const [targetScreen, setTargetScreen] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timer-targetScreen');
      return saved ? Number(saved) : null;
    }
    return null;
  });
  const [customFont, setCustomFont] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timer-customFont');
    }
    return null;
  });
  const [completionMessage, setCompletionMessage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timer-completionMessage') || 'Time\'s up!';
    }
    return 'Time\'s up!';
  });

  // Save to localStorage whenever values change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer-time', time.toString());
    }
  }, [time]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer-running', isRunning.toString());
    }
  }, [isRunning]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (backgroundImage) {
        localStorage.setItem('timer-background', backgroundImage);
      } else {
        localStorage.removeItem('timer-background');
      }
    }
  }, [backgroundImage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer-textColor', textColor);
    }
  }, [textColor]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer-titleColor', titleColor);
    }
  }, [titleColor]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer-format', timeFormat);
    }
  }, [timeFormat]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer-textSize', textSize.toString());
    }
  }, [textSize]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer-mode', timerMode);
    }
  }, [timerMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer-title', title);
    }
  }, [title]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer-countdown', countdownTime.toString());
    }
  }, [countdownTime]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (targetScreen !== null) {
        localStorage.setItem('timer-targetScreen', targetScreen.toString());
      } else {
        localStorage.removeItem('timer-targetScreen');
      }
    }
  }, [targetScreen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (customFont) {
        localStorage.setItem('timer-customFont', customFont);
      } else {
        localStorage.removeItem('timer-customFont');
      }
    }
  }, [customFont]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer-completionMessage', completionMessage);
    }
  }, [completionMessage]);

  return (
    <TimerContext.Provider
      value={{
        time,
        isRunning,
        backgroundImage,
        textColor,
        titleColor,
        timeFormat,
        textSize,
        timerMode,
        title,
        countdownTime,
        targetScreen,
        customFont,
        completionMessage,
        setTime,
        setIsRunning,
        setBackgroundImage,
        setTextColor,
        setTitleColor,
        setTimeFormat,
        setTextSize,
        setTimerMode,
        setTitle,
        setCountdownTime,
        setTargetScreen,
        setCustomFont,
        setCompletionMessage,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
} 