import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Directive({
  selector: '[appDoubleClick]'
})
export class DoubleClickDirective implements OnInit, OnDestroy {

  @Input() debounceTime = 300;
  @Output('appDoubleClick') doubleClick = new EventEmitter();

  private clicksSubject = new Subject<MouseEvent>();
  private subscription!: Subscription;
  
  constructor() { }

  ngOnInit() {
    this.subscription = this.clicksSubject.pipe(debounceTime(this.debounceTime)).subscribe(event => {
      if (event.type === 'dblclick') {
        this.doubleClick.emit(event);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('dblclick', ['$event'])
  doubleClickEvent(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.clicksSubject.next(event);
  }
}
