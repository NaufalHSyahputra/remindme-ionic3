import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, AlertController, MenuController } from "ionic-angular";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { GeofenceListPage } from "../pages/geofence-list/geofence-list";
import { GeofenceService } from "../services/geofence-service";
import { GeofencePluginMock, TransitionType } from "../services/geofence-plugin-mock";
import { FIXTURES } from "../models/geofence";
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = GeofenceListPage;
  localnotif: any;

  constructor(localNotifications: LocalNotifications, platform: Platform, statusBar: StatusBar,
    private alertCtrl: AlertController,
    private geofenceService: GeofenceService,
    private menuCtrl: MenuController,
    splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      if (window.geofence === undefined) {
        console.warn("Geofence Plugin not found. Using mock instead.");
        window.geofence = GeofencePluginMock;
        window.TransitionType = TransitionType;
      }  
      window.geofence.initialize().then(() => {
        window.geofence.onTransitionReceived = function (geofences) {
          geofences.forEach(function (geo) {
            console.log("Geofence transition detected", geo);
          });
        };
      });
    });
  }

  // addFixtures() {
  //   FIXTURES.forEach((fixture) => this.geofenceService.addOrUpdate(fixture));
  //   this.menuCtrl.close();
  // }

  removeAll() {
    const confirm = this.alertCtrl.create({
      title: "Are you sure?",
      message: "Are you sure you want to remove all geofences?",
      buttons: [
        { text: "No" },
        {
          text: "Yes",
          handler: () => {
            this.geofenceService.removeAll();
          },
        },
      ],
    });
    this.menuCtrl.close();
    confirm.present();
  }

  testApp() {
    const confirm = this.alertCtrl.create({
      title: "Are you sure?",
      message: "Running tests will remove all your geofences. Do you want to continue?",
      buttons: [
        { text: "No" },
        {
          text: "Yes",
          handler: () => {
            window.location.href = "cdvtests/index.html";
          },
        },
      ],
    });

    this.menuCtrl.close();
    confirm.present();
  }
  presentAlert(data) {
  let alert = this.alertCtrl.create({
    title: 'Test',
    subTitle: data.fenceID,
    buttons: ['Dismiss']
  });
  alert.present();
}
}
