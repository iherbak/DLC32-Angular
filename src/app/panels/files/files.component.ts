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

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less']
})
export class FilesComponent implements OnInit, OnDestroy {

  @ViewChild("fileInput") fileInput: ElementRef | undefined;

  private unsub: Subject<void> = new Subject();

  public directory: Directory;
  public pageIndex = 0;
  public pageFiles: ESP32File[] = [];
  public fileSources: FileSource[] = [new FileSource("Internal flash", Drive.SPIFF)];
  public fileForm: FormGroup;
  private currentPath = "/";

  public get Path() {
    return this.currentPath;
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
      this.directory.files.push(new ESP32File("adssadsa.txt","322.77 KB"));
      this.directory.files.push(new ESP32File("folder","-1"));
      this.directory.files.push(new ESP32File("alder","-1"));
      this.UpdateFileList(this.directory);
      this.showFilesOnPage(0,10);

    this.clientService.Connected.pipe(takeUntil(this.unsub)).subscribe(() => {
      let sdPaths = this.firmwareService.FirmwareInfo.SDPaths;
      sdPaths.forEach(sdp => {
        this.fileSources.push(new FileSource(sdp.key, Drive.SD))
      });

      if (this.fileSources.length > 1) {
        this.fileSourceFc.setValue(this.fileSources[1], { emitEvent: false });
      }
      this.refreshFiles();

    });
  }
  ngOnInit(): void {

    this.fileSourceFc.valueChanges.pipe(takeUntil(this.unsub)).subscribe((source: FileSource) => {
      this.currentPath = "/"
      this.refreshFiles();
    });

    this.selectedFileFc.valueChanges.pipe(takeUntil(this.unsub)).subscribe((file: ESP32File[]) => {
      if (file[0].size == "-1") {
        //reverse to parent
        if (file[0].name == '..') {
          var lastpath = this.currentPath.lastIndexOf("/");
          this.currentPath = this.currentPath.substring(0, lastpath);
          this.currentPath = this.currentPath == '' ? '/' : this.currentPath;
        }
        else {
          this.currentPath += file[0].name;
        }
        this.refreshFiles();
      }
    });
  }

  private refreshFiles() {
    //reset file selection
    this.selectedFileFc.setValue(null, { emitEvent: false });

    let basecommand = this.commandService.getCommandUrlByType(this.getFileActionCommandType(), ["action=list", "filename=all", `path=${this.currentPath}`]);
    if (basecommand != null) {
      this.clientService.sendGetCommand<Directory>(basecommand).subscribe({
        next: n => {
          this.UpdateFileList(n);
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
    return !this.selectedFileFc.value;
  }

  public upload() {
    this.fileInput?.nativeElement.click();
  }

  public uploadFile(event: Event) {
    let basecommand = this.commandService.getCommandUrlByType(this.getUploadTargetCommandType());
    let files = (event.target as HTMLInputElement).files;
    if (files != null && basecommand != null) {
      let formData = new FormData();
      formData.append('path', this.Path);
      formData.append(`${this.Path}${files[0].name}S`, `${files[0].size}`);
      formData.append("myfile[]", files[0]);
      this.clientService.sendPostCommand<Directory>(basecommand, formData).subscribe({
        next: (ret: Directory) => {
          this.directory = ret;
          this.showFilesOnPage(0, 10);
        },
        error: error => {
          console.log("upload failed");
        }
      });
    }
  }

  public showCreateDirectory() {
    let sheetRef = this.bottomSheet.open(CreateDirectoryComponent, { data: { currentPath: this.currentPath, commandType: this.getFileActionCommandType() } });
    sheetRef.afterDismissed().subscribe((n: { success: boolean, directory: Directory }) => {
      if (n.success) {
        this.UpdateFileList(n.directory);
      }
      else {
        this.snackBar.showSnackBar("Create Directory failed");
      }
    });


  }
}
