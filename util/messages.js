import axios from "axios";

export async function messageList() {
		const response = await axios.get('https://with-b2c7b-default-rtdb.asia-southeast1.firebasedatabase.app/messages.json')
		return response
}