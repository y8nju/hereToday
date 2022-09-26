import { useContext, useEffect, useState } from "react";
import { Alert, Button, ImageBackground, Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { sendLoginRequest } from "../../util/account";

import defaultStyle from '../styleSheet';

import { AppContext } from "../../context/appContext";
import CustomText from "../../Components/customText";
import LoadingOverlay from "../../Components/loadingOverlay";

export default function LoginScreen() {
	const navigation = useNavigation(AppContext);
	const [loading, setLoading] = useState(false);
	const [inputValues, setInputValues] = useState({ email: "", password: "" });
	const {email, password} = inputValues;
	const ctx = useContext(AppContext);

	useEffect(() => {
		navigation.setOptions({
			title: "로그인"
		});
	}, []);

	const moveRegisterHandle = () => {
		navigation.navigate("Register");
	}
	const loginHandle = () => {
		setLoading(true);
		!async function () {
			try {
				const recv = await sendLoginRequest(email, password);
				const userData = {...recv, password: password}
				console.log(userData);
				ctx.dispatch({type: 'login', payload: userData});
				AsyncStorage.setItem('authentication', JSON.stringify(userData));
				navigation.navigate("Home", {status: 'login'});
			} catch (e) {
				Alert.alert("with", "아이디 혹은 비밀번호를 확인하세요")
				console.log(e);
			}
			setLoading(false);
		}();
	}

	if(loading) {
		return <LoadingOverlay />
	}

	return (<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={[defaultStyle.wrap, {justifyContent: 'center'}]}>
			<View style={{alignItems:'center'}}>
				<ImageBackground source={require('../../assets/images/login.png')} resizeMode="cover" style={{width: 240, height: 240}}  />
			</View>
			<View style={defaultStyle.inputArea}>
				<CustomText style={defaultStyle.inputTitle}>이메일</CustomText>
				<TextInput style={defaultStyle.input}
					value={inputValues.email}
					autoCapitalize='none'
					keyboardType="email-address"
					onChangeText={(text) => setInputValues({ ...inputValues, email: text })}
					placeholder="이메일을 입력하세요"/>
			</View>
			<View style={defaultStyle.inputArea}>
				<CustomText style={defaultStyle.inputTitle}>비밀번호</CustomText>
				<TextInput style={defaultStyle.input} secureTextEntry={true}
					value={inputValues.password}
					onChangeText={(text) => setInputValues({ ...inputValues, password: text })}
					placeholder="비밀번호를 입력하세요"/>
			</View>
			<View style={defaultStyle.accountBtnArea}>
				<Button title="로그인" color="#ffbf00" onPress={loginHandle} />
			</View>
			<View style={{marginTop: 24, flexDirection: 'row', justifyContent: 'center'}}>
				<CustomText style={{textAlign: 'center'}}>계정이 없으신가요?</CustomText>
				<Pressable onPress={moveRegisterHandle}>
					<CustomText style={{color: '#ffbf00'}} weight={600}> 가입하기</CustomText>
				</Pressable>
			</View>
		</View>
	</TouchableWithoutFeedback>);
}

const styles = StyleSheet.create({
})