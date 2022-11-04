import { Component, OnInit } from "@angular/core";
import * as AOS from "aos";

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
   * Função chamada ao inicializar o componente.
   */
  ngOnInit() {
    // Atualizar as animações.
    AOS.refresh();
  }
}
