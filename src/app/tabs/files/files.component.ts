import { Component, ComponentRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less']
})
export class FilesComponent implements OnInit {

  public files: string[]
  public pageIndex = 0;
  public pageFiles: string[] = [];
  public selectedFile : string;
  constructor() {
    this.files = ['a.txt', 'b.txt', 'c.txt', 'd.txt', 'e.txt', 'f.txt', 'g.txt', 'h.txt', 'i.txt', 'j.txt', 'k.txt', 'l.txt', 'm.txt', 'n.txt', 'o.txt'];
    this.selectedFile = "";
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
    return this.selectedFile;
  }
}
