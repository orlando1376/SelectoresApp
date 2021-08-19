import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pais, PaisSmall } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = 'https://restcountries.eu/rest/v2';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {
    return this.http.get<PaisSmall[]>(`${ this.baseUrl }/region/${ region }?fields=alpha3Code;name`);
  }

  getPaisPorCodigo( codigo: string ): Observable<Pais | null> {
    if (!codigo) {
      return of(null)
    }

    return this.http.get<Pais>(`${ this.baseUrl }/alpha/${ codigo }`);
  }

  getPaisPorCodigoSmall( codigo: string ): Observable<PaisSmall> {
    return this.http.get<PaisSmall>(`${ this.baseUrl }/alpha/${ codigo }?fields=alpha3Code;name`);
  }

  getFronterasPaisNombre( fronteras: string[] ): Observable<PaisSmall[]> {
    if (!fronteras) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    fronteras.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    })

    // ejecuta todas peticiones simultáneamente
    return combineLatest( peticiones );
  }

}
