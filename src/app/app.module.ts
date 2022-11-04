import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AppHeaderComponent } from "./app-header/app-header.component";
import { AppNavbarComponent } from "./app-navbar/app-navbar.component";
import { CardComponent } from "./shared/card/card.component";
import { PokemonsListComponent } from "./pokemons/pokemons-list/pokemons-list.component";
import { PokemonsListItemComponent } from "./pokemons/pokemons-list-item/pokemons-list-item.component";
import { IndexPageComponent } from './pages/index-page/index-page.component';
import { PokedexPageComponent } from './pages/pokedex-page/pokedex-page.component';
import { AppFooterComponent } from './app-footer/app-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppNavbarComponent,
    CardComponent,
    PokemonsListComponent,
    PokemonsListItemComponent,
    IndexPageComponent,
    PokedexPageComponent,
    AppFooterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
