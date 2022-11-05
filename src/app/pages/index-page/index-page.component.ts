import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import * as AOS from "aos";

import { UserService } from "src/app/shared/user/user.service";

/**
 * Componente de página inicial.
 */
@Component({
  selector: "app-index-page",
  templateUrl: "./index-page.component.html",
  styleUrls: ["./index-page.component.scss"]
})
export class IndexPageComponent implements OnInit, OnDestroy {
  /**
   * Valor lógico indicando se deve exibir a seção de jornada.
   */
  showAdventure: boolean = false;

  /**
   * @Subscription de dados do usuário.
   */
  userDataSubscription: Subscription | null = null;

  constructor(private userService: UserService) {
    // Obter os dados do usuário.
    const userData = this.userService.userData;

    // Atualizar o valor lógico indicando se deve exibir a seção de jornada.
    this.showAdventure = Boolean(userData && userData.name.length > 0);
  }

  /**
   * Função chamada ao inicializar o componente.
   */
  ngOnInit(): void {
    // Atualizar as animações.
    AOS.refresh();

    // Criar o @Subscription de dados do usuário.
    this.userDataSubscription = this.userService.userData$.subscribe((userData) => {
      // Atualizar o valor lógico indicando se deve exibir a seção de jornada.
      this.showAdventure = (
        userData !== null &&
        userData.name.length > 0
      );
    });
  }

  /**
   * Função chamada ao destruir o componente.
   */
  ngOnDestroy(): void {
    this.userDataSubscription?.unsubscribe();
  }
}
