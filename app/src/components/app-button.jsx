import { Colors } from "@/constants/theme";
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { ThemedIcon } from "./themed-icon";

export function AppButton({ title, onPress, icon }) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
            ]}
            onPress={onPress}
        >
            <Text style={styles.primaryButtonText}>
                {title}
            </Text>
    
            <View style={styles.buttonIcon}>
                <ThemedIcon
                    name={icon}
                    size={20}
                    color={Colors.primary}
                />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    primaryButton: {
        height: 54,
        borderRadius: 27,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    primaryButtonText: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '700',
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

    pressed: {
        opacity: 0.8,
    }
})