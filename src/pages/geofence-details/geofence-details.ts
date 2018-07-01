import { Component, NgZone } from "@angular/core";
import { NavController, NavParams, MenuController } from "ionic-angular";
//import * as Leaflet from "leaflet";
import { GeofenceService } from "../../services/geofence-service";
import { Storage } from '@ionic/storage';
import { GeofenceListPage } from "../geofence-list/geofence-list";
declare var google;
declare var circle;
declare var marker;


@Component({
  templateUrl: "geofence-details.html"
})
export class GeofenceDetailsPage {
  private geofence: Geofence;
  private _radius: number;
  private _latLng: any;
  private notificationText: string;
  private transitionType: string;
  private circle: any;
  private marker: any;
  private map: any;
  private autocompleteItems: any;
  private _autocompleteText: string;
  private GoogleAutocomplete: any;
  private geocoder: any;
  private _geofenceDesc: string;


  constructor(public zone: NgZone,
    private nav: NavController,
    navParams: NavParams,
    private geofenceService: GeofenceService,
    private menu: MenuController,
    private storage: Storage
  ) {
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder;
    this.geofenceService = geofenceService;
    this.geofence = navParams.get("geofence");
    this.transitionType = this.geofence.transitionType.toString();
    this.notificationText = this.geofence.notification.text;
    this._radius = this.geofence.radius;
    console.log(this.geofence.latitude + ',' + this.geofence.longitude)
    // this._latLng = Leaflet.latLng(this.geofence.latitude, this.geofence.longitude);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this._latLng = new google.maps.LatLng(this.geofence.latitude, this.geofence.longitude);
    this.getDesc();
  }

  get geofenceDesc() {
    return this._geofenceDesc;
  }
  set geofenceDesc(value){
    this._geofenceDesc = value;
  }

  get radius() {
    return this._radius;
  }

  set radius(value) {
    this._radius = value;
    this.circle.setRadius(value);
  }

  set latLng(value) {
    this._latLng = value;
    //  this.circle.setLatLng(value);
    //  this.marker.setLatLng(value);
  }

  get latLng() {
    return this._latLng;
  }

  set autocompleteText(value){
    this._autocompleteText = value;
    this.GoogleAutocomplete.getPlacePredictions({ input: this._autocompleteText },
      (predictions, status) => {
        this.autocompleteItems = [];
        if (predictions) {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      });
  }

  reverseGeocode(latLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0]);
          const address = results[0].formatted_address;
          const addressList = address.split(',');
          this.autocompleteText = address;
        }
      }
    });
  }

  getDesc(){
    this.storage.get(this.geofence.id).then((val) => {
      this._geofenceDesc = val;
    });
  }

  get autocompleteText(){
    return this._autocompleteText;
  }

  ionViewDidLoad() {
    this.menu.enable(false);
    // workaround map is not correctly displayed
    // maybe this should be done in some other event

   setTimeout(this.loadMap.bind(this), 1000);
  }

  ionViewDidEnter(){
    this.reverseGeocode(this._latLng);
  }


  selectSearchResult(item) {
    this.autocompleteItems = [];
    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.autocompleteText = results[0].formatted_address;
        if (this.marker != null) {
          this.marker.setMap(null);
          this.marker = null;
        }
        this.map.setCenter(results[0].geometry.location);
        this.latLng = results[0].geometry.location;
        this.marker = new google.maps.Marker({
          map: this.map,
          center: results[0].geometry.location,
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: results[0].geometry.location,
        });
        this.circle.bindTo('center', this.marker, 'position');
      }
    })
  }

  loadMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: this._latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    this.circle = new google.maps.Circle({
      center: this.latLng,
      map: this.map,
      radius: this.radius,
      strokeColor: "red",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "red",
      clickable: true,
    });
    this.circle.bindTo('center', this.marker, 'position');
    google.maps.event.addListener(this.marker, 'dragend', (event) => {
      this.latLng = event.latLng;
    });


    // This event listener calls addMarker() when the circle is clicked.
    google.maps.event.addListener(this.circle, 'click', (e) => {
      this.markerPosition(e);
    })

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(this.map, 'click', (e) => {
      this.markerPosition(e);
    });

  }
  //Changing marker along with circle
  markerPosition(e) {
    //removes previous flotted markers
    if (this.marker != null) {
      this.marker.setMap(null);
      this.marker = null;
    }
    //Set every time as center
    this.map.setCenter(e.latLng);
    this.latLng = e.latLng;
    this.marker = new google.maps.Marker({
      map: this.map,
      center: e.latLng,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    this.circle.bindTo('center', this.marker, 'position');

  }
  //Saving changes
  saveChanges() {
    const geofence = this.geofence;
    geofence.notification.text = this.notificationText;
    geofence.radius = this.radius;
    geofence.latitude = this.latLng.lat();
    geofence.longitude = this.latLng.lng();
    geofence.transitionType = parseInt(this.transitionType, 10);
    this.geofenceService.addOrUpdate(geofence, this.geofenceDesc).then(() => {
      this.home();
    });
  }

  home(){
this.transitiontoList(this.geofence);
  }

  transitiontoList(geofence) {
    this.nav.setRoot(GeofenceListPage);
  }
}
