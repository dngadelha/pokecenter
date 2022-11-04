import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { v4 as uuidv4 } from "uuid";

/**
 * Serviço de gerenciamento de usuários.
 */
@Injectable({
  providedIn: "root"
})
export class UserService {
  /**
   * Nome do usuário.
   */
  userName: Subject<string | null>;

  constructor() {
    // Verificar se o ID do usuário não está definido.
    if (!this.getUserId()) {
      // Gerar um ID para o usuário.
      localStorage.setItem("user.id", uuidv4());
    }

    // Inicializar o nome do usuário.
    this.userName = new Subject<string | null>();
    this.userName.next(this.getUserName());
  }

  /**
   * Obtém o ID do usuário.
   * @returns ID do usuário.
   */
  getUserId(): string | null {
    return localStorage.getItem("user.id");
  }

  /**
   * Obtém o nome do usuário.
   * @returns Nome do usuário.
   */
  getUserName(): string | null {
    return localStorage.getItem("user.name");
  }

  /**
   * Define o nome do usuário.
   * @param name Nome do usuário.
   */
  setUserName(name: string) {
    // Verificar se o nome do usuário mudou.
    if (this.getUserName() !== name) {
      // Atualizar o nome do usuário.
      localStorage.setItem("user.name", name);
      this.userName.next(name);
    }
  }
}
