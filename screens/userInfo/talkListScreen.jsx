import { useContext, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { messageList } from "../../util/messages";

import { AppContext } from "../../context/appContext";
import CustomText from "../../Components/customText";

export default function TalkListScreen() {
	const [messages, setMessages] = useState([]);

	const navigation = useNavigation();
	const ctx = useContext(AppContext);
	
	useEffect(()=> {
		getMessageArr();
	}, []);

	const getMessageArr = async() => {
		let idToken = ctx.auth?.idToken;
		if(idToken) {
			const result = await messageList(idToken);
			const messageArr = Object.keys(result).map((name) => { return {name, ...result[name]}});
			const myMessage = messageArr.filter(one=> one.writer == ctx.auth.email);
			messageArr.sort((a, b) => a.createdAt - b.createdAt).reverse();
			setMessages(myMessage);
		}
	}
	function TalkItem({data}) {
		const talkData = data.item;
		return (<Pressable style={styles.itemArea} onPress={()=> navigation.navigate('TalkStack', {data: talkData})}>
			<View style={styles.itemTitle}>
				<Text style={{fontFamily: 'SUIT-SemiBold', textAlign: 'justify'}} numberOfLines={1}>{talkData.title}</Text>

			</View>
			<View style={styles.itemText}>
				<Text style={{fontFamily: 'SUIT-Regular', textAlign: 'justify'}} numberOfLines={8}>{talkData.content}</Text>
			</View>
		</Pressable>)
	}
	return (<View style={{flex: 1, backgroundColor: '#fff'}}>
		{messages ? <FlatList style={{flex: 1}} data={messages}
			keyExtractor={({name})=> name}
			numColumns = {3}
			renderItem={one => <TalkItem data={one} />}
			/>
		: <></>}
	</View>)
}
const styles = StyleSheet.create({
	itemArea: {
		flex: 1/3,
		height: 200,
		backgroundColor: '#f1f1f1',
		margin: 1,
	},
	itemTitle: {
		borderBottomColor: '#eee',
		borderBottomWidth: 1,
		backgroundColor: '#fff',
		margin: 2,
		marginBottom: 1,
		paddingHorizontal: 6,
		paddingVertical: 10
	},
	itemText: {
		flex: 1,
		backgroundColor: '#fff',
		margin: 2,
		marginTop: 1,
		padding: 6,
		paddingVertical: 10
	}
})