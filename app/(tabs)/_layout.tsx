import { Tabs, router, usePathname } from "expo-router";
import { BottomTabIcon } from "../../components/BottomTabIcon";
import { colors } from "../../constants/theme";

export default function TabLayout() {
  const pathname = usePathname();
  const attendIsActive = normalizeTabPath(pathname) === "/home/attend";
  const createRootTabPress =
    (rootPath: "/home" | "/learn" | "/journal" | "/profile", href: "/(tabs)/home" | "/(tabs)/learn" | "/(tabs)/journal" | "/(tabs)/profile") =>
    (event: { preventDefault: () => void }) => {
      const currentPath = normalizeTabPath(pathname);
      if (currentPath === rootPath) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      router.replace(href);
    };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.burgundy,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          display: attendIsActive ? "none" : "flex",
          height: 88,
          paddingBottom: 18,
          paddingTop: 10
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2
        }
      }}
    >
      <Tabs.Screen
        name="home"
        listeners={{
          tabPress: createRootTabPress("/home", "/(tabs)/home")
        }}
        options={{
          title: "Home",
          tabBarAccessibilityLabel: "Home tab",
          tabBarIcon: ({ focused }) => <BottomTabIcon focused={focused} name={focused ? "home" : "home-outline"} />
        }}
      />
      <Tabs.Screen
        name="learn"
        listeners={{
          tabPress: createRootTabPress("/learn", "/(tabs)/learn")
        }}
        options={{
          title: "Learn",
          tabBarAccessibilityLabel: "Learn tab",
          tabBarIcon: ({ focused }) => <BottomTabIcon focused={focused} name={focused ? "reorder-three" : "reorder-three-outline"} />
        }}
      />
      <Tabs.Screen
        name="journal"
        listeners={{
          tabPress: createRootTabPress("/journal", "/(tabs)/journal")
        }}
        options={{
          title: "Journal",
          tabBarAccessibilityLabel: "Journal tab",
          tabBarIcon: ({ focused }) => <BottomTabIcon focused={focused} name={focused ? "diamond" : "diamond-outline"} />
        }}
      />
      <Tabs.Screen
        name="profile"
        listeners={{
          tabPress: createRootTabPress("/profile", "/(tabs)/profile")
        }}
        options={{
          title: "Profile",
          tabBarAccessibilityLabel: "Profile tab",
          tabBarIcon: ({ focused }) => <BottomTabIcon focused={focused} name={focused ? "ellipse" : "ellipse-outline"} />
        }}
      />
    </Tabs>
  );
}

function normalizeTabPath(pathname: string) {
  return pathname.replace(/^\/\(tabs\)/, "").replace(/\/index$/, "") || "/home";
}
