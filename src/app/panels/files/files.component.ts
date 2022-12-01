import { Component, ComponentRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { CommandType } from 'src/app/models/commandType';
import { Directory } from 'src/app/models/directory';
import { ESP32File } from 'src/app/models/esp32file';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { Drive, FileSource } from 'src/app/models/fileSource';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less']
})
export class FilesComponent {

  @ViewChild('filelist') filelist: MatSelectionList | undefined;

  @ViewChild("fileInput") fileInput: ElementRef | undefined;

  public directory: Directory;
  public pageIndex = 0;
  public pageFiles: ESP32File[] = [];
  public fileSources: FileSource[] = [new FileSource("Internal flash", Drive.SPIFF), new FileSource("SD card", Drive.SD)];
  public fileForm: FormGroup;
  private currentPath = "/";

  public get Path() {
    return this.currentPath;
  }

  public get fileSourceFc() {
    return this.fileForm.get("fileSource") as FormControl;
  }

  constructor(private formBuilder: FormBuilder, private commandService: CommandService, private clientService: ClientService) {

    this.fileForm = this.formBuilder.group({
      fileSource: [this.fileSources[0]]
    });

    this.directory = new Directory();
    let basecommand = this.commandService.getCommandUrlByType(CommandType.FilesAction, ["action=list", "filename=all", `path=${this.currentPath}`]);
    if (basecommand != null) {
      this.clientService.sendGetCommand<Directory>(basecommand).subscribe({
        next: n => {
          console.log(n);
          console.log(typeof(n));
          this.directory = n;
          this.showFilesOnPage(0, 10);
        }
       
      }
      );
    }
  }

  public paginate(event: PageEvent) {
    this.showFilesOnPage(event.pageIndex, event.pageSize);
  }

  private showFilesOnPage(pageIndex: number, pageSize: number) {
    let offset = pageIndex * pageSize;
    this.pageFiles = this.directory.files.slice(offset, offset + pageSize);
  }

  public fileSelected() {
    return !this.filelist?.selectedOptions.hasValue();
  }

  public upload(){
    this.fileInput?.nativeElement.click();
  }

  public uploadFile(event: Event) {
    let basecommand = this.commandService.getCommandUrlByType(CommandType.Upload);
    let files = (event.target as HTMLInputElement).files;
    if (files != null && basecommand != null) {
      let formData = new FormData();
      formData.append('path', this.Path);
      formData.append(`${this.Path}${files[0].name}S`, `${files[0].size}`);
      formData.append("myfile[]", files[0]);
      this.clientService.sendPostCommand<Directory>(basecommand,formData).subscribe({
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
}
