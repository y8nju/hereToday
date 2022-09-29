import { Button, Image, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import defaultStyle from "../screens/styleSheet";

export default function NotLogin() {
	const navigation = useNavigation();
	const loginHandle = () => {
		navigation.navigate("Account");
	}
	return (<View style={[defaultStyle.wrap, {justifyContent: 'center'}]}>
		<View style={{alignItems:'center'}}>
			<Image source={require('../assets/images/notLogin.png')} resizeMode="cover" style={{width: 280, height: 280}}  />
		</View>
		<View style={defaultStyle.accountBtnArea}>
			<Button title="로그인 하기" color="#ffbf00" onPress={loginHandle} />
		</View>
	</View>)
	
}