import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ClientService } from 'src/app/services/client.service';
import { InfosheetComponent } from '../infosheet/infosheet.component';
import { GrblsheetComponent } from './grblsheet/grblsheet.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {

  public version: string = '1.0';

  public get isRunning() {
    return this.clientService.isRunning;
  }

  public get isConnected() {
    return this.clientService.isConnected;
  }

  constructor(private bottomSheet: MatBottomSheet, private clientService: ClientService) {

  }

  public showInfo() {
    this.bottomSheet.open(InfosheetComponent);
  }

  public showGrblSettings() {
    this.bottomSheet.open(GrblsheetComponent);
  }
}
