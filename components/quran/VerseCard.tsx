import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

type VerseCardProps = {
  verseNumber: string;
  arabicText: string;
  translationText?: string;
};

function VerseCard({ verseNumber, arabicText, translationText }: VerseCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.verseIndex}>{verseNumber}</Text>
      </View>
      <Text style={styles.arabic}>{arabicText}</Text>
      {translationText ? <Text style={styles.translation}>{translationText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E3F2E1",
    backgroundColor: "#E8F5E2",
    marginBottom: 10,
  },
  verseIndex: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  arabic: {
    fontSize: 34,
    lineHeight: 48,
    color: Colors.light.text,
    textAlign: "right",
  },
  translation: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: Colors.light.icon,
    textAlign: "left",
  },
});

const MemoizedVerseCard = memo(VerseCard);
export default MemoizedVerseCard;
export { MemoizedVerseCard as VerseCard };
