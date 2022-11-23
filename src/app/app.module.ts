import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './main/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { PanelsComponent } from './panels/panels.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { XyzComponent } from './panels/controls/xy/xyz.component';
import { GeneralComponent } from './panels/controls/general/general.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LaserComponent } from './panels/controls/laser/laser.component';
import { FilesComponent } from './panels/files/files.component';
import { FileItemComponent } from './panels/files/file-item/file-item.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ProgressComponent } from './panels/progress/progress.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PanelsComponent,
    XyzComponent,
    GeneralComponent,
    LaserComponent,
    FilesComponent,
    FileItemComponent,
    ProgressComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatGridListModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatCardModule,
    MatListModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
