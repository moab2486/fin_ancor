import { LoadingScreen } from '@/components/loading-screen';
import { ThemedIcon } from '@/components/themed-icon';
import { Colors } from '@/constants/theme';
import { Tabs, useSegments } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

export default function TabsLayout() {
    const segments = useSegments()

    const [loading, setLoading] = useState(false)

    const previousTab = useRef(null)
    const loadingTimer = useRef(null)

    /*
    * Detect when the actual tab changes.
    *
    * IMPORTANT:
    * We do NOT replace <Tabs> with <LoadingScreen>.
    * The Tabs navigator remains mounted.
    */
    useEffect(() => {
        const currentTab = segments[segments.length - 1]

        if (previousTab.current === null) {
            previousTab.current = currentTab
            return
        }

        if (previousTab.current !== currentTab) {
            previousTab.current = currentTab

            if (loadingTimer.current) {
                clearTimeout(loadingTimer.current)
            }

            loadingTimer.current = setTimeout(() => {
                setLoading(false)
            }, 700)
        }

        return () => {
            if (loadingTimer.current) {
                clearTimeout(loadingTimer.current)
            }
        }
    }, [segments])

    const handleTabPress = () => {
        setLoading(true)
    }

    return (
        <View style={styles.container}>
            <Tabs
                screenOptions={{
                    headerShown: false,

                    tabBarActiveTintColor: Colors.primary,
                    tabBarInactiveTintColor: Colors.textLight,

                    tabBarStyle: {
                        height: 72,
                        paddingTop: 8,
                        paddingBottom: 10,
                        backgroundColor: Colors.white,
                        borderTopWidth: 1,
                        borderTopColor: Colors.border,
                        elevation: 8,
                    },

                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                    },
                }}

                screenListeners={{
                    tabPress: handleTabPress,
                }}
            >
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        title: 'Home',

                        tabBarIcon: ({ color, focused }) => (
                            <ThemedIcon
                                name={
                                    focused
                                    ? 'home'
                                    : 'home-outline'
                                }
                                size={23}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="payment"
                    options={{
                        title: 'Save',

                        tabBarIcon: ({ color, focused }) => (
                            <ThemedIcon
                                name={
                                    focused
                                    ? 'wallet'
                                    : 'wallet-outline'
                                }
                                size={23}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="payout"
                    options={{
                        title: 'Cashout',

                        tabBarIcon: ({ color, focused }) => (
                            <ThemedIcon
                                name={
                                    focused
                                    ? 'cash'
                                    : 'cash-outline'
                                }
                                size={23}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'profile',

                        tabBarIcon: ({ color, focused }) => (
                            <ThemedIcon
                                name={
                                    focused
                                    ? 'user-large'
                                    : 'user'
                                }
                                size={23}
                                color={color}
                                family={'fontawesome6'}
                            />
                        ),
                    }}
                />
            </Tabs>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <LoadingScreen />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
        Colors.background,
    },

    loadingOverlay: {
        ...StyleSheet.absoluteFill,
        zIndex: 999,
        backgroundColor:Colors.background,
    },
})