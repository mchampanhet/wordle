import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DialogModule,
    BrowserAnimationsModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
