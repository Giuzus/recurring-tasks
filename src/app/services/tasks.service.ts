import { Injectable } from '@angular/core';

import { Task, TaskTypeEnum } from '../models/task'
import { Guid } from '../util/guid';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private readonly DAY_RESET_HOUR = "day-reset-hour";
  private readonly WEEK_RESET_DAY = "week-reset-day";
  private readonly LOCAL_STORED_TASKS = "local-stored-tasks";

  public tasksUpdated: Subject<Task[]> = new Subject<Task[]>()

  private _dayResetHour: number;
  private _weekResetDay: number;

  private lastDeletedTaskIndex: number;
  private lastDeletedTask: Task;

  get dayResetHour() { return this._dayResetHour; }
  get weekResetDay() { return this._weekResetDay; }


  private tasks: Task[]

  constructor() {
    this._dayResetHour = +localStorage.getItem(this.DAY_RESET_HOUR) || 0;
    this._weekResetDay = +localStorage.getItem(this.WEEK_RESET_DAY) || 0;
    this.tasks = this.getSavedTasks();
  }

  public isCompleted(task: Task): boolean {
    if (task.completedAt) {
      let now = new Date();

      if (task.type == TaskTypeEnum.Daily) {
        let resetDate = new Date(`${task.completedAt.toDateString()} ${this.dayResetHour}:00:00`);
        if (task.completedAt.getHours() >= this.dayResetHour) {
          resetDate.setDate(resetDate.getDate() + 1);
        }

        return now < resetDate;
      }
      else {
        let resetDate = new Date(`${task.completedAt.toDateString()} ${this.dayResetHour}:00:00`);
        if (task.completedAt.getHours() >= this.dayResetHour) {
          resetDate.setDate(resetDate.getDate() + 1);
        }
        while (resetDate.getDay() != this.weekResetDay) {
          resetDate.setDate(resetDate.getDate() + 1);
        }

        return now < resetDate;
      }
    }
    return false;
  }

  public getTasks(): Task[] {
    return this.tasks.slice();
  }

  public getTask(id: string): Task {
    return new Task(this.tasks.find((task: Task) => task.id == id));
  }

  public addTask(task: Task): void {
    task.id = Guid.newGuid();
    this.tasks.push(task);

    this.saveTasks();
  }

  public move(removedIndex, addedIndex): void {

    let itemToAdd = this.tasks.splice(removedIndex, 1)[0];

    this.tasks.splice(addedIndex, 0, itemToAdd);

    this.saveTasks();
    this.tasksUpdated.next(this.getTasks());

  };

  public updateTask(task: Task): void {
    let index = this.tasks.findIndex((t: Task) => t.id == task.id);
    this.tasks[index] = task;
  }

  public completeTask(id: string): void {
    let task = this.tasks.find((task: Task) => task.id == id);
    task.completedAt = new Date();
    this.saveTasks();
  }

  public incompleteTask(id: string): void {
    let task = this.tasks.find((task: Task) => task.id == id);
    task.completedAt = null;
    this.saveTasks();
  }

  public deleteTask(id: String): void {

    this.lastDeletedTaskIndex = this.tasks.findIndex(x => x.id == id);
    this.lastDeletedTask = this.tasks.find(x => x.id == id);

    this.tasks = this.tasks.filter((task: Task) => task.id !== id);

    this.tasksUpdated.next(this.getTasks());
    this.saveTasks();
  }

  public undoDelete() {
    if (this.lastDeletedTaskIndex && this.lastDeletedTask) {
      this.tasks.splice(this.lastDeletedTaskIndex, 0, this.lastDeletedTask);
      this.tasksUpdated.next(this.getTasks());
      this.saveTasks();
    }
  }

  public updateConfiguration(dayResetHour: number, weekResetDay: number) {
    this._dayResetHour = dayResetHour;
    this._weekResetDay = weekResetDay;

    localStorage.setItem(this.DAY_RESET_HOUR, dayResetHour.toString());
    localStorage.setItem(this.WEEK_RESET_DAY, weekResetDay.toString());
  }

  private getSavedTasks(): Task[] {
    let tasks: Task[] = [];

    let tasksJsonString: string = localStorage.getItem(this.LOCAL_STORED_TASKS);
    let stored = JSON.parse(tasksJsonString) || [];

    stored.forEach(x => {
      tasks.push(new Task({
        id: x.id,
        description: x.description,
        type: x.type,
        completedAt: x.completedAt != null ? new Date(x.completedAt) : null
      }));
    });

    return tasks;
  }

  private saveTasks(): void {
    var tasksJson = JSON.stringify(this.getTasks());
    localStorage.setItem(this.LOCAL_STORED_TASKS, tasksJson);
  }

}
