export default function GetUserLocation(setUserLocation){

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log("Geolocation not supported");
      }
      
      function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setUserLocation([longitude, latitude]);
      }
      
      function error() {
        console.log("Unable to retrieve your location");
      }
}