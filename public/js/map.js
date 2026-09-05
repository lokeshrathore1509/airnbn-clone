// Mapbox Map Initialization with safe fallbacks
(function() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  if (typeof mapToken === 'undefined' || !mapToken || mapToken.trim() === "") {
    mapContainer.innerHTML = `
      <div class="d-flex flex-column align-items-center justify-content-center h-100 bg-light text-muted p-4 rounded-4 border">
        <i class="fa-solid fa-map-location-dot fa-3x text-secondary mb-3"></i>
        <h5 class="fw-bold">Location Preview</h5>
        <p class="mb-0 text-center">${listing.location || "Exact destination"}, ${listing.country || ""}</p>
        <small class="text-muted mt-2">Exact location will be provided after confirmed reservation.</small>
      </div>
    `;
    return;
  }

  mapboxgl.accessToken = mapToken.trim();

  let coordinates = [77.2090, 28.6139]; // Default coordinates
  if (
    listing &&
    listing.geometry &&
    Array.isArray(listing.geometry.coordinates) &&
    listing.geometry.coordinates.length === 2 &&
    typeof listing.geometry.coordinates[0] === 'number' &&
    typeof listing.geometry.coordinates[1] === 'number'
  ) {
    coordinates = listing.geometry.coordinates;
  }

  try {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: 9,
      scrollZoom: false,
    });

    // Add navigation control (+ / - buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create marker popup
    const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
      <div style="padding: 6px; font-family: 'Plus Jakarta Sans', sans-serif;">
        <h6 style="margin: 0 0 4px 0; font-weight: 700; color: #222;">${listing.title}</h6>
        <p style="margin: 0; font-size: 0.85rem; color: #717171;">${listing.location || ""}, ${listing.country || ""}</p>
        <span style="display:inline-block; margin-top: 4px; font-size: 0.75rem; color: #FF385C; font-weight: 600;">Exact location after booking</span>
      </div>
    `);

    // Create custom styled marker
    const markerEl = document.createElement('div');
    markerEl.className = 'custom-marker';
    markerEl.innerHTML = '<i class="fa-solid fa-house"></i>';

    new mapboxgl.Marker({ element: markerEl })
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map);

  } catch (err) {
    console.error("Mapbox initialization error:", err);
    mapContainer.innerHTML = `
      <div class="d-flex flex-column align-items-center justify-content-center h-100 bg-light text-muted p-4 rounded-4 border">
        <i class="fa-solid fa-location-dot fa-3x text-danger mb-3"></i>
        <h5 class="fw-bold">${listing.location || "Location"}, ${listing.country || ""}</h5>
        <p class="mb-0 text-center">Interactive map coordinates: [${coordinates.join(', ')}]</p>
      </div>
    `;
  }
})();