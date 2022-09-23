import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Alert, Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";
import CustomText from "../Components/customText";
import { AppContext } from "../context/appContext";
import { messageWrite } from "../util/messages";
import defaultStyle from "./styleSheet";

export default function TalkWriteScreen () {
	const navigation = useNavigation();
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
		Alert.alert("WITH", "글을 게시하시겠습니까?", [
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
		return (<Pressable  onPress={writeHandle}>
			<CustomText>완료</CustomText>
		</Pressable>)
	}
	return ( <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={[defaultStyle.wrap, {backgroundColor: '#fff'}]}>
			<View style={[defaultStyle.inputArea, {borderBottomColor: '#ddd', borderBottomWidth: 1}]}>
				<TextInput
					value={titleInp}
					onChangeText={(text) => setTitleInp(text)}
					placeholder="제목을 입력하세요"
					style={styles.textarea}
				/>
			</View>
			<View style={defaultStyle.inputArea}>
				<TextInput
					value={contentInp}
					multiline
					numberOfLines={4}
					onChangeText={(text) => setContentInp(text)}
					placeholder="blabla"
					style={styles.textarea}
				/>
			</View>
		</View>
	</TouchableWithoutFeedback> );
}
const styles = StyleSheet.create({
	textarea: {
		padding: 4,
		textAlignVertical: "top" 
	},
})