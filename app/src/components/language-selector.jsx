import { Colors } from '@/constants/theme';
import {
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';
import { ThemedIcon } from './themed-icon';

export function LanguageSelector() {
    return (
        <Pressable style={styles.languageSelector}>
            <Text style={styles.languageText}>Hausa / En</Text>

            <ThemedIcon
                name="globe-outline"
                size={18}
                color={Colors.text}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    languageSelector: {
        height: 40,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    languageText: {
        fontSize: 13,
        color: Colors.text,
        fontWeight: '500',
    }
})
