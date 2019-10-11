import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import * as fromIngresoEgreso from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[];
  subscription: Subscription = new Subscription();

  constructor( private store: Store<fromIngresoEgreso.AppState>,
               private ingresoEgresoService: IngresoEgresoService ) { }

  ngOnInit() {

    this.subscription = this.store.select('ingresoEgreso')
        .subscribe( ingresoEgreso => {
          console.log(ingresoEgreso.items);
          this.items = ingresoEgreso.items;
        });
  }


  borrarItem( item: IngresoEgreso ) {
    console.log('Borrar:', item);
    this.ingresoEgresoService.borrarIngresoEgreso(item.uid)
        .then( () => {
          console.log('Item eliminado');
        });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
