import { StyleSheet, View, type ViewStyle } from "react-native";
import { ATTEND_ICON_COLOR, type AttendIconName } from "../assets/icons/attend";

type AttendIconProps = {
  color?: string;
  name: AttendIconName;
  size?: number;
  style?: ViewStyle;
};

export function AttendIcon({ color = ATTEND_ICON_COLOR, name, size = 24, style }: AttendIconProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[styles.root, { height: size, width: name === "sacred-divider-ornament" ? size * 4 : size }, style]}
    >
      <IconGlyph color={color} name={name} size={size} />
    </View>
  );
}

function IconGlyph({ color, name, size }: Required<Pick<AttendIconProps, "color" | "name" | "size">>) {
  switch (name) {
    case "stand":
    case "sit":
    case "kneel":
    case "process":
      return <PostureGlyph color={color} kind={name} size={size} />;
    case "cross":
      return <CrossGlyph color={color} size={size} />;
    case "home":
      return <HomeGlyph color={color} size={size} />;
    case "more":
      return <MoreGlyph color={color} size={size} />;
    case "left-chevron":
      return <ChevronGlyph color={color} size={size} />;
    case "chalice":
      return <ChaliceGlyph color={color} size={size} />;
    case "lyre-music":
      return <LyreGlyph color={color} size={size} />;
    case "gloria-sunburst":
      return <SunburstGlyph color={color} size={size} />;
    case "sacred-divider-ornament":
      return <DividerGlyph color={color} size={size} />;
  }
}

