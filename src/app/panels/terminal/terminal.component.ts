import { Component, OnDestroy } from '@angular/core';
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

  public commandForm: UntypedFormGroup;

  public get commandInputFc(): FormControl {
    return this.commandForm.get('commandInput') as FormControl;
  }
  public filteredOptions: Command[] = [];

  private unsub: Subject<void> = new Subject();

  constructor(formBuilder: UntypedFormBuilder, private commandService: CommandService) {
    this.commandForm = formBuilder.group({
      commandInput: [""]
    });

    this.commandInputFc.valueChanges.pipe(takeUntil(this.unsub)).subscribe(commandfilter =>{
      this.filteredOptions = this.commandService.getCommands().filter(o=> o.command.includes(commandfilter));
    });
  }
  
  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

}
