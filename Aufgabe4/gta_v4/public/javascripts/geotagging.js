/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
let mapManager = null;

function refreshDiscovery({searchTerm, latitude, longitude}) {
    const parameter = new URLSearchParams({
        searchTerm,
        latitude,
        longitude
    })
    fetch(`/api/geotags?${parameter.toString()}`)
        .then(res => {
            if (!res.ok) throw new Error(`Fehler bei /api/geotags: ${res.status}`);
            return res.json();
        })
        .then(taglist => {
            //const taglist = json.data;
            const nameInput = document.getElementById("tag-name");
            const hashtagInput = document.getElementById("tag-hashtag");
            if (nameInput) nameInput.value = '';
            if (hashtagInput) hashtagInput.value = '';
            const ul = document.getElementById("discoveryResults")
            ul.innerHTML = "";

            if (taglist.length === 0) {
                 const li = document.createElement("li");
                li.textContent = "No results to display.";
                ul.appendChild(li);
            }
            else {
                taglist.forEach(geoTag => {
                   const li = document.createElement("li");
                   li.textContent = `${geoTag.name} (${geoTag.latitude}, ${geoTag.longitude}) ${geoTag.hashtag}`;
                   ul.appendChild(li);
                });
            }

            const mapContainer = document.getElementById("map")
            mapContainer.setAttribute("data-tags", JSON.stringify(taglist));
            mapManager.updateMarkers(
                Number(latitude), 
                Number(longitude),
                taglist
            );

            //updateLocation();

        })
        .catch(err => {
            console.error(err);
        })
}


function initLocation() {
    LocationHelper.findLocation(location => {
        document.getElementById("tag-latitude").value = location.latitude;
        document.getElementById("tag-longitude").value = location.longitude;
        document.getElementById("disc-latitude").value = location.latitude;
        document.getElementById("disc-longitude").value = location.longitude;

        mapManager.initMap(
            Number(location.latitude),
            Number(location.longitude));
        const searchTerm = document.getElementById("search-term").value || "";
        refreshDiscovery({
        searchTerm,
        latitude: location.latitude,
        longitude: location.longitude
        });
    });

    let placeholders = document.getElementsByClassName("placeholder");
    while (placeholders.length > 0) {
        placeholders[0].parentNode.removeChild(placeholders[0]);
    }
    
}


// ... your code here ...
function updateLocation() {
    const latitude = document.getElementById("disc-latitude").value;
    const longitude = document.getElementById("disc-longitude").value;

    if (!latitude || !longitude) return;

    const taglist_json = document.getElementById("map").getAttribute("data-tags");
    
    mapManager.updateMarkers(latitude, longitude, JSON.parse(taglist_json));
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    mapManager = new MapManager();
    initLocation();

    const tagForm = document.getElementById("tag-form");
    tagForm.addEventListener("submit", event => {
        event.preventDefault();
        const name = document.getElementById("tag-name").value;
        const hashtag = document.getElementById("tag-hashtag").value;
        const latitude = document.getElementById("tag-latitude").value;
        const longitude = document.getElementById("tag-longitude").value;

        fetch('/api/geotags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, latitude, longitude, hashtag })
        })
        .then(res => {
            if (!res.ok) throw new Error(`Fehler beim Erstellen: ${res.status}`);
            return res.json();
        })
        .then(newTag => {
            const lat = document.getElementById("tag-latitude").value;
            const lon = document.getElementById("tag-longitude").value;
            const searchTerm = document.getElementById("search-term").value || "";
            refreshDiscovery({ searchTerm, latitude: lat, longitude: lon });
        })
        .catch(err => console.error(err));
    });

    const disForm = document.getElementById("discoveryFilterForm");
    disForm.addEventListener("submit", event => {
        event.preventDefault();
        const searchTerm = document.getElementById("search-term").value || "";
        const lat = document.getElementById("disc-latitude").value;
        const lon = document.getElementById("disc-longitude").value;
        refreshDiscovery({ searchTerm, latitude: lat, longitude: lon });
    })
});