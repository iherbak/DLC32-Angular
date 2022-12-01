import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Axis } from '../models/axis';
import { Command } from '../models/command';
import { CommandType } from '../models/commandType';
import { ExecutableCommand } from '../models/executableCommand';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  //GRbl commands response comes back through websocket connection
  public InvalidCommand: Subject<string> = new Subject();

  private commands: Command[] = [new Command("$$", "Display Grbl Settings."),
  new Command("$x", "Change Grbl Setting x to val."),
  new Command("$#", "View GCode Parameters."),
  new Command("$G", "View GCode parser state."),
  new Command("$C", "Toggle Check Gcode Mode"),
  new Command("$H", "Run Homing Cycle", CommandType.Home),
  new Command("$J", "Run Jogging Motion.", CommandType.Jog),
  new Command("$X", "Kill Alarm Lock state.", CommandType.Unlock),
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
  new Command("[ESP800]", "GetFirmware information", CommandType.FwInfo, "GET", "text"),
  new Command("G92", "Set origin to current position", CommandType.SetOrigin),
  new Command("M3", "Turn on laser/spindle", CommandType.LaserOn),
  new Command("M5", "Turn off laser/spindle", CommandType.LaserOff),
  new Command("getFiles from internal flash", "Getting Files from server", CommandType.FilesAction),
  new Command("getFiles from sd card", "Getting Files from server", CommandType.FilesSdAction),
  new Command("upload to internal flash", "Getting Files from server", CommandType.Upload, "POST"),
  new Command("upload to sd card", "Getting Files from server", CommandType.UploadSd, "POST"),
  new Command("manipulateFiles", "Manipulate files on server", CommandType.FilesAction),
  new Command("login", "Login to files", CommandType.Login),
  new Command("updateFw", "Update Frimware command", CommandType.UpdateFw),
  ];

  constructor() { }

  public getCommands(): Command[] {
    return this.commands;
  }

  public getJogCommand(axis: Axis, distance: number, feedrate: number) {
    let basecommand = this.commands.find(c => c.commandType === CommandType.Jog);
    let axisparam = this.assembleMoveParams(axis, distance, feedrate);
    return this.getCommandUrl(basecommand, axisparam);
  }

  public getCommandUrlByCommand(command: string, args: string[] = []) {
    let basecommand = new Command(command, '');
    if (basecommand) {
      return this.getCommandUrl(basecommand, args);
    }
    this.InvalidCommand.next(`Invalid command : ${command}`);
    return null;
  }

  public getCommandUrlByType(commandType: CommandType, args: string[] = []) {
    let basecommand = this.commands.find(c => c.commandType === commandType);
    if (basecommand !== undefined) {
      return this.getCommandUrl(basecommand, args);
    }
    this.InvalidCommand.next(`Invalid command type: ${commandType}`);
    return null;
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
    return this.getCommandUrl(basecommand, [args.join(" ")]);
  }

  private assembleMoveParams(axis: Axis, distance: number, feedrate: number): string[] {
    switch (axis) {
      case Axis.X: {
        return [`=G91 G21 X${distance} F${feedrate}`];
      }
      case Axis.Y: {
        return [`=G91 G21 Y${distance} F${feedrate}`];
      }
      case Axis.Z: {
        return [`=G91 G21 Z${distance} F${feedrate}`];
      }
      default:
        {
          return [];
        }
    }
  }

  private getCommandUrl(command: Command | undefined, args: string[]): ExecutableCommand {
    let issuedCommand = new ExecutableCommand("");
    if (command !== undefined) {
      switch (command.commandType) {

        case CommandType.Jog: {
          issuedCommand.commandUrl = `/command?commandText=${command.command}${args.join('&')}`;
          issuedCommand.responseType = command.responseType;
          break;
        }
        case CommandType.Upload: {
          issuedCommand.commandUrl = `/files`;
          issuedCommand.responseType = command.responseType;
          issuedCommand.httpAction = command.httpAction;
          break;
        }
        case CommandType.UploadSd: {
          issuedCommand.commandUrl = `/upload`;
          issuedCommand.responseType = command.responseType;
          issuedCommand.httpAction = command.httpAction;
          break;
        }
        case CommandType.FilesSdAction: {
          //delete, deletedir, createdir and filename as additional required parameter 
          issuedCommand.commandUrl = `/upload${args.length > 0 ? "?" + args.join('&') : ""}`;
          issuedCommand.responseType = command.responseType;
          break;
        }
        case CommandType.FilesAction: {
          //delete, deletedir, createdir and filename as additional required parameter 
          issuedCommand.commandUrl = `/files${args.length > 0 ? "?" + args.join('&') : ""}`;
          issuedCommand.responseType = command.responseType;
          break;
        }
        case CommandType.Login:
          {
            issuedCommand.commandUrl = "/login";
            issuedCommand.responseType = command.responseType;
            break;
          }
        case CommandType.UpdateFw: {
          issuedCommand.commandUrl = "/updatefw";
          issuedCommand.responseType = command.responseType;
          break;
        }
        default:
          {
            let commandprefix = command.commandType === CommandType.CommandSilent ? "command_silent" : "command";
            issuedCommand.commandUrl = `/${commandprefix}?commandText=${command.command} ${args.join('&')}`;
            issuedCommand.responseType = command.responseType;
            break;
          }
      }
      return issuedCommand;
    }
    else {
      this.InvalidCommand.next(issuedCommand.commandUrl);
      return issuedCommand;
    }
  }

}
