import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import type { HadithBook } from "../../lib/api/hadith/getHadithBooks";

type BookCardProps = {
    book: HadithBook;
};

function BookCard({ book }: BookCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{book.bookName}</Text>
            <Text style={styles.subtitle}>{book.writerName}</Text>
            <View style={styles.metaRow}>
                <Text style={styles.metaText}>Hadiths: {book.hadiths_count}</Text>
                <Text style={styles.metaText}>Chapters: {book.chapters_count}</Text>
            </View>
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
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.light.text,
    },
    subtitle: {
        marginTop: 4,
        fontSize: 13,
        color: Colors.light.icon,
    },
    metaRow: {
        marginTop: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    metaText: {
        fontSize: 12,
        color: Colors.light.icon,
    },
});

const MemoizedBookCard = memo(BookCard);
export default MemoizedBookCard;
export { MemoizedBookCard as BookCard };
