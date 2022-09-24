import { Alert, Button, Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";

import defaultStyle from "../styleSheet";

import CustomText from "../../Components/customText";
import { useContext, useState } from "react";
import { messageDelete, messageUpdate } from "../../util/messages";
import { AppContext } from "../../context/appContext";

export default function TalkUpdateScreen({navigation, route}) {
	const [loading, setLoading] = useState(false);

	const data = route.params.data;
	const {name, title, content} = data;
	const ctx = useContext(AppContext);
	const {idToken} = ctx.auth;

	const [titleInp, setTitleInp] = useState(title)
	const [contentInp, setContentInp] = useState(content);

	const updateHandle = () => {
		Alert.alert("WITH", "이야기를 수정할까요?", [
			{
				text: '취소'
			}, {
				text: '수정하기',
				onPress: () =>{
					setLoading(true);
					!async function () {
						const title = titleInp; 
						const content = contentInp;
						try {
							const recv = await messageUpdate(title, content, name, idToken);
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

	const deleteHandle = () => {
		Alert.alert("WITH", "이야기를 지울까요?", [
			{
				text: '취소'
			}, {
				text: '지우기',
				onPress: () =>{
					setLoading(true);
					!async function () {
						try {
							const recv = await messageDelete(name, idToken);
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

	return( <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={[defaultStyle.wrap, {backgroundColor: '#fff'}]}>
			<View style={{paddingHorizontal: 20}}>
				<View style={styles.titleArea}>
					<TextInput
						value={titleInp}
						onChangeText={(text) => setTitleInp(text)}
						style={[styles.textarea, {fontFamily: 'SUIT-SemiBold', fontSize: 16}]}
					/>
				</View>
			</View>
			<View style={{paddingHorizontal: 20, paddingVertical: 18}}>
				<TextInput
					value={contentInp}
					multiline
					numberOfLines={5}
					onChangeText={(text) => setContentInp(text)}
					style={[styles.textarea, {fontFamily: 'SUIT-Regular', textAlignVertical: "top", lineHeight: 30}]}
				/>
			</View>
			<View style={styles.buttonArea}>
				<View>
					<Button title="수정하기" color="#ffbf00" onPress={updateHandle}/>
				</View>
				<View style={{marginLeft: 12}}>
					<Button title="지우기" color="#ddd" onPress={deleteHandle}/>
				</View>
			</View>
		</View>
	</TouchableWithoutFeedback>)
};
const styles = StyleSheet.create({
	titleArea: {
		paddingBottom: 18,
		borderBottomColor: '#ddd',
		borderBottomWidth: 1
	},
	textarea: {
		fontSize: 16,
		borderColor: '#eee',
		borderWidth: 1,
		borderRadius: 4,
		paddingVertical: 4,
		paddingHorizontal: 8
	},
	buttonArea: {
		flexDirection: 'row',
		justifyContent: 'center'
	}
})