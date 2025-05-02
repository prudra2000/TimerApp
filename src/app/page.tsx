'use client';

import { useState, useEffect } from 'react';
import TimerControls from '@/components/TimerControls';
import ImageUpload from '@/components/ImageUpload';
import TimerSettings from '@/components/TimerSettings';
import { useTimer } from '@/context/TimerContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Maximize2, Settings, ImageIcon, Timer } from 'lucide-react';

export default function Home() {
  const { backgroundImage, setBackgroundImage, targetScreen } = useTimer();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        if (targetScreen !== null && 'getScreenDetails' in window) {
          const screenDetails = await (window as any).getScreenDetails();
          const screen = screenDetails.screens[targetScreen];
          if (screen) {
            const element = document.documentElement;
            await element.requestFullscreen({ screen } as any);
          }
        } else {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error('Error entering fullscreen:', err);
      }
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-white to-gray-50">
      {!isFullscreen && (
        <div className="w-full max-w-7xl space-y-8">
          <div className="space-y-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-800">Background Image</h2>
              </div>
              <ImageUpload />
            </div>

            <Separator className="bg-gray-100" />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
              </div>
              <TimerSettings />
            </div>

            <Separator className="bg-gray-100" />

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-800">Timer Controls</h2>
              </div>
              <TimerControls />
              <Button
                onClick={toggleFullscreen}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md"
                variant="default"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Enter Fullscreen Mode
              </Button>
            </div>
          </div>
        </div>
      )}
      {isFullscreen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}
          />
          <div className="relative z-10">
            <TimerControls fullscreen />
          </div>
        </div>
      )}
    </main>
  );
}
