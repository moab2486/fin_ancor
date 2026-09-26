import { ThemedIcon } from "@/components/themed-icon";
import { Colors } from "@/constants/theme";
import { router } from 'expo-router';
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const paymentMethods = [
    {
        id: 'pos',
        title: 'OPay / Moniepoint POS',
        subtitle: 'Instant payment from your POS sales',
        icon: 'storefront-outline',
    },
    // {
    //     id: 'bank',
    //     title: 'Bank Transfer',
    //     subtitle: 'Transfer directly from your bank',
    //     icon: 'business-outline',
    // },
    {
        id: 'card',
        title: 'Card Payment',
        subtitle: 'Debit or credit card',
        icon: 'card-outline',
    },
    // {
    //     id: 'ussd',
    //     title: 'USSD',
    //     subtitle: '*123# quick payment',
    //     icon: 'phone-portrait-outline',
    // },
]

const frequencies = [
    {
        id: 'transaction',
        title: 'Transaction',
        subtitle: 'Save daily on every transaction',
    },
    {
        id: 'daily',
        title: 'Daily',
        subtitle: 'Save every day',
    },
    {
        id: 'weekly',
        title: 'Weekly',
        subtitle: 'Save once a week',
    },
    {
        id: 'monthly',
        title: 'Monthly',
        subtitle: 'Save once a month',
    },
]

