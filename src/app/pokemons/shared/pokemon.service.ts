import { Injectable } from "@angular/core";
import { RequestService } from "src/app/shared/request/request.service";

/**
 * Serviço de gerenciamento de pokemons.
 */
@Injectable({
  providedIn: "root"
})
export class PokemonService extends RequestService {
  /**
   * Obtém a lista de pokémons.
   * @param limit Limite de registros.
   * @param offset Índice do primeiro registro.
   */
  getPokemons(limit?: number, offset?: number) {
    // Obter a lista de pokémons.
    return this.request({
      route: "/pokemon/list",
      body: {
        limit,
        offset,
      },
    });
  }

  /**
   * Obtém a lista de pokémons capturados pelo usuário.
   * @param limit Limite de registros.
   * @param offset Índice do primeiro registro.
   */
  getUserCapturedPokemons(limit?: number, offset?: number) {
    // Obter a lista de pokémons capturados pelo usuário.
    return this.request({
      route: "/user/pokemons",
      body: {
        limit,
        offset,
      },
    });
  }

  /**
   * Captura um Pokémon.
   * @param name Nome do Pokémon.
   */
  capturePokemon(name: string) {
    // Capturar um Pokémon.
    return this.request({
      route: "/pokemon/capture",
      body: {
        name,
      },
    });
  }
}
