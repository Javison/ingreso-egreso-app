import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import Swal from 'sweetalert2';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private afAuth: AngularFireAuth,
               private afDB: AngularFirestore,
               private router: Router ) { }


  initAuthListener() {
    // this.afAuth.authState.subscribe( fbUser => {
    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
      console.log(fbUser);
      //console.log(fbUser.email);
    });
  }              

  crearUsuario( nombre: string, email:string, password:string ) {

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
            } );

        })
        .catch( error => {
          console.error(error);
          //Swal('Errro en el login', error.message, 'error');
        });

  }


  login( email: string, password: string ) {
    
    this.afAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then( resp => {
          console.log(resp);
          this.router.navigate(['/']);
        })
        .catch( error => {
          console.error(error);
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
