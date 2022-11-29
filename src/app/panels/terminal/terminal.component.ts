import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Command } from 'src/app/models/command';
import { CommandService } from 'src/app/services/command.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.less']
})
export class TerminalComponent implements OnDestroy {

  @ViewChild("window") commandWindowElement!: ElementRef;
  @Input() maxLines: number = 100;

  private currentLinesCount: number = 1;
  public commandForm: UntypedFormGroup;

  public get commandInputFc(): FormControl {
    return this.commandForm.get('commandInput') as FormControl;
  }

  public get commandWindowFc(): FormControl {
    return this.commandForm.get('commandWindow') as FormControl;
  }


  public filteredOptions: Command[] = [];

  private unsub: Subject<void> = new Subject();

  constructor(formBuilder: UntypedFormBuilder, private commandService: CommandService) {
    this.commandForm = formBuilder.group({
      commandInput: [""],
      commandWindow: [{ value: "Terminal is ready", disabled: true }]
    });

    this.commandInputFc.valueChanges.pipe(takeUntil(this.unsub)).subscribe(commandfilter => {
      this.filteredOptions = this.commandService.getCommands().filter(o => o.command.includes(commandfilter));
    });

    this.commandWindowFc.valueChanges.pipe(takeUntil(this.unsub)).subscribe((added: string) => {
      if (this.currentLinesCount++ > this.maxLines) {
        this.currentLinesCount = 1;
        this.commandWindowFc.setValue("Stripped as max lines reached....");
      }
      else {
        this.commandWindowElement.nativeElement.scrollTop = this.commandWindowElement.nativeElement.scrollHeight;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

  public sendCommand() {
    this.commandWindowFc.setValue(this.commandWindowFc.value + "\n" + this.commandInputFc.value);
  }
}
