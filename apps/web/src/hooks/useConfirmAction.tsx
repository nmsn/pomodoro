"use client";

import { useState, useCallback } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export interface UseConfirmActionOptions {
  /** 确认对话框标题 */
  title?: string;
  /** 确认对话框内容 */
  message?: string;
  /** 确认按钮文本 */
  confirmText?: string;
  /** 是否为危险操作 */
  destructive?: boolean;
}

interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  destructive: boolean;
  pendingAction: (() => void) | null;
}

export function useConfirmAction(options: UseConfirmActionOptions = {}) {
  const {
    title = "确认操作",
    message = "当前计时正在进行中，确认要中断吗？",
    confirmText = "确认中断",
    destructive = true,
  } = options;

  const [state, setState] = useState<ConfirmState>({
    open: false,
    title,
    message,
    confirmText,
    destructive,
    pendingAction: null,
  });

  const confirm = useCallback(
    (action: () => void, isActive: boolean) => {
      if (isActive) {
        setState((prev) => ({
          ...prev,
          open: true,
          title,
          message,
          confirmText,
          destructive,
          pendingAction: action,
        }));
      } else {
        action();
      }
    },
    [title, message, confirmText, destructive]
  );

  const handleConfirm = useCallback(() => {
    state.pendingAction?.();
    setState((prev) => ({ ...prev, open: false, pendingAction: null }));
  }, [state.pendingAction]);

  const handleCancel = useCallback(() => {
    setState((prev) => ({ ...prev, open: false, pendingAction: null }));
  }, []);

  const Dialog = useCallback(
    () => (
      <ConfirmDialog
        open={state.open}
        title={state.title}
        message={state.message}
        confirmText={state.confirmText}
        destructive={state.destructive}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    ),
    [state, handleConfirm, handleCancel]
  );

  return { confirm, Dialog };
}
