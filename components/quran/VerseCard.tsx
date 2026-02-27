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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E2",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  verseIndex: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  arabic: {
    fontSize: 35,
    lineHeight: 34,
    color: Colors.light.text,
    textAlign: "right",
  },
  translation: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.light.icon,
    textAlign: "left",
  },
});

const MemoizedVerseCard = memo(VerseCard);
export default MemoizedVerseCard;
export { MemoizedVerseCard as VerseCard };
