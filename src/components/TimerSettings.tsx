"use client";

import { useTimer } from "@/context/TimerContext";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { TimerMode, TimeFormat } from "@/context/TimerContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Type,
  Monitor,
} from "lucide-react";

const timeFormats = [
  { label: "HH:MM:SS", value: "HH:MM:SS" },
  { label: "MM:SS", value: "MM:SS" },
  { label: "SS", value: "SS" },
];

const MIN_TEXT_SIZE = 12;
const MAX_TEXT_SIZE = 500;

interface Screen {
  width: number;
  height: number;
}

interface ScreenDetails {
  screens: Screen[];
}

declare global {
  interface Window {
    getScreenDetails: () => Promise<ScreenDetails>;
  }
}

export default function TimerSettings() {
  const {
    textColor,
    setTextColor,
    timeFormat,
    setTimeFormat,
    textSize,
    setTextSize,
    titleColor,
    setTitleColor,
    timerMode,
    setTimerMode,
    title,
    setTitle,
    targetScreen,
    setTargetScreen,
    customFont,
    setCustomFont,
    completionMessage,
    setCompletionMessage,
  } = useTimer();
  const [screens, setScreens] = useState<{ id: number; label: string }[]>([
    { id: 0, label: "Screen 1" },
  ]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpenChange = async (open: boolean) => {
    if (open && "getScreenDetails" in window) {
      try {
        const details = await window.getScreenDetails();
        const screenList = details.screens.map(
          (screen: Screen, index: number) => ({
            id: index,
            label: `Screen ${index + 1} (${screen.width}x${screen.height})`,
          })
        );
        setScreens(screenList);
      } catch (err) {
        console.error("Error getting screen details:", err);
      }
    }
  };

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fontUrl = event.target?.result as string;
        setCustomFont(fontUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isMounted) {
    return <div className="space-y-6" />;
  }

  return (
    <div className="grid gap-6">
      {/* Display Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Monitor className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Target Screen</Label>
            <Select
              value={targetScreen?.toString()}
              onValueChange={(value) => setTargetScreen(Number(value))}
              onOpenChange={handleOpenChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select screen" />
              </SelectTrigger>
              <SelectContent>
                {screens.map((screen) => (
                  <SelectItem key={screen.id} value={screen.id.toString()}>
                    {screen.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fullscreen Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title to display in fullscreen mode"
            />
          </div>
        </CardContent>
      </Card>

      {/* Timer Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Timer Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-row gap-4">
            <div className="space-y-2 w-1/2">
              <Label>Timer Mode</Label>
              <Select
                value={timerMode}
                onValueChange={(value) => setTimerMode(value as TimerMode)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timer mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular Timer</SelectItem>
                  <SelectItem value="countdown">Countdown Timer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-1/2">
              <Label>Time Format</Label>
              <Select
                value={timeFormat}
                onValueChange={(value) => setTimeFormat(value as TimeFormat)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {timeFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Completion Message</Label>
            <Input
              type="text"
              value={completionMessage}
              onChange={(e) => setCompletionMessage(e.target.value)}
              placeholder="Enter message to show when timer completes"
            />
            <p className="text-sm text-gray-500">
              This message will appear when the timer reaches zero
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Text Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Type className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Text Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-row gap-4">
            <div className="space-y-2 w-1/2">
              <Label>Counter Color</Label>
              <div className="flex items-center gap-4">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-20 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
              />
              <Input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                placeholder="#FFFFFF"
                className="font-mono"
              />
            </div>
          </div>
          <div className="space-y-2 w-1/2">
            <Label>Title Color</Label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={titleColor}
                onChange={(e) => setTitleColor(e.target.value)}
                className="h-10 w-20 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
              />
              <Input
                type="text"
                value={titleColor}
                onChange={(e) => setTitleColor(e.target.value)}
                placeholder="#FFFFFF"
                className="font-mono"
              />
            </div>
          </div></div>
          <div className="space-y-2">
            <Label>Text Size</Label>
            <div className="flex flex-row gap-4">
              <Slider
                value={[textSize]}
                onValueChange={(value) => setTextSize(value[0])}
                min={MIN_TEXT_SIZE}
                max={MAX_TEXT_SIZE}
                step={1}
              />
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  min={MIN_TEXT_SIZE}
                  max={MAX_TEXT_SIZE}
                  className="w-24"
                />
                <span className="text-sm text-gray-500">pixels</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Custom Font</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFontUpload}
                className="cursor-pointer"
              />
              {customFont && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomFont(null)}
                >
                  Remove Font
                </Button>
              )}
            </div>
            {customFont && (
              <p className="text-sm text-gray-500 mt-2">
                Custom font loaded. You can remove it using the button above.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
