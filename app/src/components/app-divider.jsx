import { Colors } from "@/constants/theme";
import {
    StyleSheet,
    Text,
    View
} from "react-native";

export function AppDivider({ text = "OR" }) {
    return (
        <View style={styles.dividerContainer}>
            <View style={styles.divider} />
    
            <Text style={styles.dividerText}>{text}</Text>
    
            <View style={styles.divider} />
        </View>
    )
}

const styles = StyleSheet.create({
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 22,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },

    dividerText: {
        marginHorizontal: 12,
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
    }
})