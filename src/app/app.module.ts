import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './main/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { ControlsComponent } from './tabs/controls/controls.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { XyzComponent } from './tabs/controls/xy/xyz.component';
import { GeneralComponent } from './tabs/controls/general/general.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LaserComponent } from './tabs/controls/laser/laser.component';
import { FilesComponent } from './tabs/files/files.component';
import { FileItemComponent } from './tabs/files/file-item/file-item.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ControlsComponent,
    XyzComponent,
    GeneralComponent,
    LaserComponent,
    FilesComponent,
    FileItemComponent
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
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
