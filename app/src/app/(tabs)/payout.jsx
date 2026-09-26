import { ThemedIcon } from '@/components/themed-icon';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const REQUESTS = [
    {
        id: 'withdraw',
        title: 'Cash Out',
        subtitle: 'Withdraw money from your available balance',
        icon: 'wallet-outline',
        button: 'Continue',
        fields: [
            {
                key: 'amount',
                label: 'Amount',
                placeholder: 'Enter amount',
                keyboardType: 'numeric',
                prefix: '₦',
            },
            {
                key: 'destination',
                label: 'Destination',
                placeholder: 'Bank account / wallet',
            },
            {
                key: 'reason',
                label: 'Reason',
                placeholder: 'What is this withdrawal for?',
                multiline: true,
            },
        ],
    },

    {
        id: 'loan',
        title: 'Request Loan',
        subtitle: 'Get emergency financial support',
        icon: 'cash-outline',
        button: 'Request Loan',
        fields: [
            {
                key: 'amount',
                label: 'Loan Amount',
                placeholder: 'How much do you need?',
                keyboardType: 'numeric',
                prefix: '₦',
            },
            {
                key: 'purpose',
                label: 'Purpose',
                placeholder: 'What will the loan be used for?',
                multiline: true,
            },
            {
                key: 'repayment',
                label: 'Preferred Repayment Period',
                placeholder: 'e.g. 3 months',
            },
        ],
    },

    {
        id: 'insurance',
        title: 'Insurance Claim',
        subtitle: 'Report a covered market loss',
        icon: 'shield-checkmark-outline',
        button: 'Submit Claim',
        fields: [
            {
                key: 'incident',
                label: 'Incident Type',
                placeholder: 'Fire, flood, theft, etc.',
            },
            {
                key: 'amount',
                label: 'Estimated Loss',
                placeholder: 'Enter estimated loss',
                keyboardType: 'numeric',
                prefix: '₦',
            },
            {
                key: 'description',
                label: 'Describe What Happened',
                placeholder: 'Tell us what happened...',
                multiline: true,
            },
        ],
    },

    {
        id: 'pension',
        title: 'Pension Request',
        subtitle: 'Request access to your pension fund',
        icon: 'people-outline',
        button: 'Submit Request',
        fields: [
            {
                key: 'amount',
                label: 'Requested Amount',
                placeholder: 'Enter amount',
                keyboardType: 'numeric',
                prefix: '₦',
            },
            {
                key: 'reason',
                label: 'Reason',
                placeholder: 'Why are you requesting this?',
                multiline: true,
            },
            {
                key: 'account',
                label: 'Receiving Account',
                placeholder: 'Bank account number',
                keyboardType: 'numeric',
            },
        ],
    },
]

export default function payoutScreen() {
    const [activeRequest, setActiveRequest] = useState(null)
    const [formData, setFormData] = useState({})

    const toggleRequest = id => {
        setActiveRequest(current =>
        current === id ? null : id
        )

        setFormData({})
    }

    const updateField = (key, value) => {
        setFormData(current => ({
            ...current,
            [key]: value,
        }))
    }

    const submitRequest = request => {
        console.log({
            request: request.id,
            data: formData,
        })

        // Connect your API here later.
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.safeArea}
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
                    >
                        <ThemedIcon
                            name="arrow-back"
                            size={24}
                            color={Colors.text}
                        />
                    </Pressable>
        
                    <Text style={styles.headerTitle}>
                        CASHOUT
                    </Text>
            
                    <View style={styles.headerSpace} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Available Balance */}
                    <View style={styles.balanceCard}>
                        <View>
                            <Text style={styles.balanceLabel}>
                                AVAILABLE TO YOU
                            </Text>

                            <Text style={styles.balance}>
                                ₦42,500.00
                            </Text>
                        </View>

                        <View style={styles.balanceIcon}>
                            <ThemedIcon
                            name="wallet"
                            size={25}
                            color={Colors.white}
                            />
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>
                        What do you need?
                    </Text>

                    {/* Accordion */}
                    {REQUESTS.map(request => {
                    const isOpen = activeRequest === request.id

                        return (
                            <RequestAccordion
                                key={request.id}
                                request={request}
                                open={isOpen}
                                formData={formData}
                                onPress={() =>
                                    toggleRequest(request.id)
                                }
                                onChange={updateField}
                                onSubmit={() =>
                                    submitRequest(request)
                                }
                            />
                        )
                    })}

                    <View style={styles.helpCard}>
                        <View style={styles.helpIcon}>
                            <ThemedIcon
                            name="information-circle-outline"
                            size={20}
                            color={Colors.primary}
                            />
                        </View>

                        <View style={styles.helpContent}>
                            <Text style={styles.helpTitle}>
                            Need help?
                            </Text>

                            <Text style={styles.helpText}>
                            Our support team can help you choose
                            the right option for your situation.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

/*
 * Reusable accordion
 */
