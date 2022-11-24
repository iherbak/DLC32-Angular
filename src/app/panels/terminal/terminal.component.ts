import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, Form, FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Command } from 'src/app/models/command';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.less']
})
export class TerminalComponent implements OnDestroy {

  private options: Command[] = [new Command("$$", "Display Grbl Settings."),
  new Command("$x=val", "Change Grbl Setting x to val."),
  new Command("$#", "View GCode Parameters."),
  new Command("$G", "View GCode parser state."),
  new Command("$C", "Toggle Check Gcode Mode"),
  new Command("$H", "Run Homing Cycle"),
  new Command("$J=gcode", "Run Jogging Motion."),
  new Command("$X", "Kill Alarm Lock state."),
  new Command("$I", "View Build Info"),
  new Command("$N", "View saved start up code"),
  new Command("$Nx=line", "Save Start-up GCode line (x=0 or 1) There are executed on a reset."),
  new Command("$RST=$", "Restores the Grbl settings to defaults."),
  new Command("$RST=#", "Erases G54-G59 WCS offsets and G28/30 positions stored in EEPROM."),
  new Command("$RST=*", "Clear and Load all data from EEPROM."),
  new Command("$SLP", "Enable Sleep mode."),
  new Command("Ctrl-x", "Soft Reset"),
  new Command("?", "Status report query."),
  new Command("~", "Cycle Start/Resume from Feed Hold, Door or Program pause."),
  new Command("!", "Feed Hold - Stop all motion.")];

  public commandForm: UntypedFormGroup;

  public get commandInputFc(): FormControl {
    return this.commandForm.get('commandInput') as FormControl;
  }
  public filteredOptions: Command[] = [];

  private unsub: Subject<void> = new Subject();

  constructor(private formBuilder: UntypedFormBuilder) {
    this.commandForm = formBuilder.group({
      commandInput: [""]
    });

    this.commandInputFc.valueChanges.pipe(takeUntil(this.unsub)).subscribe(commandfilter =>{
      this.filteredOptions = this.options.filter(o=> o.command.includes(commandfilter));
    });
  }
  
  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

}
