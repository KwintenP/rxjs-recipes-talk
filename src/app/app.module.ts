import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatDialogModule,
  MatCheckboxModule,
  MatInputModule
} from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { APP_ROUTES } from "./app.routes";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { JokeListComponent } from "./joke-list/joke-list.component";
import { SettingsDialogComponent } from "./settings-dialog/settings-dialog.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES),
    FlexLayoutModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    JokeListComponent,
    SettingsDialogComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [SettingsDialogComponent]
})
export class AppModule {}
