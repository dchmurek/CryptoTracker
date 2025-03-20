import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";
import star from "../assets/star.png";
import crypto from "../assets/crypto.png";
import settings from "../assets/settings.png";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { Settings } from "./screens/Settings";
import { Favourites } from "./screens/Favourites";
import { NotFound } from "./screens/NotFound";
import { CryptoDetails } from "./screens/CryptoDetails";

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: "Crypto",
        tabBarIcon: ({ color, size }) => (
          <Image
            source={crypto}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    Favourites: {
      screen: Favourites,
      options: {
        title: "Favourites",
        tabBarIcon: ({ color, size }) => (
          <Image
            source={star}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    Settings: {
      screen: Settings,
      options: {
        title: "Settings",
        tabBarIcon: ({ color, size }) => (
          <Image
            source={settings}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    CryptoDetails: {
      screen: CryptoDetails,
      options: {
        title: "Crypto Details",
      },
    },
    Profile: {
      screen: Profile,
      linking: {
        path: ":user(@[a-zA-Z0-9-_]+)",
        parse: {
          user: (value) => value.replace(/^@/, ""),
        },
        stringify: {
          user: (value) => `@${value}`,
        },
      },
    },
    Settings: {
      screen: Settings,
      options: ({ navigation }) => ({
        presentation: "modal",
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
