import { LanguageSelector } from '@/components/language-selector'
import { ThemedIcon } from '@/components/themed-icon'
import { Colors } from '@/constants/theme'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const FormField = ({
    label,
    value,
    placeholder,
    onChangeText,
    editable = true,
    keyboardType = 'default',
    secureTextEntry = false,
    rightElement,
    optional = false,
}) => {
    return (
        <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{label}</Text>

                {optional && (
                    <Text style={styles.optionalText}>Optional</Text>
                )}
            </View>

            <View
                style={[
                    styles.inputWrapper,
                    !editable && styles.disabledInput,
                ]}
            >
                <TextInput
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textLight}
                    onChangeText={onChangeText}
                    editable={editable}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    style={styles.input}
                />

                {rightElement}
            </View>
        </View>
    )
}

const Section = ({
    title,
    description,
    children,
}) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>

            {description && (
                <Text style={styles.sectionDescription}>
                    {description}
                </Text>
            )}

            <View style={styles.sectionCard}>
                {children}
            </View>
        </View>
    )
}

const VerifiedBadge = () => (
    <View style={styles.verifiedBadge}>
        <ThemedIcon
            name="checkmark-circle"
            size={16}
            color={Colors.success}
        />

        <Text style={styles.verifiedText}>Verified</Text>
    </View>
)

const VerificationRow = ({
  type,
  value,
  onChange,
  verified,
  loading,
  onVerify,
}) => {
    const maskedValue = useMemo(() => {
        if (!value) return ''

        if (value.length <= 4) {
        return '•'.repeat(value.length)
        }

        return `${'•'.repeat(value.length - 4)}${value.slice(-4)}`
    }, [value])

    return (
        <View style={styles.verificationContainer}>
            <View style={styles.verificationHeader}>
                <View>
                    <Text style={styles.verificationTitle}>
                        {type}
                    </Text>

                    <Text style={styles.verificationDescription}>
                        {verified
                        ? `${type} has been successfully verified`
                        : `Verify your ${type} to continue`}
                    </Text>
                </View>

                {verified && <VerifiedBadge />}
            </View>

            <FormField
                label={`${type} Number`}
                value={verified ? maskedValue : value}
                placeholder={`Enter ${type}`}
                onChangeText={onChange}
                editable={!verified}
                keyboardType="numeric"
                rightElement={
                    verified ? (
                        <ThemedIcon
                            name="lock-closed"
                            size={18}
                            color={Colors.textLight}
                        />
                    ) : undefined
                }
            />

            {!verified && (
                <Pressable
                    style={({ pressed }) => [
                        styles.verifyButton,
                        pressed && styles.pressed,
                        loading && styles.disabledButton,
                    ]}
                    onPress={onVerify}
                    disabled={loading}
                >
                    <Text style={styles.verifyButtonText}>
                        {loading ? 'Verifying...' : `Verify ${type}`}
                    </Text>
                </Pressable>
            )}

            {verified && (
                <View style={styles.lockedNotice}>
                    <ThemedIcon
                        name="shield-checkmark-outline"
                        size={18}
                        color={Colors.success}
                    />

                    <Text style={styles.lockedNoticeText}>
                        This information is verified and cannot be changed.
                    </Text>
                </View>
            )}
        </View>
    )
}

export default function ProfileScreen() {
    const [profileImage, setProfileImage] = useState(null)

    const [phone] = useState('+234 801 234 5678')
    const [email] = useState('user@example.com')

    const [bvn, setBvn] = useState('')
    const [nin, setNin] = useState('')

    const [bvnVerified, setBvnVerified] = useState(false)
    const [ninVerified, setNinVerified] = useState(false)

    const [verifying, setVerifying] = useState(null)

    const [accountType, setAccountType] = useState('Savings')
    const [bank, setBank] = useState('')
    const [accountNumber, setAccountNumber] = useState('')

    const [posTerminals, setPosTerminals] = useState([
        {
            id: Date.now().toString(),
            value: '',
        },
    ])

    const [saving, setSaving] = useState(false)

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!permission.granted) {
            Alert.alert(
                'Permission required',
                'Please allow access to your photos to change your profile image.'
            )

            return
        }

        const result =  await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ['images'],
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.8,
                        })

        if (!result.canceled) {
        setProfileImage(result.assets[0].uri)
    }
}