function RequestAccordion({
  request,
  open,
  formData,
  onPress,
  onChange,
  onSubmit,
}) {
  return (
    <View
        style={[
            styles.accordion,
            open && styles.accordionOpen,
        ]}
    >
        <Pressable
            onPress={onPress}
            style={styles.accordionHeader}
        >
            <View style={styles.requestIcon}>
                <ThemedIcon
                    name={request.icon}
                    size={22}
                    color={
                    open
                        ? Colors.white
                        : Colors.primary
                    }
                />
            </View>

            <View style={styles.requestInfo}>
                <Text style={styles.requestTitle}>
                    {request.title}
                </Text>

                <Text style={styles.requestSubtitle}>
                    {request.subtitle}
                </Text>
            </View>

            <View style={styles.chevron}>
                <ThemedIcon
                    name={
                    open
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={19}
                    color={Colors.textSecondary}
                />
            </View>
        </Pressable>

        {open && (
            <View style={styles.form}>
                <View style={styles.divider} />

                {request.fields.map(field => (
                    <FormField
                    key={field.key}
                    field={field}
                    value={formData[field.key] || ''}
                    onChange={value =>
                        onChange(field.key, value)
                    }
                    />
                ))}

                <Pressable
                    onPress={onSubmit}
                    style={styles.submitButton}
                >
                    <Text style={styles.submitText}>
                        {request.button}
                    </Text>

                    <ThemedIcon
                        name="arrow-forward"
                        size={18}
                        color={Colors.white}
                    />
                </Pressable>
            </View>
        )}
    </View>
  )
}

/*
 * Reusable form field
 */
function FormField({
  field,
  value,
  onChange,
}) {
  return (
    <View style={styles.field}>
        <Text style={styles.fieldLabel}>
            {field.label}
        </Text>

        <View
            style={[
                styles.inputContainer,
                field.multiline && styles.multilineContainer,
            ]}
        >
            {field.prefix && (
                <Text style={styles.prefix}>
                    {field.prefix}
                </Text>
            )}

            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={field.placeholder}
                placeholderTextColor={
                    Colors.textLight
                }
                keyboardType={
                    field.keyboardType || 'default'
                }
                multiline={field.multiline}
                numberOfLines={
                    field.multiline ? 4 : 1
                }
                textAlignVertical={
                    field.multiline
                    ? 'top'
                    : 'center'
                }
                style={[
                    styles.input,
                    field.multiline &&
                    styles.multilineInput,
                ]}
            />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    container: {
        paddingHorizontal: 20,
        paddingBottom: 35,
    },

    header: {
        height: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
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
        fontSize: 25,
        fontWeight: '800',
        color: Colors.text,
    },

    subtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 4,
    },

    headerIcon: {
        width: 48,
        height: 48,
        borderRadius: 15,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    balanceCard: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
    },

    balanceLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#D5F2E1',
        letterSpacing: 0.5,
    },

    balance: {
        fontSize: 28,
        fontWeight: '900',
        color: Colors.white,
        marginTop: 5,
    },

    balanceIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor:
        'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 11,
    },

    accordion: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },

    accordionOpen: {
        borderColor: Colors.primary,
    },

    accordionHeader: {
        minHeight: 76,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
    },

    requestIcon: {
        width: 45,
        height: 45,
        borderRadius: 14,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    requestInfo: {
        flex: 1,
        marginLeft: 12,
    },

    requestTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.text,
    },

    requestSubtitle: {
        fontSize: 10,
        lineHeight: 15,
        color: Colors.textSecondary,
        marginTop: 3,
    },

    chevron: {
        marginLeft: 8,
    },

    form: {
        paddingHorizontal: 14,
        paddingBottom: 16,
    },

    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginBottom: 16,
    },

    field: {
        marginBottom: 14,
    },

    fieldLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 7,
    },

    inputContainer: {
        minHeight: 48,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 13,
    },

    multilineContainer: {
        minHeight: 95,
        alignItems: 'flex-start',
    },

    prefix: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary,
        marginRight: 5,
    },

    input: {
        flex: 1,
        minHeight: 46,
        color: Colors.text,
        fontSize: 13,
    },

    multilineInput: {
        paddingTop: 12,
        paddingBottom: 12,
    },

    submitButton: {
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        marginTop: 5,
    },

    submitText: {
        color: Colors.white,
        fontSize: 13,
        fontWeight: '800',
    },

    helpCard: {
        marginTop: 15,
        padding: 14,
        borderRadius: 15,
        backgroundColor: Colors.primaryLight,
        flexDirection: 'row',
        gap: 11,
    },

    helpIcon: {
        width: 38,
        height: 38,
        borderRadius: 11,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },

    helpContent: {
        flex: 1,
    },

    helpTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: Colors.text,
    },

    helpText: {
        fontSize: 10,
        lineHeight: 15,
        color: Colors.textSecondary,
        marginTop: 3,
    },
})