import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';


@NgModule({

    declarations: [
        LoginComponent,
        RegisterComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        AngularFireModule,
        AngularFireAuthModule,
        RouterModule
    ]
})
export class AuthModule {}