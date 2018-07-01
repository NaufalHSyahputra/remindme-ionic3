import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { GeofenceDetailsPage } from "../pages/geofence-details/geofence-details";
import { GeofenceListItem } from "../components/geofence-list-item/geofence-list-item";
import { GeofenceListPage } from "../pages/geofence-list/geofence-list";
import { GeofenceViewPage } from "../pages/geofence-view/geofence-view";
import { GeofenceService } from "../services/geofence-service";
import { HomePage } from '../pages/home/home';

import { LocalNotifications } from '@ionic-native/local-notifications';

const components = [
  MyApp,
  GeofenceDetailsPage,
  GeofenceListPage,
  GeofenceListItem,
  GeofenceViewPage
]
@NgModule({
  declarations: [
    MyApp,
    GeofenceDetailsPage,
    GeofenceListPage,
    GeofenceListItem,
    GeofenceViewPage
   
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
   
    GeofenceDetailsPage,
    GeofenceListPage,
    GeofenceListItem,
    GeofenceViewPage
  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
        GeofenceService,
        LocalNotifications

  ]
})
export class AppModule {}
