import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { AppState, useColorScheme } from "react-native";
import { SWRConfig } from "swr";
import { TamaguiProvider, Theme } from "tamagui";
import config from "../tamagui.config";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
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
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
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
