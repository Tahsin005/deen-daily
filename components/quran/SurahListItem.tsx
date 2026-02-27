import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
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
    backgroundColor: "#E8F5E2",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "700",
    color: Colors.light.primary,
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
