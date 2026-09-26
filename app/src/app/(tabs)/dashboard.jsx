import { ThemedIcon } from '@/components/themed-icon';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerWithBack}>
          <Pressable onPress={() => router.back()}>
              <ThemedIcon
                  name="arrow-back"
                  size={24}
                  color={Colors.text}
              />
          </Pressable>

          <Text style={styles.headerTitle}>
            DASHBOARD
          </Text>

          <View style={styles.headerSpace} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
            <View style={styles.profileSection}>
                <View style={styles.avatar}>
                    <ThemedIcon
                        name="person"
                        size={30}
                        color={Colors.primary}
                    />
                    </View>

                    <View>
                    <Text style={styles.welcomeText}>
                        👋 Welcome,
                    </Text>

                    <Text style={styles.userName}>
                        MaMusa
                    </Text>
                </View>
            </View>
        </View>

        {/* FinAnchor Card */}
        <View style={styles.safetyCard}>
          <View style={styles.safetyBackgroundCircle} />

          <View style={styles.safetyHeader}>
            <View style={styles.safetyIcon}>
              <ThemedIcon
                name="shield-halved"
                size={23}
                color={Colors.primary}
                family={'fontawesome6'}
              />
            </View>

            <Text style={styles.safetyLabel}>
              MY TOTAL FinAnchor
            </Text>
          </View>

          <Text style={styles.totalAmount}>
            ₦42,500.00
          </Text>

          <View style={styles.earningBadge}>
            <ThemedIcon
              name="arrow-up"
              size={18}
              color={Colors.success}
            />

            <Text style={styles.earningAmount}>
              +₦320
            </Text>

            <Text style={styles.earningText}>
              earned this week
            </Text>
          </View>

          <View style={styles.safetyWatermark}>
            <ThemedIcon
              name="shield-checkmark-outline"
              size={105}
              color="rgba(255,255,255,0.08)"
            />
          </View>
        </View>

        {/* Financial Split */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderIcon}>
              <ThemedIcon
                name="pie-chart"
                size={22}
                color={Colors.primary}
              />
            </View>

            <Text style={styles.sectionTitle}>
              MY FINANCIAL SPLIT
            </Text>
          </View>

          <View style={styles.splitContainer}>
            {/* Insurance */}
            <Pressable
              style={[
                styles.splitCard,
                styles.insuranceCard,
              ]}
            >
              <View style={styles.splitIconContainer}>
                <ThemedIcon
                  name="umbrella"
                  size={25}
                  color={Colors.primary}
                  family={'fontawesome6'}
                />
              </View>

              <Text style={styles.splitTitle}>
                MARKET INSURANCE
              </Text>

              <Text style={styles.splitDescription}>
                Active
              </Text>

              <Text style={styles.coverText}>
                Cover up to ₦500k
              </Text>

              <View style={styles.divider} />

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>
                  Status
                </Text>

                <View style={styles.statusValue}>
                  <ThemedIcon
                    name="checkmark-circle"
                    size={19}
                    color={Colors.success}
                  />

                  <Text style={styles.secureText}>
                    SECURE
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* Pension */}
            <Pressable
              style={[
                styles.splitCard,
                styles.pensionCard,
              ]}
            >
              <View
                style={[
                  styles.splitIconContainer,
                  styles.pensionIcon,
                ]}
              >
                <ThemedIcon
                  name="trending-up"
                  size={27}
                  color={Colors.purple}
                />
              </View>

              <Text
                style={[
                  styles.splitTitle,
                  styles.pensionTitle,
                ]}
              >
                MY PENSION FUND
              </Text>

              <Text style={styles.pensionAmount}>
                ₦31,200
              </Text>

              <Text style={styles.splitDescription}>
                Saved
              </Text>

              <View style={styles.divider} />

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>
                  Status
                </Text>

                <View style={styles.statusValue}>
                  <ThemedIcon
                    name="trending-up"
                    size={19}
                    color={Colors.purple}
                  />

                  <Text style={styles.growingText}>
                    GROWING
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Live Piggy Bank */}
        <View style={styles.sectionCard}>
          <View style={styles.feedHeader}>
            <View style={styles.sectionHeaderIcon}>
              <ThemedIcon
                name="time-outline"
                size={23}
                color={Colors.blue}
              />
            </View>

            <View style={styles.feedTitleContainer}>
              <Text style={styles.sectionTitle}>
                LIVE PIGGY-BANK FEEDS
              </Text>

              <Text style={styles.feedSubtitle}>
                From your OPay / Moniepoint POS
              </Text>
            </View>

            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>
                LIVE
              </Text>
            </View>
          </View>

          {/* Feed 1 */}
          <FeedItem
            amount="+₦50"
            description="saved via POS Sale #4928"
            time="10 mins ago"
          />

          {/* Feed 2 */}
          <FeedItem
            amount="+₦120"
            description="saved via POS Sale #4912"
            time="2 hours ago"
          />

          {/* Feed 3 */}
          <FeedItem
            amount="+₦75"
            description="saved via POS Sale #4890"
            time="Yesterday"
          />
        </View>

        {/* Emergency Section */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <View style={styles.emergencyIcon}>
              <ThemedIcon
                name="warning"
                size={22}
                color={Colors.danger}
              />
            </View>

            <Text style={styles.emergencyTitle}>
              EMERGENCY SUPPORT
            </Text>
          </View>

          <Text style={styles.emergencyDescription}>
            Get immediate help when your business is affected.
          </Text>

          <View style={styles.emergencyActions}>
            {/* Report Disaster */}
            <Pressable
              style={[
                styles.emergencyButton,
                styles.reportButton,
              ]}
            >
              <View style={styles.actionIcon}>
                <ThemedIcon
                  name="flame"
                  size={23}
                  color={Colors.white}
                />
              </View>

              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>
                  Report Incident
                </Text>

                <Text style={styles.actionSubtitle}>
                  Fire / Flood / Disaster
                </Text>
              </View>

              <ThemedIcon
                name="chevron-forward"
                size={20}
                color={Colors.white}
              />
            </Pressable>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

/**
 * POS feed item
 */
function FeedItem({
  amount,
  description,
  time,
}) {
  return (
    <View style={styles.feedItem}>
      <View style={styles.feedIcon}>
        <ThemedIcon
          name="arrow-down"
          size={18}
          color={Colors.primary}
        />
      </View>

      <View style={styles.feedMain}>
        <View style={styles.feedAmountRow}>
          <Text style={styles.feedAmount}>
            {amount}
          </Text>

          <Text style={styles.feedDescription}>
            {description}
          </Text>
        </View>
      </View>

      <Text style={styles.feedTime}>
        {time}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 30,
    },

    /* =========================
        HEADER
    ========================= */

    header: {
        minHeight: 76,
        backgroundColor: Colors.surface,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        borderWidth: 1,
        borderColor: Colors.border,

        boxShadow: '0px 3px 8px rgba(0,0,0,0.4)',
        elevation: 2,
    },

    headerWithBack: {
        height: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
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

    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,

        backgroundColor: Colors.primaryLight,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 11,

        borderWidth: 1,
        borderColor: '#CDEDDD',
    },

    welcomeText: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 1,
    },

    userName: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text,
    },

    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: Colors.background,

        paddingHorizontal: 10,
        paddingVertical: 9,

        borderRadius: 12,

        borderWidth: 1,
        borderColor: Colors.border,
    },

    languageText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text,

        marginHorizontal: 5,
    },

    /* =========================
        FinAnchor
    ========================= */

    safetyCard: {
        marginTop: 16,
        minHeight: 205,

        borderRadius: 24,
        padding: 22,

        overflow: 'hidden',

        backgroundColor: Colors.primaryDark,

        boxShadow: '0px 8px 18px rgb(7,136,63,0.18)',
        elevation: 6,
    },

    safetyBackgroundCircle: {
        position: 'absolute',

        width: 230,
        height: 230,
        borderRadius: 115,

        right: -100,
        top: -90,

        backgroundColor: Colors.primary,
        opacity: 0.45,
    },

    safetyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    safetyIcon: {
        width: 44,
        height: 44,

        borderRadius: 13,

        backgroundColor: Colors.white,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 12,
    },

    safetyLabel: {
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.8,
        color: Colors.white,
    },

    totalAmount: {
        marginTop: 20,

        fontSize: 36,
        fontWeight: '900',

        color: Colors.white,

        letterSpacing: -1,
    },

    earningBadge: {
        alignSelf: 'flex-start',

        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: 'rgba(255,255,255,0.13)',

        paddingHorizontal: 12,
        paddingVertical: 8,

        borderRadius: 20,

        marginTop: 14,
    },

    earningAmount: {
        color: '#8BE0AD',
        fontSize: 14,
        fontWeight: '800',
        marginLeft: 4,
    },

    earningText: {
        color: Colors.white,
        fontSize: 13,
        marginLeft: 5,
    },

    safetyWatermark: {
        position: 'absolute',
        right: 15,
        bottom: 10,
    },

    /* =========================
        SECTION
    ========================= */

    sectionCard: {
        marginTop: 16,

        backgroundColor: Colors.surface,

        borderRadius: 22,

        padding: 16,

        borderWidth: 1,
        borderColor: Colors.border,

        boxShadow: '0px 3px 10px rgb(0,0,0,0.035)',
        elevation: 2,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    sectionHeaderIcon: {
        width: 40,
        height: 40,

        borderRadius: 12,

        backgroundColor: Colors.primaryLight,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 10,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.text,

        letterSpacing: 0.2,
    },

    /* =========================
        FINANCIAL SPLIT
    ========================= */

    splitContainer: {
        flexDirection: 'row',
        gap: 10,
    },

    splitCard: {
        flex: 1,

        borderRadius: 18,

        padding: 14,

        minHeight: 205,

        borderWidth: 1,
    },

    insuranceCard: {
        backgroundColor: '#F2FAF5',
        borderColor: '#D7EFDF',
    },

    pensionCard: {
        backgroundColor: '#F8F5FD',
        borderColor: '#E8DFF8',
    },

    splitIconContainer: {
        width: 46,
        height: 46,

        borderRadius: 14,

        backgroundColor: '#DDF4E5',

        alignItems: 'center',
        justifyContent: 'center',

        marginBottom: 13,
    },

    pensionIcon: {
        backgroundColor: '#EEE7FC',
    },

    splitTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: Colors.primary,

        lineHeight: 18,
    },

    pensionTitle: {
        color: Colors.purple,
    },

    splitDescription: {
        marginTop: 8,

        fontSize: 14,
        color: Colors.text,

        fontWeight: '600',
    },

    coverText: {
        marginTop: 3,

        fontSize: 12,
        color: Colors.textSecondary,
    },

    pensionAmount: {
        marginTop: 8,

        fontSize: 19,
        fontWeight: '900',
        color: Colors.text,
    },

    divider: {
        height: 1,

        backgroundColor: Colors.border,

        marginVertical: 15,
    },

    statusRow: {
        flexDirection: 'column',
    },

    statusLabel: {
        fontSize: 11,
        color: Colors.textSecondary,
        marginBottom: 5,
    },

    statusValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    secureText: {
        marginLeft: 5,

        fontSize: 12,
        fontWeight: '800',

        color: Colors.success,
    },

    growingText: {
        marginLeft: 5,

        fontSize: 12,
        fontWeight: '800',

        color: Colors.purple,
    },

    /* =========================
        LIVE FEEDS
    ========================= */

    feedHeader: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 14,
    },

    feedTitleContainer: {
        flex: 1,
    },

    feedSubtitle: {
        fontSize: 11,
        color: Colors.textSecondary,

        marginTop: 2,
    },

    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 7,
        paddingVertical: 5,

        backgroundColor: Colors.primaryLight,

        borderRadius: 10,
    },

    liveDot: {
        width: 6,
        height: 6,

        borderRadius: 3,

        backgroundColor: Colors.success,

        marginRight: 4,
    },

    liveText: {
        fontSize: 9,
        fontWeight: '800',
        color: Colors.success,
    },

    feedItem: {
        minHeight: 64,

        borderRadius: 15,

        borderWidth: 1,
        borderColor: Colors.border,

        backgroundColor: Colors.surface,

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 10,

        marginBottom: 9,
    },

    feedIcon: {
        width: 38,
        height: 38,

        borderRadius: 19,

        backgroundColor: Colors.primaryLight,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 10,
    },

    feedMain: {
        flex: 1,
    },

    feedAmountRow: {
        flexDirection: 'column',
    },

    feedAmount: {
        fontSize: 15,
        fontWeight: '900',
        color: Colors.primary,
    },

    feedDescription: {
        fontSize: 11,
        color: Colors.textSecondary,

        marginTop: 2,
    },

    feedTime: {
        fontSize: 10,
        color: Colors.textLight,

        marginLeft: 5,
    },

    /* =========================
        EMERGENCY
    ========================= */

    emergencyCard: {
        marginTop: 16,

        backgroundColor: '#FFF7F6',

        borderRadius: 22,

        padding: 16,

        borderWidth: 1,
        borderColor: '#FECACA',
    },

    emergencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    emergencyIcon: {
        width: 40,
        height: 40,

        borderRadius: 12,

        backgroundColor: '#FEE4E2',

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 10,
    },

    emergencyTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: Colors.danger,
    },

    emergencyDescription: {
        fontSize: 12,
        color: Colors.textSecondary,

        lineHeight: 18,

        marginTop: 8,
        marginBottom: 14,
    },

    emergencyActions: {
        gap: 10,
    },

    emergencyButton: {
        minHeight: 70,

        borderRadius: 17,

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 14,
    },

    loanButton: {
        backgroundColor: Colors.danger,
    },

    reportButton: {
        backgroundColor: Colors.warning,
    },

    actionIcon: {
        width: 42,
        height: 42,

        borderRadius: 13,

        backgroundColor: 'rgba(255,255,255,0.16)',

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 11,
    },

    actionTextContainer: {
        flex: 1,
    },

    actionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.white,
    },

    actionSubtitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',

        marginTop: 3,
    }
})