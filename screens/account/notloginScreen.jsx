import { CommonActions, useIsFocused } from "@react-navigation/native";
import { ToastAndroid } from "react-native";

import NotLogin from "../../Components/notLogin";

export default function NotLoginScreen({navigation, route}) {
	const focused = useIsFocused();
	console.log(focused)
	useEffect(()=> {
		if(route.params !== undefined) {
			switch(route.params.status) {
				case 'logout':
					navigation.dispatch(CommonActions.setParams({ status: '' }));
					return ToastAndroid.show("다음에 또 만나요", ToastAndroid.LONG);
				case 'passChange':
					navigation.dispatch(CommonActions.setParams({ status: '' }));
					return ToastAndroid.show("비밀번호가 변경되어 로그아웃 되었습니다", ToastAndroid.LONG);
			}
		}
	}, [route, focused]);

	return <NotLogin />	
}