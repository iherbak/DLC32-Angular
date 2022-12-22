import { Component, ComponentRef, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { CommandType } from 'src/app/models/commandType';
import { Directory } from 'src/app/models/directory';
import { ESP32File } from 'src/app/models/esp32file';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { Drive, FileSource } from 'src/app/models/fileSource';
import { Subject, takeUntil } from 'rxjs';
import { FirmwareService } from 'src/app/services/firmware.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreateDirectoryComponent } from './create-directory/create-directory.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DeleteComponent } from './delete/delete.component';
import { WsState } from 'src/app/models/wsStatusMessage';
import { ProcessingDetails } from 'src/app/models/processingDetails';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less']
})
export class FilesComponent implements OnInit, OnDestroy {

  @ViewChild("fileInput") fileInput!: ElementRef;

  private unsub: Subject<void> = new Subject();
  private postponedUpdate: boolean = true;
  private processingDetails: ProcessingDetails = new ProcessingDetails("", 0);
  public directory: Directory;
  public pageIndex = 0;
  public pageFiles: ESP32File[] = [];
  public fileSources: FileSource[] = [new FileSource("/spiffs", Drive.SPIFF)];
  public fileForm: FormGroup;

  public get slashCorrectPath() {
    return `${this.directory.path}${this.directory.path === "/" ? "" : "/"}`;
  }

  public get fileSourceFc() {
    return this.fileForm.get("fileSource") as FormControl;
  }

  public get selectedFileFc() {
    return this.fileForm.get("selectedFile") as FormControl;
  }

  constructor(private formBuilder: FormBuilder, private commandService: CommandService, private clientService: ClientService, private firmwareService: FirmwareService, private bottomSheet: MatBottomSheet, private snackBar: SnackBarService) {

    this.fileForm = this.formBuilder.group({
      fileSource: [this.fileSources[0]],
      selectedFile: []
    });

    this.directory = new Directory();
    this.directory.path = "/";
    this.directory.files = [new ESP32File("cedfre","1321 kB")];
    this.UpdateFileList(this.directory);
    this.clientService.Connected.pipe(takeUntil(this.unsub)).subscribe(() => {
      this.fileSources.push(new FileSource(this.firmwareService.FirmwareInfo.Primary_Sd, Drive.SD))
      if (this.fileSources.length > 1) {
        this.fileSourceFc.setValue(this.fileSources[1], { emitEvent: false });
      }
      this.refreshFiles();

    });
  }
  ngOnInit(): void {

    this.fileSourceFc.valueChanges.pipe(takeUntil(this.unsub)).subscribe((source: FileSource) => {
      this.directory.path = "/"
      this.refreshFiles();
    });

    this.clientService.WsStatusMessage.pipe(takeUntil(this.unsub)).subscribe({
      next: (commandResult) => {
        if (commandResult.state === WsState.Idle && this.postponedUpdate) {
          this.postponedUpdate = false;
          this.directory.path = this.processingDetails.FilePath.substring(0, this.processingDetails.FilePath.lastIndexOf("/"));
          this.refreshFiles();
        }
        if ((commandResult.state == WsState.Run || commandResult.state === WsState.Hold) && this.postponedUpdate) {
          this.processingDetails = commandResult.getProcessingDetails();
        }
      }
    });

  }

  private refreshFiles() {
    //reset file selection
    this.selectedFileFc.setValue(null, { emitEvent: false });

    let basecommand = this.commandService.getEspApiCommand(this.getFileActionCommandType(), ["action=list", "filename=all", `path=${this.directory.path}`]);
    if (basecommand != null) {
      this.clientService.sendGetCommand<Directory>(basecommand).subscribe({
        next: n => {
          if (n.status.toLowerCase() !== "busy") {
            if (n.status.toLowerCase() != 'no sd card') {
              this.UpdateFileList(n);
            }
            else {
              this.snackBar.showSnackBar("SD Card was not recognized by firmware,");
              this.fileSources.splice(1, 1);
              this.fileSourceFc.setValue(this.fileSources[0], { emitEvent: false });
              this.refreshFiles();
            }
          }
          else {
            this.postponedUpdate = true;
          }
        },
        error: () => {
          this.snackBar.showSnackBar("Unable to get files!");
        }
      }
      );
    }
  }

