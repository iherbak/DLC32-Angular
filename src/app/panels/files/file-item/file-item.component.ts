import { Component, Input } from '@angular/core';
import { ESP32File } from 'src/app/models/esp32file';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.less']
})
export class FileItemComponent {

  @Input() file!: ESP32File;
  
  constructor(){
    
  }
}
