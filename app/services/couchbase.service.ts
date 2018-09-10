import { Injectable } from '@angular/core';
import { Couchbase } from 'nativescript-couchbase';

@Injectable()
export class CouchbaseService {

  private database: any;

  constructor() {
    this.database = new Couchbase("plants");

    this.database.createView("plants", "1", function(document, emitter) {
      emitter.emit(document._id, document);
    });
  }

  public getPlant(docId: string) {
    return this.database.getDocument(docId);
  }

  public createPlant(data: any, docId: string) {
    return this.database.createDocument(data, docId);
  }

  public updatePlant(docId: string, data: any) {
    return this.database.updateDocument(docId, data);
  }

  public deletePlant(docId: string) {
    return this.database.deleteDocument(docId);
  }

  public getAllPlants() {
    let plants = this.database.executeQuery("plants");
    return plants;
  }

}
