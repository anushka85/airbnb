

      mapboxgl.accessToken =maptoken;
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style:"mapbox://styles/mapbox/streets-v12",
            center: listing.geometry.coordinates, // starting position [lng, lat]
            zoom: 6 // starting zoom
        });
        const marker=new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset:25})
        //.setLngLat(e.lngLat)
        .setHTML(`<h4>${listing.title} </h4><p>Exact location will be provided after booking</p>`))
        .addTo(map);
    
    