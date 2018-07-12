import { Injectable } from "@angular/core";
import generateUUID from "../utils/uuid";
import { Storage } from '@ionic/storage';
@Injectable()
export class GeofenceService {
  private geofences: Geofence[];
  constructor(private storage: Storage) { }
  create(attributes) {
    const id = generateUUID();
    const defaultGeofence = {
      id: id,
      latitude: 50,
      longitude: 50,
      radius: 1000,
      transitionType: window.TransitionType.ENTER,
      notification: {
        id: this.getNextNotificationId(),
        title: "Remind Me!",
        text: "",
        icon: "res://ic_menu_mylocation",
        openAppOnClick: true,
        data: { fenceID: id } 
      },
    };

    return Object.assign(defaultGeofence, attributes);
  }

  clone(geofence: Geofence) {
    return JSON.parse(JSON.stringify(geofence));
  }

  addOrUpdate(geofence: Geofence, desc) {
    return window.geofence.addOrUpdate(geofence)
      .then(() => this.findById(geofence.id))
      .then((found) => {
        if (!found) {
          this.geofences.push(geofence);
          this.storage.set(geofence.id, desc);
        } else {
          const index = this.geofences.indexOf(found);

          this.geofences[index] = geofence;
        }
      });
  }

  findAll() {
    return window.geofence.getWatched()
      .then((geofencesJson) => {
        const geofences = JSON.parse(geofencesJson);

        this.geofences = geofences;
        return geofences;
      });
  }

  findById(id) {
    const found = this.geofences.filter(g => g.id === id);

    if (found.length > 0) {
      return found[0];
    }

    return undefined;
  }

  removeAll() {
    return window.geofence.removeAll().then(() => {
      this.geofences.length = 0;
    });
  }

  remove(geofence) {
    return window.geofence.remove(geofence.id).then(() => {
      this.geofences.splice(this.geofences.indexOf(geofence), 1);
    });
  }

  private getNextNotificationId() {
    var max = 0;

    this.geofences.forEach(function (gf) {
      if (gf.notification && gf.notification.id) {
        if (gf.notification.id > max) {
          max = gf.notification.id;
        }
      }
    });

    return max + 1;
  }
}
