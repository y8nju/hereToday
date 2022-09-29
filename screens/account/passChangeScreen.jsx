import { useContext, useEffect, useState } from "react";
import { Alert, Button, Image, Keyboard, TextInput, TouchableWithoutFeedback, View } from "react-native";

import { sendpassChangeRequest } from "../../util/account";

import defaultStyle from "../styleSheet";

import CustomText from "../../Components/customText";
import { AppContext } from "../../context/appContext";

export default function PassChangeScreen({navigation}) {
	const [loading, setLoading] = useState(false);
	const [pass, setPass] = useState('');
	const [passchkText, setPassChkText] = useState('');
	const ctx = useContext(AppContext);

	useEffect(() => {
		if(pass.length > 1 && pass.length < 6) {
			setPassChkText('비밀번호는 6자 이상 입력해주세요');
		}else if(pass.length == 0 || pass.length >= 6) {
			setPassChkText('');
		}
	}, [pass]);

	const passChangeHandele = () => {
		Alert.alert("오늘여기", `입력하신 비밀번호로 저장할까요? \n비밀번호 변경 시 로그아웃됩니다`, [
			{
				text: '취소'
			}, {
				text: '저장',
				onPress: () =>{ 
					if(pass.length < 6) {
						Alert.alert('오늘여기', '비밀번호는 6자 이상 입력해주세요')
					} else {
						setLoading(true);
						!async function( ) {
							const idToken = ctx.auth.idToken;
							const password = pass
							try{
								const recv = await sendpassChangeRequest(idToken, password);
								console.log(recv); 
								ctx.dispatch({type: 'logout'});
								navigation.navigate('Login', {status: 'passChange'})
							} catch(e) {
								Alert.alert('오늘여기', '비밀번호가 정상적으로 변경되지 않았습니다')
								console.log(e.message);
							}
							setLoading(false);
						}();
					}
				}
			}
		])
	}

	return (<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={[defaultStyle.wrap, {backgroundColor: '#fff'}]}>
			<View style={{alignItems:'center', backgroundColor: '#fff'}}>
				<Image source={require('../../assets/images/passChange.png')} resizeMode="cover" style={{width: 240, height: 240,}}  />
			</View>
			<View style={defaultStyle.inputArea}>
				<CustomText style={defaultStyle.inputTitle}>비밀번호(6자 이상)</CustomText>
				<TextInput style={defaultStyle.input} secureTextEntry={true}
					onChangeText={(txt) => setPass(txt)}
					value={pass}
					placeholder="변경할 비밀번호를 입력해주세요"/>
			</View>
			<View style={{paddingHorizontal: 26}}>
				<CustomText style={defaultStyle.chkText}>{passchkText}</CustomText>
			</View>
			<View style={defaultStyle.accountBtnArea}>
				<Button title="저장" color="#ffbf00" onPress={passChangeHandele}/>
			</View>
		</View>
	</TouchableWithoutFeedback>)
}