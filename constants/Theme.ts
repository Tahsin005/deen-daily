import { Colors } from "./Colors";
import { Fonts } from "./Fonts";

const primaryRgb = "37, 103, 30";
const secondaryRgb = "72, 161, 17";
const accentRgb = "242, 181, 11";

export const Theme = {
    colors: {
        primary: Colors.light.primary,
        secondary: Colors.light.secondary,
        accent: Colors.light.accent,
        background: Colors.light.background,
        surface: "rgba(255, 255, 255, 0.05)",
        surfaceMuted: "rgba(255, 255, 255, 0.03)",
        surfaceHover: "rgba(255, 255, 255, 0.08)",
        surfaceSoft: `rgba(${secondaryRgb}, 0.14)`,
        surfaceAccent: `rgba(${accentRgb}, 0.16)`,
        border: "rgba(255, 255, 255, 0.09)",
        borderLight: "rgba(255, 255, 255, 0.05)",
        borderRim: "rgba(255, 255, 255, 0.18)",
        text: Colors.light.text,
        textMuted: "#9CA3AF",
        onPrimary: "#FFFFFF",
        onAccent: "#11181C",
        icon: Colors.light.icon,
        danger: "#EF4444",
        success: "#10B981",
    },
    radius: {
        xs: 6,
        sm: 10,
        md: 14,
        lg: 18,
        xl: 22,
        pill: 9999,
    },
    typography: {
        title: {
            fontSize: Fonts.size.display,
            fontWeight: "700" as const,
        },
        subtitle: {
            fontSize: Fonts.size.xl,
            fontWeight: "600" as const,
        },
        body: {
            fontSize: Fonts.size.text,
            fontWeight: "400" as const,
        },
        caption: {
            fontSize: Fonts.size.sm,
            fontWeight: "500" as const,
        },
    },
    gradients: {
        primaryStrong: Colors.light.primary,
        primarySoft: `rgba(${primaryRgb}, 0.18)`,
        goldSoft: `rgba(${accentRgb}, 0.18)`,
    },
    glass: {
        card: {
            backgroundColor: "rgba(22, 28, 24, 0.65)",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.09)",
            borderTopColor: "rgba(255, 255, 255, 0.16)",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 18,
            elevation: 4,
        },
        panel: {
            backgroundColor: "rgba(14, 18, 15, 0.78)",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.10)",
            borderTopColor: "rgba(255, 255, 255, 0.22)",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.45,
            shadowRadius: 24,
            elevation: 8,
        },
    },
};