// App.tsx
import "react-native-gesture-handler";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import { Navigation } from "./navigation";

Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/crypto.png"),
  require("./assets/star.png"),
  require("./assets/settings.png"),
]);

SplashScreen.preventAutoHideAsync();

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigation
        linking={{
          enabled: "auto",
          prefixes: ["helloworld://"],
        }}
        onReady={() => {
          SplashScreen.hideAsync();
        }}
      />
    </GestureHandlerRootView>
  );
}
