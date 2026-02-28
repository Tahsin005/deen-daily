import { Colors } from "./Colors";

const primaryRgb = "37, 103, 30";
const secondaryRgb = "72, 161, 17";
const accentRgb = "242, 181, 11";

export const Theme = {
    colors: {
        primary: Colors.light.primary,
        secondary: Colors.light.secondary,
        accent: Colors.light.accent,
        background: Colors.light.background,
        surface: "#FFFFFF",
        surfaceMuted: "#F9FAFB",
        surfaceSoft: `rgba(${secondaryRgb}, 0.08)`,
        surfaceAccent: `rgba(${accentRgb}, 0.12)`,
        border: "#E5E7EB",
        borderLight: "#F0F0F0",
        text: Colors.light.text,
        textMuted: "#6B7280",
        onPrimary: "#FFFFFF",
        onAccent: Colors.light.text,
        icon: Colors.light.icon,
        danger: "#DC2626",
    },
    radius: {
        sm: 10,
        md: 14,
        lg: 18,
        xl: 22,
        pill: 999,
    },
    typography: {
        title: {
            fontSize: 20,
            fontWeight: "700" as const,
        },
        subtitle: {
            fontSize: 16,
            fontWeight: "600" as const,
        },
        body: {
            fontSize: 14,
            fontWeight: "400" as const,
        },
        caption: {
            fontSize: 12,
            fontWeight: "500" as const,
        },
    },
    gradients: {
        primaryStrong: Colors.light.primary,
        primarySoft: `rgba(${primaryRgb}, 0.12)`,
    },
};