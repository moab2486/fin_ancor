import { Colors } from '@/constants/theme';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { ThemedIcon } from './themed-icon';

export function AppLogo() {
    return (
        <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
                <ThemedIcon
                    name="umbrella"
                    size={28}
                    color={Colors.white}
                    family="fontawesome6"
                />
            </View>
    
            <Text style={styles.logoText}>FinAnchor</Text>
    
            <Text style={styles.logoSubtitle}>
                Secure today. Thrive tomorrow.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 28,
  },

  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  logoText: {
    fontSize: 27,
    fontWeight: '800',
    color: Colors.primary,
  },

  logoSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: Colors.textSecondary,
  }
})