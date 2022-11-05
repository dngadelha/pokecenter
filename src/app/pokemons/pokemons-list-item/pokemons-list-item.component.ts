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
   * ID do pokémon formatado.
   */
  pokemonId?: string;

  /**
   * Função chamada ao inicializar o componente.
   */
  ngOnInit() {
    if (this.pokemon) {
      // Formatar o ID do pokémon.
      this.pokemonId = this.pokemon.id.toString().padStart(3, "0");
    }
  }
}
