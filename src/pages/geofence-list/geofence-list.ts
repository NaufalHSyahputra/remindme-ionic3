import { Component } from "@angular/core";
import { NavController, Platform, MenuController } from "ionic-angular";
import { GeofenceDetailsPage } from "../geofence-details/geofence-details";
import { GeofenceService } from "../../services/geofence-service";
import { SplashScreen } from '@ionic-native/splash-screen';
import { GeofenceViewPage } from "../geofence-view/geofence-view";


@Component({
  templateUrl: "geofence-list.html"
})
export class GeofenceListPage {
  isLoading: boolean = false;
  geofences: [Geofence];

  constructor(
    private nav: NavController,
    private geofenceService: GeofenceService,
    private platform: Platform,
    private menu: MenuController,
    private splashScreen: SplashScreen
  ) {
    this.isLoading = true;
    this.platform.ready().then(() => {
      this.geofenceService.findAll()
        .then(geofences => {
          this.geofences = geofences;
          this.isLoading = false;
        })
        .catch(() => this.isLoading = false);
    });
  }

  ionViewDidEnter() {
    this.menu.enable(true);
  }

  ionViewLoaded() {
    
    // this.splashScreen.hide();
  }

  new() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geofence = this.geofenceService.create({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });

        this.transitionToDetailsPage(geofence);
      },
      (error) => {

      },
      { timeout: 5000 }
    );
  }

  geofenceItemTapped(geofence) {
    this.transitionToViewPage(geofence);
  }

  transitionToViewPage(geofence) {
    this.nav.push(GeofenceViewPage, {
      geofence
    })
  }

    transitionToDetailsPage(geofence) {
    this.nav.push(GeofenceDetailsPage, {
      geofence
    })
  }
}
