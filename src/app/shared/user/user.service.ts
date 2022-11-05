import jwt_decode from "jwt-decode";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { RequestService } from "../request/request.service";
import { User } from "./user";

/**
 * Serviço de gerenciamento de usuários.
 */
@Injectable({
  providedIn: "root"
})
export class UserService extends RequestService {
  /**
   * Dados do usuário.
   */
  userData: User | null;

  /**
   * @Subject de dados do usuário.
   */
  userData$: Subject<User | null>;

  constructor() {
    super();

    // Inicializar os dados do usuário
    this.userData = this.getUserData();
    this.userData$ = new Subject<User | null>();
    this.userData$.next(this.userData);
  }

  /**
   * Obtém o token da sessão do usuário.
   * @returns Token da sessão do usuário.
   */
  getUserToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Define o token da sessão do usuário.
   * @param token Token da sessão do usuário.
   */
  setUserToken(token: string) {
    // Verificar se o token da sessão do usuário mudou.
    if (this.getUserToken() !== token) {
      // Atualizar o token da sessão do usuário.
      localStorage.setItem("token", token);

      this.userData = this.getUserData();
      this.userData$.next(this.userData);
    }
  }

  /**
   * Obtém os dados do usuário.
   * @returns Dados do usuário.
   */
  getUserData(): User | null {
    try {
      // Obter o token da sessão do usuário.
      const token = this.getUserToken();

      // Verificar se o token existe.
      if (token) {
        // Decodificar o token.
        const tokenData = jwt_decode(token);

        // Verificar se foi decodificado.
        if (tokenData && typeof tokenData === "object") {
          return tokenData as User;
        }
      }
    } catch (e) {
      // Não fazer nada aqui, somente dar erro no console.
      console.error(e);
    }

    // Retornar nulo.
    return null;
  }

  /**
   * Cria um usuário.
   * @param name Nome do usuário.
   */
  createUser(name: string) {
    // Criar usuário.
    return this.request({
      route: "/user/create",
      body: {
        name,
      },
    });
  }
}
