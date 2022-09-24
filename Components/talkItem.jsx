import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import CustomText from "./customText";

export default function TalkItem({data}) {
	const navigation = useNavigation();
	const message = data.item
	const detailHnadle = () => {
		navigation.navigate('TalkView', {data: message});
	}
	return ( <View>
		<Pressable android_ripple={{color: "#00000008"}} style={{paddingTop: 14, paddingBottom: 10}}
		onPress={detailHnadle}>
			<View style={[styles.padding]}>
				<CustomText style={{textAlign: 'justify', fontSize: 16}} weight={600}>{message.title}</CustomText>
			</View>
			<View style={{paddingBottom: 10, paddingHorizontal: 20}}>
				<Text style={{fontFamily: 'SUIT-Regular', textAlign: 'justify'}} numberOfLines={2}>{message.content}</Text>
			</View>
			<View style={[styles.padding, {flexDirection: "row", justifyContent: 'space-between', borderTopColor: '#eee', borderTopWidth: 1 }]}>
				<CustomText style={{fontSize: 12, color: "#777"}}>{message.writer}</CustomText>
				<CustomText style={{fontSize: 12, color: "#777"}}>{message.createdAt.slice(0, 10)}</CustomText>
			</View>
		</Pressable>
		<View style={{height: 8, backgroundColor: "#f1f1f1"}}></View>
	</View> );
}

const styles = StyleSheet.create({
	padding: {
		paddingVertical: 10,
		paddingHorizontal: 20
	},
})