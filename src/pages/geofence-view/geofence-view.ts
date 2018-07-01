import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, MenuController, IonicPage } from "ionic-angular";
import { GeofenceService } from "../../services/geofence-service";
import { Storage } from '@ionic/storage';
import { GeofenceDetailsPage } from "../geofence-details/geofence-details";
import { GeofenceListPage } from "../geofence-list/geofence-list";
declare var google;
declare var circle;
declare var marker;
/**
 * Generated class for the GeofenceViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-geofence-view',
  templateUrl: 'geofence-view.html',
})
export class GeofenceViewPage {
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
  private alamat: string;


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
    this._geofenceDesc = "";
    console.log(this.geofence.latitude + ',' + this.geofence.longitude)
    // this._latLng = Leaflet.latLng(this.geofence.latitude, this.geofence.longitude);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this._latLng = new google.maps.LatLng(this.geofence.latitude, this.geofence.longitude);
    this.reverseGeocode(this._latLng);
    this.getDesc();

  }

  get details() {
    return `When ${this.transitionTypeText} within ${this.geofence.radius}m`;
  }

  get transitionTypeText() {
    switch(this.geofence.transitionType) {
      case 1: return "entering region";
      case 2: return "exiting region";
      case 3: return "entering or exiting region";
    }
  }

  get geofenceDesc() {
    return this._geofenceDesc;
  }

  set geofenceDesc(value) {
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

  get autocompleteText() {
    return this._autocompleteText;
  }

  reverseGeocode(latLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0]);
          const address = results[0].formatted_address;
          const addressList = address.split(',');
          this._autocompleteText = address;
          this.alamat = address;
        }
      }
    });
  }

    getDesc(){
    this.storage.get(this.geofence.id).then((val) => {
      this._geofenceDesc = val;
    });
  }

  ionViewDidLoad() {
    this.menu.enable(false);
    // workaround map is not correctly displayed
    // maybe this should be done in some other event
    setTimeout(this.loadMap.bind(this), 100);
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
      clickable: false,
    });
    this.circle.bindTo('center', this.marker, 'position');
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
  edit() {
    this.transitionToEditPage(this.geofence);
  }

    transitionToEditPage(geofence) {
    this.nav.setRoot(GeofenceDetailsPage, {
      geofence
    })
  }

  remove(){
    this.geofenceService.remove(this.geofence);
    this.nav.setRoot(GeofenceListPage);
  }
}
