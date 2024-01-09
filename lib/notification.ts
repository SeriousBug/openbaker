import * as Notifications from "expo-notifications";
import { getAllStarters } from "./data/starters";
import { getNextFeeding } from "./time";

export function notify({
  title,
  body,
  date,
}: {
  title: string;
  body: string;
  date: Date;
}) {
  Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: {},
    },
    trigger: {
      date,
    },
  });
}

export async function rescheduleAllNotifications() {
  // Ew
  await Notifications.cancelAllScheduledNotificationsAsync();
  const starters = await getAllStarters();
  for (const starter of starters) {
    const next = getNextFeeding(starter);
    if (next) {
      notify({
        title: "Time to feed your 🍞 starter!",
        body: "It's time to feed your starter now.",
        date: next,
      });
    }
  }
}
