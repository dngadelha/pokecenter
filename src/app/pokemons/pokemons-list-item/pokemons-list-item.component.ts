import { Component, Input } from "@angular/core";
import { Pokemon } from "../shared/pokemon";

@Component({
  selector: "pokemons-list-item",
  templateUrl: "./pokemons-list-item.component.html",
  styleUrls: ["./pokemons-list-item.component.scss"]
})
export class PokemonsListItemComponent {
  /**
   * Pokemon a ser exibido.
   */
  @Input()
  pokemon?: Pokemon;
}
