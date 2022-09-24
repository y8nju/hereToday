import { useContext, useEffect, useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { messageList } from '../../util/messages';

import { AppContext } from '../../context/appContext';
import TalkItem from '../../Components/talkItem';

export default function TalkScreen({navigation, route}) {
	console.log(route)
	const [messages, setMessages] = useState([]);
	const ctx = useContext(AppContext);
	useEffect(() => {
		onRead();
	}, [route]);
	const onAddItemHandle = ()=> {
		navigation.navigate('TalkWrite');
	}
	
	function onRead() {
		messageList()
		.then( (recv) => {
			const messageArr = Object.keys(recv).map((name) => { return {name, ...recv[name]}});
			console.log(messageArr)
			setMessages(messageArr);
		})
	}
	console.log(messages instanceof Array);

	return ( <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={{flex: 1, backgroundColor: '#fff', position: 'relative'}}>
			<View style={{flex:1}}>	
			{messages && <FlatList style={{flex: 1}} data={messages}  
				keyExtractor={({name})=> name}
				renderItem={(one)=> <TalkItem data={one} />}
				/>}
				
			</View>
			{ctx.auth && <View style={styles.addBtn}>
				<Pressable android_ripple={{color: '#fff'}} onPress={onAddItemHandle}
					style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Ionicons name="add" size={32} color="#fff" />
				</Pressable>
			</View>}
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