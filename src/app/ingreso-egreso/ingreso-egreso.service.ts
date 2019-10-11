import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsActions, UnsetItemsActions } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {


  ingresoEgresoAuthSubscription: Subscription = new Subscription();
  ingresoEgresoItemsSubscription: Subscription = new Subscription();

  constructor( private afDB: AngularFirestore,
               private authService: AuthService,
               private store: Store<AppState> ) { }


  initIngresoEgresoListener() {

    this.ingresoEgresoAuthSubscription = 
      this.store.select('auth')
              .pipe(
                filter( auth => auth.user != null )
              )
              .subscribe( auth => {
                console.log( auth.user.uid );
                this.ingresoEgresoItems( auth.user.uid );
              });

    //const user= this.authService.getUsuario();    
  }


  private ingresoEgresoItems( uid: string) {

    // Se utiliza snapshop changes para recuperar el id de cada elemento

    this.ingresoEgresoItemsSubscription = 
      this.afDB.collection(`${ uid }/ingresos-egresos/items`)
             .snapshotChanges()
             .pipe(
               map( docData => {

                return docData.map( doc => {
                  return {
                    uid: doc.payload.doc.id,
                    ...doc.payload.doc.data()
                  };
                });
               })
             )
             .subscribe( (coleccion: any[] ) => {
               console.log(coleccion);
               this.store.dispatch( new SetItemsActions(coleccion) );
             });

  }

  cancelarSubscriptions() {
    this.ingresoEgresoItemsSubscription.unsubscribe();
    this.ingresoEgresoAuthSubscription.unsubscribe();
    this.store.dispatch( new UnsetItemsActions() );
  }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {

    const user = this.authService.getUsuario();

    return this.afDB.doc(`${ user.uid }/ingresos-egresos`)
             .collection('items')
             .add( { ...ingresoEgreso } )
             .then()
             .catch();

  }


  borrarIngresoEgreso( uid: string ) {

    const user = this.authService.getUsuario();

    return this.afDB.doc(`${ user.uid }/ingresos-egresos/items/${ uid }`)
             .delete();

  }
}
