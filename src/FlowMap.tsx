import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import * as React from 'react';
import * as CommonFunctions from './common-functions';
import {FlowComponent} from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowComponent';
import { IManywho } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/interfaces';

declare const manywho: IManywho;

class FlowMap extends FlowComponent {

    context: any;

    lng: any;
    lat: any;
    os: string;
    browser: string;
    browserManu: string;

    map: any;

    google: any;
    googleLoaded: boolean = false;

    markers: any[] = [];

    constructor(props: any) {
        super(props);

        this.calculateMarkers = this.calculateMarkers.bind(this);
        this.detectLocation = this.detectLocation.bind(this);
        this.locationDetected = this.locationDetected.bind(this);
        this.calculateMarkers = this.calculateMarkers.bind(this);
        this.searchResult = this.searchResult.bind(this);
        this.createMarker = this.createMarker.bind(this);
        this.apiLoaded = this.apiLoaded.bind(this);
        this.mapReady = this.mapReady.bind(this);
        this.addCurrentLocation = this.addCurrentLocation.bind(this);
        this.createMarker = this.createMarker.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        // {apiKey: 'AIzaSyDZ2cbjJkFl5qygZYcKrcZVTzfX70G_-nY'}
        // GoogleApiWrapper(this.apiLoaded);

    }

    async componentDidMount() {
        const googleMapScript = document.createElement('script');
        googleMapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ2cbjJkFl5qygZYcKrcZVTzfX70G_-nY&libraries=places';
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener('load', this.apiLoaded);
    }

    apiLoaded() {
        console.log('google api loaded');
        this.googleLoaded = true;
        this.detectLocation();
    }

    detectLocation() {
        navigator.geolocation.getCurrentPosition(this.locationDetected);
        this.os = navigator.platform;
        this.browser = navigator.product;
        this.browserManu = navigator.vendor;
        // this.save();
    }

    locationDetected(result: any) {
        console.log('location loaded');
        this.lat = result.coords.latitude;
        this.lng = result.coords.longitude;
        this.forceUpdate();
    }

    mapReady(mapProps: any, map: any) {
        this.map = map;
        this.addCurrentLocation(map);
        this.calculateMarkers(mapProps, map);
    }

    addCurrentLocation(map: any) {
        const pos: any = {lat: this.lat, lng: this.lng};
        const place: any = new google.maps.Marker();

        place.geometry = {};
        place.geometry.location = pos;
        place.name = 'Here';

        this.createMarker(this.map, place);

    }

    calculateMarkers(mapProps: any, map: any) {
        const service = new google.maps.places.PlacesService(map);
        const me = new google.maps.LatLng(this.lat, this.lng);
        const request: any = {
            location: me,
            radius: 30000,
            // query: 'hospital',
            // types: ['hospital', 'health'], // thsis is where you set the map to get the hospitals and health related places
            types: ['hospital', 'health'],
          };
        service.nearbySearch(request, this.searchResult);
    }

    searchResult(results: any, status: any) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
              this.createMarker(this.map, results[i]);
            }
          }
    }

    createMarker(map: any, place: any): any {
        const placeLoc = place.geometry.location;
        this.markers.push(
            <Marker
                position={placeLoc}
                label={place.name}
                title={place.name}
                onClick={(marker: any) => {this.openInfoWindow(marker, place); }}
            />,
        );
        this.forceUpdate();

    }

    openInfoWindow(marker: any, place: any) {
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

    render() {

        let map: any;

        // check api loaded
        if (this.googleLoaded === true) {
            // check location found
            if (this.lng && this.lat) {
                // const pos: any = new google.maps.LatLng(this.lat, this.lng);
                const pos: any = {lat: this.lat, lng: this.lng};

                map = (
                    <Map
                    google={google}
                    zoom={12}
                    initialCenter={pos}
                    onReady={this.mapReady}
                    >
                        {this.markers}
                    </Map>
                );
            }
        }

        return (
            <div
                style={{width: '100%', height: '100%'}}
            >
                {map}
            </div>
        );

    }
}

manywho.component.register('FlowMap', FlowMap);

// export default FlowMap;

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDZ2cbjJkFl5qygZYcKrcZVTzfX70G_-nY',
  })(FlowMap);
