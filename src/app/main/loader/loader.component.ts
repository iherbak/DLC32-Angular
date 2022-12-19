import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ShowProgress } from 'src/app/models/showProgress';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less']
})
export class LoaderComponent implements OnDestroy {

  private unsub: Subject<void> = new Subject();
  private showProgress: ShowProgress = new ShowProgress();


  public get ShowProgress() {
    return this.showProgress;
  }
  
  constructor(public clientService: ClientService) {
    this.clientService.WaitingForClient.pipe(takeUntil(this.unsub)).subscribe(event => {
      this.showProgress = event;
    })
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
}
