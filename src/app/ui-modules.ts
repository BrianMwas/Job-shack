

// Applications.
import { ApplicationdetailComponent } from './applications/applicationdetail/applicationdetail.component';
import { ApplicationlistComponent } from './applications/applicationlist/applicationlist.component';
import {  StoreDevtoolsModule } from "@ngrx/store-devtools";
import * as fromJobs from '../app/shared/reducers/jobs.reducer'

// Nebular Modules
import {
    NbSidebarModule ,
    NbMenuModule,
    NbDatepickerModule,
    NbToastrModule,
    NbDialogModule
} from '@nebular/theme';


import {
  NbSecurityModule
} from "@nebular/security"



// Nebular Auth Modules.
import {
    NbPasswordAuthStrategy,
    NbAuthModule,
    NbAuthJWTToken
} from "@nebular/auth"
import { CommonModule } from '@angular/common';
// import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { JobEffects } from './shared/effects/job.effects';

export const Applications = [
    ApplicationdetailComponent,
    ApplicationlistComponent
]


export const nebular = [
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot()
]

export const angularSpecific = [
    CommonModule
]

export const Store = [
    StoreModule.forRoot({
        jobs:  fromJobs.reducer
    }),
    EffectsModule.forRoot([JobEffects]),
    StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
        logOnly: environment.production,
        //Restrict extension to log-only mode
        
    })
]


export const nBSecurity = [
  NbSecurityModule.forRoot({
    accessControl: {
      seeker: {
        view: [
          'jobdetail',
          'apply',
          'review',
          'comment',
          'addCV'
        ]
      },
      employer: {
        view: [
          'createjob',
          'updatejob',
          'deletejob',
          'createCompany',
          'updateCompany'
        ]
      }
    }
  })
]


// The Password should be imported separately from the auth module, the auth module only will be imported.
export const password = [
    NbPasswordAuthStrategy
]

export const auth = [
    NbAuthModule.forRoot({
        strategies: [
            NbPasswordAuthStrategy.setup({
                // Alias to the strategy to dynamically mention it later. Allows multiple strategy configurations in one app
                name: 'email',


                token: {
                    class: NbAuthJWTToken,
                    key: 'token'
                },
                baseEndpoint: 'http://localhost:9000/api/v1',
                login: {
                    endpoint: "/auth/login",
                    method: 'post',
                    redirect: {
                        success: "/dashboard", // Redirect to dashboard on successful login
                        failure: null // Stay on the page on failures
                    }
                },
                register: {
                    endpoint: "/auth/register",
                    method: 'post',
                    redirect: {
                        success: '/auth/login',
                        failure: null
                    }
                },
                logout: {
                    endpoint: "/auth/logout",
                    method: 'get',
                    redirect : {
                        success: '/',
                        failure: '/'
                    }
                },
                resetPass: {
                    endpoint: "/reset-pass",
                    method: 'post'
                },
                requestPass: {
                  endpoint: "/auth/request-password-change",
                  method: "post"
                },
                messages: {
                    key: 'data.message'
                },
                validation: {
                    fullName: {
                        required: true
                    },
                    password: {
                        regexp: "/(?=.*[a-zA-Z])(?=.*[0-9]+).*/"
                    }
                }
            })
        ]
    })
]
