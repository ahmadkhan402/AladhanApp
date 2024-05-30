// SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import AppColor from '../../utils/AppCollor';

const asrSchools = [
    { label: 'Hanafi', value: 'Hanafi' },
    { label: 'Shafi', value: 'Shafi' }
];

export default function SettingsScreen({ navigation }) {
    const [methods, setMethods] = useState([]);
    const [method, setMethod] = useState('2'); // Default to ISNA
    const [school, setSchool] = useState('Shafi');

    useEffect(() => {
        const fetchMethods = async () => {
            const response = await axios.get('https://api.aladhan.com/v1/methods');
            const methodsData = Object.entries(response.data.data).map(([key, value]) => ({
                label: value.name,
                value: key
            }));
            setMethods(methodsData);
        };

        const loadSettings = async () => {
            const savedMethod = await AsyncStorage.getItem('calculationMethod');
            const savedSchool = await AsyncStorage.getItem('asrSchool');
            if (savedMethod) setMethod(savedMethod);
            if (savedSchool) setSchool(savedSchool);
        };

        fetchMethods();
        loadSettings();
    }, []);

    const saveSettings = async () => {
        await AsyncStorage.setItem('calculationMethod', method);
        await AsyncStorage.setItem('asrSchool', school);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.calContainer}>
                <Text style={styles.label}>Calculation Method:</Text>
                <Picker
                    selectedValue={method}
                    style={styles.picker}
                    onValueChange={(itemValue) => setMethod(itemValue)}
                >
                    {methods.map((method) => (
                        <Picker.Item key={method.value} label={method.label} value={method.value} />
                    ))}
                </Picker>

                <Text style={styles.label}>Asr School:</Text>
                <Picker
                    selectedValue={school}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSchool(itemValue)}
                >
                    {asrSchools.map((school) => (
                        <Picker.Item key={school.value} label={school.label} value={school.value} />
                    ))}
                </Picker>


                <TouchableOpacity style={styles.button} onPress={saveSettings}>
                    <Text style={styles.buttonText}>Save Settings</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: AppColor.colorPrimary
    },
    calContainer: {

        borderRadius: 10,
        paddingHorizontal: 5,
        alignSelf: "center",
        backgroundColor: AppColor.white,

        width: '82%',
        padding: 10,
        borderBottomWidth: 2,

        borderBottomColor: '#ccc',
    },
    label: {
        fontSize: 18,
        marginVertical: 10,

    },
    picker: {
        backgroundColor: AppColor.gray,
        height: 50,
        width: '100%'
    },
    button: {
        marginTop: 30,
        width: "80%",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 20
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});


