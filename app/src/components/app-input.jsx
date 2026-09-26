import { Colors } from '@/constants/theme';
import {
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { ThemedIcon } from './themed-icon';

export function AppInput({ label, icon = 'person-outline', secure = false, ...props }) {   
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
    
            <View style={styles.inputWrapper}>
            <ThemedIcon
                name={icon}
                size={20}
                color={Colors.textSecondary}
            />
    
            <TextInput
                {...props}
                secureTextEntry={secure}
                style={styles.input}
                placeholderTextColor={Colors.textLight}
            />
    
            {secure && (
                <ThemedIcon
                name="eye-off-outline"
                size={20}
                color={Colors.textSecondary}
                />
            )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 17,
    },

    inputLabel: {
        fontSize: 13,
        color: Colors.text,
        fontWeight: '600',
        marginBottom: 7,
    },

    inputWrapper: {
        height: 52,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        gap: 10,
    },

    input: {
        flex: 1,
        fontSize: 15,
        color: Colors.text,
    }
})