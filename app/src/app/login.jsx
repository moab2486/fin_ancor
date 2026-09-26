import { AppButton } from "@/components/app-button";
import { AppDivider } from "@/components/app-divider";
import { AppInput } from "@/components/app-input";
import { AppLogo } from "@/components/app-logo";
import { ThemedIcon } from "@/components/themed-icon";
import { Colors } from "@/constants/theme";
import { loginUser } from "@/https/auth";
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (loading) return

        setLoading(true)
        setError('')
        try {
            const challenge = await loginUser({ email, password })
            router.push({
                pathname: '/verify',
                params: { challengeId: challenge.challengeId },
            })
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <SafeAreaView  style={styles.safeArea}>
		<ScrollView 
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
		>
			{/* Header */}
			<View style={styles.header}>
				<Pressable onPress={() => router.back()}>
                    <ThemedIcon
                        name="arrow-back"
                        size={25}
                        color={Colors.text}
                    />
				</Pressable>

				<Text style={styles.headerTitle}>
                    LOGIN
                </Text>

                <View style={styles.headerSpace} />
			</View>

			<AppLogo />

			<Text style={styles.title}>
				Welcome back! 👋
			</Text>

			<Text style={styles.subtitle}>
				Login to your account and keep
				{'\n'}
				building your FinAnchor.
			</Text>

			{/* Login form */}
              <AppInput
                label="Email"
                icon="mail-outline"
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

			<AppInput
                        label="Password"
				icon="lock-closed-outline"
                        placeholder="Enter your password"
				secure
                        value={password}
                        onChangeText={setPassword}
			/>

                    <Pressable
                        style={styles.forgot}
                        onPress={() => router.replace('/forgot-pin')}
                    >
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </Pressable>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

			<AppButton
                title={loading ? "Signing in..." : "Login"}
                onPress={handleLogin}
			/>

			<AppDivider />

			{/* Biometric */}
			<Pressable style={styles.biometric}>
				<View style={styles.fingerprint}>
				<ThemedIcon
					name="finger-print-outline"
					size={28}
					color={Colors.primary}
				/>
				</View>

				<View style={styles.biometricContent}>
				<Text style={styles.biometricTitle}>
					Login with Biometrics
				</Text>

				<Text style={styles.biometricText}>
					Use your fingerprint to login
					quickly and securely
				</Text>
				</View>

				<ThemedIcon
				name="chevron-forward"
				size={20}
				color={Colors.primary}
				/>
			</Pressable>

			{/* Register */}
			<View style={styles.register}>
				<Text style={styles.registerText}>
                Don&apos;t have an account?{' '}
				</Text>

				<Pressable
				onPress={() => router.push('/register')}
				>
				<Text style={styles.link}>
					Register
				</Text>
				</Pressable>
			</View>

			{/* <SecurityNotice /> */}

			{/* Illustration placeholder */}
			{/* <View style={styles.illustration}>
				<View style={styles.marketRoof} />

				<View style={styles.marketStand}>
				<View style={styles.marketItems}>
					<Text style={styles.marketEmoji}>🍅</Text>
					<Text style={styles.marketEmoji}>🍊</Text>
					<Text style={styles.marketEmoji}>🥬</Text>
				</View>

				<Text style={styles.marketText}>
					Your FinAnchor journey starts here
				</Text>
				</View>
			</View> */}
		</ScrollView>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    container: {
        paddingHorizontal: 22,
        paddingBottom: 40,
    },

    header: {
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.text,
    },

    headerSpace: {
        width: 42,
    },

    title: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        color: Colors.text,
    },

    subtitle: {
        textAlign: 'center',
        color: Colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
        marginTop: 7,
        marginBottom: 25,
    },

    forgot: {
        alignSelf: 'flex-end',
        marginTop: -8,
        marginBottom: 18,
    },

    forgotText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 12,
    },

    biometric: {
        backgroundColor: Colors.primaryLight,
        borderRadius: 14,
        padding: 13,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    fingerprint: {
        width: 48,
        height: 48,
        borderRadius: 13,
        backgroundColor: '#D7F3E2',
        alignItems: 'center',
        justifyContent: 'center',
    },

    biometricContent: {
        flex: 1,
    },

    biometricTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.text,
    },

    biometricText: {
        fontSize: 10,
        lineHeight: 15,
        color: Colors.textSecondary,
        marginTop: 3,
    },

    register: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 22,
    },

    registerText: {
        fontSize: 13,
        color: Colors.textSecondary,
    },

    link: {
        color: Colors.primary,
        fontWeight: '700',
    },

    errorText: {
        color: '#B42318',
        fontSize: 12,
        marginBottom: 14,
        textAlign: 'center',
    },

    illustration: {
        marginTop: 'auto',
        height: 125,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    marketRoof: {
        width: 180,
        height: 45,
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        backgroundColor: '#63C78B',
    },

    marketStand: {
        width: 220,
        height: 65,
        backgroundColor: '#E9F7EF',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    marketItems: {
        flexDirection: 'row',
        gap: 15,
    },

    marketEmoji: {
        fontSize: 20,
    },

    marketText: {
        marginTop: 5,
        fontSize: 10,
        color: Colors.primaryDark,
        fontWeight: '600',
    },
})