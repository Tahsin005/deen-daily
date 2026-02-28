import { useEffect, useRef } from "react";
import {
    Animated,
    StyleProp,
    StyleSheet,
    ViewStyle,
} from "react-native";

const useSkeletonPulse = () => {
    const opacity = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                    Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.6,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return opacity;
};

type SkeletonBoxProps = {
    style?: StyleProp<ViewStyle>;
};

export const SkeletonBox = ({ style }: SkeletonBoxProps) => {
    const opacity = useSkeletonPulse();
    return <Animated.View style={[styles.box, style, { opacity }]} />;
};

export const SkeletonLine = ({ style }: SkeletonBoxProps) => (
    <SkeletonBox style={[styles.line, style]} />
);

export const SkeletonCircle = ({ style }: SkeletonBoxProps) => (
    <SkeletonBox style={[styles.circle, style]} />
);

const styles = StyleSheet.create({
    box: {
        backgroundColor: "#E5E7EB",
        borderRadius: 8,
    },
    line: {
        height: 12,
        borderRadius: 6,
    },
    circle: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
});
