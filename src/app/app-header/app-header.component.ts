import { Component, OnInit } from "@angular/core";
import * as AOS from "aos";
import { UserService } from "../shared/user/user.service";

/**
 * Componente de cabeçalho da aplicação.
 */
@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"]
})
export class AppHeaderComponent implements OnInit {
  /**
   * Valor lógico indicando se deve exibir a seção de iniciar jornada.
   */
  showStartSection: boolean;

  /**
   * Nome do usuário.
   */
  userName: string | null = null;

  /**
   * Nome do usuário.
   */
  userNameInput: string = "";

  constructor(private userService: UserService) {
    // Inicializar o nome do usuário.
    this.userName = this.userService.getUserName();

    // Inicializar o valor lógico indicando se deve exibir a seção de iniciar jornada.
    this.showStartSection = (
      this.userName === null ||
      this.userName.length === 0
    );
  }

  /**
   * Função chamada ao inicializar o componente.
   */
  ngOnInit() {
    // Atualizar as animações.
    AOS.refresh();
  }

  /**
   * Atualiza o valor do campo de nome do usuário.
   * @param userNameInput Nome do usuário.
   */
  setUserNameInput(userNameInput: string) {
    this.userNameInput = userNameInput;
  }

  /**
   * Função chamada ao pressionar tecla no campo de nome do usuário.
   * @param event Evento do teclado.
   */
  onUserNameInputKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      // Iniciar a jornada.
      this.start();
    }
  }

  /**
   * Inicia a jornada.
   */
  start() {
    // Verificar se especificou o nome do usuário
    if (this.userNameInput && this.userNameInput.length > 0) {
      // Definir o nome do usuário.
      this.userService.setUserName(this.userNameInput);
      this.userName = this.userNameInput;

      // Atualizar o valor lógico indicando se deve exibir a seção de iniciar jornada.
      this.showStartSection = false;
    }
  }
}
