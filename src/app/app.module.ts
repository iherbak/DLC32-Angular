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
import { FilesComponent } from './panels/files/files.component';
import { FileItemComponent } from './panels/files/file-item/file-item.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ProgressComponent } from './panels/progress/progress.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TerminalComponent } from './panels/terminal/terminal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PanelsComponent,
    XyzComponent,
    GeneralComponent,
    FilesComponent,
    FileItemComponent,
    ProgressComponent,
    TerminalComponent
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
    MatProgressBarModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
