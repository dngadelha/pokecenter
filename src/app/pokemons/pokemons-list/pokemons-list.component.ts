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
    const debounced = this.search$.pipe(debounceTime(200), share());
    this.searchSubscription$ = merge(
      this.search$.pipe(throttle((val) => debounced)), debounced
    ).subscribe((search) => {
      // Verificar o tipo.
      switch (this.type) {
        // Caso seja a lista de todos os pokémons.
        case "all":
          // Atualizar a lista de pokémons.
          this.updatePokemons(true);
          break;

        // Caso seja a lista de pokémons capturados.
        case "captured":
          // Tentar capturar Pokémon.
          // this.tryCapturePokemon(search);
          break;
      }
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

    if (search.length === 0) {
      this.searchHasError = false;
    }
  }

  /**
   * Função chamada ao pressionar tecla no campo de busca.
   * @param event Evento do teclado.
   */
  onSearchInputKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      // Tentar capturar pokémon.
      this.tryCapturePokemon();
    }
  }

  /**
   * Evento chamado ao rolar a página.
   * @see https://developer.mozilla.org/pt-BR/docs/Web/API/Window/scroll
   */
  @HostListener("window:scroll")
  onWindowScroll() {
    if (this.pokemonsList && !this.isUpdatingPokemons && this.type === "all" && this.pokemons.length > 0) {
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
  updatePokemons(forceUpdate: boolean = false) {
    // Verificar se já está carregando a lista de pokémons.
    if (this.isUpdatingPokemons) return;

    // Definir que está carregando a lista de pokémons.
    this.isUpdatingPokemons = true;

    // Verificar o tipo da lista de pókemons.
    switch (this.type) {
      case "all": {
        // Verificar se ainda não carregou todos os pókemons.
        if (forceUpdate || this.totalPokemons === -1 || this.pokemons.length < this.totalPokemons) {
          // Obter a lista de pokémons.
          this.pokemonService
            .getPokemons(
              /* Limite: */ 50,
              /* Offset: */ forceUpdate ? 0 : this.pokemons.length,
              /* Nome: */ this.search
            )
            .subscribe((response) => {
              // Verificar se obteve a lista de pokémons.
              if (response && response.status === "success" && response.result && response.result.pokemons) {
                // Verificar se possui busca.
                if (forceUpdate || this.search && this.search.trim().length > 0) {
                  // Atualizar a lista de pokémons.
                  this.pokemons = response.result.pokemons;
                } else {
                  // Adicionar à lista de pokémons.
                  this.pokemons = this.pokemons.concat(response.result.pokemons);
                }

                // Atualizar o total de pokémons.
                this.totalPokemons = response.result.count;
              }

              // Redefinir que está carregando a lista de pokémons.
              this.isUpdatingPokemons = false;
            });
        } else {
          // Redefinir que está carregando a lista de pokémons.
          this.isUpdatingPokemons = false;
        }

        break;
      };

      case "captured": {
        // Obter a lista de pokémons capturados pelo usuário.
        this.pokemonService
          .getUserCapturedPokemons()
          .subscribe((response) => {
            // Verificar se obteve a lista de pokémons.
            if (response && response.status === "success" && response.result && response.result.pokemons) {
              // Atualizar a lista de pokémons.
              this.pokemons = response.result.pokemons;

              // Atualizar o total de pokémons.
              this.totalPokemons = response.result.count;
            }

            // Redefinir que está carregando a lista de pokémons.
            this.isUpdatingPokemons = false;
          });

        break;
      };

      default: {
        // Redefinir que está carregando a lista de pokémons.
        this.isUpdatingPokemons = false;
        break;
      }
    }
  }

  /**
   * Tenta capturar um Pokémon.
   * @param name Nome do Pókemon.
   */
  tryCapturePokemon(name?: string) {
    // Verificar se já está capturando um pokémon.
    if (this.isCapturingPokemon) return;

    // Verificar se o nome não foi especificado.
    if (!name) name = this.search.trim();

    // Verificar se o nome do Pókemon foi especificado.
    if (name && name.trim().length > 0) {
      // Definir que está capturando um pokémon.
      this.isCapturingPokemon = true;

      // Tentar capturar o Pokémon.
      this.pokemonService
        .capturePokemon(name)
        .subscribe((response) => {
          if (response) {
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
                this.setSearch("");

                // Redefinir que está carregando a lista de pokémons.
                this.isUpdatingPokemons = false;

                // Atualizar a lista de pokémons.
                this.updatePokemons(true);
                break;
              case "pokemon_not_found":
                // Pokémon não encontrado!
                this.searchHasError = true;

                // Exibir alerta.
                this.toastrService.warning("Esse Pokémon não foi encontrado!", "Alerta");
                break;
              case "pokemon_already_captured":
                // Exibir alerta.
                this.toastrService.warning("Você já capturou esse Pokémon!", "Alerta");

                // Redefinir campo de busca.
                this.setSearch("");
                break;
              default:
                // Resposta desconhecida!
                this.searchHasError = true;
                break;
            }
          }

          // Redefinir que está capturando um pokémon.
          this.isCapturingPokemon = false;
        });
    } else {
      // Redefinir estado de erro do campo de busca.
      this.searchHasError = false;
    }
  }
}
