import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MaterialImportsModule } from './modules/material-imports.module';
import { HeaderComponent } from './components/header/header.component';
import { RoutesModule } from './modules/routes.module';
import { TaskListComponent } from './components/task-lists/task-list/task-list.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { TasksService } from './services/tasks.service';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { TaskListsComponent } from './components/task-lists/task-lists.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TaskListComponent,
    ConfigurationComponent,
    EditTaskComponent,
    TaskListsComponent
  ],
  imports: [
    BrowserModule,
    // FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialImportsModule,
    RoutesModule
  ],
  providers: [TasksService],
  bootstrap: [AppComponent]
})
export class AppModule { }
