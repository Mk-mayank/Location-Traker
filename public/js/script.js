const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit('sent-location', { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true, // Use high accuracy if available
      maximumAge: 0,            // Don't use cached data
      timeout: 5000             // Timeout after 5 seconds
    }
  );
}

const map = L.map("map").setView([0,0],16); // Assuming you're using Leaflet to initialize a map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution : "OpenStreetMap"
}).addTo(map)

const markers = {};

socket.on("received-location" , (data)=>{
  const { latitude, longitude , id} = data ;
  map.setView([latitude ,longitude] );

  if(markers[id]){
    markers[id].setLatLng([latitude ,longitude]);
  }
  else{
    markers[id]= L.marker([latitude , longitude ] ).addTo(map) ;
  }
});

socket.on("user-disconnected", (id)=>{
  map.removeLayer(markers[id]);
  delete markers[id]; 
})

