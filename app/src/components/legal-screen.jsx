import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedIcon } from './themed-icon';

export default function LegalScreen({
    title,
    description,
    lastUpdated,
    icon,
    sections,
}) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
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
                        {title}
                    </Text>

                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    {/* Hero */}
                    <View style={styles.hero}>
                        <View style={styles.heroIcon}>
                            <ThemedIcon
                                name={icon}
                                size={30}
                                color={Colors.primary}
                            />
                        </View>

                        <Text style={styles.title}>
                            {title}
                        </Text>

                        <Text style={styles.description}>
                            {description}
                        </Text>

                        <View style={styles.updated}>
                            <ThemedIcon
                                name="calendar-outline"
                                size={14}
                                color={Colors.textSecondary}
                            />

                            <Text style={styles.updatedText}>
                            Last updated: {lastUpdated}
                            </Text>
                        </View>
                    </View>

                    {/* Important notice */}
                    <View style={styles.notice}>
                        <View style={styles.noticeIcon}>
                            <ThemedIcon
                                name="information-circle"
                                size={20}
                                color={Colors.primary}
                            />
                        </View>

                        <Text style={styles.noticeText}>
                            Please read this document carefully before
                            using financhor services.
                        </Text>
                    </View>

                        {/* Sections */}
                        {sections.map((section, index) => (
                            <View
                                key={section.id}
                                style={styles.section}
                            >
                                <View style={styles.sectionHeader}>
                                    <View style={styles.number}>
                                        <Text style={styles.numberText}>
                                        {index + 1}
                                        </Text>
                                    </View>

                                    <Text style={styles.sectionTitle}>
                                        {section.title}
                                    </Text>
                                </View>

                                {section.paragraphs?.map(
                                    (paragraph, paragraphIndex) => (
                                        <Text
                                            key={paragraphIndex}
                                            style={styles.paragraph}
                                        >
                                            {paragraph}
                                        </Text>
                                    )
                                )}

                                {section.bullets?.map(
                                    (bullet, bulletIndex) => (
                                        <View
                                            key={bulletIndex}
                                            style={styles.bulletRow}
                                        >
                                            <View style={styles.bullet} />

                                            <Text style={styles.bulletText}>
                                                {bullet}
                                            </Text>
                                        </View>
                                    )
                                )}
                            </View>
                        ))}

                        {/* Footer */}
                        <View style={styles.footer}>
                            <View style={styles.footerIcon}>
                                <ThemedIcon
                                name="shield-checkmark"
                                size={22}
                                color={Colors.primary}
                                />
                            </View>

                            <Text style={styles.footerTitle}>
                                Your trust matters to financhor
                            </Text>

                            <Text style={styles.footerText}>
                                We are committed to providing clear,
                                transparent and responsible services.
                            </Text>

                            <Text style={styles.footerCopyright}>
                                © {new Date().getFullYear()} financhor
                            </Text>
                        </View>
                </ScrollView>
            </View>
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

    header: {
        height: 64,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '800',
        color: Colors.text,
    },

    headerSpacer: {
        width: 42,
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    hero: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 20,
    },

    heroIcon: {
        width: 68,
        height: 68,
        borderRadius: 22,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },

    title: {
        fontSize: 25,
        fontWeight: '900',
        color: Colors.text,
        textAlign: 'center',
    },

    description: {
        fontSize: 12,
        lineHeight: 19,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 7,
        maxWidth: 340,
    },

    updated: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 5,
    },

    updatedText: {
        fontSize: 10,
        color: Colors.textSecondary,
    },

    notice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryLight,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 15,
        padding: 14,
        marginBottom: 8,
    },

    noticeIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    noticeText: {
        flex: 1,
        fontSize: 11,
        lineHeight: 17,
        color: Colors.text,
    },

    section: {
        marginTop: 25,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    number: {
        width: 32,
        height: 32,
        borderRadius: 11,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    numberText: {
        color: Colors.white,
        fontSize: 11,
        fontWeight: '800',
    },

    sectionTitle: {
        flex: 1,
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '800',
        color: Colors.text,
    },

    paragraph: {
        fontSize: 12,
        lineHeight: 20,
        color: Colors.textSecondary,
        marginBottom: 10,
    },

    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        paddingLeft: 5,
    },

    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        marginTop: 7,
        marginRight: 10,
    },

    bulletText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 19,
        color: Colors.textSecondary,
    },

    footer: {
        marginTop: 35,
        borderRadius: 18,
        backgroundColor: Colors.primaryLight,
        padding: 20,
        alignItems: 'center',
    },

    footerIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    footerTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: Colors.text,
    },

    footerText: {
        fontSize: 10,
        lineHeight: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 6,
    },

    footerCopyright: {
        fontSize: 9,
        color: Colors.textLight,
        marginTop: 14,
    },
})