export default function PaymentScreen() {
  const [amount, setAmount] = useState('1000')

  // Currently being edited
  const [method, setMethod] = useState('pos')
  const [frequency, setFrequency] =
    useState('daily')

  // Currently saved configuration
  const [savedMethod, setSavedMethod] = useState('pos')
  const [savedFrequency, setSavedFrequency] = useState('transaction')

  const numericAmount =
    Number(amount.replace(/,/g, '')) || 0

  const selectedMethod = paymentMethods.find(
    item => item.id === method,
  )

  const currentSavedMethod = paymentMethods.find(
    item => item.id === savedMethod,
  )

  const currentSavedFrequency = frequencies.find(
    item => item.id === savedFrequency,
  )

  /*
   * POS transactions have a 1.5% deduction.
   *
   * Example:
   * ₦1,000 × 1.5% = ₦15 deduction
   * ₦1,000 - ₦15 = ₦985 credited
   *
   * Other payment methods have no deduction.
   */
  const transactionFee = useMemo(() => {
    if (method !== 'pos') {
      return 0
    }

    return numericAmount * 0.015
  }, [method, numericAmount])

  const amountCredited =
    numericAmount - transactionFee

  const handleSavePaymentMethod = () => {
    setSavedMethod(method)
    setSavedFrequency(frequency)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
          SAVE
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Saved Payment Method */}
        <View style={styles.balanceCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.balanceLabel}>
              Saved payment method
            </Text>

            <Text style={styles.balanceTitle}>
              {currentSavedMethod?.title}
            </Text>

            <Text style={styles.totalLabel}>
              Payment frequency
            </Text>

            <Text style={styles.balance}>
              {currentSavedFrequency?.title}
            </Text>
          </View>

          <View style={styles.balanceIcon}>
            <ThemedIcon
              name={
                currentSavedMethod?.icon ||
                'storefront-outline'
              }
              size={45}
              color="#8FE2AC"
            />
          </View>
        </View>

        {/* POS Fee Information */}
        {method === 'pos' && (
            <View style={styles.feeNotice}>
                <View style={styles.feeNoticeIcon}>
                    <ThemedIcon
                        name="information-circle-outline"
                        size={18}
                        color={Colors.primary}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.feeNoticeTitle}>
                        POS transaction deduction
                    </Text>

                    <Text style={styles.feeNoticeText}>
                        A 1.5% deduction is applied to
                        every POS transaction.
                    </Text>
                </View>
            </View>
        )}

        {/* Amount */}
        {method !== 'pos' && (
            <Text style={styles.sectionLabel}>
                Enter Amount
            </Text>
        )}
        {method !== 'pos' && (
            <View style={styles.amountInput}>
            <Text style={styles.currency}>
                ₦
            </Text>

            <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.amountText}
                placeholder="Enter amount"
                placeholderTextColor={Colors.textLight}
            />
            </View>
        )}

        {/* Quick amounts */}
        {method !== 'pos' && (
            <View style={styles.quickAmounts}>
            {[500, 1000, 2000, 5000].map(value => (
                <Pressable
                key={value}
                style={[
                    styles.quickButton,
                    numericAmount === value &&
                    styles.quickButtonActive,
                ]}
                onPress={() =>
                    setAmount(value.toString())
                }
                >
                <Text
                    style={[
                    styles.quickText,
                    numericAmount === value &&
                        styles.quickTextActive,
                    ]}
                >
                    ₦{value.toLocaleString()}
                </Text>
                </Pressable>
            ))}
            </View>
        )}

        {/* Payment methods */}
        <Text style={styles.sectionLabel}>
          Choose Payment Method
        </Text>

        {paymentMethods.map(item => {
          const active = method === item.id

          return (
            <Pressable
              key={item.id}
              style={[
                styles.paymentMethod,
                active &&
                  styles.paymentMethodActive,
              ]}
              onPress={() =>
                setMethod(item.id)
              }
            >
              <View
                style={[
                  styles.radio,
                  active && styles.radioActive,
                ]}
              >
                {active && (
                  <View
                    style={styles.radioDot}
                  />
                )}
              </View>

              <View style={styles.methodIcon}>
                <ThemedIcon
                  name={item.icon}
                  size={22}
                  color={
                    active
                      ? Colors.primary
                      : Colors.textSecondary
                  }
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={styles.methodTitle}
                >
                  {item.title}
                </Text>

                <Text
                  style={styles.methodSubtitle}
                >
                  {item.subtitle}
                </Text>
              </View>
            </Pressable>
          )
        })}


        {/* Frequency */}
        <Text style={styles.sectionLabel}>
          Payment Frequency
        </Text>

        <View style={styles.frequencyContainer}>
          {frequencies.map(item => {
            const active = frequency === item.id

            return (
              <Pressable
                key={item.id}
                style={[
                  styles.frequencyButton,
                  active &&
                    styles.frequencyButtonActive,
                ]}
                onPress={() =>
                  setFrequency(item.id)
                }
              >
                <Text
                  style={[
                    styles.frequencyTitle,
                    active &&
                      styles.frequencyTitleActive,
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.frequencySubtitle,
                    active &&
                      styles.frequencySubtitleActive,
                  ]}
                >
                  {item.subtitle}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {/* Save Payment Method */}
        <Pressable
          style={styles.saveButton}
          onPress={handleSavePaymentMethod}
        >
          <ThemedIcon
            name="checkmark-circle-outline"
            size={20}
            color={Colors.white}
          />

          <Text style={styles.saveButtonText}>
            Save Payment Method
          </Text>

          <View style={styles.lock}>
            <ThemedIcon
              name="lock-closed"
              size={17}
              color={Colors.primary}
            />
          </View>
        </Pressable>

        <View style={styles.footer}>
          <ThemedIcon
            name="shield-checkmark"
            size={16}
            color={Colors.primary}
          />

          <Text style={styles.footerText}>
            Your payment is 100% secure and encrypted
          </Text>
        </View>

        {/* Trust indicators */}
        <View style={styles.trustRow}>
          <TrustItem
            icon="checkmark-circle-outline"
            title="Instant"
            subtitle="Confirmation"
          />

          <TrustItem
            icon="shield-checkmark-outline"
            title="Secure"
            subtitle="Payments"
          />

          <TrustItem
            icon="people-outline"
            title="Trusted by"
            subtitle="10,000+ Traders"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

function SummaryRow({
  label,
  value,
  green = false,
  large = false,
}) {
  return (
    <View style={styles.summaryRow}>
      <Text
        style={[
          styles.summaryLabel,
          large && styles.summaryLarge,
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.summaryValue,
          green && styles.greenValue,
          large && styles.summaryLarge,
        ]}
      >
        {value}
      </Text>
    </View>
  )
}

function TrustItem({
  icon,
  title,
  subtitle,
}) {
  return (
    <View style={styles.trustItem}>
      <ThemedIcon
        name={icon}
        size={18}
        color={Colors.primary}
      />

      <View>
        <Text style={styles.trustTitle}>
          {title}
        </Text>

        <Text style={styles.trustSubtitle}>
          {subtitle}
        </Text>
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
    marginBottom: 10,
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

  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  secureText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },

  balanceCard: {
    minHeight: 175,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    padding: 20,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  balanceLabel: {
    color: '#D5F4E1',
    fontSize: 12,
  },

  balanceTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },

  totalLabel: {
    color: '#D5F4E1',
    fontSize: 11,
    marginTop: 25,
  },

  balance: {
    color: Colors.white,
    fontSize: 27,
    fontWeight: '800',
    marginTop: 2,
  },

  balanceIcon: {
    width: 75,
    height: 75,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignSelf: 'center',
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 22,
    marginBottom: 8,
  },

  amountInput: {
    height: 58,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  currency: {
    fontSize: 19,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginRight: 15,
  },

  amountText: {
    flex: 1,
    fontSize: 22,
    color: Colors.text,
    fontWeight: '700',
  },

  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 9,
  },

  quickButton: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },

  quickButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  quickText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
  },

  quickTextActive: {
    color: Colors.white,
  },

  paymentMethod: {
    minHeight: 67,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    marginBottom: 9,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  paymentMethodActive: {
    borderColor: Colors.primary,
    backgroundColor: '#F5FCF8',
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioActive: {
    borderColor: Colors.primary,
  },

  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },

  methodIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  methodTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },

  methodSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  /* POS fee notice */

  feeNotice: {
    marginTop: 15,
    minHeight: 55,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  feeNoticeIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  feeNoticeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },

  feeNoticeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  /* Frequency */

  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  frequencyButton: {
    flex: 1,
    minHeight: 65,
    minWidth: '150px',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'center',
  },

  frequencyButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: '#F5FCF8',
  },

  frequencyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },

  frequencyTitleActive: {
    color: Colors.primary,
  },

  frequencySubtitle: {
    fontSize: 9,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  frequencySubtitleActive: {
    color: Colors.primaryDark,
  },

  summary: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },

  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
  },

  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },

  greenValue: {
    color: Colors.primary,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },

  summaryLarge: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },

  frequencySummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 6,
  },

  frequencySummaryText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },

  /* Save */

  saveButton: {
    height: 55,
    borderRadius: 28,
    backgroundColor: Colors.primaryDark,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  saveButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '800',
  },

  /* Pay */

  payButton: {
    height: 55,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  payButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '800',
  },

  lock: {
    position: 'absolute',
    right: 7,
    width: 41,
    height: 41,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
  },

  footerText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },

  trustRow: {
    marginTop: 20,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  trustTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.text,
  },

  trustSubtitle: {
    fontSize: 8,
    color: Colors.textSecondary,
    marginTop: 1,
  },
})