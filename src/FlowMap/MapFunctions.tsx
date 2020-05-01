import { Marker } from 'google-maps-react';
import React = require('react');

export async function getCurrentLocation(options?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

export async function findNearby(map: any, currentPosition: any, keys: string[], radiusMeters: number): Promise<any[]> {
    const service = new google.maps.places.PlacesService(map);
    const me = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
    const request: any = {
        location: me,
        radius: radiusMeters,
        types: keys,
      };
    const { results, status } = await new Promise((resolve) => {
        service.nearbySearch(
        request,
        // pass a callback to getDetails that resolves the promise
        (results, status) => resolve({ results, status }),
        );
    });
    return results;

}

export function addMarker(latitude: number, longitude: number, label: string, tooltip: string, place: any, icon: string): any {
    // const placeLoc = place.geometry.location;
    const pos: any = {lat: latitude, lng: longitude};
    return (
        <Marker
            position={pos}
            label={label}
            title={tooltip}
            onClick={(marker: any) => {openInfoWindow(marker, place); }}
            icon={icon}
        />
    );
}

export function openInfoWindow(marker: any, place: any) {
    const contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<span style="font-size: 20px">' + place.name + '</span>' +
        '<div id="bodyContent">' +
        '<p style="font-size: 16px">' + place.vicinity + '</p>' +
        '</div>' +
        '</div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
    infowindow.setPosition(marker.position);
    infowindow.open(this.map);
}
