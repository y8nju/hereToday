import { useContext, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import defaultStyle from '../styleSheet/index';

import { messageDetail } from "../../util/messages";

import { AppContext } from "../../context/appContext";
import CustomText from "../../Components/customText";

export default function TalkViewScreen({navigation, route}) {
	
	const ctx = useContext(AppContext);
	const data = route.params.data;
	
	console.log(data)

	useEffect(() => {
		if(data.writer === ctx.auth.email){
			navigation.setOptions({
				headerRight: () => <UpdateBtn />
			})
		}
	})
	const updateHandle = () => {
		navigation.navigate('TalkUpdate', {data: data});
	}
	function UpdateBtn() {
		return (<View style={{overflow: 'hidden', borderRadius: 8}}>
			<Pressable android_ripple={{color: "#00000008"}} style={{paddingHorizontal: 4, paddingVertical: 8}} onPress={updateHandle}>
				<CustomText>수정</CustomText>
			</Pressable>
		</View>)
	}

	return(<View style={[defaultStyle.wrap, {backgroundColor: '#fff'}]}>
		<View style={{paddingHorizontal: 20}}>
			<View style={styles.titleArea}>
				<CustomText style={{fontSize: 16}} weight={600}>{data.title}</CustomText>
				<View style={{flexDirection: 'row', alignItems:'flex-end', marginTop:6}}>
					<CustomText style={{fontSize: 14, color: "#777"}}>{data.writer}</CustomText>
					<CustomText style={{fontSize: 12, color: "#777", marginLeft: 6}}>{data.createdAt.slice(0, 10)}</CustomText>
				</View>
			</View>
		</View>
		<View style={{paddingHorizontal: 20, paddingVertical: 18}}>
			<CustomText style={{fontSize: 18, lineHeight: 30}}>{data.content}</CustomText>
		</View>
	</View>)
}
const styles = StyleSheet.create({
	titleArea: {
		paddingVertical: 18,
		borderBottomColor: '#ddd',
		borderBottomWidth: 1
	}
})