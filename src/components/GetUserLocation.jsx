export default function GetUserLocation(setLatlng){

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log("Geolocation not supported");
        setLatlng(null)

      }
      
      function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLatlng({ lat: latitude, lng: longitude })

      }
      
      function error() {
        console.warn("User denied location access");
        setLatlng(null)

      }
}