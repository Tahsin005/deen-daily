import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../constants/Fonts";
import { GlassCard } from "../glass/GlassCard";

type VerseCardProps = {
  verseNumber: string;
  arabicText: string;
  translationText?: string;
};

function VerseCard({ verseNumber, arabicText, translationText }: VerseCardProps) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${arabicText}\n\n"${translationText ?? ""}"\n[Ayah ${verseNumber}] - Shared via Deen Daily`,
      });
    } catch {
      // ignore
    }
  };

  return (
    <GlassCard variant="muted" style={styles.card} contentStyle={styles.cardContent}>

      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.verseIndex}>{verseNumber}</Text>
        </View>
        <Pressable onPress={handleShare} style={styles.actionBtn}>
          <Ionicons name="share-outline" size={16} color="#9CA3AF" />
        </Pressable>
      </View>


      <Text style={styles.arabic}>{arabicText}</Text>


      {translationText ? (
        <Text style={styles.translation}>{translationText}</Text>
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  cardContent: {
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(242, 181, 11, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(242, 181, 11, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  verseIndex: {
    fontSize: Fonts.size.xs,
    fontWeight: "700",
    color: "#F2B50B",
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  arabic: {
    fontSize: Fonts.size.mega,
    lineHeight: 44,
    color: "#FFFFFF",
    textAlign: "right",
    letterSpacing: 0,
    marginBottom: 12,
  },
  translation: {
    fontSize: Fonts.size.text,
    lineHeight: 22,
    color: "#D1D5DB",
    textAlign: "left",
  },
});

export const MemoizedVerseCard = memo(VerseCard);
export default MemoizedVerseCard;
export { MemoizedVerseCard as VerseCard };
