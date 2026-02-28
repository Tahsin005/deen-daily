import { useEffect, useRef } from "react";
import { Animated, ImageStyle, StyleProp, StyleSheet } from "react-native";

const logoSource = require("../../assets/images/logo.png");

type GlobalLoaderProps = {
    size?: number;
    style?: StyleProp<ImageStyle>;
};

export const GlobalLoader = ({ size = 120, style }: GlobalLoaderProps) => {
    const scale = useRef(new Animated.Value(0.92)).current;
    const opacity = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
        const scaleAnimation = Animated.loop(
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 1.05,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: 0.92,
                duration: 700,
                useNativeDriver: true,
            }),
        ])
        );

        const opacityAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ])
        );

        scaleAnimation.start();
        opacityAnimation.start();

        return () => {
            scaleAnimation.stop();
            opacityAnimation.stop();
        };
    }, [opacity, scale]);

    return (
        <Animated.Image
        source={logoSource}
        style={[styles.logo, style, { width: size, height: size, opacity, transform: [{ scale }] }]}
        />
    );
};

const styles = StyleSheet.create({
    logo: {
        resizeMode: "contain",
        alignSelf: "center",
    },
});
