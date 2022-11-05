import { Component, OnDestroy, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
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
export class AppHeaderComponent implements OnInit, OnDestroy {
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

  /**
   * @Subscription de dados do usuário.
   */
  userDataSubscription: Subscription | null = null;

  /**
   * Valor lógico indicando se está criando o usuário.
   */
  isCreatingUser: boolean = false;

  constructor(
    private toastrService: ToastrService,
    private userService: UserService
  ) {
    // Inicializar o nome do usuário.
    this.userName = this.userService.userData?.name ?? null;

    // Inicializar o valor lógico indicando se deve exibir a seção de iniciar jornada.
    this.showStartSection = (
      this.userName === null ||
      this.userName.length === 0
    );
  }

  /**
   * Função chamada ao inicializar o componente.
   */
  ngOnInit(): void {
    // Atualizar as animações.
    AOS.refresh();

    // Criar o @Subscription de dados do usuário.
    this.userDataSubscription = this.userService.userData$.subscribe((userData) => {
      // Atualizar nome do usuário.
      this.userName = userData ? userData.name : null;
    });
  }

  /**
   * Função chamada ao destruir o componente.
   */
  ngOnDestroy(): void {
    this.userDataSubscription?.unsubscribe();
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
  async start() {
    // Se já está criando o usuário, não fazer nada.
    if (this.isCreatingUser) return;

    try {
      // Verificar se especificou o nome do usuário
      if (this.userNameInput && this.userNameInput.length > 0) {
        // Definir o valor lógico indicando se está criando o usuário.
        this.isCreatingUser = true;

        // Criar usuário.
        const response = await this.userService.createUser(this.userNameInput.trim());

        // Verificar o status da resposta.
        switch (response.status) {
          case "success":
            // Verificar se retornou o token.
            if (response.result && response.result.token) {
              // Definir o token da sessão do usuário.
              this.userService.setUserToken(response.result.token);

              // Atualizar o valor lógico indicando se deve exibir a seção de iniciar jornada.
              this.showStartSection = false;
            }

            break;
          case "empty_name":
            // Usuário não informou o nome.
            this.toastrService.error("Por favor, informe seu nome.", "Erro");
            break;
          case "":
            break;
        }
      }
    } catch (e) {
      // Erro ao enviar requisição.
      this.userService.handleRequestError(e as Error, this.toastrService);
    }

    // Redefinir o valor lógico indicando se está criando o usuário.
    this.isCreatingUser = false;
  }
}
