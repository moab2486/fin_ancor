import { Colors } from '@/constants/theme'
import { router } from 'expo-router'
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>
            Welcome to financhor
        </Text>

        <Text style={styles.subtitle}>
            Your money. Your FinAnchor.
        </Text>

        <Pressable
            style={styles.button}
            onPress={() => router.push('/login')}
        >
            <Text style={styles.buttonText}>
                Login
            </Text>
        </Pressable>

        <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/register')}
        >
            <Text style={styles.secondaryButtonText}>
                Create Account
            </Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },

    title: {
        fontSize: 30,
        fontWeight: '800',
        color: Colors.text,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        marginTop: 8,
        marginBottom: 35,
    },

    button: {
        width: '100%',
        height: 54,
        borderRadius: 27,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    buttonText: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '700',
    },

    secondaryButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.primary,
    },

    secondaryButtonText: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: '700',
    },
})