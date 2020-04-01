import { FlowComponent } from 'flow-component-model';
import { Map, Marker } from 'google-maps-react';
import * as React from 'react';
import { showLocal } from './LocalMode';
import { getCurrentLocation } from './MapFunctions';

declare const manywho: any;

export default class FlowMap extends FlowComponent {

    context: any;

    currentPosition: any;
    os: string;
    browser: string;
    browserManu: string;

    map: any;

    google: any;
    googleLoaded: boolean = false;

    markers: any[] = [];

    constructor(props: any) {
        super(props);
        this.apiLoaded = this.apiLoaded.bind(this);
        this.mapReady = this.mapReady.bind(this);

        // {apiKey: 'AIzaSyDZ2cbjJkFl5qygZYcKrcZVTzfX70G_-nY'}
        // GoogleApiWrapper(this.apiLoaded);

    }

    async componentDidMount() {
        await super.componentDidMount();

        this.os = navigator.platform;
        this.browser = navigator.product;
        this.browserManu = navigator.vendor;

        this.currentPosition = await getCurrentLocation();

        const googleMapScript = document.createElement('script');
        const apiKey = this.getAttribute('apiKey', '');
        googleMapScript.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places';
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener('load', this.apiLoaded);
    }

    // fires when the maps script has loaded
    async apiLoaded() {
        this.googleLoaded = true;
        this.forceUpdate();
    }

    // this triggers when the map page element is ready from the event handler on <Map>
    async mapReady(mapProps: any, map: any) {
        this.map = map;
        // decide what to do based on attribute "mode"
        const mode = this.getAttribute('mode', 'local');
        switch (mode) {
            case 'local':
                const poiTypes: string = this.getAttribute('poiTypes', '');
                this.markers = await showLocal(this.map, this.currentPosition, poiTypes);
                break;
        }

        this.forceUpdate();
    }

    render() {

        let map: any;

        // check api loaded
        if (this.googleLoaded === true) {
            // check location found
            if (this.currentPosition) {
                // const pos: any = new google.maps.LatLng(this.lat, this.lng);
                const pos: any = {lat: this.currentPosition.coords.latitude, lng: this.currentPosition.coords.longitude};

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
/*
export default GoogleApiWrapper({
    apiKey: 'AIzaSyDZ2cbjJkFl5qygZYcKrcZVTzfX70G_-nY',
  })(FlowMap);
*/
