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

  public tasks: Task[];
  public categories: String[];
  public categoryList: any[];

  private tasksUpdatedSubscription: Subscription;

  ngOnInit() {
    this.tasks = this.taskService.getTasks();
    this.categories = this.taskService.getCategories();
    this.formatCategories();

    this.tasksUpdatedSubscription = this.taskService.tasksUpdated.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.categories = this.taskService.getCategories();
      this.formatCategories();
    });
  }

  ngOnDestroy() {
    this.tasksUpdatedSubscription.unsubscribe();
  }

  formatCategories() {
    this.categoryList = this.categoryList || [];

    this.categories.forEach(cat => {
      if (this.categoryList.some(x => x.category == cat)) {
        //updates existing category
        debugger;
        let index = this.categoryList.findIndex(x => x.category == cat);
        this.categoryList[index].daily = this.tasks.filter(x => x.category == cat && x.type == TaskTypeEnum.Daily);
        this.categoryList[index].weekly = this.tasks.filter(x => x.category == cat && x.type == TaskTypeEnum.Weekly);
      }
      else {
        //adds new category
        let category = {
          category: cat,
          daily: this.tasks.filter(x => x.category == cat && x.type == TaskTypeEnum.Daily),
          weekly: this.tasks.filter(x => x.category == cat && x.type == TaskTypeEnum.Weekly)
        }
        this.categoryList.push(category);
      }
    });

    

    //removes previously existent category
    for (let i = this.categoryList.length - 1; i >= 0; i--) {
      if (!this.tasks.some(x => x.category == this.categoryList[i].category)) {
        this.categoryList.splice(i, 1);
      }
    }
  }


}
