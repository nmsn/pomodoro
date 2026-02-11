"use client";

import { PomodoroTimer } from "@/components/pomodoro-timer";
import { DrawerScrollableContent } from "@/components/ConfigDrawer";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 relative">
      <PomodoroTimer
        workDuration={25}
        breakDuration={5}
        className="shadow-2xl"
      />

      {/* 设置按钮 - 右下角 */}
      <div className="fixed bottom-6 right-6">
        <DrawerScrollableContent />
      </div>
    </main>
  );
}
