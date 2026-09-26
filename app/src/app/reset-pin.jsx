import { ThemedIcon } from '@/components/themed-icon'
import { Colors } from '@/constants/theme'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const PIN_LENGTH = 4

export default function ResetPinScreen() {
    const params = useLocalSearchParams()
    const phone = params.phone || ''

    const [pin, setPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')
    const [activeField, setActiveField] = useState('pin')
    const [showPin, setShowPin] = useState(false)
    const [showConfirmPin, setShowConfirmPin] = useState(false)
    const [loading, setLoading] = useState(false)

    const isPinComplete = pin.length === PIN_LENGTH
    const isConfirmComplete = confirmPin.length === PIN_LENGTH

    const pinsMatch =
        isPinComplete &&
        isConfirmComplete &&
        pin === confirmPin

    const canContinue = pinsMatch && !loading

    const pinError = useMemo(() => {
        if (
            confirmPin.length === PIN_LENGTH &&
            pin !== confirmPin
        ) {
            return 'PINs do not match'
        }

        return null
    }, [pin, confirmPin])

    const addDigit = (digit) => {
        if (activeField === 'pin') {
            if (pin.length < PIN_LENGTH) {
                setPin((value) => value + digit)
            }
        } else {
            if (confirmPin.length < PIN_LENGTH) {
                setConfirmPin((value) => value + digit)
            }
        }
    }

    const removeDigit = () => {
        if (activeField === 'pin') {
            setPin((value) => value.slice(0, -1))
        } else {
            setConfirmPin((value) => value.slice(0, -1))
        }
    }

    const handleContinue = async () => {
        if (!canContinue) return

        setLoading(true)

        try {
            /*
            * Replace this with your API request.
            *
            * Example:
            *
            * await api.post('/auth/reset-pin', {
            *   phone,
            *   pin,
            * })
            */

            await new Promise((resolve) =>
                setTimeout(resolve, 800)
            )

            router.replace('/pin-reset-success')
        } finally {
            setLoading(false)
        }
    }

    const renderPinDots = (value, field) => {
        return (
            <Pressable
                onPress={() => setActiveField(field)}
                style={[
                    styles.pinBox,
                    activeField === field &&
                        styles.pinBoxActive,
                    field === 'confirm' &&
                        pinError &&
                        styles.pinBoxError,
                ]}
            >
                <View style={styles.pinDots}>
                    {Array.from({
                        length: PIN_LENGTH,
                    }).map((_, index) => {
                        const filled = index < value.length

                        return (
                            <View
                                key={index}
                                style={[
                                styles.pinDot,
                                filled && styles.pinDotFilled,
                                activeField === field &&
                                    index === value.length &&
                                    styles.pinDotCurrent,
                                ]}
                            >
                                {filled &&
                                    ((field === 'pin'
                                        ? showPin
                                        : showConfirmPin) ? (
                                        <Text style={styles.pinDigit}>
                                        {value[index]}
                                        </Text>
                                    ) : null)}
                            </View>
                        )
                    })}
                </View>

                <ThemedIcon
                    name={
                        (field === 'pin'
                        ? showPin
                        : showConfirmPin)
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={19}
                    color={Colors.textSecondary}
                    onPress={() => {
                        if (field === 'pin') {
                            setShowPin((value) => !value)
                        } else {
                            setShowConfirmPin((value) => !value)
                        }
                    }}
                />
            </Pressable>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={
                    Platform.OS === 'ios'
                    ? 'padding'
                    : undefined
                }
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
                        Reset PIN
                    </Text>

                    <View style={styles.headerSpace} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Hero */}
                    <View style={styles.hero}>
                        <View style={styles.iconContainer}>
                            <ThemedIcon
                                name="key-outline"
                                size={34}
                                color={Colors.primary}
                            />
                        </View>

                        <Text style={styles.title}>
                            Create a new PIN
                        </Text>

                        <Text style={styles.description}>
                            Choose a new 4-digit PIN for your
                            financhor account. Make sure it is
                            something you can remember.
                        </Text>

                        {!!phone && (
                            <View style={styles.accountBadge}>
                                <ThemedIcon
                                    name="phone-portrait-outline"
                                    size={14}
                                    color={Colors.primary}
                                />

                                <Text style={styles.accountText}>
                                    {phone}
                                </Text>
                            </View>
                        )}
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
                                Keep your PIN private
                            </Text>

                            <Text style={styles.securityText}>
                                Never share your PIN with anyone,
                                including someone claiming to be
                                from financhor.
                            </Text>
                        </View>
                    </View>

                    {/* PIN */}
                    <View style={styles.form}>
                        <Text style={styles.label}>
                            New PIN
                        </Text>

                        {renderPinDots(pin, 'pin')}

                        <Text style={styles.helper}>
                            Enter a 4-digit PIN.
                        </Text>

                        {/* Confirm PIN */}
                        <Text
                            style={[
                            styles.label,
                            styles.confirmLabel,
                            ]}
                        >
                            Confirm New PIN
                        </Text>

                        {renderPinDots(
                            confirmPin,
                            'confirm'
                        )}

                        {pinError ? (
                            <View style={styles.errorRow}>
                                <ThemedIcon
                                    name="alert-circle-outline"
                                    size={14}
                                    color={Colors.danger}
                                />

                                <Text style={styles.errorText}>
                                    {pinError}
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.helper}>
                                Enter the same PIN again.
                            </Text>
                        )}
                    </View>

                    {/* Number pad */}
                    <View style={styles.keypad}>
                        {[
                            '1',
                            '2',
                            '3',
                            '4',
                            '5',
                            '6',
                            '7',
                            '8',
                            '9',
                            '#',
                            '0',
                            'delete',
                        ].map((key, index) => {
                            if (key === '') {
                                return (
                                    <View
                                        key={index}
                                        style={styles.keyEmpty}
                                    />
                                )
                            }

                            if (key === 'delete') {
                                return (
                                    <Pressable
                                        key={index}
                                        onPress={removeDigit}
                                        style={styles.key}
                                    >
                                        <ThemedIcon
                                            name="backspace-outline"
                                            size={23}
                                            color={Colors.text}
                                        />
                                    </Pressable>
                                )
                            }

                            return (
                                <Pressable
                                    key={index}
                                    onPress={() => addDigit(key)}
                                    style={({ pressed }) => [
                                        styles.key,
                                        pressed && styles.keyPressed,
                                    ]}
                                >
                                    <Text style={styles.keyText}>
                                        {key}
                                    </Text>
                                </Pressable>
                            )
                        })}
                    </View>

                    {/* Continue */}
                    <Pressable
                        onPress={handleContinue}
                        disabled={!canContinue}
                        style={[
                            styles.button,
                            !canContinue &&
                            styles.buttonDisabled,
                        ]}
                    >
                        {loading ? (
                            <Text style={styles.buttonText}>
                                Updating PIN...
                            </Text>
                        ) : (
                            <>
                                <Text style={styles.buttonText}>
                                    Reset PIN
                                </Text>

                                <ThemedIcon
                                    name="arrow-forward"
                                    size={19}
                                    color={Colors.white}
                                />
                            </>
                        )}
                    </Pressable>
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
        paddingTop: 20,
        paddingBottom: 20,
    },

    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 23,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },

    title: {
        fontSize: 26,
        fontWeight: '900',
        color: Colors.text,
        textAlign: 'center',
    },

    description: {
        fontSize: 12,
        lineHeight: 19,
        color: Colors.textSecondary,
        textAlign: 'center',
        maxWidth: 340,
        marginTop: 8,
    },

    accountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.primaryLight,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginTop: 12,
    },

    accountText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.primaryDark,
    },

    securityCard: {
        flexDirection: 'row',
        backgroundColor: Colors.primaryLight,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 15,
        padding: 13,
        marginBottom: 22,
    },

    securityIcon: {
        width: 37,
        height: 37,
        borderRadius: 11,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    securityContent: {
        flex: 1,
    },

    securityTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 3,
    },

    securityText: {
        fontSize: 10,
        lineHeight: 16,
        color: Colors.textSecondary,
    },

    form: {
        marginBottom: 18,
    },

    label: {
        fontSize: 12,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 8,
    },

    confirmLabel: {
        marginTop: 18,
    },

    pinBox: {
        height: 58,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        borderRadius: 14,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    pinBoxActive: {
        borderColor: Colors.primary,
        borderWidth: 1.5,
    },

    pinBoxError: {
        borderColor: Colors.danger,
    },

    pinDots: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },

    pinDot: {
        width: 15,
        height: 15,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: Colors.border,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },

    pinDotFilled: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },

    pinDotCurrent: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },

    pinDigit: {
        color: Colors.white,
        fontSize: 8,
        fontWeight: '800',
    },

    helper: {
        fontSize: 10,
        color: Colors.textLight,
        marginTop: 6,
    },

    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 7,
        gap: 5,
    },

    errorText: {
        fontSize: 10,
        color: Colors.danger,
        fontWeight: '600',
    },

    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },

    key: {
        width: '30%',
        height: 48,
        borderRadius: 13,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },

    keyPressed: {
        backgroundColor: Colors.primaryLight,
        borderColor: Colors.primary,
    },

    keyEmpty: {
        width: '30%',
        height: 48,
    },

    keyText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
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
})