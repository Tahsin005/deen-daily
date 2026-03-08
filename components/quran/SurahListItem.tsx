import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import { Theme } from "../../constants/Theme";
import type { SurahSummary } from "../../lib/api/quranV2/types";

type SurahListItemProps = {
  surah: SurahSummary;
  onPress: (index: number) => void;
};

function SurahListItem({ surah, onPress }: SurahListItemProps) {
  const handlePress = useCallback(() => {
    onPress(surah.id);
  }, [onPress, surah.id]);

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIndex}>{surah.id}</Text>
        <View style={styles.cardTitles}>
          <Text style={styles.cardTitle}>{surah.transliteration}</Text>
          <Text style={styles.cardSubtitle}>{surah.translation}</Text>
        </View>
      </View>
      <View style={styles.cardMetaRow}>
        <Text style={styles.cardMetaText}>{surah.type}</Text>
        <Text style={styles.cardMetaText}>{surah.total_verses} verses</Text>
        <Text style={styles.cardMetaText}>{surah.name}</Text>
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
    fontSize: Fonts.size.xl,
    fontWeight: "600",
    color: Colors.light.text,
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: Fonts.size.text,
    color: Colors.light.icon,
  },
  cardMetaRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  cardMetaText: {
    fontSize: Fonts.size.sm,
    color: Colors.light.icon,
  },
});

const MemoizedSurahListItem = memo(SurahListItem);
export default MemoizedSurahListItem;
export { MemoizedSurahListItem as SurahListItem };
