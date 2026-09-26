import { AppButton } from "@/components/app-button";
import { AppDivider } from "@/components/app-divider";
import { AppInput } from "@/components/app-input";
import { AppLogo } from "@/components/app-logo";
import { ThemedIcon } from "@/components/themed-icon";
import { Colors } from "@/constants/theme";
import { registerUser } from "@/https/auth";
import { router } from 'expo-router';
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const [accepted, setAccepted] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!accepted || loading) return

        setLoading(true)
        setError('')
        try {
            const challenge = await registerUser({ name, phone, email, password })
            router.push({
                pathname: '/verify',
                params: { challengeId: challenge.challengeId, phone },
            })
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <SafeAreaView style={styles.safeArea}>
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
                        REGISTRATION
                    </Text>

                    <View style={styles.headerSpace} />
                </View>

                <AppLogo />

                <Text style={styles.title}>Create your account</Text>

                <Text style={styles.subtitle}>
                    Join thousands of market traders
                    {'\n'}
                    building their FinAnchor.
                </Text>

                {/* Progress */}
                <View style={styles.progressContainer}>
                    <ProgressStep
                        number="1"
                        title="Account"
                        active
                    />

                    <View style={styles.progressLine} />

                    <ProgressStep
                        number="2"
                        title="Verify"
                    />

                    <View style={styles.progressLine} />

                    <ProgressStep
                        number="3"
                        title="Done"
                    />
                </View>

                {/* Form */}
                <AppInput
                    label="Full Name"
                    icon="person-outline"
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={setName}
                />

                <AppInput
                    label="Phone Number"
                    icon="call-outline"
                    placeholder="+234 803 123 4567"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />

                <Text style={styles.helperText}>
                    We&apos;ll use this to send you OTP and updates
                </Text>

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
                    label="Create Password"
                    icon="lock-closed-outline"
                    placeholder="At least 8 characters"
                    secure
                    value={password}
                    onChangeText={setPassword}
                />

                <Text style={styles.helperText}>
                You will use this password to login
                </Text>

                <AppInput
                    label="Referral Code (Optional)"
                    icon="gift-outline"
                    placeholder="Enter referral code"
                />

                {/* Terms */}
                {/* <Pressable
                    style={styles.terms}
                    onPress={() => setAccepted(!accepted)}
                >
                    <View
                        style={[
                            styles.checkbox,
                            accepted && styles.checkboxActive,
                        ]}
                    >
                        {accepted && (
                            <ThemedIcon
                                name="checkmark"
                                size={16}
                                color={Colors.white}
                            />
                        )}
                    </View>

                    <Text style={styles.termsText}>
                        I agree to the{' '}
                        <Text style={styles.link}>
                            Terms & Conditions
                        </Text>{' '}
                            and{' '}
                        <Text style={styles.link}>
                            Privacy Policy
                        </Text>
                    </Text>
                </Pressable> */}
                <View style={styles.terms}>
                    {/* Checkbox */}
                    <Pressable
                        onPress={() => setAccepted(!accepted)}
                        style={[
                            styles.checkbox,
                            accepted && styles.checkboxActive,
                        ]}
                    >
                        {accepted && (
                            <ThemedIcon
                                name="checkmark"
                                size={16}
                                color={Colors.white}
                            />
                        )}
                    </Pressable>

                    {/* Terms text */}
                    <Text style={styles.termsText}>
                        I agree to the{' '}

                        <Text
                            style={styles.link}
                            onPress={() => router.push('/terms')}
                        >
                            Terms & Conditions
                        </Text>

                        {' '}and{' '}

                        <Text
                            style={styles.link}
                            onPress={() => router.push('/privacy')}
                        >
                            Privacy Policy
                        </Text>
                    </Text>
                </View>

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <AppButton
                    title={loading ? "Creating account..." : "Continue"}
                    onPress={handleRegister}
                />

                <AppDivider />

                {/* Google */}
                <Pressable style={styles.googleButton}>
                    <Text style={styles.googleG}>G</Text>

                    <Text style={styles.googleText}>
                        Continue with Google
                    </Text>
                </Pressable>

                <View style={styles.bottomText}>
                    <Text style={styles.normalText}>
                        Already have an account?{' '}
                    </Text>

                    <Pressable
                        onPress={() => router.push('/login')}
                    >
                        <Text style={styles.link}>Login</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

function ProgressStep({ number, title, active = false, }) {
    return (
        <View style={styles.step}>
            <View
                style={[
                styles.stepCircle,
                active && styles.stepCircleActive,
                ]}
            >
                <Text
                    style={[
                        styles.stepNumber,
                        active && styles.stepNumberActive,
                    ]}
                >
                    {number}
                </Text>
            </View>

            <Text style={styles.stepTitle}>{title}</Text>
        </View>
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
        color: Colors.text,
        textAlign: 'center',
    },

    subtitle: {
        textAlign: 'center',
        color: Colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
        marginTop: 7,
        marginBottom: 24,
    },

    progressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 28,
    },

    progressLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
        marginTop: 15,
    },

    step: {
        alignItems: 'center',
        width: 55,
    },

    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
    },

    stepCircleActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },

    stepNumber: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
    },

    stepNumberActive: {
        color: Colors.white,
    },

    stepTitle: {
        fontSize: 10,
        color: Colors.textSecondary,
        marginTop: 5,
    },

    helperText: {
        fontSize: 10,
        color: Colors.textSecondary,
        marginTop: -10,
        marginBottom: 15,
    },

    // terms: {
    //     flexDirection: 'row',
    //     alignItems: 'flex-start',
    //     marginTop: 18,
    // },

    // termsText: {
    //     flex: 1,
    //     fontSize: 12,
    //     lineHeight: 19,
    //     color: Colors.textSecondary,
    // },

    terms: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 17,
        gap: 10,
    },

    checkbox: {
        width: 23,
        height: 23,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
    },

    checkboxActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },

    termsText: {
        flex: 1,
        fontSize: 11,
        lineHeight: 17,
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

    googleButton: {
        height: 52,
        borderRadius: 12,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },

    googleG: {
        fontSize: 20,
        fontWeight: '800',
        color: '#4285F4',
    },

    googleText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },

    bottomText: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 22,
    },

    normalText: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
})