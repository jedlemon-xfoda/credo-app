import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/theme";

type BottomTabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
};

export function BottomTabIcon({ name, focused }: BottomTabIconProps) {
  return <Ionicons color={focused ? colors.burgundy : colors.mutedText} name={name} size={19} />;
}
