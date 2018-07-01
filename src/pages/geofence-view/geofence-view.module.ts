import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeofenceViewPage } from './geofence-view';

@NgModule({
  declarations: [
    GeofenceViewPage,
  ],
  imports: [
    IonicPageModule.forChild(GeofenceViewPage),
  ],
})
export class GeofenceViewPageModule {}
