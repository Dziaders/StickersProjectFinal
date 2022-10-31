import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { STICKERS } from 'src/app/sticker-collection/sticker-collection.component'
import { map } from 'rxjs/operators';


interface Sticker {
  id?: number;
  name: string;
  collection: string;
  date: number;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class GalleryComponent {
  stickers: Sticker[] = STICKERS;
  sticker: FormGroup;
  loadedStickers: Sticker[] = [];
  downloadedStickers: Sticker[] = [];

  constructor(private http: HttpClient){}

  ngOnInit(){
    this.onFetchSavedStickers();
    console.log(this.loadedStickers);
  }

  onFetchSavedStickers(){
    this.fetchSavedStickers();
  }

  editSticker(sticker: Sticker) {
    this.sticker = new FormGroup({
      id: new FormControl(sticker.id),
      name: new FormControl(sticker.name),
      collection: new FormControl(sticker.collection),
      date: new FormControl(sticker.date)
    });
  }

  save() {
    let index = this.stickers.findIndex(sticker => sticker.id === this.sticker.value.id);
    this.stickers[index] = this.sticker.value;
    //////////////
    this.http.post('https://stickers-project-e23f9-default-rtdb.firebaseio.com/stickers-data.json', this.stickers).subscribe(responseData => {
      console.log(responseData)
    });
  }

  cancel() {
    this.sticker = null;
  }

  private fetchSavedStickers(){
    this.http
    .get<{[key: string]: Sticker}>('https://stickers-project-e23f9-default-rtdb.firebaseio.com/stickers-data.json')
    .pipe(map(responseData => {
      const postArray: Sticker[] = [];
      for (const key in responseData){
        
        postArray.push({ ...responseData[key], id: +key })
      
    }
    this.downloadedStickers = postArray;
    console.log(postArray);
    return postArray;
  
    
    }))
    .subscribe(savedStickers => {
      // console.log(savedStickers)
      this.loadedStickers = savedStickers;
       console.log(this.loadedStickers);
  });
    console.log(this.loadedStickers);
    console.log(this.downloadedStickers);
  }
}




