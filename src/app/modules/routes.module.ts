import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

import { TaskListsComponent } from '../components/task-lists/task-lists.component';
import { ConfigurationComponent } from '../components/configuration/configuration.component';
import { EditTaskComponent } from '../components/edit-task/edit-task.component';


const appRoutes: Routes = [
  { path: '', component: TaskListsComponent, pathMatch: 'full' },
  { path: 'new', component: EditTaskComponent },
  { path: 'edit/:id', component: EditTaskComponent },
  { path: 'configuration', component: ConfigurationComponent }
  // {
  //     path: 'todo',
  //     component: TodoComponent,
  //     canActivate: [AuthGuard],
  //     children: [
  //         { path: '', component: TodoStartComponent },
  //         { path: 'new', component: TodoEditComponent },
  //         { path: ':id', component: TodoDetailsComponent },
  //         { path: ':id/edit', component: TodoEditComponent }
  //     ]
  // }
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class RoutesModule { }
