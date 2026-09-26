import { Colors } from '@/constants/theme';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { ThemedIcon } from './themed-icon';

export function SecurityNotice() {
    return (
        <View style={styles.securityNotice}>
            <View style={styles.securityIcon}>
                <ThemedIcon
                    name="shield-checkmark"
                    size={22}
                    color={Colors.primary}
                />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.securityTitle}>
                    Your data is safe with us
                </Text>

                <Text style={styles.securityText}>
                    We use bank-level security to protect your information and money.
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    securityNotice: {
        marginTop: 20,
        backgroundColor: Colors.primaryLight,
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        gap: 12,
    },

    securityIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#D5F2E1',
        alignItems: 'center',
        justifyContent: 'center',
    },

    securityTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 3,
    },

    securityText: {
        fontSize: 11,
        lineHeight: 16,
        color: Colors.textSecondary,
    }
})