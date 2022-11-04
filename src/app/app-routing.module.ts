import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IndexPageComponent } from "./pages/index-page/index-page.component";
import { PokedexPageComponent } from "./pages/pokedex-page/pokedex-page.component";

/**
 * Rotas da aplicação.
 */
const routes: Routes = [
  {
    path: "",
    component: IndexPageComponent,
  },
  {
    path: "pokedex",
    component: PokedexPageComponent,
  }
];

/**
 * Módulo de rotas da aplicação.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
