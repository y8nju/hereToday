import { StyleSheet } from "react-native";

const defaultStyle = StyleSheet.create({
	wrap: {
		flex: 1, 
		paddingVertical: 30,
		backgroundColor: '#fff',
	},
	inputArea: {
		paddingHorizontal: 24,
		marginBottom: 16
	},
	inputTitle: {
		marginBottom: 4,
	},
	input: {
		height: 40,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 4,
		backgroundColor: '#fff',
		padding: 10,
	},
	chkText: {
		color: '#ff5d5d'
	},
	accountBtnArea: {
		paddingHorizontal: 24,
		marginTop: 12
	}
})
export default defaultStyle;