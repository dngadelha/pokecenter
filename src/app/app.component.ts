import { Component, HostListener } from "@angular/core";

/**
 * Componente raiz da aplicação.
 */
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  /**
   * Estado de ativo da barra de navegação.
   */
  navbarActive: boolean = false;

  /**
   * Evento chamado ao rolar a página.
   * @see https://developer.mozilla.org/pt-BR/docs/Web/API/Window/scroll
   */
  @HostListener("window:scroll")
  onWindowScroll() {
    // Definir barra de navegação como ativa quando o usuário rolar a página.
    this.navbarActive = (window.pageYOffset > 0);
  }
}
