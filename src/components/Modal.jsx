import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react'
import {
  APIProvider,
  Map,
  Marker,
  useMarkerRef
} from '@vis.gl/react-google-maps';const googleKey = import.meta.env.VITE_GOOGLE_API_KEY
import GetUserLocation from '../components/GetUserLocation.jsx'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',          
  maxWidth: 700,         
  height: '90vh',         
  maxHeight: 500,   
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  m: 0
};

export default function LocationModal({latlng, setLatlng}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [markerRef, marker] = useMarkerRef();

  useEffect(() => {
    if (!marker) return;

    // Set marker as draggable
    marker.setDraggable(true);

    // Add an event listener to handle the drag end event
    marker.addListener('dragend', (event) => {
/*       const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }; */
      setLatlng({ lat: event.latLng.lat(), lng: event.latLng.lng()})
    });
    //setLatlng({ lat: newPosition.lat, lng: newPosition.lng });

    return () => {
      google.maps.event.clearListeners(marker, 'dragend');
    };
  }, [marker, setLatlng]);

  function handleEnableLocation() {
    GetUserLocation(setLatlng);
}

  return (
    <div>
    <div className="w-full flex ml-auto justify-end">
    <img onClick={handleOpen} className="mb-4 border-2 rounded border-gray-700 cursor-pointer hover:brightness-90" src="src/assets/vanMap.png"></img>
    </div>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <APIProvider apiKey={googleKey}>
          <div className="flex flex-col items-center mb-2">
            <button onClick={handleEnableLocation} className="text-sm text-blue-600 font-medium hover:underline">Use my current location</button>
            <p className="text-sm">Or drag marker to set location on the map</p>

          </div>
          <div className="h-[calc(100%-50px)] border border-gray-300 overflow-hidden"> {/* Adjusts height */}
              <Map
                style={{ width: '100%', height: '100%' }}
                defaultCenter={{ lat: 49.28204, lng: -123.1171 }}
                defaultZoom={11}
                gestureHandling="greedy"
                disableDefaultUI={true}
              >
                <Marker ref={markerRef} position={{ lat: latlng.lat, lng: latlng.lng }} />
              </Map>
            </div>
        </APIProvider>        
        </Box>
      </Modal>
    </div>
  );
}