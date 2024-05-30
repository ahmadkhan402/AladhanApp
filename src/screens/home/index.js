// screens/HomePage.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import AppColor from '../utils/AppCollor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNextPrayer } from '../utils/nextPrayerTime';

export default function HomeScreen() {
    const [location, setLocation] = useState(null);
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);

    useEffect(() => {
        const fetchLocationAndPrayerTimes = async () => {
            try {
                let storedLocation = await AsyncStorage.getItem('userLocation');
                if (storedLocation) {
                    storedLocation = JSON.parse(storedLocation);
                    setLocation(storedLocation);
                    fetchPrayerTimes(storedLocation);
                } else {
                    let { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        setErrorMsg('Permission to access location was denied');
                        setLoading(false);
                        return;
                    }

                    let location = await Location.getCurrentPositionAsync({});
                    const { latitude, longitude } = location.coords;

                    await AsyncStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
                    setLocation({ latitude, longitude });
                    fetchPrayerTimes({ latitude, longitude });
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        const fetchPrayerTimes = async (location) => {
            try {
                const response = await axios.get(`http://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}&method=2`);
                setPrayerTimes(response.data.data.timings);
                setNextPrayer(getNextPrayer(response.data.data.timings));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchLocationAndPrayerTimes();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading Prayer Times...</Text>
            </View>
        );
    }

    if (errorMsg) {
        return (
            <View style={styles.loadingContainer}>
                <Text>{errorMsg}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Prayer Times</Text>



            {prayerTimes && (
                <FlatList
                    data={Object.keys(prayerTimes)}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <View style={[styles.prayerTimeContainer, item === nextPrayer && styles.highlight]}>
                            <Text style={styles.prayerName}>{item}</Text>
                            <Text style={styles.prayerTime}>{prayerTimes[item]}</Text>
                        </View>
                    )}
                />
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    prayerTimeContainer: {
        borderRadius: 10,
        paddingHorizontal: 5,
        alignSelf: "center",
        backgroundColor: AppColor.colorPrimary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        padding: 10,
        borderBottomWidth: 1,

        borderBottomColor: '#ccc',
    },
    prayerName: {
        fontSize: 18,
        color: 'white',
        paddingHorizontal: 5,
    },
    prayerTime: {
        paddingHorizontal: 5,
        fontSize: 18,
        fontWeight: 'bold',
        color: AppColor.colorSecondary
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: AppColor.colorPrimary
    },
    highlight: {
        backgroundColor: '#DAB351',
    },
});


