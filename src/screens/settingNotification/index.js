import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';

export async function requestNotificationPermission() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status } = await Notifications.getPermissionsAsync(); // Check existing permissions

    if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync(); // Request permission
        if (newStatus !== 'granted') {
            Alert.alert(
                'Notification Permission',
                'You need to enable notifications for this app to receive prayer alerts.',
                [{ text: 'OK', onPress: () => console.log('Permission denied') }]
            );
            return false; // Permission denied
        }
    }
    return true; // Permission granted
}
export async function schedulePrayerNotifications(prayerTimes) {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const notificationEnabled = await AsyncStorage.getItem('notificationEnabled');
    if (notificationEnabled !== 'true') return;

    const today = new Date();
    const notificationPromises = Object.keys(prayerTimes).map(prayer => {
        const [hours, minutes] = prayerTimes[prayer].split(':').map(Number);
        const notificationTime = new Date(today);
        notificationTime.setHours(hours);
        notificationTime.setMinutes(minutes);
        notificationTime.setSeconds(0);

        if (notificationTime > today) {
            return Notifications.scheduleNotificationAsync({
                content: {
                    title: `Time for ${prayer}`,
                    body: `It's time for ${prayer} prayer.`,
                    sound: true,
                },
                trigger: notificationTime,
            });
        }
    });

    await Promise.all(notificationPromises);
}
