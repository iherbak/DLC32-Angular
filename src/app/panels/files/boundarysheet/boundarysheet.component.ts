import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { timer } from 'rxjs';
import { Boundaries } from 'src/app/models/boundaries';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';

@Component({
  selector: 'app-boundarysheet',
  templateUrl: './boundarysheet.component.html',
  styleUrls: ['./boundarysheet.component.less']
})
export class BoundarysheetComponent {

  public get bounds() {
    return this.data.boundaries.bounds;
  }

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { boundaries: Boundaries }, public bottomSheetRef: MatBottomSheetRef<BoundarysheetComponent>, private commandService: CommandService, private clientService: ClientService) {

  }

  public sendBoundaries() {
    let boundCommands = this.commandService.generateBoundaryCommands(this.data.boundaries.bounds);
    let sender = timer(0, 500);
    let i = 0;
    let s = sender.subscribe(() => {
      if (i < boundCommands.length) {
        this.clientService.sendGetCommand(boundCommands[i++], true, false).subscribe();
      }
      else {
        s.unsubscribe();
        this.bottomSheetRef.dismiss();
      }
    });
  }
}
