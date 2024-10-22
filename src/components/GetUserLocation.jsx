export default function GetUserLocation(setUserLocation){

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log("Geolocation not supported");
        setUserLocation(null)

      }
      
      function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setUserLocation([longitude, latitude]);
      }
      
      function error() {
        console.warn("User denied location access");
        setUserLocation(null)
      }
}