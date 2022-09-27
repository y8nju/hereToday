import { Pressable, View } from "react-native";
import CustomText from "./customText";

export default function HeaderRightButton({children, onPress}) {
	return (<View style={{overflow: 'hidden', borderRadius: 8}}>
		<Pressable android_ripple={{color: "#00000008"}} style={{paddingHorizontal: 4, paddingVertical: 8}} onPress={onPress}>
			<CustomText>{children}</CustomText>
		</Pressable>
	</View>)
}