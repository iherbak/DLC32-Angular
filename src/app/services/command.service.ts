import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Axis } from '../models/axis';
import { Command } from '../models/command';
import { CommandType } from '../models/commandType';
import { EspCommand } from '../models/espCommand';
import { ExecutableCommand } from '../models/executableCommand';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  //GRbl commands response comes back through websocket connection
  public InvalidCommand: Subject<string> = new Subject();

  private grblCommands: Command[] = [
    new Command("$$", "Display Grbl Settings."),
    new Command("$x=", "Change Grbl Setting x to val."),
    new Command("$#", "View GCode Parameters."),
    new Command("$G", "View GCode parser state."),
    new Command("$I", "View Build Info"),
    new Command("$N", "View saved start up code"),
    new Command("$N", "Save Start-up GCode line (x=0 or 1) There are executed on a reset."),
    new Command("$C", "Toggle Check Gcode Mode"),
    new Command("$X", "Kill Alarm Lock state."),
    new Command("$H", "Run Homing Cycle"),
    new Command("$J", "Run Jogging Motion."),
    new Command("$RST=$", "Restores the Grbl settings to defaults."),
    new Command("$RST=#", "Erases G54-G59 WCS offsets and G28/30 positions stored in EEPROM."),
    new Command("$RST=*", "Clear and Load all data from EEPROM."),
    new Command("$SLP", "Enable Sleep mode."),
    new Command("\u0018", "Soft Reset"),
    new Command("?", "Status report query."),
    new Command("~", "Cycle Start/Resume from Feed Hold, Door or Program pause."),
    new Command("!", "Feed Hold - Stop all motion."),
    new Command("\u0084", "Safety door"),
    new Command("\u0085", "Jog cancel"),
    new Command("\u0090", "100% feed rate"),
    new Command("\u0091", "Incerase feed rate by 10%"),
    new Command("\u0092", "Decrease feed rate by 10%"),
    new Command("\u0093", "Incerase feed rate by 1%"),
    new Command("\u0094", "Decrease feed rate by 1%"),
    new Command("\u0095", "100% full rapid rate"),
    new Command("\u0096", "50% full rapid rate"),
    new Command("\u0097", "25% full rapid rate"),
    new Command("\u0099", "100% spindle speed"),
    new Command("\u009A", "Increase spindle speed by 10%"),
    new Command("\u009B", "Decrease spindle speed by 10%"),
    new Command("\u009C", "Increase spindle speed by 1%"),
    new Command("\u009D", "Decrease spindle speed by 1%"),
    new Command("\u009E", "Toggle spindle stop"),
    new Command("\u00A0", "Toggle flood coolant"),
    new Command("\u00A0", "Toggle mist coolant"),


  ];
  private espCommands: Command[] = [
    new EspCommand("[ESP]", "Esp commands help"),
    new EspCommand("[ESP0]", "Esp commands help"),
    new EspCommand("[ESP100]<SSID>", "Set/Get STA SSID"),
    new EspCommand("[ESP101]<Password>", "Set STA Password"),
    new EspCommand("[ESP102]<mode>", "Set/Get STA IP mode (DHCP/STATIC)"),
    new EspCommand("[ESP103]IP=<IP> MSK=<IP> GW=<IP>", "Set/Get STA IP/Mask/GW"),
    new EspCommand("[ESP105]<SSID>", "Set/Get AP SSID"),
    new EspCommand("[ESP106]<Password>", "Change AP Password"),
    new EspCommand("[ESP107]<IP>", "Set/Get AP IP"),
    new EspCommand("[ESP108]<channel>", "Set/Get AP channel"),
    new EspCommand("[ESP110]<state>", "Set/Get radio state which can be STA, AP, BT, OFF"),
    new EspCommand("[ESP111]<header answer>", "Get current IP", "GET", "text"),
    new EspCommand("[ESP112]<Hostname> ", "Get/Set hostname"),
    new EspCommand("[ESP115]<state>", "Get/Set immediate Radio (WiFi/BT) state which can be ON, OFF"),
    new EspCommand("[ESP120]<state>", "Get/Set HTTP state which can be ON, OFF"),
    new EspCommand("[ESP121]<port>", "Get/Set HTTP port"),
    new EspCommand("[ESP130]<state>", "Get/Set Telnet state which can be ON, OFF"),
    new EspCommand("[ESP131]<port>", "Get/Set Telnet port"),
    new EspCommand("[ESP140]<Bluetooth name> ", "Get/Set btname"),
    new EspCommand("[ESP200]", "Get SD Card Status"),
    new EspCommand("[ESP210]", "Get SD Card Content"),
    new EspCommand("[ESP215]<file/dir name>", "Delete SD Card file / directory"),
    new EspCommand("[ESP220]<Filename> ", "Print SD file", 'GET', 'text'),
    new EspCommand("[ESP221]<Filename> ", "Read SD file", 'GET', 'text'),
    new EspCommand("[ESP400]", "Get full EEPROM settings content but do not give any passwords"),
    new EspCommand("[ESP401]P=<position> T=<type> V=<value> ", "Set EEPROM setting position in EEPROM, type: B(byte), I(integer/long), S(string), A(IP address / mask)"),
    new EspCommand("[ESP410]", "Get available AP list (limited to 30)"),
    new EspCommand("[ESP420]", "Get current settings of ESP3D"),
    new EspCommand("[ESP444]RESTART", "Restart ESP"),
    new EspCommand("[ESP555]<password>", "Change / Reset user password"),
    new EspCommand("[ESP600]msg", "Send Notification"),
    new EspCommand("[ESP610]type=<NONE/PUSHOVER/EMAIL/LINE> T1=<token1> T2=<token2> TS=<Settings>", "Set/Get Notification settings Get will give type and settings only, not the protected T1/T2"),
    new EspCommand("[ESP700]<filename>", "Run SPIFFS file"),
    new EspCommand("[ESP701]", "Read local file"),
    new EspCommand("[ESP710]FORMAT", "Format SPIFFS"),
    new EspCommand("[ESP720]", "SPIFFS total size and used size"),
    new EspCommand("[ESP800]", "Get fw version and basic information", "GET", 'text')
  ];
  private espApiCommands: Command[] = [
    new Command("getFiles from internal flash", "Getting Files from server", "GET", "json", CommandType.FilesAction),
    new Command("getFiles from sd card", "Getting Files from server", "GET", "json", CommandType.FilesSdAction),
    new Command("upload to internal flash", "Getting Files from server", "POST", "json", CommandType.Upload),
    new Command("upload to sd card", "Getting Files from server", "POST", "json", CommandType.UploadSd),
    new Command("manipulateFiles", "Manipulate files on server", "GET", "json", CommandType.FilesAction),
    new Command("login", "Login to files", "GET", "json", CommandType.Login),
    new Command("updateFw", "Update Frimware command", "GET", "json", CommandType.UpdateFw),
    new Command("firmwareInfo", "Get firmware info", "GET", "json", CommandType.FirmwareInfo),
    new Command("grblSettings", "Get grbl settings", "GET", "json", CommandType.GrblSettings)
  ];

  private gcodeCommands: Command[] = [
    new Command("G1", "Linear move"),
    new Command("G2", "Arc or circle move"),
    new Command("G3", "Arc or circle move"),
    new Command("G38.2", "probes towards a target and stops on contact"),
    new Command("G38.3", "probes towards a target and stops on contact. No error is given if it fails to trigger the probe"),
    new Command("G38.4", "probes away from a target and stops on contact break"),
    new Command("G38.5", "probes away from a target and stops on contact break. No error is given if it fails to trigger the probe."),
    new Command("G80", "Cancels the current motion mode"),
    new Command("G54", "use coordinate system 1"),
    new Command("G55", "use coordinate system 2"),
    new Command("G56", "use coordinate system 3"),
    new Command("G57", "use coordinate system 4"),
    new Command("G58", "use coordinate system 5"),
    new Command("G59", "use coordinate system 6"),
    new Command("G17", "Select workspace plane XY"),
    new Command("G18", "Select workspace plane ZX"),
    new Command("G19", "Select workspace plane YZ"),
    new Command("G90", "Absolute positioning"),
    new Command("G91", "Relative positioning"),
    new Command("G91.1", "Change relative positioning"),
    new Command("G93", "Feed rate mode"),
    new Command("G94", "Feed rate unit"),
    new Command("G20", "Set units to inches"),
    new Command("G21", "Set units to millimeters"),
    new Command("G40", "Cutter radius compensation"),
    new Command("G43.1", "Change tool length offset"),
    new Command("G49", "Tool length offset"),
    new Command("M0", "Pause after the last movement and wait for user to continue"),
    new Command("M2", "Change program mode"),
    new Command("M30", "Delte file from SD card"),
    new Command("M3", "Laser/spindle on clockwise"),
    new Command("M4", "Laser/spindle on counterclockwise"),
    new Command("M5", "Laser/spindle off"),
    new Command("M7", "Turn on mist coolant"),
    new Command("M8", "Turn on spindle flood coolant or laser air assist"),
    new Command("M9", "Turn off all coolants or air assist"),
    new Command("G4", "Dwell pauses the command queue and waits for a period of time."),
    new Command("G10", "Retract"),
    new Command("G28", "Auto home"),
    new Command("G30", "Do single Z-probe"),
    new Command("G28.1", "Change G28 predefined position to current"),
    new Command("G30.1", "Change G31 predefined position to current"),
    new Command("G53", "Move in machine coordintes"),
    new Command("G92", "Set position")
  ];

  constructor() { }

  public getCommands(): Command[] {
    return this.grblCommands.concat(this.espCommands.concat(this.gcodeCommands));
  }

  public getJogCommand(axis: Axis, distance: number, feedrate: number) {
    let basecommand = this.grblCommands.find(c => c.command === "$J");
    let axisparam = this.assembleMoveParams(axis, distance, feedrate);
    return this.getCommandUrl(basecommand, axisparam);
  }

  public getCommandUrlByCommand(command: string, args: string[] = []) {
    let basecommand = new Command(command, '');
    if (basecommand) {
      let storedCommand = this.getCommands().find(c => c.command.startsWith(command));
      if (storedCommand != null) {
        basecommand.responseType = storedCommand.responseType;
        basecommand.commandType = storedCommand.commandType;
      }
      return this.getCommandUrl(basecommand, args);
    }
    this.InvalidCommand.next(`Invalid command : ${command}`);
    return null;
  }

  public getEspApiCommand(commandType: CommandType, args: string[] = []) {
    let basecommand = this.espApiCommands.find(c => c.commandType === commandType);
    if (basecommand !== undefined) {
      return this.getCommandUrl(basecommand, args);
    }
    this.InvalidCommand.next(`Invalid command type: ${commandType}`);
    return null;
  }

  public getSetOriginCommand(axes: Axis[]) {
    let basecommand = this.gcodeCommands.find(c => c.command == "G92");
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

  private getCommandUrl(command: Command | undefined, args: string[] = []): ExecutableCommand {
    let issuedCommand = new ExecutableCommand("");
    if (command !== undefined) {
      switch (command.commandType) {

        case CommandType.Upload: {
          issuedCommand.commandUrl = `/files`;
          issuedCommand.httpAction = command.httpAction;
          break;
        }
        case CommandType.UploadSd: {
          issuedCommand.commandUrl = `/sd`;
          issuedCommand.httpAction = command.httpAction;
          break;
        }
        case CommandType.FilesSdAction: {
          //delete, deletedir, createdir and filename as additional required parameter 
          issuedCommand.commandUrl = `/sd${args.length > 0 ? "?" + args.join('&') : ""}`;
          break;
        }
        case CommandType.FilesAction: {
          //delete, deletedir, createdir and filename as additional required parameter 
          issuedCommand.commandUrl = `/files${args.length > 0 ? "?" + args.join('&') : ""}`;
          break;
        }
        case CommandType.GrblSettings: {
          issuedCommand.commandUrl = "/grblsettings";
          break;
        }
        case CommandType.Login:
          {
            issuedCommand.commandUrl = "/login";
            break;
          }
        case CommandType.UpdateFw: {
          issuedCommand.commandUrl = "/updatefw";
          break;
        }
        case CommandType.FirmwareInfo: {
          issuedCommand.commandUrl = "/firmware";
          break;
        }
        default:
          {
            let commandprefix = command.commandType === CommandType.CommandSilent ? "command_silent" : "command";
            commandprefix = command.commandType == CommandType.EspCommand ? "espcommand" : commandprefix;
            if (args.length > 0) {
              issuedCommand.commandUrl = `/${commandprefix}?cmd=${command.command}${args.join('&')}`;
            }
            else {
              issuedCommand.commandUrl = `/${commandprefix}?cmd=${command.command}`;
            }
            break;
          }
      }

      issuedCommand.responseType = command.responseType;
      return issuedCommand;
    }
    else {
      this.InvalidCommand.next(issuedCommand.commandUrl);
      return issuedCommand;
    }
  }

}
