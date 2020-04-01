import { addMarker, findNearby } from './MapFunctions';

export async function showLocal(map: any, currentPosition: any, poiTypeNames: string): Promise<any[]> {
    const markers: any[] = [];
    markers.push(
        addMarker(
            currentPosition.coords.latitude,
            currentPosition.coords.longitude,
            'Me',
            'I am here',
            null,
            null,
        ),
    );
    if (poiTypeNames.length > 0) {
        let poiTypes: string[] = poiTypeNames.split(';');
        poiTypes = poiTypes.map((s) => s.trim());
        const pointsOfInterest: any = await findNearby(map, currentPosition, poiTypes, 30000);
        if (pointsOfInterest && pointsOfInterest.length > 0) {
            pointsOfInterest.forEach((result: any) => {
                markers.push(
                    addMarker(
                        result.geometry.location.lat(),
                        result.geometry.location.lng(),
                        result.name,
                        result.vicinity,
                        result,
                        result.icon,
                    ));
            });
        }
    }
    return markers;
}
