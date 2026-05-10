import type { ComponentType } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { SvgProps } from "react-native-svg";
import BowingGesture from "../../assets/attend/gestures/attend-gesture-bowing-default.svg";
import ProcessionGesture from "../../assets/attend/gestures/attend-gesture-procession-default.svg";
import SignCrossGesture from "../../assets/attend/gestures/attend-gesture-sign-cross-default.svg";
import StrikeBreastGesture from "../../assets/attend/gestures/attend-gesture-strike-breast-default.svg";
import CheckIconAsset from "../../assets/attend/icons/check.svg";
import CloseIconAsset from "../../assets/attend/icons/close.svg";
import CrossPenitentialIcon from "../../assets/attend/icons/cross-penitential.svg";
import SpeakerIconAsset from "../../assets/attend/icons/speaker.svg";
import SunburstIcon from "../../assets/attend/icons/sunburst.svg";
import ChaliceLiturgical from "../../assets/attend/liturgical/attend-liturgical-chalice-default.svg";
import HostEucharistLiturgical from "../../assets/attend/liturgical/attend-liturgical-host-eucharist-default.svg";
import LyreWingedLiturgical from "../../assets/attend/liturgical/attend-liturgical-lyre-winged-default.svg";

export type AttendAssetSource = ComponentType<SvgProps>;

export const attendAssetSources = {
  gestures: {
    bowing: BowingGesture,
    procession: ProcessionGesture,
    signCross: SignCrossGesture,
    strikeBreast: StrikeBreastGesture
  },
  icons: {
    check: CheckIconAsset,
    close: CloseIconAsset,
    crossPenitential: CrossPenitentialIcon,
    speaker: SpeakerIconAsset,
    sunburst: SunburstIcon
  },
  liturgical: {
    chalice: ChaliceLiturgical,
    hostEucharist: HostEucharistLiturgical,
    lyreWinged: LyreWingedLiturgical
  }
} as const;

type AttendAssetImageProps = {
  color?: string;
  label?: string;
  source: AttendAssetSource;
  style?: StyleProp<ViewStyle>;
};

export function AttendAssetImage({ color, label, source, style }: AttendAssetImageProps) {
  const Asset = source;
  return (
    <View accessibilityLabel={label} pointerEvents="none" style={[assetFrameStyle, style]} testID="attend-asset-frame">
      <Asset color={color} height="100%" preserveAspectRatio="xMidYMid meet" width="100%" />
    </View>
  );
}

const assetFrameStyle: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden"
};
