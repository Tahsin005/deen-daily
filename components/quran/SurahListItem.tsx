import { memo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../constants/Fonts";
import type { SurahSummary } from "../../lib/api/quranV2/types";
import { GlassCard } from "../glass/GlassCard";

type SurahListItemProps = {
  surah: SurahSummary;
  onPress: (index: number) => void;
};

function SurahListItem({ surah, onPress }: SurahListItemProps) {
  const handlePress = useCallback(() => {
    onPress(surah.id);
  }, [onPress, surah.id]);

  const isMakki = surah.type.toLowerCase().includes("makk");

  return (
    <GlassCard onPress={handlePress} style={styles.card} contentStyle={styles.cardContent}>

      <View style={styles.leftRow}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>{surah.id}</Text>
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.transliteration}>{surah.transliteration}</Text>
          <Text style={styles.translation} numberOfLines={1}>
            {surah.translation}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.typeBadge, isMakki ? styles.makkiBadge : styles.madaniBadge]}>
              <Text style={[styles.typeText, isMakki ? styles.makkiText : styles.madaniText]}>
                {isMakki ? "MAKKI" : "MADANI"}
              </Text>
            </View>
            <Text style={styles.versesCount}>{surah.total_verses} verses</Text>
          </View>
        </View>
      </View>


      <View style={styles.rightArabic}>
        <Text style={styles.arabicName}>{surah.name}</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  idBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(242, 181, 11, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(242, 181, 11, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  idText: {
    fontSize: Fonts.size.sm,
    fontWeight: "700",
    color: "#F2B50B",
  },
  textGroup: {
    flex: 1,
  },
  transliteration: {
    fontSize: Fonts.size.md,
    fontWeight: "700",
    color: "#F3F4F6",
    letterSpacing: -0.2,
  },
  translation: {
    fontSize: Fonts.size.xs,
    color: "#9CA3AF",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  makkiBadge: {
    backgroundColor: "rgba(37, 103, 30, 0.3)",
    borderColor: "rgba(72, 161, 17, 0.4)",
  },
  madaniBadge: {
    backgroundColor: "rgba(242, 181, 11, 0.15)",
    borderColor: "rgba(242, 181, 11, 0.3)",
  },
  typeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  makkiText: {
    color: "#48A111",
  },
  madaniText: {
    color: "#FDE68A",
  },
  versesCount: {
    fontSize: Fonts.size.xxs,
    color: "#6B7280",
  },
  rightArabic: {
    paddingLeft: 12,
  },
  arabicName: {
    fontSize: Fonts.size.xxl,
    fontWeight: "700",
    color: "#FDE68A",
    textAlign: "right",
  },
});

export const MemoizedSurahListItem = memo(SurahListItem);
export default MemoizedSurahListItem;
export { MemoizedSurahListItem as SurahListItem };
