import { useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import defaultStyle from './styleSheet';

import CustomText from '../Components/customText';
import TalkItem from '../Components/talkItem';
import TalkWrite from '../Components/talkWrite';

export default function TalkScreen() {
	return ( <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={{flex: 1, backgroundColor: '#fff', position: 'relative'}}>
		<View>
			<TalkWrite></TalkWrite>
		</View>
			<View style={styles.addBtn}>
				<Pressable android_ripple={{color: '#fff'}} style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Ionicons name="add" size={32} color="#fff" />
				</Pressable>
			</View>
			{/* <FlatList style={{flex: 1}} data={} 
				renderItem={<TalkItem />}>
			</FlatList> */}
			<TalkItem />
		</View>
	</TouchableWithoutFeedback> );
}
const styles = StyleSheet.create({
	addBtn: {
		position:'absolute', 
		width: 44,
		height:44,
		bottom: 12, 
		right: 12, 
		borderRadius: 50, 
		backgroundColor: '#ffbf00',
		overflow: 'hidden',
		shadowColor: "#000",
		shadowOffset: {
			width: 2,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 0.3,
		elevation: 2,
	}
})