// screens/GetStartedScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function GetStartedScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.contentCon}>
                <Image source={require('../../../assets/musque.jpeg')} style={styles.image} />

                <Text style={styles.title}>Welcome to Nimaz Timing App</Text>
                <Text style={styles.subtitle}>Get accurate Salah timings</Text>
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    contentCon: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
        flex: 1
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#7a7a7a',
        marginBottom: 30,
    },
    buttonView: {
        marginVertical: 20,
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    button: {

        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
