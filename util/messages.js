import axios from "axios";

export async function messageList(idToken) {
		const response = await axios.get(`https://with-b2c7b-default-rtdb.asia-southeast1.firebasedatabase.app/messages.json?auth=${idToken}`)
		return response.data;
}

export async function messageWrite(title, writer, content, idToken) {
	const response = await axios.post(`https://with-b2c7b-default-rtdb.asia-southeast1.firebasedatabase.app/messages.json?auth=${idToken}`, {
		title, writer, content, createdAt: new Date()
	})
	return response.data
}

export async function messageDetail(name, idToken) {
	const response = await axios.get(`https://with-b2c7b-default-rtdb.asia-southeast1.firebasedatabase.app/messages/${name}.json?auth=${idToken}`)
	return response.data
}

export async function messageUpdate(title, content, name, idToken) {
	const response = await axios.patch(`https://with-b2c7b-default-rtdb.asia-southeast1.firebasedatabase.app/messages/${name}.json?auth=${idToken}`, {
		title, content
	})
	return response.data
}

export async function messageDelete(name, idToken) {
	const response = await axios.delete(`https://with-b2c7b-default-rtdb.asia-southeast1.firebasedatabase.app/messages/${name}.json?auth=${idToken}`)
	return response.data
}