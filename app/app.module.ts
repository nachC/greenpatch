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
import { EditProfileModalComponent } from "./edit-profile-modal/edit-profile-modal.component";
import { ImageGaleryModalComponent } from "./image-galery-modal/image-galery-modal.component";

import { CouchbaseService } from "./services/couchbase.service";
import { DataParams } from "./services/data-params";

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
        DatePickerModalComponent,
        EditProfileModalComponent,
        ImageGaleryModalComponent
    ],
    entryComponents: [
        DatePickerModalComponent,
        EditProfileModalComponent,
        ImageGaleryModalComponent
    ],
    providers: [CouchbaseService,
                DataParams],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