function PostureGlyph({ color, kind, size }: { color: string; kind: "stand" | "sit" | "kneel" | "process"; size: number }) {
  const scale = size / 24;

  if (kind === "sit") {
    return (
      <View style={styles.fill}>
        <SolidCircle color={color} size={4.4 * scale} style={{ left: 6.5 * scale, top: 2.5 * scale }} />
        <SolidBlock color={color} style={{ borderRadius: 3 * scale, height: 8.6 * scale, left: 7.2 * scale, top: 7 * scale, transform: [{ rotate: "-4deg" }], width: 4.2 * scale }} />
        <SolidBlock color={color} style={{ borderRadius: 3 * scale, height: 3.8 * scale, left: 10 * scale, top: 12.3 * scale, width: 7.4 * scale }} />
        <SolidBlock color={color} style={{ borderRadius: 3 * scale, height: 7.1 * scale, left: 15.4 * scale, top: 13.6 * scale, width: 3.4 * scale }} />
        <SolidBlock color={color} style={{ borderRadius: 2 * scale, height: 1.7 * scale, left: 14.6 * scale, top: 20.2 * scale, width: 5.2 * scale }} />
      </View>
    );
  }

  if (kind === "kneel") {
    return (
      <View style={styles.fill}>
        <SolidCircle color={color} size={4.4 * scale} style={{ left: 6.4 * scale, top: 2.5 * scale }} />
        <SolidBlock color={color} style={{ borderRadius: 3 * scale, height: 9.4 * scale, left: 8.3 * scale, top: 7.1 * scale, transform: [{ rotate: "-12deg" }], width: 4.2 * scale }} />
        <SolidBlock color={color} style={{ borderRadius: 3 * scale, height: 3.8 * scale, left: 10.8 * scale, top: 13.5 * scale, width: 7 * scale }} />
        <SolidBlock color={color} style={{ borderRadius: 3 * scale, height: 6.9 * scale, left: 16.1 * scale, top: 15 * scale, width: 3.2 * scale }} />
        <SolidBlock color={color} style={{ borderRadius: 2 * scale, height: 1.7 * scale, left: 11.6 * scale, top: 20.8 * scale, width: 8 * scale }} />
      </View>
    );
  }

  if (kind === "process") {
    return (
      <View style={styles.fill}>
        <ProcessFigure color={color} left={4.4 * scale} scale={scale} top={1.8 * scale} />
        <ProcessFigure color={color} left={12.3 * scale} scale={scale} top={3.2 * scale} />
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <SolidCircle color={color} size={4.5 * scale} style={{ left: 9.75 * scale, top: 2.2 * scale }} />
      <SolidBlock color={color} style={{ borderRadius: 4 * scale, height: 4.8 * scale, left: 7.4 * scale, top: 7.3 * scale, width: 9.2 * scale }} />
      <SolidBlock color={color} style={{ borderRadius: 2.4 * scale, height: 8.4 * scale, left: 9 * scale, top: 11 * scale, width: 6 * scale }} />
      <SolidBlock color={color} style={{ borderRadius: 2 * scale, height: 5.2 * scale, left: 8.5 * scale, top: 17.2 * scale, width: 2.7 * scale }} />
      <SolidBlock color={color} style={{ borderRadius: 2 * scale, height: 5.2 * scale, left: 12.8 * scale, top: 17.2 * scale, width: 2.7 * scale }} />
    </View>
  );
}

function ProcessFigure({ color, left, scale, top }: { color: string; left: number; scale: number; top: number }) {
  return (
    <>
      <SolidCircle color={color} size={3.8 * scale} style={{ left: left + 2.6 * scale, top }} />
      <SolidBlock color={color} style={{ borderRadius: 3 * scale, height: 4.2 * scale, left: left + 1.2 * scale, top: top + 4.8 * scale, width: 6.4 * scale }} />
      <SolidBlock color={color} style={{ borderRadius: 2.2 * scale, height: 7.2 * scale, left: left + 2.4 * scale, top: top + 8.4 * scale, width: 4.2 * scale }} />
      <SolidBlock color={color} style={{ borderRadius: 2 * scale, height: 5 * scale, left: left + 1.7 * scale, top: top + 14.4 * scale, transform: [{ rotate: "10deg" }], width: 2.4 * scale }} />
      <SolidBlock color={color} style={{ borderRadius: 2 * scale, height: 5.2 * scale, left: left + 5 * scale, top: top + 14.2 * scale, transform: [{ rotate: "-14deg" }], width: 2.4 * scale }} />
    </>
  );
}

function CrossGlyph({ color, size }: { color: string; size: number }) {
  const scale = size / 24;
  return (
    <View style={styles.fill}>
      <Stroke color={color} style={{ height: 18 * scale, left: 11.3 * scale, top: 3 * scale, width: 1.5 * scale }} />
      <Stroke color={color} style={{ height: 1.5 * scale, left: 6.6 * scale, top: 8.5 * scale, width: 10.8 * scale }} />
      <Stroke color={color} style={{ height: 1.4 * scale, left: 9 * scale, top: 20 * scale, width: 6 * scale }} />
    </View>
  );
}

function HomeGlyph({ color, size }: { color: string; size: number }) {
  const scale = size / 24;
  return (
    <View style={styles.fill}>
      <SolidBlock color={color} style={{ borderRadius: 1.8 * scale, height: 10.2 * scale, left: 6.8 * scale, top: 10 * scale, width: 10.4 * scale }} />
      <SolidBlock color={color} style={{ borderRadius: 1.4 * scale, height: 9.4 * scale, left: 7 * scale, top: 6.7 * scale, transform: [{ rotate: "45deg" }], width: 9.4 * scale }} />
      <View style={[styles.homeDoorCutout, { height: 5.8 * scale, left: 10.3 * scale, top: 14.4 * scale, width: 3.4 * scale }]} />
    </View>
  );
}

function MoreGlyph({ color, size }: { color: string; size: number }) {
  const dot = Math.max(3, size * 0.16);
  return (
    <View style={[styles.rowCenter, { gap: dot * 0.8 }]}>
      {[0, 1, 2].map((item) => (
        <View key={item} style={{ backgroundColor: color, borderRadius: 999, height: dot, width: dot }} />
      ))}
    </View>
  );
}

function ChevronGlyph({ color, size }: { color: string; size: number }) {
  const scale = size / 24;
  return (
    <View style={styles.fill}>
      <Stroke color={color} style={{ height: 1.5 * scale, left: 7 * scale, top: 8 * scale, transform: [{ rotate: "-45deg" }], width: 9 * scale }} />
      <Stroke color={color} style={{ height: 1.5 * scale, left: 7 * scale, top: 14 * scale, transform: [{ rotate: "45deg" }], width: 9 * scale }} />
    </View>
  );
}

function ChaliceGlyph({ color, size }: { color: string; size: number }) {
  const scale = size / 24;
  return (
    <View style={styles.fill}>
      <View style={[styles.box, { borderColor: color, borderRadius: 8 * scale, height: 10 * scale, left: 7 * scale, top: 4 * scale, width: 10 * scale }]} />
      <Stroke color={color} style={{ height: 6 * scale, left: 11.3 * scale, top: 14 * scale, width: 1.4 * scale }} />
      <Stroke color={color} style={{ height: 1.4 * scale, left: 8.5 * scale, top: 20 * scale, width: 7 * scale }} />
    </View>
  );
}

function LyreGlyph({ color, size }: { color: string; size: number }) {
  const scale = size / 24;
  return (
    <View style={styles.fill}>
      <View style={[styles.arc, { borderBottomColor: color, borderLeftColor: color, borderRightColor: color, height: 13 * scale, left: 7 * scale, top: 5 * scale, width: 10 * scale }]} />
      {[9.5, 12, 14.5].map((left) => (
        <Stroke key={left} color={color} style={{ height: 11 * scale, left: left * scale, top: 6.5 * scale, width: 1 * scale }} />
      ))}
      <Stroke color={color} style={{ height: 1.3 * scale, left: 8 * scale, top: 19 * scale, width: 8 * scale }} />
    </View>
  );
}

function SunburstGlyph({ color, size }: { color: string; size: number }) {
  const scale = size / 24;
  return (
    <View style={styles.fill}>
      <Circle color={color} size={7 * scale} style={{ left: 8.5 * scale, top: 8.5 * scale }} />
      {Array.from({ length: 8 }).map((_, index) => (
        <Stroke key={index} color={color} style={{ height: 5 * scale, left: 11.5 * scale, top: 2.5 * scale, transform: [{ rotate: `${index * 45}deg` }], width: 1.1 * scale }} />
      ))}
    </View>
  );
}

function DividerGlyph({ color, size }: { color: string; size: number }) {
  return (
    <View style={[styles.rowCenter, { width: size * 4 }]}>
      <Stroke color={color} style={{ flex: 1, height: 1 }} />
      <View style={[styles.diamond, { borderColor: color, height: size * 0.36, marginHorizontal: size * 0.28, width: size * 0.36 }]} />
      <Stroke color={color} style={{ flex: 1, height: 1 }} />
    </View>
  );
}

function Stroke({ color, style }: { color: string; style: ViewStyle }) {
  return <View style={[styles.stroke, { backgroundColor: color }, style]} />;
}

function SolidBlock({ color, style }: { color: string; style: ViewStyle }) {
  return <View style={[styles.solidBlock, { backgroundColor: color }, style]} />;
}

function SolidCircle({ color, size, style }: { color: string; size: number; style?: ViewStyle }) {
  return <View style={[styles.solidCircle, { backgroundColor: color, height: size, width: size }, style]} />;
}

function Circle({ color, size, style }: { color: string; size: number; style?: ViewStyle }) {
  return <View style={[styles.circle, { borderColor: color, height: size, width: size }, style]} />;
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center"
  },
  fill: {
    height: "100%",
    position: "relative",
    width: "100%"
  },
  stroke: {
    borderRadius: 999,
    position: "absolute"
  },
  solidBlock: {
    position: "absolute"
  },
  solidCircle: {
    borderRadius: 999,
    position: "absolute"
  },
  circle: {
    borderRadius: 999,
    borderWidth: 1.3,
    position: "absolute"
  },
  box: {
    borderRadius: 2,
    borderWidth: 1.3,
    position: "absolute"
  },
  arc: {
    borderBottomWidth: 1.3,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 1.3,
    borderRightWidth: 1.3,
    position: "absolute"
  },
  rowCenter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  diamond: {
    borderWidth: 1.15,
    transform: [{ rotate: "45deg" }]
  },
  homeDoorCutout: {
    backgroundColor: "rgba(251, 247, 238, 0.86)",
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    position: "absolute"
  }
});
