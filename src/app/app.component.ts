import { Component, HostListener, OnInit } from "@angular/core";
import * as AOS from "aos";

/**
 * Componente raiz da aplicação.
 */
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  /**
   * Estado de ativo da barra de navegação.
   */
  navbarActive: boolean = false;

  ngOnInit() {
    // Inicializar as animações.
    AOS.init();
  }

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
