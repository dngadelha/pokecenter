import { Component, Input, OnInit } from "@angular/core";
import { Pokemon } from "../shared/pokemon";

/**
 * Componente de item de lista de pokémons.
 */
@Component({
  selector: "pokemons-list-item",
  templateUrl: "./pokemons-list-item.component.html",
  styleUrls: ["./pokemons-list-item.component.scss"]
})
export class PokemonsListItemComponent implements OnInit {
  /**
   * Pokemon a ser exibido.
   */
  @Input()
  pokemon?: Pokemon;

  /**
   * Valor do campo de busca.
   */
  @Input()
  search?: string;

  /**
   * ID do pokémon formatado.
   */
  pokemonId?: string;

  /**
   * Destaca o texto de acordo com o valor do campo de busca.
   * @param value Valor a ser destacado.
   * @returns Valor destacado.
   */
  highlightSearch(value: string): string {
    if (!this.search || this.search.length === 0) return value;
    return value.replace(
      new RegExp(`(${this.search})`, "igm"),
      "<span class=\"highlight\">$1</span>"
    );
  }

  /**
   * Função chamada ao inicializar o componente.
   */
  ngOnInit(): void {
    if (this.pokemon) {
      // Formatar o ID do pokémon.
      this.pokemonId = this.pokemon.id.toString().padStart(3, "0");
    }
  }
}
