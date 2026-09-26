import { ThemedIcon } from '@/components/themed-icon'
import { Colors } from '@/constants/theme'
import { router } from 'expo-router'
import { useState } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"

export default function ForgotPinScreen() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleContinue = () => {
    if (!phone.trim()) {
      return
    }

    setLoading(true)

    // Replace with your API call later.
    setTimeout(() => {
      setLoading(false)

      router.push({
        pathname: '/reset-pin',
        params: {
          phone,
        },
      })
    }, 700)
  }

  return (
    <SafeAreaView  style={styles.safeArea}>
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === 'ios'
                ? 'padding'
                : undefined
            }
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <ThemedIcon
                            name="arrow-back"
                            size={22}
                            color={Colors.text}
                        />
                    </Pressable>

                    <Text style={styles.headerTitle}>
                        Forgot PIN
                    </Text>

                    <View style={styles.headerSpace} />
                </View>

                {/* Icon */}
                <View style={styles.hero}>
                    <View style={styles.iconContainer}>
                        <ThemedIcon
                            name="lock-closed-outline"
                            size={34}
                            color={Colors.primary}
                        />
                    </View>

                    <Text style={styles.title}>
                        Reset your PIN
                    </Text>

                    <Text style={styles.description}>
                        Enter the phone number linked to your
                        financhor account. We'll send you a
                        verification code to continue.
                    </Text>
                </View>

                {/* Security notice */}
                <View style={styles.securityCard}>
                    <View style={styles.securityIcon}>
                        <ThemedIcon
                            name="shield-checkmark-outline"
                            size={20}
                            color={Colors.primary}
                        />
                    </View>

                    <View style={styles.securityContent}>
                        <Text style={styles.securityTitle}>
                            Your account is protected
                        </Text>

                        <Text style={styles.securityText}>
                            For your security, you'll need to
                            verify your identity before creating
                            a new PIN.
                        </Text>
                    </View>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Text style={styles.label}>
                        Phone Number
                    </Text>

                    <View style={styles.inputContainer}>
                        <View style={styles.countryCode}>
                            <Text style={styles.countryText}>
                                +234
                            </Text>
                        </View>

                        <View style={styles.inputDivider} />

                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="801 234 5678"
                            placeholderTextColor={
                                Colors.textLight
                            }
                            keyboardType="phone-pad"
                            maxLength={10}
                            style={styles.input}
                        />
                    </View>

                    <Text style={styles.helper}>
                        Use the phone number registered with
                        your financhor account.
                    </Text>
                </View>

                {/* Continue */}
                <Pressable
                    onPress={handleContinue}
                    disabled={
                        !phone.trim() || loading
                    }
                    style={[
                        styles.button,
                        (!phone.trim() || loading) &&
                        styles.buttonDisabled,
                    ]}
                >
                    {loading ? (
                        <Text style={styles.buttonText}>
                            Verifying...
                        </Text>
                    ) : (
                        <>
                            <Text style={styles.buttonText}>
                                Continue
                            </Text>

                            <ThemedIcon
                                name="arrow-forward"
                                size={19}
                                color={Colors.white}
                            />
                        </>
                    )}
                </Pressable>

                {/* Back to login */}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>
                        Remember your PIN?
                    </Text>

                    <Pressable
                        onPress={() => router.replace('/login')}
                    >
                        <Text style={styles.loginLink}>
                            Back to Login
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 35,
    },

    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.text,
    },

    headerSpace: {
        width: 42,
    },

    hero: {
        alignItems: 'center',
        paddingTop: 28,
        paddingBottom: 25,
    },

    iconContainer: {
        width: 76,
        height: 76,
        borderRadius: 24,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },

    title: {
        fontSize: 27,
        fontWeight: '900',
        color: Colors.text,
        textAlign: 'center',
    },

    description: {
        fontSize: 12,
        lineHeight: 19,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 9,
        maxWidth: 340,
    },

    securityCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.primaryLight,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 14,
        marginBottom: 25,
    },

    securityIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
    },

    securityContent: {
        flex: 1,
    },

    securityTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 4,
    },

    securityText: {
        fontSize: 10,
        lineHeight: 16,
        color: Colors.textSecondary,
    },

    form: {
        marginBottom: 25,
    },

    label: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
    },

    inputContainer: {
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 13,
        paddingHorizontal: 13,
    },

    countryCode: {
        paddingRight: 10,
    },

    countryText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.text,
    },

    inputDivider: {
        width: 1,
        height: 24,
        backgroundColor: Colors.border,
        marginRight: 10,
    },

    input: {
        flex: 1,
        height: 52,
        fontSize: 14,
        color: Colors.text,
    },

    helper: {
        fontSize: 10,
        lineHeight: 15,
        color: Colors.textLight,
        marginTop: 7,
    },

    button: {
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
    },

    buttonDisabled: {
        backgroundColor: '#B7D8C4',
    },

    buttonText: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.white,
    },

    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        gap: 5,
    },

    loginText: {
        fontSize: 11,
        color: Colors.textSecondary,
    },

    loginLink: {
        fontSize: 11,
        fontWeight: '800',
        color: Colors.primary,
    },
})