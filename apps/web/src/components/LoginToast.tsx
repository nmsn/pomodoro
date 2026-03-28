"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginToastProps {
  message?: string;
  onClose?: () => void;
}

export function LoginToast({
  message = "登录后可保存您的番茄钟记录",
  onClose,
}: LoginToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 -translate-x-1/2 z-50",
        "px-4 py-3 rounded-lg shadow-lg",
        "bg-background/95 backdrop-blur-sm border border-border",
        "animate-in fade-in slide-in-from-bottom-2 duration-300",
        "flex items-center gap-3"
      )}
    >
      <span className="text-sm text-foreground">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="p-1 hover:bg-muted rounded cursor-pointer"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}
