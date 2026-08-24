
mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
          // Use the standard style for the map
        // projection: 'globe', // display the map as a globe
         // initial zoom level, 0 is the world view, higher values zoom in
        center: listing.geometry.coordinates,
        zoom: 2, // center the map on this longitude and latitude
    });

    // map.addControl(new mapboxgl.NavigationControl());
    // map.scrollZoom.disable();

    // map.on('style.load', () => {
    //     map.setFog({}); // Set the default atmosphere style
    // });

    // console.log(coordinates);

    // const marker = new mapboxgl.Marker()
    // .setLngLat(coordinates)
    // .addTo(map);

    const marker = new mapboxgl.Marker({color:"red"})

    .setLngLat(listing.geometry.coordinates)
     .setPopup(new mapboxgl.Popup({offset:25 })
    // .setLngLat(e.lngLat)
       
     .setHTML(`<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`)
    )
  .addTo(map);
 
  






































    


