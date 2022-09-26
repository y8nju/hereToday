const GOOGLE_APP_KEY = 'AIzaSyAwu3irzU1v9B4A-BFuXeuh6aZOzAaD3sY';

export function createStaticMapUri(lat, lng) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=400x400&markers=color:red%7C${lat},${lng}&key=${GOOGLE_APP_KEY}`
}