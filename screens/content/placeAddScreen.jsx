import { Keyboard, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import defaultStyle from "../styleSheet";

import CustomText from "../../Components/customText";
import ImagePicker from "../../Components/imagePicker";
import LocationPicker from "../../Components/locationPicker";
import { useState } from "react";

export default function PlaceAddScreen() {
	
	const [modal, setModal] = useState(false);
	
	const modalCloseHandle = () => {
		setModal(false);
	}
	return (<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={[defaultStyle.wrap, {flex: 1, backgroundColor: '#fff', position: 'relative'}]}>
			<View style={{flex:1, paddingHorizontal: 24}}>	
				<TextInput
						// value={titleInp}
						// onChangeText={(text) => setTitleInp(text)}
						placeholder="어디인가요?"
						style={[styles.textarea, {fontFamily: 'SUIT-SemiBold'}]}
					/>
					<ImagePicker />
					{/* 모달로 바꾸기 */}
					<LocationPicker />

			</View>
		</View>
	</TouchableWithoutFeedback> )
}
const styles = StyleSheet.create({
	textarea: {
		fontSize: 16,
		textAlignVertical: "top",
		padding: 4,
	}
})