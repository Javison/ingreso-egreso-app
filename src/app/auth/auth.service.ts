import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { ActivarLoadingAction,
         DesactivarLoadingAction } from '../shared/ui.actions';

import * as firebase from 'firebase';
import Swal from 'sweetalert2';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../app.reducer';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription;

  constructor( private afAuth: AngularFireAuth,
               private afDB: AngularFirestore,
               private store: Store<AppState>,
               private router: Router ) { }


  initAuthListener() {

    this.afAuth.authState
                .subscribe( (fbUser: firebase.User) => {

                  if ( fbUser ) {

                    console.log(fbUser);
                    //console.log(fbUser.email);
                    if ( fbUser ) {
                      this.userSubscription = 
                        this.afDB.doc(`${ fbUser.uid }/usuario`)
                                .valueChanges()
                                .subscribe( (usuarioObj: any) => {
                                  const newUser = new User( usuarioObj ); 
                                  this.store.dispatch( new SetUserAction( newUser ));
                                  console.log(newUser);
                                })
                    }

                  } else {
                    if (this.userSubscription) {
                      this.userSubscription.unsubscribe();
                    }
                  }

                
      });

  }

  crearUsuario( nombre: string, email:string, password:string ) {

    this.store.dispatch( new ActivarLoadingAction() );

    this.afAuth.auth
        .createUserWithEmailAndPassword(email, password)
        .then( resp => {
          console.log(resp);

          const user: User = {
            uid: resp.user.uid,
            nombre: nombre,
            email: resp.user.email
          }

          this.afDB.doc(`${ user.uid }/usuario`)
            .set( user )
            .then( () => {
              this.router.navigate(['/']);
              this.store.dispatch( new DesactivarLoadingAction() );
            } );

        })
        .catch( error => {
          console.error(error);
          this.store.dispatch( new DesactivarLoadingAction() );
          //Swal('Errro en el login', error.message, 'error');
        });

  }


  login( email: string, password: string ) {

    this.store.dispatch( new ActivarLoadingAction() );
    
    this.afAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then( resp => {
          console.log(resp);
          this.store.dispatch( new DesactivarLoadingAction() );
          this.router.navigate(['/']);
        })
        .catch( error => {
          console.error(error);
          this.store.dispatch( new DesactivarLoadingAction() );
          //Swal('Errro en el login', error.message, 'error');
        });
  }

  logout() {
    
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();

  }


  isAuth() {
    return this.afAuth.authState
      .pipe(
        map( fbUser => {
          
          if ( fbUser == null ) {
            this.router.navigate(['/login']);
          }

          return fbUser != null;
        })
      )
  }
  
}
