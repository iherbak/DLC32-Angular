import { AfterViewInit, Directive, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subject, takeUntil } from 'rxjs';
import { ClientService } from '../services/client.service';

@Directive({
  selector: '[appBusyIndicator]'
})
export class BusyIndicatorDirective implements OnDestroy, AfterViewInit {

  private unsubScribe: Subject<void> = new Subject();
  private loadingContainer! : HTMLElement;
  private resizeObservable$! : Observable<Event>;

  constructor(private element: ElementRef, clientService: ClientService, private renderer: Renderer2) {

    this.resizeObservable$ = fromEvent(window, 'resize');
    
    this.resizeObservable$.pipe(takeUntil(this.unsubScribe)).subscribe(evt => {
      let bbox = (this.element.nativeElement as HTMLDivElement).getBoundingClientRect();
      this.renderer.setStyle(this.loadingContainer, "width", bbox.width+"px");
      this.renderer.setStyle(this.loadingContainer, "height", bbox.height+"px");
    });

    clientService.WaitingForClient.pipe(takeUntil(this.unsubScribe)).subscribe(waitingForClient => {
      this.renderer.setStyle(
        this.loadingContainer,
        "display",
        waitingForClient ? "block" : "none"
      );
    });
  }

  ngAfterViewInit(): void {
    this.loadingContainer = this.renderer.createElement("div");
    this.renderer.setStyle(
      this.loadingContainer,
      "display",
      "none"
    );
    let bbox = (this.element.nativeElement as HTMLDivElement).getBoundingClientRect();

    this.renderer.setStyle(this.loadingContainer, "width", bbox.width+"px");
    this.renderer.setStyle(this.loadingContainer, "height", bbox.height+"px");
    this.renderer.setStyle(this.loadingContainer, "position", "absolute");
    this.renderer.setStyle(this.loadingContainer, "background-color", "darkgrey");
    this.renderer.setStyle(this.loadingContainer, "z-index", "7");
    // custom spinner -- start
    const spinnerContainer = this.renderer.createElement("div");
    this.renderer.addClass(spinnerContainer, "lds-facebook");
    const spinnerInnerDiv1 = this.renderer.createElement("div");
    const spinnerInnerDiv2 = this.renderer.createElement("div");
    const spinnerInnerDiv3 = this.renderer.createElement("div");

    this.renderer.appendChild(spinnerContainer, spinnerInnerDiv1);
    this.renderer.appendChild(spinnerContainer, spinnerInnerDiv2);
    this.renderer.appendChild(spinnerContainer, spinnerInnerDiv3);

    this.renderer.appendChild(this.loadingContainer, spinnerContainer);
    // custom spinner -- end

    this.renderer.appendChild(this.element.nativeElement, this.loadingContainer);
  }

  ngOnDestroy(): void {
    this.unsubScribe.next();
    this.unsubScribe.complete();
  }


}
