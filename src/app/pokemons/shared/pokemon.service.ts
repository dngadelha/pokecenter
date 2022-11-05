import { Injectable } from "@angular/core";
import { RequestService } from "src/app/shared/request/request.service";
import { Pokemon } from "./pokemon";

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
   * @param name Nome do pókemon para buscar.
   */
  getPokemons(limit?: number, offset?: number, name?: string) {
    // Obter a lista de pokémons.
    return this.request<{
      /**
       * Lista de pokémons.
       */
      pokemons: Pokemon[];

      /**
       * Total de pokémons.
       */
      count: number;
    }>({
      method: "POST",
      route: "/pokemon/list",
      body: {
        limit,
        offset,
        name,
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
    return this.request<{
      /**
       * Lista de pokémons.
       */
      pokemons: Pokemon[];

      /**
       * Total de pokémons.
       */
      count: number;
    }>({
      method: "POST",
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
    return this.request<{
      /**
       * Informações do Pokémon capturado.
       */
      pokemon?: Pokemon;
    }>({
      method: "POST",
      route: "/pokemon/capture",
      body: {
        name,
      },
    });
  }
}
