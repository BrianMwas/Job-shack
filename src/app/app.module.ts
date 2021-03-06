import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { AuthGuard } from './auth-guard.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { Applications,  nebular,  auth, angularSpecific, nBSecurity, Store } from './ui-modules';

import { UisModule } from './ui/uis.module';
import { JobModule } from './jobs/job.module';
import { ApplicationModule } from './applications/application.module';
import { UserProfileModule } from './auth/user.module';
import { NbRoleProvider } from '@nebular/security';
import { RoleProvider } from './auth/role.provider';


@NgModule({
  declarations: [
    AppComponent,
    ...Applications
  ],
  imports: [
    BrowserModule,
    ApplicationModule,
    BrowserAnimationsModule,
    NbLayoutModule,
    JobModule,
    UisModule,
    ...nebular,
    UserProfileModule,
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbEvaIconsModule,
    ...angularSpecific,
    ...auth,
    ...nBSecurity,
    AppRoutingModule,
    ...Store
  ],
  providers: [
    AuthGuard,
    {
      provide : NbRoleProvider,
      useClass: RoleProvider
    }
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
