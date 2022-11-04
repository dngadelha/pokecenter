import { Component, OnInit } from "@angular/core";
import * as AOS from "aos";

import { PokemonService } from "../shared/pokemon.service";

/**
 * Componente de listagem de pokemons.
 */
@Component({
  selector: "pokemons-list",
  templateUrl: "./pokemons-list.component.html",
  styleUrls: ["./pokemons-list.component.scss"],
  providers: [PokemonService],
})
export class PokemonsListComponent implements OnInit {
  /**
   * Valor do campo de busca.
   */
  search: string = "";

  constructor(public pokemonService: PokemonService) {}

  /**
   * Função chamada ao inicializar o componente.
   */
  ngOnInit(): void {
    // Atualizar as animações.
    AOS.refresh();
  }

  /**
   * Atualiza o valor do campo de busca.
   * @param search Valor do campo de busca.
   */
  setSearch(search: string) {
    this.search = search;
  }
}
