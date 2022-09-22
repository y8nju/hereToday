import axios from "axios";
const APP_KEY = "AIzaSyA5-bMDjoxJPGF_pSwhNqlZND7VEkx0qUw"

export async function sendRegisterReq(email, password) {
	// try{
		const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APP_KEY}`, {
			email: email,
			password: password,
			returnSecureToken: true
		})
		return response.data
	// } catch(e) {
	// 	console.log(e.message);
	// }
}

export async function sendLoginRequest(email, password) {
	const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APP_KEY}`, {
		email: email,
		password: password,
		returnSecureToken: true
	})
	return response.data
}