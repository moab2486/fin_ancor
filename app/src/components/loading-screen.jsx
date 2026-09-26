import { Colors } from '@/constants/theme'
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native'

export function LoadingScreen({
  message = 'Loading...'
}) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>K</Text>
        </View>
      </View>

      <Text style={styles.brand}>
        financhor
      </Text>

      <Text style={styles.tagline}>
        Your money. Your FinAnchor.
      </Text>

      <ActivityIndicator
        size="small"
        color={Colors.primary}
        style={styles.loader}
      />

      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  logoContainer: {
    marginBottom: 14,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    color: Colors.white,
    fontSize: 34,
    fontWeight: '900',
  },

  brand: {
    color: Colors.text,
    fontSize: 25,
    fontWeight: '900',
  },

  tagline: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },

  loader: {
    marginTop: 35,
  },

  message: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 10,
  },
})