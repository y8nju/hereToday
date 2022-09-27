import { useContext, useEffect, useState } from "react";
import { Alert, Button, ImageBackground, Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import defaultStyle from '../styleSheet';

import { sendRegisterReq } from "../../util/account";

import { AppContext } from "../../context/appContext";
import CustomText from "../../Components/customText";
import LoadingOverlay from "../../Components/loadingOverlay";

export default function RegisterScreen({navigation}) {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] =useState();
	const [pass, setPass] = useState();
	const [passChk, setPassChk] = useState();
	const [passchkText, setPassChkText] = useState('');
	const ctx = useContext(AppContext);

	useEffect(() => {
		navigation.setOptions({
			title: "회원가입"
		});
		if(pass !== undefined && passChk !== undefined) {
			if(pass == passChk) {
				setPassChkText('')
			} else if (pass !== passChk) {
				setPassChkText( '비밀번호가 일치하지 않습니다')
			}
		}
	}, [pass, passChk]);

	const emailHandle = (txt) => {
		setEmail(txt);
	}
	const passHandle = (txt) => {
		setPass(txt);
	}
	const passChkHandle = (txt) => {
		setPassChk(txt);
	}
	const registerHandle = () => {

		if(pass !== passChk) {
			Alert.alert('오늘여기', '비밀번호가 일치하지 않습니다')
		}else if(pass.length < 6) {
			Alert.alert('오늘여기', '비밀번호는 6자 이상 입력해주세요')

		}else if(!(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email))) {
			Alert.alert('오늘여기', '이메일 형식이 아닙니다')
		}else {
			setLoading(true);
			!async function( ) {
				try{
					const recv = await sendRegisterReq(email, pass);
					console.log(recv); 
					ctx.dispatch({type: 'login', payload: recv});
					AsyncStorage.setItem('authentication', JSON.stringify(recv));
					navigation.navigate('Home', {status: 'signup'})
				} catch(e) {
					Alert.alert('오늘여기', '회원가입이 정상적으로 이루어지지 않았습니다')
					console.log(e.message);
				}
				setLoading(false);
			}();
		}
	}

	if(loading) {
		return <LoadingOverlay />
	}

	return ( <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={[defaultStyle.wrap, {justifyContent: 'center'}]}>
			<View style={{alignItems:'center'}}>
				<ImageBackground source={require('../../assets/images/signup.png')} resizeMode="cover" style={{width: 240, height: 240}}  />
			</View>
			<View style={defaultStyle.inputArea}>
				<CustomText style={defaultStyle.inputTitle}>이메일</CustomText>
				<TextInput style={defaultStyle.input}
					value={email}
					autoCapitalize='none'
					keyboardType="email-address"
					onChangeText={emailHandle}
					placeholder="이메일을 입력하세요"/>
			</View>
			<View style={defaultStyle.inputArea}>
				<CustomText style={defaultStyle.inputTitle}>비밀번호</CustomText>
				<TextInput style={defaultStyle.input} secureTextEntry={true}
					onChangeText={passHandle}
					value={pass}
					placeholder="비밀번호를 입력하세요"/>
			</View>
			<View style={defaultStyle.inputArea}>
				<CustomText style={defaultStyle.inputTitle}>비밀번호 확인</CustomText>
				<TextInput style={defaultStyle.input} secureTextEntry={true}
					onChangeText={passChkHandle}
					value={passChk}
					placeholder="비밀번호를 입력하세요"/>
			</View>
			<View style={{paddingHorizontal: 26}}>
				<CustomText style={defaultStyle.chkText}>{passchkText}</CustomText>
			</View>
			<View style={defaultStyle.accountBtnArea}>
				<Button title="가입하기" color="#ffbf00" onPress={registerHandle}/>
			</View>
		</View>
	</TouchableWithoutFeedback>);
}