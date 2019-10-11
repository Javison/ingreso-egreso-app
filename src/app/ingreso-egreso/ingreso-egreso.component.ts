import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  tipo: string = 'ingreso';

  cargando: boolean;
  loadingSubs: Subscription = new Subscription();

  constructor( public ingresoEgresoService: IngresoEgresoService,
               private store: Store<AppState> ) { }

  ngOnInit() {

    this.loadingSubs = this.store.select('ui')
        .subscribe( ui => {
          this.cargando = ui.isLoading;
        })


    this.forma = new FormGroup({
      'descripcion': new FormControl( '', Validators.required ),
      'monto': new FormControl( 0, Validators.min(0) )
    });
  }

  crearIngresoEgreso() {
    console.log( this.forma );

    this.store.dispatch( new ActivarLoadingAction() );

    const ingresoEgreso = new IngresoEgreso( { ...this.forma.value, tipo: this.tipo } );
    console.log(ingresoEgreso);

    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
          .then( () => {
            this.forma.reset({
              monto: 0
            });
            
            this.store.dispatch( new DesactivarLoadingAction() );

          });
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }

}
