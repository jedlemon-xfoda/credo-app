import "@testing-library/jest-native/extend-expect";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import React from "react";
import { Pressable, Text, View } from "react-native";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  dismissTo: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true)
};
const mockTabPreventDefault = jest.fn();

let mockSearchParams: Record<string, string> = { id: "offertory" };
let mockPathname = "/home";

const mockStack = ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children);
mockStack.Screen = () => null;

const mockTabs = ({ children }: { children: React.ReactNode }) => React.createElement(View, null, children);
mockTabs.Screen = ({
  name,
  options,
  listeners
}: {
  name: string;
  options?: { href?: null; tabBarAccessibilityLabel?: string; title?: string };
  listeners?: { tabPress?: (event: { preventDefault: () => void }) => void };
}) =>
  options?.href === null
    ? null
    : React.createElement(
        Pressable,
        {
          accessibilityLabel: options?.tabBarAccessibilityLabel,
          onPress: () => listeners?.tabPress?.({ preventDefault: mockTabPreventDefault })
        },
        React.createElement(Text, null, options?.title ?? name)
      );

const mockUseFocusEffect = (callback: () => void | (() => void)) => {
  React.useEffect(() => callback(), [callback]);
};

jest.mock("expo-router", () => ({
  router: mockRouter,
  Stack: mockStack,
  Tabs: mockTabs,
  useFocusEffect: mockUseFocusEffect,
  usePathname: () => mockPathname,
  useLocalSearchParams: () => mockSearchParams
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children, style }: { children: React.ReactNode; style?: unknown }) => {
    const ReactModule = jest.requireActual("react");
    const { View: MockView } = jest.requireActual("react-native");
    return ReactModule.createElement(MockView, { style }, children);
  }
}));

beforeEach(() => {
  mockAsyncStorage.clear();
  process.env.EXPO_PUBLIC_ATTEND_REVIEW_DATE = "2026-05-09";
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.dismissTo.mockClear();
  mockRouter.back.mockClear();
  mockRouter.canGoBack.mockClear();
  mockRouter.canGoBack.mockReturnValue(true);
  mockTabPreventDefault.mockClear();
  mockSearchParams = { id: "offertory" };
  mockPathname = "/home";
});

const router = mockRouter;
const setMockSearchParams = (params: Record<string, string>) => {
  mockSearchParams = params;
};
const setMockPathname = (pathname: string) => {
  mockPathname = pathname;
};

export { router, setMockPathname, setMockSearchParams };
export { mockTabPreventDefault };
