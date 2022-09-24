import { useContext, useEffect } from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import defaultStyle from "./styleSheet";

import { AppContext } from "../context/appContext";
import CustomText from "../Components/customText";

export default function HomeScreen() {
	const navigation = useNavigation(AppContext);
	const ctx = useContext(AppContext);
	useEffect(()=> {
		navigation.setOptions({
			title: "WITH",
			headerTitleStyle: {fontFamily: "Kyobo"}, 
		})
	})
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