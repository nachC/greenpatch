import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';

import { HomeComponent } from "./home/home.component";
import { AddPlantComponent } from "./add-plant/add-plant.component";
import { PlantProfileComponent } from "./plant-profile/plant-profile.component";
import { DatePickerModalComponent } from "./date-picker-modal/date-picker-modal.component";

import { CouchbaseService } from "./services/couchbase.service";
// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpModule } from "nativescript-angular/http";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        TNSFontIconModule.forRoot({
            'fa': './fonts/font-awesome.min.css'
        }),
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        AddPlantComponent,
        PlantProfileComponent,
        DatePickerModalComponent
    ],
    entryComponents: [
        DatePickerModalComponent
    ],
    providers: [CouchbaseService],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
