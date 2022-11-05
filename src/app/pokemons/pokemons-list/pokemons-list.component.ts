import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { debounceTime, merge, share, Subject, Subscription, throttle } from "rxjs";
import * as AOS from "aos";

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
export class PokemonsListComponent implements OnInit, OnDestroy {
  /**
   * Tipo da lista de pókemons.
   */
  @Input()
  type: "all" | "captured" = "all";

  /**
   * Valor do campo de busca.
   */
  search: string = "";
  search$: Subject<string> = new Subject<string>();
  searchSubscription$: Subscription | null = null;

  /**
   * Valor lógico indicando se o campo de busca possui erros.
   */
  searchHasError: boolean = false;

  /**
   * Lista de pokémons capturados/cadastrados.
   */
  pokemons: Pokemon[] = [];

  /**
   * Total de pokémons capturados/cadastrados.
   */
  totalPokemons: number = -1;

  /**
   * Valor lógico indicando se está atualizando a lista de pokémons.
   */
  isUpdatingPokemons: boolean = false;

  /**
   * Valor lógico indicando se está capturando um pokémon.
   */
  isCapturingPokemon: boolean = false;

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
    this.updatePokemons(true);

    // Inscrever no @Subject do campo de busca com debounce.
    const debounced = this.search$.pipe(debounceTime(250), share());
    this.searchSubscription$ = merge(
      this.search$.pipe(throttle((val) => debounced)), debounced
    ).subscribe((search) => {
      // Tentar capturar Pokémon.
      this.tryCapturePokemon(search);
    });
  }

  /**
   * Função chamada ao destruir o componente.
   */
  ngOnDestroy(): void {
    this.searchSubscription$?.unsubscribe();
  }

  /**
   * Atualiza o valor do campo de busca.
   * @param search Valor do campo de busca.
   */
  setSearch(search: string) {
    this.search = search;
    this.search$.next(search);
  }

  /**
   * Evento chamado ao rolar a página.
   * @see https://developer.mozilla.org/pt-BR/docs/Web/API/Window/scroll
   */
  @HostListener("window:scroll")
  onWindowScroll() {
    if (this.pokemonsList && !this.isUpdatingPokemons && this.type === "all") {
      // Obter a posição do elemento da lista de pokémons.
      const elementPosition = this.pokemonsList.nativeElement.getBoundingClientRect().top;

      // Verificar se o usuário chegou ao final da lista de pokémons.
      if (window.scrollY >= this.pokemonsList.nativeElement.offsetHeight + elementPosition) {
        // Atualizar a lista de pokémons.
        this.updatePokemons(false);
      }
    }
  }

  /**
   * Atualiza a lista de pókemons.
   */
  async updatePokemons(forceUpdate: boolean = false) {
    // Verificar se já está carregando a lista de pokémons.
    if (this.isUpdatingPokemons) return;

    // Definir que está carregando a lista de pokémons.
    this.isUpdatingPokemons = true;

    try {
      // Verificar o tipo da lista de pókemons.
      switch (this.type) {
        case "all": {
          // Verificar se ainda não carregou todos os pókemons.
          if (forceUpdate || this.totalPokemons === -1 || this.pokemons.length < this.totalPokemons) {
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
          /*if (forceUpdate || this.totalPokemons === -1 || this.pokemons.length < this.totalPokemons) {*/

          // Obter a lista de pokémons capturados pelo usuário.
          const response = await this.pokemonService.getUserCapturedPokemons(/*50, this.pokemons.length*/);

          // Verificar se obteve a lista de pokémons.
          if (response.status === "success" && response.result && response.result.pokemons) {
            // Atualizar a lista de pokémons.
            this.pokemons = /*[...response.result.pokemons, ...this.pokemons]*/ response.result.pokemons;

            // Atualizar o total de pokémons.
            this.totalPokemons = response.result.count;
          }

          /*}*/

          break;
        };
      }
    } catch (e) {
      // Falha ao obter a lista de pokémons.
      this.pokemonService.handleRequestError(e as Error, this.toastrService);
    }

    // Redefinir que está carregando a lista de pokémons.
    this.isUpdatingPokemons = false;
  }

  /**
   * Tenta capturar um Pokémon.
   * @param name Nome do Pókemon.
   */
  async tryCapturePokemon(name: string) {
    // Verificar se já está capturando um pokémon.
    if (this.isCapturingPokemon) return;

    // Verificar se o nome do Pókemon foi especificado.
    if (name && name.trim().length > 0) {
      // Definir que está capturando um pokémon.
      this.isCapturingPokemon = true;

      try {
        // Tentar capturar o Pokémon.
        const response = await this.pokemonService.capturePokemon(name);

        // Verificar o status da requisição.
        switch (response.status) {
          case "success":
            // Pokémon capturado com sucesso.
            const pokemon = response.result?.pokemon;

            // Exibir mensagem de sucesso.
            this.toastrService.success(pokemon ?
              `Você capturou o Pokémon <i>${pokemon.id.toString().padStart(3, "0")}</i> - <b>${pokemon.name}</b>!` :
              `Você capturou o Pokémon!`,
              "Parabéns", {
                enableHtml: true,
              },
            );

            // Redefinir campo de busca.
            this.searchHasError = false;
            this.setSearch("");

            // Redefinir que está carregando a lista de pokémons.
            this.isUpdatingPokemons = false;

            // Atualizar a lista de pokémons.
            await this.updatePokemons(true);
            break;
          case "pokemon_not_found":
            // Pokémon não encontrado!
            this.searchHasError = true;
            break;
          case "pokemon_already_captured":
            // Exibir mensagem de erro.
            this.toastrService.warning("Você já capturou esse Pokémon!", "Alerta");

            // Redefinir campo de busca.
            this.searchHasError = false;
            this.setSearch("");
            break;
          default:
            // Resposta desconhecida!
            this.searchHasError = true;
            break;
        }
      } catch (e) {
        // Falha ao capturar o Pokémon.
        this.pokemonService.handleRequestError(e as Error, this.toastrService);
      }

      // Redefinir que está capturando um pokémon.
      this.isCapturingPokemon = false;
    } else {
      // Redefinir estado de erro do campo de busca.
      this.searchHasError = false;
    }
  }
}
