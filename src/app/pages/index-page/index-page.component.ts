import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { UserService } from "src/app/shared/user/user.service";

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
   * @Subscription de nome do usuário.
   */
  userNameSubscription: Subscription | null = null;

  constructor(private userService: UserService) {
    // Atualizar o valor lógico indicando se deve exibir a seção de jornada.
    this.showAdventure = (
      this.userService.getUserName() !== null &&
      this.userService.getUserName()!.length > 0
    );
  }

  /**
   * Função chamada ao inicializar o componente.
   */
  ngOnInit() {
    // Criar o @Subscription de nome do usuário.
    this.userNameSubscription = this.userService.userName.subscribe((userName) => {
      // Atualizar o valor lógico indicando se deve exibir a seção de jornada.
      this.showAdventure = (
        userName !== null &&
        userName.length > 0
      );
    });
  }

  /**
   * Função chamada ao destruir o componente.
   */
  ngOnDestroy(): void {
    this.userNameSubscription?.unsubscribe();
  }
}
