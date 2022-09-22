import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import defaultStyle from "../screens/styleSheet";

export default function TalkWrite () {
	const [message, setMessage] = useState('');
    return ( <View style={defaultStyle.inputArea}>
        <TextInput
            value={message}
            multiline
            numberOfLines={4}
            onChangeText={(text) => setMessage(text)}
            placeholder="blabla"
            style={styles.textarea}
        />
    </View> );
}
const styles = StyleSheet.create({
	textarea: {
		padding: 10,
		textAlignVertical: "top" 
	},
})