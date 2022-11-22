import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.less']
})
export class FileItemComponent {

  @Input() fileName: string;
  constructor(){
    this.fileName = "";
  }
}
