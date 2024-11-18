export default function GetUserLocation(setLocation, setLoading){

    if (navigator.geolocation) {
        setLoading(true)
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log("Geolocation not supported");
      }
      
      function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation({ lat: latitude, lng: longitude })
        setLoading(false)
      }
      
      function error() {
        console.warn("User denied location access");
        setLoading(false)

      }
}