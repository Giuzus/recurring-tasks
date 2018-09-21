import { NgModule } from '@angular/core';
import { MatSidenavModule, MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatMenuModule, MatSelectModule, MatInputModule, MatSnackBarModule, MatList, MatListModule } from '@angular/material';


const modules = [
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatSelectModule,
  MatInputModule,
  MatSnackBarModule,
  MatListModule
]

@NgModule({
  imports: modules,
  exports: modules,
  declarations: []
})
export class MaterialImportsModule { }
