import { useContext, useEffect, useState } from "react";
import { Alert, Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";

import defaultStyle from '../styleSheet';

import { AppContext } from "../../context/appContext";
import { messageWrite } from "../../util/messages";
import CustomText from "../../Components/customText";

export default function TalkWriteScreen ({navigation}) {
	const [loading, setLoading] = useState(false);
	const [titleInp, setTitleInp] = useState('')
	const [contentInp, setContentInp] = useState('');
	const ctx = useContext(AppContext);
	useEffect(() => {
		navigation.setOptions({
			title: "안녕 글쓰기",
			headerRight: ()=> { return <WirteBtn />}
		});
	}, [titleInp, contentInp]);
	const writeHandle = () => {
		Alert.alert("WITH", "이야기를 전달할까요?", [
			{
				text: '취소'
			}, {
				text: '완료',
				onPress: () =>{
					setLoading(true);
					!async function () {
						const writer = ctx.auth.email;
						const idToken = ctx.auth.idToken;
						try {
							const recv = await messageWrite(titleInp, writer, contentInp, idToken);
							console.log(titleInp, writer, contentInp, idToken)
							console.log(recv);
						} catch (e) {
							console.log(e);
						}
						setLoading(false);
					}();
					navigation.navigate("Talk", {loading: 'loading'});
				}
			}
		])
	}
	function WirteBtn() {
		return (<View style={{overflow: 'hidden', borderRadius: 8}}>
			<Pressable android_ripple={{color: "#00000008"}} style={{paddingHorizontal: 4, paddingVertical: 8}} onPress={writeHandle}>
				<CustomText>완료</CustomText>
			</Pressable>
		</View>)
	}
	return ( <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={[defaultStyle.wrap, {backgroundColor: '#fff'}]}>
			<View style={[defaultStyle.inputArea, {borderBottomColor: '#ddd', borderBottomWidth: 1}]}>
				<TextInput
					value={titleInp}
					onChangeText={(text) => setTitleInp(text)}
					placeholder="제목을 입력하세요"
					style={[styles.textarea, {fontFamily: 'SUIT-SemiBold'}]}
				/>
			</View>
			<View style={defaultStyle.inputArea}>
				<TextInput
					value={contentInp}
					multiline
					numberOfLines={5}
					onChangeText={(text) => setContentInp(text)}
					placeholder="당신의 이야기를 들려주세요"
					style={[styles.textarea, {fontFamily: 'SUIT-Regular', lineHeight: 30}]}
				/>
			</View>
		</View>
	</TouchableWithoutFeedback> );
}
const styles = StyleSheet.create({
	textarea: {
		fontSize: 16,
		textAlignVertical: "top",
		padding: 4,
	},
})