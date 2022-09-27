import axios from "axios";

const GOOGLE_APP_KEY = 'AIzaSyAwu3irzU1v9B4A-BFuXeuh6aZOzAaD3sY';

export function createStaticMapUri(lat, lng) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=400x400&markers=color:red%7C${lat},${lng}&key=${GOOGLE_APP_KEY}`
}

export async function getAdresses(lat, lng) {
    const endPoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_APP_KEY}&language=ko`
    const response = await axios.get(endPoint);
    const adressData = response.data.results;
    const contry = adressData[adressData.length-1].formatted_address;

    return adressData[0].formatted_address.substr(contry.length+1);
}