import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { action } from 'ui/dialogs';
import * as camera from 'nativescript-camera';
import * as imagepicker from 'nativescript-imagepicker';
import { Image } from 'tns-core-modules/ui/image/image';
import { SwipeGestureEventData } from '../../node_modules/tns-core-modules/ui/gestures/gestures';

@Component({
  moduleId: module.id,
  selector: 'app-image-galery-modal',
  templateUrl: './image-galery-modal.component.html',
  styleUrls: ['./image-galery-modal.component.scss']
})
export class ImageGaleryModalComponent implements OnInit {

  images: Array<string>;
  activeImage: string;
  currentIndex = 0;
  updatedImages = false;

  constructor(private params: ModalDialogParams) {
    this.images = params.context;
    this.activeImage = this.images[0];
    console.log(this.images.length);
  }

  ngOnInit() { }

  onSwipe(args: SwipeGestureEventData) {
    console.log("Swipe Direction: " + args.direction);
    console.log("images array size: " + this.images.length);
    console.log("current index before update: " + this.currentIndex);
    //if swipe right
    if(args.direction == 1) {
      this.currentIndex--;
      if(this.currentIndex < 0) {
        this.currentIndex = this.images.length-1;
      }
      this.activeImage = this.images[this.currentIndex];
    }
    //if swipe left
    else if(args.direction == 2) {
      this.currentIndex++;
      if(this.currentIndex == this.images.length) {
        this.currentIndex = 0;
      }
      this.activeImage = this.images[this.currentIndex]
    }
    console.log("current index after update: " + this.currentIndex);

  } 

  openActions() {
    let options = {
      title : "Actions",
      cancelButtonText : "Cancel",
      actions : [
        "Take new picture",
        "Upload new picture"
      ]
    };

    action(options).then((result) => {
      if(result == "Take new picture") {
        console.log("Take new picture clicked");
        this.capturePicture();
      }
      else if(result == "Upload new picture") {
        console.log("Upload new picture clicked");
        this.uploadPicture();
      }
    });
  }

  capturePicture() {
    if(camera.isAvailable()) {
      camera.requestPermissions();   
      camera.takePicture()
        .then((imageAsset) => {
          this.images.push(imageAsset.android);
          this.updatedImages = true;
          this.currentIndex = this.images.length-1;
          this.activeImage = this.images[this.currentIndex];
        }).catch((err) => {
          console.log("Error -> " + err.message);
        });
    }
  }

  uploadPicture() {
    let context = imagepicker.create({
      mode: 'multiple'
    });

    context.authorize()
      .then(() => {
        return context.present();
      })
        .then((selection) => {
          selection.forEach((element) => {
            this.images.push(element.android);
            this.updatedImages = true;
            this.currentIndex = this.images.length-1;
            this.activeImage = this.images[this.currentIndex];
          });
        })
        .catch(function(e) {
          console.log("Error -> " + e);
        });
  }

  submit() {
    this.params.closeCallback({images : this.images, updated : this.updatedImages});
  }

}
