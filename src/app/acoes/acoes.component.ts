import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Acoes } from './modelo/acoes';
import { AcoesService } from './acoes.service';
import { Subscription, merge } from 'rxjs';
import {
  tap,
  switchMap,
  filter,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';

const ESPERA_DIGITACAO = 300;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {
  acoesInput = new FormControl();
  todasAcoes$ = this.acoesService.getAcoes().pipe(
    tap(() => {
      console.log('Fluxo Inicial');
    })
  );
  filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
    debounceTime(ESPERA_DIGITACAO), // espera um tempo antes de começar
    tap(() => { // 'vasa' o fluxo
      console.log('Fluxo do Filtro');
    }),
    tap(console.log),
    filter( //filtra o fluxo com uma funcao booleana
      (valorDigitado) => valorDigitado.length >= 3 || !valorDigitado.length
    ),
    distinctUntilChanged(), // recorda a ultima pesquisa
    switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado)), //transforma um observable em outro
    tap(console.log)
  );
  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$); //Faz a união dos dois observables

  constructor(private acoesService: AcoesService) {}
}
