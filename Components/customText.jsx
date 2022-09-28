import {Text} from "react-native";

export default function CustomText({children, style, weight, type}) {
	if(!type) {
		if(weight === 300) {
			return (<Text style={[{fontFamily: 'SUIT-Light'}, style]}>{children}</Text>)
		}else if(weight === 600) {
			return (<Text style={[{fontFamily: 'SUIT-SemiBold'}, style]}>{children}</Text>)
		}else if(weight === 800) {
			return (<Text style={[{fontFamily: 'SUIT-ExtraBold'}, style]}>{children}</Text>)
		}else if(!weight) {
			return (<Text style={[{fontFamily: 'SUIT-Regular'}, style]}>{children}</Text>)
		}
	}else if(type == 'hand') {
		return (<Text style={[{fontFamily: 'Kyobo'}, style]}>{children}</Text>)
	}
}