  private UpdateFileList(n: Directory) {
    this.addParent(n);
    n.files = n.files.sort((a, b) => {
      if (a.size == '-1' && b.size == '-1') {
        return (a.name < b.name) ? -1 : 1;
      }
      if (a.size == '-1' && b.size != '-1') {
        return -1;
      }
      if (a.size != '-1' && b.size == '-1') {
        return 1;
      }
      return (a.name < b.name) ? -1 : 1;

    });
    this.directory = n;
    this.showFilesOnPage(0, 10);
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

  public paginate(event: PageEvent) {
    this.showFilesOnPage(event.pageIndex, event.pageSize);
  }

  private getFileActionCommandType() {
    return (this.fileSourceFc.value as FileSource).Drive === Drive.SPIFF ? CommandType.FilesAction : CommandType.FilesSdAction;
  }
  private getUploadTargetCommandType() {
    return (this.fileSourceFc.value as FileSource).Drive === Drive.SPIFF ? CommandType.Upload : CommandType.UploadSd
  }

  private showFilesOnPage(pageIndex: number, pageSize: number) {
    let offset = pageIndex * pageSize;
    this.pageFiles = this.directory.files.slice(offset, offset + pageSize);
  }

  private addParent(directory: Directory) {
    let isSubDir = directory.path.length > 1;
    if (isSubDir) {
      directory.files.unshift(new ESP32File('..', '-1'));
    }
  }

  public fileSelected() {
    if (this.selectedFileFc.value == null) {
      return false;
    }
    if (this.fileSourceFc.value.Drive === Drive.SPIFF || this.selectedFileFc.value[0].name === '..' || this.selectedFileFc.value[0].size === '-1') {
      return false;
    }
    return true;
  }

  public canBeDeleted() {
    if (this.selectedFileFc.value == null) {
      return false;
    }
    if (this.selectedFileFc.value[0].name === '..') {
      return false;
    }
    return true;
  }

  public upload() {
    this.fileInput.nativeElement.click();
  }

  public uploadFile(event: Event) {
    let basecommand = this.commandService.getEspApiCommand(this.getUploadTargetCommandType());
    let files = (event.target as HTMLInputElement).files;
    if (files != null && basecommand != null) {
      let formData = new FormData();
      //to get updated list of this path
      formData.append('path', this.slashCorrectPath);
      //for size check on server
      formData.append(`${this.slashCorrectPath}${files[0].name}S`, `${files[0].size}`);
      //to create file under dir
      formData.append("myfile[]", files[0], `${this.slashCorrectPath}${files[0].name}`);
      this.clientService.sendPostCommand<Directory>(basecommand, formData).subscribe({
        next: (ret: Directory) => {
          this.UpdateFileList(ret);
          //reset input
          this.fileInput.nativeElement.value = null;
        },
        error: () => {
          this.fileInput.nativeElement.value = null;
          this.snackBar.showSnackBar("Upload failed!",)
        }
      });
    }
  }

  public showCreateDirectory() {
    let sheetRef = this.bottomSheet.open(CreateDirectoryComponent, { data: { currentPath: this.directory.path, commandType: this.getFileActionCommandType() } });
    sheetRef.afterDismissed().subscribe((n: { success: boolean, directory: Directory }) => {
      if (n != undefined) {
        if (n.success) {
          this.UpdateFileList(n.directory);
        }
        else {
          this.snackBar.showSnackBar("Create Directory failed");
        }
      }
    });

  }

  public showDelete() {
    let sheetRef = this.bottomSheet.open(DeleteComponent, { data: { currentPath: this.directory.path, file: this.selectedFileFc.value[0], commandType: this.getFileActionCommandType() } });
    sheetRef.afterDismissed().subscribe((n: { success: boolean, directory: Directory }) => {
      if (n != undefined) {
        if (n.success) {
          this.UpdateFileList(n.directory);
        }
        else {
          this.snackBar.showSnackBar("Delete failed");
        }
      }
    });
  }

  public enterDir(file: ESP32File) {
    if (file.size == "-1") {
      //reverse to parent
      if (file.name == '..') {
        var lastpath = this.directory.path.lastIndexOf("/");
        this.directory.path = this.directory.path.substring(0, lastpath);
        this.directory.path = this.directory.path == '' ? '/' : this.directory.path;
      }
      else {
        this.directory.path = `${this.slashCorrectPath}${file.name}`;
      }
      this.refreshFiles();
    }
  }
  public StartFile() {

    let basecommand = this.commandService.getCommandUrlByCommand("[ESP220]", [`${this.slashCorrectPath}${this.selectedFileFc.value[0].name}`]);
    if (basecommand != null) {
      this.clientService.sendGetCommand<void>(basecommand).subscribe();
    }
  }

}
