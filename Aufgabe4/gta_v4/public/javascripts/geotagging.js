/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
function updateLocation() {

    let usr_latitude = document.getElementById("disc-latitude").value;
    let usr_longitude = document.getElementById("disc-longitude").value;
    let mapManager = new MapManager();
    const taglist_json = document.getElementById("mapView").getAttribute("data-tags");

    if(!usr_latitude && !usr_longitude) {
        LocationHelper.findLocation((location) => {
        document.getElementById("tag-latitude").value = location.latitude;
        document.getElementById("tag-longitude").value = location.longitude;

        document.getElementById("disc-latitude").value = location.latitude;
        document.getElementById("disc-longitude").value = location.longitude;

        
        mapManager.initMap(location.latitude, location.longitude);
        mapManager.updateMarkers(location.latitude, location.longitude, JSON.parse(taglist_json));
        console.log("first location");
    });
    }
    else {
        mapManager.initMap(usr_latitude, usr_longitude);
        mapManager.updateMarkers(usr_latitude, usr_longitude, JSON.parse(taglist_json));
    }

    let placeholders = document.getElementsByClassName("placeholder");
    while (placeholders.length > 0) {
        placeholders[0].parentNode.removeChild(placeholders[0]);
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});