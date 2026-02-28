import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";
import type { SurahSummary } from "../../lib/api/quran/getSurahs";

type SurahListItemProps = {
  surah: SurahSummary;
  onPress: (index: number) => void;
};

function SurahListItem({ surah, onPress }: SurahListItemProps) {
  const handlePress = useCallback(() => {
    onPress(Number.parseInt(surah.index, 10));
  }, [onPress, surah.index]);

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIndex}>{surah.index}</Text>
        <View style={styles.cardTitles}>
          <Text style={styles.cardTitle}>{surah.title}</Text>
          <Text style={styles.cardSubtitle}>{surah.titleAr}</Text>
        </View>
      </View>
      <View style={styles.cardMetaRow}>
        <Text style={styles.cardMetaText}>{surah.type}</Text>
        <Text style={styles.cardMetaText}>{surah.place}</Text>
        <Text style={styles.cardMetaText}>{surah.count} verses</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIndex: {
    width: 42,
    height: 42,
  borderRadius: 21,
  backgroundColor: Theme.colors.surfaceSoft,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "700",
  color: Theme.colors.primary,
    marginRight: 12,
  },
  cardTitles: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 14,
    color: Colors.light.icon,
  },
  cardMetaRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  cardMetaText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
});

const MemoizedSurahListItem = memo(SurahListItem);
export default MemoizedSurahListItem;
export { MemoizedSurahListItem as SurahListItem };
