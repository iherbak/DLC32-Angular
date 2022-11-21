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
import { XyComponent } from './tabs/controls/xy/xy.component';
import { ZComponent } from './tabs/controls/z/z.component';
import { GeneralComponent } from './tabs/controls/general/general.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ControlsComponent,
    XyComponent,
    ZComponent,
    GeneralComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
