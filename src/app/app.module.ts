/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { AuthGuard } from './auth-guard.service';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { NzMessageModule } from "ng-zorro-antd/message";

import { NZ_I18N, en_US, fr_FR } from 'ng-zorro-antd/i18n';


registerLocaleData(fr);

import {
  AccountBookFill,
  AlertFill,
  AlertOutline,
  DownloadOutline,
  EditOutline,
  DeleteOutline,
  UserOutline,
  MailOutline,
  LockOutline,
  UserAddOutline,
  FolderAddOutline,
  MoneyCollectOutline,
  CaretLeftOutline,
  CaretLeftFill,
  PaperClipOutline,
  PicRightOutline,
  EyeOutline,
  UpSquareOutline,
  ForwardOutline,
} from '@ant-design/icons-angular/icons';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



const icons: IconDefinition[] = [ AccountBookFill, AlertOutline, AlertFill,
  DownloadOutline, EditOutline, DeleteOutline, UserOutline, MailOutline,
  LockOutline, UserAddOutline, FolderAddOutline, MoneyCollectOutline, CaretLeftOutline, CaretLeftFill,
  PaperClipOutline, PicRightOutline, EyeOutline, UpSquareOutline, ForwardOutline];


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NzIconModule.forRoot(icons),
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NzMessageModule,
  ],
  providers: [
    AuthGuard,
    { provide: NZ_I18N, useValue: fr_FR },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
