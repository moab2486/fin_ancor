import { AppLogo } from '@/components/app-logo'
import { ThemedIcon } from '@/components/themed-icon'
import { Colors } from '@/constants/theme'
import { verifyOtp } from '@/https/auth'
import { router, useLocalSearchParams } from 'expo-router'
import {
    useEffect,
    useRef,
    useState
} from 'react'
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function VerifyScreen() {
    const { challengeId, phone } = useLocalSearchParams()
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [seconds, setSeconds] = useState(45)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const inputs = useRef([])

    useEffect(() => {
        if (seconds <= 0) return

        const timer = setInterval(() => {
        setSeconds(value => value - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [seconds])

    const handleChange = (value, index) => {
        // Only allow numbers
        const number = value.replace(/[^0-9]/g, '')

        const newOtp = [...otp]
        newOtp[index] = number

        setOtp(newOtp)

        // Move to next input
        if (number && index < 5) {
        inputs.current[index + 1]?.focus()
        }

        // Automatically verify when all digits are entered
        if (
        index === 5 &&
        number &&
        newOtp.every(digit => digit !== '')
        ) {
        handleVerify(newOtp.join(''))
        }
    }

    const handleKeyPress = (event, index) => {
        if (
        event.nativeEvent.key === 'Backspace' &&
        !otp[index] &&
        index > 0
        ) {
        inputs.current[index - 1]?.focus()
        }
    }

    const handleVerify = async code => {
        if (!challengeId || loading) return

        setLoading(true)
        setError('')
        try {
            await verifyOtp({ challengeId, code })
            router.replace('/dashboard')
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setLoading(false)
        }
    }

    const resendOtp = () => {
        if (seconds > 0) return

        setSeconds(45)

        setOtp(['', '', '', '', '', ''])

        inputs.current[0]?.focus()

        setError('Please request a new code from the previous screen.')
    }

    const maskedPhone = '0803 ••• ••67'

    const isComplete = otp.every(digit => digit !== '')

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.container}>

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
                            OTP
                        </Text>
        
                        <View style={styles.headerSpace} />
                    </View>

                    {/* Logo */}

                    <AppLogo />

                    {/* Verification Icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <ThemedIcon
                            name="shield-checkmark"
                            size={34}
                            color={Colors.primary}
                            />
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>
                        Verify your phone number
                    </Text>

                    <Text style={styles.subtitle}>
                        We&apos;ve sent a 6-digit verification code to
                    </Text>

                    <View style={styles.phoneContainer}>
                        <ThemedIcon
                            name="call-outline"
                            size={17}
                            color={Colors.primary}
                        />

                        <Text style={styles.phone}>
                            {phone || maskedPhone}
                        </Text>

                        <Pressable onPress={() => router.back()}>
                            <Text style={styles.change}>
                                Change
                            </Text>
                        </Pressable>
                    </View>

                    {/* OTP Inputs */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={ref => {
                                    inputs.current[index] = ref
                                }}
                                value={digit}
                                onChangeText={value =>
                                    handleChange(value, index)
                                }
                                onKeyPress={event =>
                                    handleKeyPress(event, index)
                                }
                                keyboardType="number-pad"
                                maxLength={1}
                                textContentType="oneTimeCode"
                                autoComplete="sms-otp"
                                style={[
                                    styles.otpInput,
                                    digit && styles.otpInputActive,
                                ]}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Timer */}
                    <View style={styles.resendContainer}>
                        {seconds > 0 ? (
                            <Text style={styles.timerText}>
                                Didn&apos;t receive the code? Resend in{' '}
                                <Text style={styles.timer}>
                                    {seconds}s
                                </Text>
                            </Text>
                        ) : (
                            <Pressable onPress={resendOtp}>
                                <Text style={styles.resend}>
                                    Didn&apos;t receive the code? Resend OTP
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    {/* Verify Button */}
                    <Pressable
                        disabled={!isComplete || loading}
                        onPress={() =>
                            handleVerify(otp.join(''))
                        }
                        style={[
                            styles.verifyButton,
                            (!isComplete || loading) && styles.verifyButtonDisabled,
                        ]}
                    >
                        <Text style={styles.verifyButtonText}>
                            {loading ? 'Verifying...' : 'Verify & Continue'}
                        </Text>

                        <View style={styles.buttonIcon}>
                            <ThemedIcon
                                name="arrow-forward"
                                size={20}
                                color={Colors.primary}
                            />
                        </View>
                    </Pressable>

                    {!!error && <Text style={styles.errorText}>{error}</Text>}

                    {/* Security */}
                    <View style={styles.securityCard}>
                        <View style={styles.securityIcon}>
                            <ThemedIcon
                                name="lock-closed"
                                size={20}
                                color={Colors.primary}
                            />
                        </View>

                        <View style={styles.securityContent}>
                            <Text style={styles.securityTitle}>
                                Your account is protected
                            </Text>

                            <Text style={styles.securityText}>
                                Never share your verification code with
                                anyone, including FinAnchor staff.
                            </Text>
                        </View>
                    </View>

                    {/* Help */}
                    <View style={styles.helpContainer}>
                        <Text style={styles.helpText}>
                            Having trouble?
                        </Text>

                        <Pressable>
                            <Text style={styles.helpLink}>
                            Contact Support
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
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
        paddingHorizontal: 22,
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

    iconContainer: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 18,
    },

    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#D3F0DF',
    },

    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 13,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
    },

    phoneContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 6,
    },

    phone: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
    },

    change: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '700',
        marginLeft: 4,
    },

    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 35,
        marginBottom: 18,
    },

    otpInput: {
        width: 47,
        height: 56,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.white,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 21,
        fontWeight: '800',
        color: Colors.text,
    },

    otpInputActive: {
        borderColor: Colors.primary,
        backgroundColor: '#F5FCF8',
    },

    resendContainer: {
        alignItems: 'center',
        minHeight: 25,
    },

    timerText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },

    timer: {
        color: Colors.primary,
        fontWeight: '800',
    },

    resend: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '700',
    },

    verifyButton: {
        height: 54,
        borderRadius: 27,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 22,
        position: 'relative',
    },

    verifyButtonDisabled: {
        backgroundColor: '#B7D8C4',
    },

    verifyButtonText: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '800',
    },

    buttonIcon: {
        position: 'absolute',
        right: 7,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },

    securityCard: {
        flexDirection: 'row',
        backgroundColor: Colors.primaryLight,
        borderRadius: 14,
        padding: 14,
        marginTop: 22,
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

    securityContent: {
        flex: 1,
    },

    securityTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 3,
    },

    securityText: {
        fontSize: 10,
        lineHeight: 15,
        color: Colors.textSecondary,
    },

    helpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 20,
        gap: 4,
    },

    helpText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },

    helpLink: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '700',
    },

    errorText: {
        color: '#B42318',
        fontSize: 12,
        marginTop: 12,
        textAlign: 'center',
    },
})