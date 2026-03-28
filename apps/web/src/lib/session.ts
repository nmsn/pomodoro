import { apiFetch } from "@/lib/api";
import type { CurrentSession } from "@/atoms/timer";

export async function savePomodoroSession(
  session: CurrentSession,
  completed: boolean
): Promise<void> {
  const duration = Math.floor((Date.now() - session.startTime) / 1000);
  await apiFetch("/api/sessions", {
    method: "POST",
    body: JSON.stringify({
      timerType: session.timerType,
      mode: session.mode,
      startTime: session.startTime,
      endTime: Date.now(),
      duration,
      completed,
    }),
  });
}
