// File origin: VS1LAB A3

const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    // TODO: ... your code here ...

    #geoTagStorageField = [];


    constructor () {
        this.#geoTagStorageField = [];
        this.nextId = 1;//0 ist default ID sollte nur vergeben sein wenn was schief gelaufen ist.
        this.fillFromSamples();
    }

    /**TODOs ID
     * <x> getID
     * <x> remove by ID
     * <x> get by ID
     */

    getID() {
        return this.nextId++;
    }
    removeGeoTagByID(id) {
        const index = this.#geoTagStorageField.findIndex(tag => tag.id == id);
        this.#geoTagStorageField.splice(index, 1);
    }
    getGeoTagByID(id) {
        const index = this.#geoTagStorageField.findIndex(tag => tag.id == id);
        if (index == -1) return null;
        return this.#geoTagStorageField[index];
    }
    getAll() {
        return this.#geoTagStorageField;
    }

    addGeoTag (geotag) {
        this.#geoTagStorageField.push(geotag);
    }

    removeGeoTag (name) {
        this.#geoTagStorageField = this.#geoTagStorageField.filter(tag => tag.Name !== name);
    }

    getNearbyGeoTags (latitude, longitude, radius) {
        const radiusSquared = radius * radius;
        let nearbyGeoTags = [];
        this.#geoTagStorageField.forEach(tag => {
            let deltaX = tag.latitude - latitude;
            let deltaY = tag.longitude - longitude;
            if (radiusSquared >= ((deltaX * deltaX) + (deltaY + deltaY))) nearbyGeoTags.push(tag);
        })
        return nearbyGeoTags;
    }

    searchNearbyGeoTags (latitude, longitude, radius, keyword) {
        let searchResultField = [];
        const nearbyGeoTags = this.getNearbyGeoTags(latitude, longitude, radius);
        nearbyGeoTags.forEach( tag => {
            if (tag.name.includes(keyword)) searchResultField.push(tag);
            else if (tag.hashtag.includes(keyword)) searchResultField.push(tag);
        });

        return searchResultField;
    }

    fillFromSamples () {
        const _name = 0;
        const _latitude = 1;
        const _longitude = 2;
        const _hashtag = 3;
        GeoTagExamples.tagList.forEach(tag => {
            this.addGeoTag(new GeoTag(tag[_name],tag[_latitude], tag[_longitude], tag[_hashtag], this.getID()));
        })
    }

}

module.exports = InMemoryGeoTagStore
