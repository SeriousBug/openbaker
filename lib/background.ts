import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { rescheduleAllNotifications } from "./notification";
import { Log } from "./log";

const BACKGROUND_FETCH_TASK = "openbaker-background-update";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  await rescheduleAllNotifications();
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export async function registerBackgroundUpdate() {
  Log.event("registerBackgroundUpdate");
  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 60 * 6, // 6 hours
    startOnBoot: true,
    stopOnTerminate: false,
  });
}
