import axios from "axios";
import { Buffer } from "buffer";

export async function sendAddPlaceRequest(placeData, fileData, fileURI, idToken, writer) {
	const fileName = fileURI.substring(fileURI.lastIndexOf('/') + 1);
	console.log(fileName)
	const endPoint = `https://firebasestorage.googleapis.com/v0/b/with-b2c7b.appspot.com/o/${fileName}`
	// 1. 파일 업로드 (Storage)
	console.log('[fileData]', fileData?.length, ' : ' , fileData?.substring(0, 100));
	const uploadResult = await axios({
		url: endPoint,
		method: 'post',
		headers: {
			"Content-type": "image/jpeg"
		},
		// npm i buffer
		data: Buffer.from(fileData, "base64")
	})
	// console.log(uploadResult)

	// // 2. 데이터 저장(Realtime Database)
	// console.log(placeData);
	
	const placeItem ={...placeData, 
		imgURI: `${endPoint}?alt=media`, 
		writer,
		createdAt: new Date()}
	await axios.post(`https://with-b2c7b-default-rtdb.asia-southeast1.firebasedatabase.app/place.json?auth=${idToken}`, {
		placeItem, favorite: ''
	})
	console.log(placeItem);
}

export async function placeList(idToken) {
	const response = await axios.get(`https://with-b2c7b-default-rtdb.asia-southeast1.firebasedatabase.app/place.json?auth=${idToken}`)
	return response.data;
}
export async function placeFavorite(favoriteArr, name, idToken) {
	const response = await axios.patch(`https://with-b2c7b-default-rtdb.asia-southeast1.firebasedatabase.app/place/${name}.json?auth=${idToken}`, {
		favorite: favoriteArr
	})
	console.log('????????', response.data)
	return response.data

}

export async function placeUpdate(placeData, fileData, fileURI, name, idToken, writer) {
	const fileName = fileURI.substring(fileURI.lastIndexOf('/') + 1);
	const endPoint = `https://firebasestorage.googleapis.com/v0/b/with-b2c7b.appspot.com/o/${fileName}`
	const uploadResult = await axios({
		url: endPoint,
		method: 'post',
		headers: {
			"Content-type": "image/jpeg"
		},
		// npm i buffer
		data: Buffer.from(fileData, "base64")
	})

	const placeItem ={...placeData, 
		imgURI: `${endPoint}?alt=media`, 
		writer,
		createdAt: new Date()}
	const response = await axios.patch(`https://with-b2c7b-default-rtdb.asia-southeast1.firebasedatabase.app/place/${name}.json?auth=${idToken}`, {
		placeItem
	})
	return response.data
}

export async function placeDelete(name, idToken) {
	const response = await axios.delete(`https://with-b2c7b-default-rtdb.asia-southeast1.firebasedatabase.app/place/${name}.json?auth=${idToken}`)
	return response.data
}