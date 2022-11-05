import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import * as AOS from "aos";
import { ToastrService } from "ngx-toastr";
import { Pokemon } from "../shared/pokemon";

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
   * Tipo da lista de pókemons.
   */
  @Input()
  type: "all" | "captured" = "all";

  /**
   * Valor do campo de busca.
   */
  search: string = "";

  /**
   * Lista de pokémons capturados/cadastrados.
   */
  pokemons: Pokemon[] = [];

  /**
   * Total de pokémons capturados/cadastrados.
   */
  totalPokemons: number = -1;

  /**
   * Valor lógico indicando se a lista de pókemons está vazia.
   */
  isUpdatingPokemons: boolean = false;

  /**
   * Referência para o elemento da lista de pókemons.
   */
  @ViewChild("pokemonsList")
  pokemonsList: ElementRef<HTMLDivElement> | null = null;

  constructor(
    private toastrService: ToastrService,
    private pokemonService: PokemonService
  ) {}

  /**
   * Função chamada ao inicializar o componente.
   */
  ngOnInit(): void {
    // Atualizar as animações.
    AOS.refresh();

    // Atualizar a lista de pokémons.
    this.updatePokemons();
  }

  /**
   * Atualiza o valor do campo de busca.
   * @param search Valor do campo de busca.
   */
  setSearch(search: string) {
    this.search = search;
  }

  /**
   * Evento chamado ao rolar a página.
   * @see https://developer.mozilla.org/pt-BR/docs/Web/API/Window/scroll
   */
  @HostListener("window:scroll")
  onWindowScroll() {
    if (this.pokemonsList && !this.isUpdatingPokemons) {
      // Obter a posição do elemento da lista de pokémons.
      const elementPosition = this.pokemonsList.nativeElement.getBoundingClientRect().top;

      // Verificar se o usuário chegou ao final da lista de pokémons.
      if (window.scrollY >= this.pokemonsList.nativeElement.offsetHeight + elementPosition) {
        // Atualizar a lista de pokémons.
        this.updatePokemons();
      }
    }
  }

  /**
   * Atualiza a lista de pókemons.
   */
  async updatePokemons() {
    // Verificar se já está carregando a lista de pokémons.
    if (this.isUpdatingPokemons) return;

    // Definir que está carregando a lista de pokémons.
    this.isUpdatingPokemons = true;

    try {
      // Verificar o tipo da lista de pókemons.
      switch (this.type) {
        case "all": {
          // Verificar se ainda não carregou todos os pókemons.
          if (this.totalPokemons === -1 || this.pokemons.length < this.totalPokemons) {
            // Obter a lista de pokémons.
            const response = await this.pokemonService.getPokemons(50, this.pokemons.length);

            // Verificar se obteve a lista de pokémons.
            if (response.status === "success" && response.result && response.result.pokemons) {
              // Atualizar a lista de pokémons.
              this.pokemons = this.pokemons.concat(response.result.pokemons);

              // Atualizar o total de pokémons.
              this.totalPokemons = response.result.count;
            }
          }

          break;
        };

        case "captured": {
          // Verificar se ainda não carregou todos os pókemons.
          if (this.totalPokemons === -1 || this.pokemons.length < this.totalPokemons) {
            // Obter a lista de pokémons capturados pelo usuário.
            const response = await this.pokemonService.getUserCapturedPokemons(50, this.pokemons.length);

            // Verificar se obteve a lista de pokémons.
            if (response.status === "success" && response.result && response.result.pokemons) {
              // Atualizar a lista de pokémons.
              this.pokemons = this.pokemons.concat(response.result.pokemons);

              // Atualizar o total de pokémons.
              this.totalPokemons = response.result.count;
            }
          }

          break;
        };
      }
    } catch (e) {
      // Falha ao obter a lista de pokémons.
      this.pokemonService.showRequestError(e as Error, this.toastrService);
    }

    // Redefinir que está carregando a lista de pokémons.
    this.isUpdatingPokemons = false;
  }
}
