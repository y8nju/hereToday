import { Image, ToastAndroid, View } from "react-native";
import { CommonActions } from "@react-navigation/native";
import defaultStyle from "../styleSheet";
import CustomText from "../../Components/customText";
import { useEffect } from "react";

export default function WithdrawSuccessScreen({navigation, route}) {

	useEffect(() => {
		if(route.params !== undefined) {
			switch(route.params.status) {
				case 'success':
					navigation.dispatch(CommonActions.setParams({ status: '' }));
					return ToastAndroid.show("좋은 서비스로 다시 만나길 바랄게요", ToastAndroid.SHORT);
			}
		}
	})

    return (<View style={[defaultStyle.wrap, {backgroundColor: '#fff', justifyContent: 'center'}]}>
    <View style={{alignItems:'center', backgroundColor: '#fff'}}>
        <Image source={require('../../assets/images/withrawSuccess.png')} resizeMode="cover" style={{width: 240, height: 240,}}  />
    </View>
    <View style={{paddingHorizontal: 20, marginTop: 20}}>
        <CustomText style={{fontSize: 18, textAlign: 'center'}} weight={600}>서비스 탈퇴가 완료되었습니다</CustomText>
    </View>
</View>)
}