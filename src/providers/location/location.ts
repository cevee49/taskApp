import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider {

  data: any;

  constructor(public http: Http) {
    console.log('Hello LocationProvider Provider');
  }

  applyHaversine(latX,lngX, lat, lng): number{
 
    let usersLocation = {
        lat: lat,
        lng: lng
    };

    let placeLocation = {
            lat: latX,
            lng: lngX
        };

    let d = this.getDistanceBetweenPoints(
            usersLocation,
            placeLocation,
            'km');
        // ).toFixed(2);
    

    return d;
}

getDistanceBetweenPoints(start, end, units): number{

    let earthRadius = {
        miles: 3958.8,
        km: 6371
    };

    let R = earthRadius[units || 'km'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

}

toRad(x){
    return x * Math.PI / 180;
}
}
