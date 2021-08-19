import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators';

import { PaisesService } from '../../services/paises.service';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;

  constructor( private fb: FormBuilder,
     private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // cuando cambia la región
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true
        }),
        switchMap( region => this.paisesService.getPaisesPorRegion( region ))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false
      })

    // cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.fronteras = [];
          this.miFormulario.get('fronteras')?.reset('');
          this.cargando = true
        }),
        switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap( pais => this.paisesService.getFronterasPaisNombre( pais?.borders!))
      )
      .subscribe( paises => {
        this.fronteras = paises;
        this.cargando = false
      })

  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
