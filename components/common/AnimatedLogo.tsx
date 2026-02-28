import { useEffect, useMemo, useRef } from "react";
import {
    Animated,
    Easing,
    ImageSourcePropType,
    ImageStyle,
    StyleProp,
} from "react-native";

const defaultSource = require("../../assets/images/daily-deen-app-icon-1.png");

type AnimatedLogoProps = {
    size?: number;
    source?: ImageSourcePropType;
    style?: StyleProp<ImageStyle>;
};

export const AnimatedLogo = ({ size = 64, source, style }: AnimatedLogoProps) => {
    const scale = useRef(new Animated.Value(1)).current;
    const floatY = useRef(new Animated.Value(0)).current;

    const animation = useMemo(
        () =>
            Animated.loop(
                Animated.sequence([
                    Animated.parallel([
                        Animated.timing(scale, {
                            toValue: 1.04,
                            duration: 1600,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(floatY, {
                            toValue: -4,
                            duration: 1600,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.parallel([
                        Animated.timing(scale, {
                            toValue: 1,
                            duration: 1600,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(floatY, {
                            toValue: 0,
                            duration: 1600,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            ),
        [floatY, scale]
    );

    useEffect(() => {
        animation.start();
        return () => animation.stop();
    }, [animation]);

    return (
        <Animated.Image
            source={source ?? defaultSource}
            resizeMode="contain"
            style={[
                {
                    width: size,
                    height: size,
                    transform: [{ translateY: floatY }, { scale }],
                },
                style,
            ]}
        />
    );
};
