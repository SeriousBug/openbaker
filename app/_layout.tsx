import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AppState, useColorScheme } from "react-native";
import { SWRConfig } from "swr";
import { TamaguiProvider, Theme } from "tamagui";
import config from "../tamagui.config";
import * as Notifications from "expo-notifications";
import { rescheduleAllNotifications } from "../lib/notification";
import { migrateUp } from "../lib/db/migration";
import "react-native-gesture-handler";
import { Log } from "../lib/log";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [migrated, setMigrated] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (initialized || !loaded) return;

    setInitialized(true);
    migrateUp().finally(() => {
      setMigrated(true);
      Log.event("loading done");
      SplashScreen.hideAsync();
    });
  }, [loaded]);

  const notificationsSetUp = useRef(false);
  useEffect(() => {
    if (notificationsSetUp.current) return;
    notificationsSetUp.current = true;
    rescheduleAllNotifications();
  }, []);

  if (!loaded || !initialized || !migrated) {
    return null;
  }

  return (
    <SWRConfig
      value={{
        revalidateIfStale: false,
        revalidateOnReconnect: false,
        revalidateOnFocus: false,
        provider: () => new Map(),
        isOnline() {
          // Doesn't matter, we don't access the network.
          return true;
        },
        isVisible() {
          return AppState.currentState === "active";
        },
        initFocus(callback) {
          // let appState = AppState.currentState;
          // const handleStateChange = (newState: AppStateStatus) => {
          //   if (
          //     appState.match(/inactive|background/) &&
          //     newState === "active"
          //   ) {
          //     callback();
          //   }
          // };
          //
          // const sub = AppState.addEventListener("change", handleStateChange);
          // return () => {
          //   sub.remove();
          // };
          // No-op. We don't access the network, the data can't just change out from under us.
        },
        initReconnect() {
          // No-op. We don't access the network, so don't need to revalidate on reconnect.
        },
      }}
    >
      <TamaguiProvider config={config}>
        <RootLayoutNav />
      </TamaguiProvider>
    </SWRConfig>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <Theme name={colorScheme}>
      <NavThemeProvider
        value={colorScheme === "dark" ? NavDarkTheme : NavDefaultTheme}
      >
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="starter/[id]/view"
            options={{ title: "Starter" }}
          />
          <Stack.Screen name="starter/add" options={{ title: "Add Starter" }} />
        </Stack>
      </NavThemeProvider>
    </Theme>
  );
}
