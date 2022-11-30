import { Component, ComponentRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { Drive, FileSource } from 'src/app/models/fileSource';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less']
})
export class FilesComponent implements OnInit {

  @ViewChild('filelist') filelist : MatSelectionList | undefined;
  
  public files: string[]
  public pageIndex = 0;
  public pageFiles: string[] = [];
  public fileSources: FileSource[] = [ new FileSource("Internal flash", Drive.SPIFF), new FileSource("SD card",Drive.SD)];
  public fileForm: FormGroup;
  
  public get fileSourceFc(){
    return this.fileForm.get("fileSource") as FormControl;
  }
  
  constructor(private formBuilder: FormBuilder) {
    
    this.fileForm = this.formBuilder.group({
      fileSource: [this.fileSources[0]]
    });

    this.files = ['a.txt', 'b.txt', 'c.txt', 'd.txt', 'e.txt', 'f.txt', 'g.txt', 'h.txt', 'i.txt', 'j.txt', 'k.txt', 'l.txt', 'm.txt', 'n.txt', 'o.txt'];
  }

  ngOnInit(): void {

    this.showFilesOnPage(0,10);
  }

  public paginate(event: PageEvent) {
    this.showFilesOnPage(event.pageIndex,event.pageSize);
  }

  private showFilesOnPage(pageIndex: number, pageSize: number){
    let offset = pageIndex * pageSize;
    this.pageFiles = this.files.slice(offset, offset + pageSize);
  }

  public fileSelected()
  {
    return !this.filelist?.selectedOptions.hasValue();
  }
}
