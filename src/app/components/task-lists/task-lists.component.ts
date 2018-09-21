import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task, TaskTypeEnum } from '../../models/task';
import { TasksService } from '../../services/tasks.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-lists',
  templateUrl: './task-lists.component.html',
  styleUrls: ['./task-lists.component.css']
})
export class TaskListsComponent implements OnInit, OnDestroy {

  constructor(private taskService: TasksService) { }

  public dailyTasks: Task[];
  public weeklyTasks: Task[];

  private tasksUpdatedSubscription: Subscription;


  ngOnInit() {
    let tasks = this.taskService.getTasks();
    this.dailyTasks = tasks.filter(x => x.type == TaskTypeEnum.Daily);
    this.weeklyTasks = tasks.filter(x => x.type == TaskTypeEnum.Weekly);

    this.tasksUpdatedSubscription = this.taskService.tasksUpdated.subscribe((tasks: Task[]) => {
      this.dailyTasks = tasks.filter(x => x.type == TaskTypeEnum.Daily);
      this.weeklyTasks = tasks.filter(x => x.type == TaskTypeEnum.Weekly);
    });
  }

  ngOnDestroy() {
    this.tasksUpdatedSubscription.unsubscribe();
  }

}
