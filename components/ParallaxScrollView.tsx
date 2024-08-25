import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, useColorScheme, View, Platform, Dimensions  } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { useState , useEffect} from "react";

import { ThemedView } from "@/components/ThemedView";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const [styles, setStyles] = useState(calculateStyles());
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  useEffect(() => {
    const onChange = ({window}) => {
      setStyles(calculateStyles(window.width));
    };
    const subscription = Dimensions.addEventListener('change', onChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
        </Animated.View>
        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
}

const calculateStyles = (screenWidth = Dimensions.get("window").width) => {
  const isSmallScreen = screenWidth < 550;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FBAED2",
      minWidth: isSmallScreen ? 330 : 380,
    },
    header: {
      height: HEADER_HEIGHT,
      overflow: "hidden",
    },
    content: {
      flex: 1,
      padding: isSmallScreen ? 0 : 32,
      gap: 16,
      overflow: "hidden",
    },
  });
};