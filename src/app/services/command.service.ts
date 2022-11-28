import { Direction } from '@angular/cdk/bidi';
import { Injectable } from '@angular/core';
import { Axis } from '../models/axis';
import { Command } from '../models/command';
import { CommandType } from '../models/commandType';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  private commands: Command[] = [new Command("$$", "Display Grbl Settings."),
  new Command("$x", "Change Grbl Setting x to val."),
  new Command("$#", "View GCode Parameters."),
  new Command("$G", "View GCode parser state."),
  new Command("$C", "Toggle Check Gcode Mode"),
  new Command("$H", "Run Homing Cycle", CommandType.Home),
  new Command("$J", "Run Jogging Motion.", CommandType.Jog),
  new Command("$X", "Kill Alarm Lock state."),
  new Command("$I", "View Build Info"),
  new Command("$N", "View saved start up code"),
  new Command("$Nx", "Save Start-up GCode line (x=0 or 1) There are executed on a reset."),
  new Command("$RST", "Restores the Grbl settings to defaults."),
  new Command("$RST", "Erases G54-G59 WCS offsets and G28/30 positions stored in EEPROM."),
  new Command("$RST", "Clear and Load all data from EEPROM."),
  new Command("$SLP", "Enable Sleep mode."),
  new Command("Ctrl-x", "Soft Reset"),
  new Command("?", "Status report query."),
  new Command("~", "Cycle Start/Resume from Feed Hold, Door or Program pause."),
  new Command("!", "Feed Hold - Stop all motion."),
  new Command("G28.1", "Set origin to current toolhead position", CommandType.SetOrigin),
  new Command("getFiles", "Getting Files from server", CommandType.FilesGet),
  new Command("manipulateFiles", "Manipulate files on server", CommandType.FilesAction),
  new Command("login", "Login to files", CommandType.Login),
  new Command("updateFw", "Update Frimware command", CommandType.UpdateFw)
  ];

  constructor() { }

  public getCommands(): Command[] {
    return this.commands;
  }

  public getJogCommand(axis: Axis, distance: number) {
    let basecommand = this.commands.find(c => c.commandType === CommandType.Jog);
    let axisparam = this.assembleMoveParams(axis, distance);
    return basecommand?.getCommandUrl(axisparam)
  }

  public getHomeCommand() {
    let basecommand = this.commands.find(c => c.commandType === CommandType.Home);
    return basecommand?.getCommandUrl([]);
  }

  public getSetOriginCommand(axes: Axis[]) {
    let basecommand = this.commands.find(c => c.commandType === CommandType.SetOrigin);
    let args: string[] = [];
    axes.forEach((axis) => {
      switch (axis) {
        case Axis.X: {
          args.push("X0");
          break;
        }
        case Axis.Y: {
          args.push("Y0");
          break;
        }
        case Axis.Z: {
          args.push("Z0");
          break;
        }
      }
    });
    return basecommand?.getCommandUrl([args.join(" ")]);
  }

  private assembleMoveParams(axis: Axis, distance: number): string[] {
    switch (axis) {
      case Axis.X: {
        return [`=X${distance}`];
      }
      case Axis.Y: {
        return [`=Y${distance}`];
      }
      case Axis.Z: {
        return [`=Z${distance}`];
      }
      default:
        {
          return [];
        }
    }
  }
}
