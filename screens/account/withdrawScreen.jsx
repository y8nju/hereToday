import { useContext, useEffect, useState } from "react";
import { Alert, Button, Image, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { sendDeleteRequest } from "../../util/account";

import defaultStyle from "../styleSheet";

import { AppContext } from "../../context/appContext";
import CustomText from "../../Components/customText";

export default function WithdrawScreen({navigation}) {
	const [loading, setLoading] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const [chkColor, setChkCOlor] = useState('#bbb');
	const ctx = useContext(AppContext);

	useEffect(() => {

	}, [isDisabled]);

	const checkHandle = () => {
		setIsDisabled(!isDisabled);
		if(isDisabled === true) {
			setChkCOlor('#ffbf00');
		}else {
			setChkCOlor('#bbb');
		}
	}

	const accountDeleteHandle = () => {
		Alert.alert("오늘여기", "서비스를 탈퇴 하실건가요?", [
			{
				text: '취소'
			}, {
				text: '탈퇴',
				onPress: () =>{ 
					setLoading(true);
					!async function( ) {
						const idToken = ctx.auth.idToken;
						try{
							const recv = await sendDeleteRequest(idToken);
							console.log(recv); 
							ctx.dispatch({type: 'logout'});
							navigation.navigate('WithdrawSuccess', {status: 'success'})
							// 마운트 확인
						} catch(e) {
							Alert.alert('오늘여기', '탈퇴가 정상적으로 이루어지지 않았습니다')
							console.log(e.message);
						}
						setLoading(false);
					}();
					
				}
			}
		])
	}
	return (<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={{flex: 1, backgroundColor: '#fff'}}>
			<View style={[defaultStyle.wrap]}>
				<View style={{alignItems:'center', backgroundColor: '#fff'}}>
					<Image source={require('../../assets/images/withraw.png')} resizeMode="cover" style={{width: 240, height: 240,}}  />
				</View>
				<View style={{paddingHorizontal: 24}}>
					<CustomText style={{fontSize: 18}} weight={600}>
						서비스 탈퇴 전{'\n'}아래 주의 사항을 꼭 확인해 주세요.
					</CustomText>
					<View style={{marginTop: 24}}>
						<CustomText style={styles.withdrawText}>
							· 탈퇴 시, 오늘여기 서비스 이용이 불가합니다.
						</CustomText>
						<CustomText style={styles.withdrawText}>
							· 오늘여기 서비스를 탈퇴하더라도 등록하신 컨텐츠는 유지됩니다.{'\n'}
							오늘여기 서비스에 등록한 컨텐츠 삭제를 원하시는 경우, 탈퇴 전 삭제해 주시기 바랍니다
						</CustomText>
					</View>
				</View>
			</View>
			<View style={{marginTop: 'auto'}}>
				<View style={{backgroundColor: '#f1f1f1', padding: 20, }}>
				<BouncyCheckbox
					size={18}
					style={{margin:0}}
					text="안내사항을 모두 확인했으며, 탈퇴 시 회원 정보는 모두 삭제 및 복구가 불가함에 동의합니다 "
					textStyle={{fontFamily: 'SUIT-Regular', fontSize: 12, textDecorationLine: 'none'}}
					disableBuiltInState
					fillColor={chkColor}
					unfillColor="#ddd"
					isChecked={!isDisabled}
					onPress={checkHandle}
				/>
				</View>
				<Button title="탈퇴" color="#ffbf00" onPress={accountDeleteHandle} disabled={isDisabled}/>
			</View>
		</View>
	</TouchableWithoutFeedback>)
}

const styles = StyleSheet.create({
	withdrawText: {
		color: '#777',
		marginBottom: 16,
		lineHeight: 20
	}
});