import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfosheetComponent } from '../infosheet/infosheet.component';
import { GrblsheetComponent } from './grblsheet/grblsheet.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {

  public version: string = '1.0';

  constructor(private bottomSheet: MatBottomSheet) {

  }

  public showInfo() {
    this.bottomSheet.open(InfosheetComponent);
  }

  public showGrblSettings() {
    this.bottomSheet.open(GrblsheetComponent);
  }
}
