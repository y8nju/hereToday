import { useContext, useEffect } from "react";
import { Button, Image, StyleSheet, ToastAndroid, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";

import defaultStyle from "./styleSheet";

import { AppContext } from "../context/appContext";
import CustomText from "../Components/customText";

export default function HomeScreen({route}) {
	const navigation = useNavigation(AppContext);
	const ctx = useContext(AppContext);
	console.log(route.params)
	useEffect(()=> {
		navigation.setOptions({
			title: "WITH",
			headerTitleStyle: {fontFamily: "Kyobo"}, 
		});
		if(route.params !== undefined) {
			switch(route.params.status) {
				case 'login':
					navigation.dispatch(CommonActions.setParams({ status: '' }));
					return ToastAndroid.show("어서오세요", ToastAndroid.SHORT);
				case 'logout':
					navigation.dispatch(CommonActions.setParams({ status: '' }));
					return ToastAndroid.show("다음에 또 만나요", ToastAndroid.SHORT);
				case 'signup':
					navigation.dispatch(CommonActions.setParams({ status: '' }));
					return ToastAndroid.show("회원가입이 완료되었습니다", ToastAndroid.SHORT);
			}
		}
	}, [route])
	const loginHandle = () => {
		navigation.navigate("Account");
	}
	if(!ctx.auth) {
		return (<View style={[defaultStyle.wrap, {justifyContent: 'center'}]}>
			<View style={{alignItems:'center'}}>
				<Image source={require('../assets/images/notLogin.png')} resizeMode="cover" style={{width: 280, height: 280}}  />
			</View>
			<View style={defaultStyle.accountBtnArea}>
				<Button title="로그인 하기" color="#ffbf00" onPress={loginHandle} />
			</View>
		</View>)
	}
	return ( <View style={[defaultStyle.wrap]}>
		{/* <Text>{ctx.auth.email}! </Text> */}
		<CustomText style={{fontSize: 24}} type={'hand'}> 준비중</CustomText>
	</View> );
}
const styles = StyleSheet.create({

})