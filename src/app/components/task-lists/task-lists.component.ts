import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task, TaskTypeEnum } from '../../models/task';
import { TasksService } from '../../services/tasks.service';
import { Subscription } from 'rxjs';
import { TaskCategory } from 'src/app/models/taskCategory';

@Component({
  selector: 'app-task-lists',
  templateUrl: './task-lists.component.html',
  styleUrls: ['./task-lists.component.css']
})
export class TaskListsComponent implements OnInit, OnDestroy {

  constructor(private taskService: TasksService) { }

  public taskCategories: TaskCategory[];
  
  private tasksUpdatedSubscription: Subscription;

  ngOnInit() {
    this.taskCategories = this.taskService.getTasks();
    
    this.tasksUpdatedSubscription = this.taskService.tasksUpdated.subscribe((categories: TaskCategory[]) => {
      this.taskCategories = categories;
    });
  }

  ngOnDestroy() {
    this.tasksUpdatedSubscription.unsubscribe();
  }
}
