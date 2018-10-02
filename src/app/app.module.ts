import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';

import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';

import { AppComponent } from './app.component';
import { MaterialImportsModule } from './modules/material-imports.module';
import { HeaderComponent } from './components/header/header.component';
import { RoutesModule } from './modules/routes.module';
import { TaskListComponent } from './components/task-lists/task-list/task-list.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { TasksService } from './services/tasks.service';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { TaskListsComponent } from './components/task-lists/task-lists.component';
import { environment } from '../environments/environment';
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
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialImportsModule,
    RoutesModule,
    NgxSmoothDnDModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [TasksService],
  bootstrap: [AppComponent]
})
export class AppModule { }