const verifyIdentity = async () => {
    const value = type === 'BVN' ? bvn : nin

    if (!value.trim()) {
        Alert.alert(
            `${type} required`,
            `Please enter your ${type} before verifying.`
        )

        return
    }

    setVerifying(type)

    try {
        await new Promise(resolve =>
            setTimeout(resolve, 1200)
        )

        if (type === 'BVN') {
            setBvnVerified(true)
        } else {
            setNinVerified(true)
        }

        Alert.alert(
            'Verification successful',
            `Your ${type} has been verified successfully.`
        )
    } catch {
        Alert.alert(
            'Verification failed',
            `We could not verify your ${type}. Please try again.`
        )
    } finally {
      setVerifying(null)
    }
}

const addPosTerminal = () => {
    setPosTerminals(current => [
        ...current,
        {
            id: `${Date.now()}-${Math.random()}`,
            value: '',
        },
    ])
}

const removePosTerminal = () => {
    setPosTerminals(current =>
        current.filter(terminal => terminal.id !== id)
    )
}

const updatePosTerminal = () => {
    setPosTerminals(current =>
        current.map(terminal =>
        terminal.id === id
            ? { ...terminal, value }
            : terminal
        )
    )
}

const saveProfile = async () => {
    setSaving(true)

    try {
        /*
        * Replace with your API request.
        *
        * const payload = {
        *   accountType,
        *   bank,
        *   accountNumber,
        *   posTerminals: posTerminals
        *     .map(item => item.value)
        *     .filter(Boolean),
        * }
        */

        await new Promise(resolve =>
            setTimeout(resolve, 800)
        )

        Alert.alert(
            'Profile updated',
            'Your profile information has been saved.'
        )
    } catch {
        Alert.alert(
            'Error',
            'Unable to save your profile. Please try again.'
        )
    } finally {
        setSaving(false)
    }
}

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    style={styles.headerButton}
                >
                <ThemedIcon
                    name="arrow-back"
                    size={23}
                    color={Colors.text}
                />
                </Pressable>

                <Text style={styles.headerTitle}>My Profile</Text>

                <LanguageSelector />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* PROFILE */}
                <View style={styles.profileCard}>
                    <Pressable
                        onPress={pickImage}
                        style={styles.avatarContainer}
                    >
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <ThemedIcon
                                name="person"
                                size={42}
                                color={Colors.primary}
                                />
                            </View>
                        )}

                        <View style={styles.cameraButton}>
                        <ThemedIcon
                            name="camera"
                            size={16}
                            color={Colors.white}
                        />
                        </View>
                    </Pressable>

                    <Text style={styles.profileName}>
                        Your Profile
                    </Text>

                    <Text style={styles.profileSubtitle}>
                        Keep your personal information up to date
                    </Text>
                </View>

                <Section
                    title="Personal Information"
                    description="Some information is managed securely and cannot be edited."
                >
                <FormField
                    label="Phone Number"
                    value={phone}
                    editable={false}
                    rightElement={
                    <ThemedIcon
                        name="lock-closed"
                        size={17}
                        color={Colors.textLight}
                    />
                    }
                />

                <FormField
                    label="Email Address"
                    value={email}
                    editable={false}
                    keyboardType="email-address"
                    rightElement={
                    <ThemedIcon
                        name="lock-closed"
                        size={17}
                        color={Colors.textLight}
                    />
                    }
                />
                </Section>

                {/* IDENTITY */}
                <Section
                title="Identity Verification"
                description="Verify your BVN and NIN to access financial services."
                >
                <VerificationRow
                    type="BVN"
                    value={bvn}
                    onChange={setBvn}
                    verified={bvnVerified}
                    loading={verifying === 'BVN'}
                    onVerify={() => verifyIdentity('BVN')}
                />

                <View style={styles.divider} />

                <VerificationRow
                    type="NIN"
                    value={nin}
                    onChange={setNin}
                    verified={ninVerified}
                    loading={verifying === 'NIN'}
                    onVerify={() => verifyIdentity('NIN')}
                />
                </Section>

                {/* BANK */}
                <Section
                title="Bank Details"
                description="Add your bank and payment collection details."
                >
                <Text style={styles.label}>Account Type</Text>

                <View style={styles.optionRow}>
                    {['Savings', 'Current'].map(type => {
                    const selected = accountType === type

                    return (
                        <Pressable
                        key={type}
                        onPress={() => setAccountType(type)}
                        style={[
                            styles.option,
                            selected && styles.selectedOption,
                        ]}
                        >
                        <ThemedIcon
                            name={
                            selected
                                ? 'radio-button-on'
                                : 'radio-button-off'
                            }
                            size={20}
                            color={
                            selected
                                ? Colors.primary
                                : Colors.textLight
                            }
                        />

                        <Text
                            style={[
                            styles.optionText,
                            selected &&
                                styles.selectedOptionText,
                            ]}
                        >
                            {type}
                        </Text>
                        </Pressable>
                    )
                    })}
                </View>

                <Text style={styles.label}>Bank</Text>

                <View style={styles.bankOptions}>
                    {['OPay', 'Moniepoint'].map(bankName => {
                    const selected = bank === bankName

                    return (
                        <Pressable
                        key={bankName}
                        onPress={() => setBank(bankName)}
                        style={[
                            styles.bankOption,
                            selected && styles.selectedBank,
                        ]}
                        >
                        <View
                            style={[
                            styles.bankIcon,
                            selected &&
                                styles.selectedBankIcon,
                            ]}
                        >
                            <ThemedIcon
                            name="business-outline"
                            size={21}
                            color={
                                selected
                                ? Colors.primary
                                : Colors.textSecondary
                            }
                            />
                        </View>

                        <Text
                            style={[
                            styles.bankText,
                            selected &&
                                styles.selectedBankText,
                            ]}
                        >
                            {bankName}
                        </Text>

                        {selected && (
                            <ThemedIcon
                            name="checkmark-circle"
                            size={20}
                            color={Colors.primary}
                            style={styles.bankCheck}
                            />
                        )}
                        </Pressable>
                    )
                    })}
                </View>

                <FormField
                    label="Account Number"
                    value={accountNumber}
                    placeholder="Enter account number"
                    onChangeText={setAccountNumber}
                    keyboardType="numeric"
                />

                <View style={styles.posHeader}>
                    <View>
                    <Text style={styles.label}>
                        POS Terminal ID
                    </Text>

                    <Text style={styles.posDescription}>
                        Add terminal IDs used for your transactions.
                    </Text>
                    </View>

                    <View style={styles.optionalBadge}>
                    <Text style={styles.optionalBadgeText}>
                        Optional
                    </Text>
                    </View>
                </View>

                {posTerminals.map((terminal, index) => (
                    <View
                    key={terminal.id}
                    style={styles.posRow}
                    >
                    <View style={styles.posInput}>
                        <TextInput
                        value={terminal.value}
                        placeholder={`POS Terminal ID ${index + 1}`}
                        placeholderTextColor={
                            Colors.textLight
                        }
                        onChangeText={value =>
                            updatePosTerminal(
                            terminal.id,
                            value
                            )
                        }
                        style={styles.input}
                        autoCapitalize="characters"
                        />
                    </View>

                    {posTerminals.length > 1 && (
                        <Pressable
                        onPress={() =>
                            removePosTerminal(terminal.id)
                        }
                        style={styles.removeButton}
                        >
                        <ThemedIcon
                            name="trash-outline"
                            size={19}
                            color={Colors.danger}
                        />
                        </Pressable>
                    )}
                    </View>
                ))}

                <Pressable
                    onPress={addPosTerminal}
                    style={styles.addTerminalButton}
                >
                    <ThemedIcon
                    name="add-circle-outline"
                    size={20}
                    color={Colors.primary}
                    />

                    <Text style={styles.addTerminalText}>
                    Add another POS terminal
                    </Text>
                </Pressable>
                </Section>

                <Pressable
                onPress={saveProfile}
                disabled={saving}
                style={({ pressed }) => [
                    styles.saveButton,
                    pressed && styles.pressed,
                    saving && styles.disabledButton,
                ]}
                >
                <Text style={styles.saveButtonText}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Text>
                </Pressable>

                <View style={styles.bottomSpace} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },

    headerButton: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },

    content: {
        padding: 16,
    },

    profileCard: {
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 8,
    },

    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },

    avatar: {
        width: 104,
        height: 104,
        borderRadius: 52,
    },

    avatarPlaceholder: {
        width: 104,
        height: 104,
        borderRadius: 52,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryLight,
        borderWidth: 2,
        borderColor: Colors.primary,
    },

    cameraButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderWidth: 3,
        borderColor: Colors.surface,
    },

    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
    },

    profileSubtitle: {
        marginTop: 4,
        fontSize: 13,
        color: Colors.textSecondary,
    },

    section: {
        marginTop: 20,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.text,
    },

    sectionDescription: {
        marginTop: 4,
        marginBottom: 10,
        fontSize: 13,
        lineHeight: 19,
        color: Colors.textSecondary,
    },

    sectionCard: {
        backgroundColor: Colors.surface,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },

    fieldContainer: {
        marginBottom: 16,
    },

    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 7,
    },

    label: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text,
    },

    optionalText: {
        fontSize: 12,
        color: Colors.textLight,
    },

    inputWrapper: {
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        backgroundColor: Colors.surface,
        paddingHorizontal: 13,
    },

    disabledInput: {
        backgroundColor: Colors.background,
    },

    input: {
        flex: 1,
        minHeight: 48,
        fontSize: 14,
        color: Colors.text,
    },

    verificationContainer: {
        paddingVertical: 3,
    },

    verificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },

    verificationTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.text,
    },

    verificationDescription: {
        marginTop: 3,
        maxWidth: 220,
        fontSize: 12,
        lineHeight: 17,
        color: Colors.textSecondary,
    },

    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
        backgroundColor: Colors.primaryLight,
    },

    verifiedText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.success,
    },

    verifyButton: {
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
        backgroundColor: Colors.primaryLight,
        borderWidth: 1,
        borderColor: Colors.primary,
    },

    verifyButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.primary,
    },

    lockedNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 11,
        borderRadius: 9,
        backgroundColor: Colors.primaryLight,
    },

    lockedNoticeText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 17,
        color: Colors.primaryDark,
    },

    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 20,
    },

    optionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 9,
        marginBottom: 18,
    },

    option: {
        flex: 1,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },

    selectedOption: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },

    optionText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textSecondary,
    },

    selectedOptionText: {
        color: Colors.primary,
    },

    bankOptions: {
        gap: 10,
        marginTop: 9,
        marginBottom: 18,
    },

    bankOption: {
        minHeight: 62,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },

    selectedBank: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },

    bankIcon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: Colors.background,
    },

    selectedBankIcon: {
        backgroundColor: Colors.surface,
    },

    bankText: {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },

    selectedBankText: {
        color: Colors.primaryDark,
    },

    bankCheck: {
        marginLeft: 'auto',
    },

    posHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    posDescription: {
        marginTop: 3,
        fontSize: 12,
        color: Colors.textSecondary,
    },

    optionalBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: Colors.background,
    },

    optionalBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textSecondary,
    },

    posRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 9,
    },

    posInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 13,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },

    removeButton: {
        width: 46,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
        backgroundColor: '#FEF3F2',
    },

    addTerminalButton: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        marginTop: 4,
        borderRadius: 9,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },

    addTerminalText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.primary,
    },

    saveButton: {
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        borderRadius: 11,
        backgroundColor: Colors.primary,
    },

    saveButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.white,
    },

    disabledButton: {
        opacity: 0.6,
    },

    pressed: {
        opacity: 0.75,
    },

    bottomSpace: {
        height: 30,
    },
})