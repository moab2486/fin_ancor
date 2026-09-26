import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function ThemedIcon({ name, size = 22, color, family = 'ionicons' }) {
    const theme = useTheme();
    const isDark = theme === 'dark';
    const iconColor = color || (isDark ? Colors.text : Colors.text);

    if (family === 'fontawesome6') {
        return <FontAwesome6 name={name} size={size} color={iconColor} />;
    }

    return <Ionicons name={name} size={size} color={iconColor} />;
}