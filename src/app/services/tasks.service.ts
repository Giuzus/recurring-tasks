import { Injectable } from '@angular/core';

import { Task, TaskTypeEnum } from '../models/task'
import { Guid } from '../util/guid';
import { Subject } from 'rxjs';
import { TaskCategory } from '../models/taskCategory';

@Injectable({
    providedIn: 'root'
})
export class TasksService {

    private readonly DAY_RESET_HOUR = "day-reset-hour";
    private readonly WEEK_RESET_DAY = "week-reset-day";
    private readonly LOCAL_STORED_TASKS = "local-stored-tasks";

    public tasksUpdated: Subject<TaskCategory[]> = new Subject<TaskCategory[]>()

    private _dayResetHour: number;
    private _weekResetDay: number;

    private lastDeletedTaskIndex: number;
    private lastDeletedTask: Task;
    private lastDeletedTaskCategory: String;

    get dayResetHour() { return this._dayResetHour; }
    get weekResetDay() { return this._weekResetDay; }


    private taskCategories: TaskCategory[];

    constructor() {
        this._dayResetHour = +localStorage.getItem(this.DAY_RESET_HOUR) || 0;
        this._weekResetDay = +localStorage.getItem(this.WEEK_RESET_DAY) || 0;
        this.taskCategories = this.getSavedTasks();
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

    public getTasks(): TaskCategory[] {
        return this.taskCategories.slice();
    }

    public getTask(id: string): { task: Task, categoryName: String } {
        var ret: { task: Task, categoryName: String } = { task: null, categoryName: null };

        this.taskCategories.forEach(cat => {
            var task = cat.tasks.find((task: Task) => task.id == id);
            if (task) {
                ret.categoryName = cat.name;
                ret.task = task;
                return;
            }
        });

        return ret;
    }

    public addTask(task: Task, category: String): void {

        let taskCategory: TaskCategory = this.taskCategories.find((cat: TaskCategory) => cat.name == category);

        if (!taskCategory) {
            taskCategory = new TaskCategory({ name: category, tasks: [] });
            this.taskCategories.push(taskCategory);
        }

        task.id = Guid.newGuid();
        taskCategory.tasks.push(task);

        this.sortCategories();

        this.saveTasks();
    }

    private sortCategories() {
        this.taskCategories = this.taskCategories.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase())
                return -1;
            else if (a.name.toLowerCase() > b.name.toLowerCase())
                return 1;
            else
                return 0;
        });
    }

    public move(category: String, taskFrom: number, taskTo: number): void {

        let taskCategory: TaskCategory = this.taskCategories.find((cat: TaskCategory) => cat.name == category);

        let task = taskCategory.tasks.splice(taskFrom, 1)[0];

        taskCategory.tasks.splice(taskTo, 0, task);

        this.saveTasks();
        this.tasksUpdated.next(this.getTasks());

    };

    public updateTask(task: Task, category: String): void {

        this.deleteTask(task.id);
        this.addTask(task, category);
    }

    public completeTask(id: string): void {
        this.taskCategories.forEach(cat => {
            let task = cat.tasks.find((task: Task) => task.id == id);
            if (!task) {
                return;
            }

            task.completedAt = new Date();
            this.saveTasks();
        });

    }

    public incompleteTask(id: string): void {
        this.taskCategories.forEach(cat => {
            let task = cat.tasks.find((task: Task) => task.id == id);
            if (!task) {
                return;
            }

            task.completedAt = null;
            this.saveTasks();
        });
    }

    public deleteTask(id: String): void {

        let taskCategory: TaskCategory = this.taskCategories.find((cat: TaskCategory) => cat.tasks.some(task => task.id == id));


        this.lastDeletedTask = taskCategory.tasks.find(x => x.id == id);
        this.lastDeletedTaskIndex = taskCategory.tasks.indexOf(this.lastDeletedTask);
        this.lastDeletedTaskCategory = taskCategory.name;

        taskCategory.tasks = taskCategory.tasks.filter((task: Task) => task.id !== id);

        if (taskCategory.tasks.length == 0) {

            let index = this.taskCategories.indexOf(taskCategory);

            this.taskCategories.splice(index, 1);
        }

        this.tasksUpdated.next(this.getTasks());

        this.saveTasks();

    }

    public undoDelete() {
        debugger;
        if (this.lastDeletedTaskIndex != null && this.lastDeletedTask != null && this.lastDeletedTaskCategory != null) {
            let taskCategory: TaskCategory = this.taskCategories.find((cat: TaskCategory) => cat.name == this.lastDeletedTaskCategory);

            if (!taskCategory) {
                taskCategory = new TaskCategory({ name: this.lastDeletedTaskCategory, tasks: [] });
                this.taskCategories.push(taskCategory);
            }

            taskCategory.tasks.splice(this.lastDeletedTaskIndex, 0, this.lastDeletedTask);

            this.sortCategories();

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

    private getSavedTasks(): TaskCategory[] {
        let taskCategories: TaskCategory[] = [];

        let tasksJsonString: string = localStorage.getItem(this.LOCAL_STORED_TASKS);
        let stored = JSON.parse(tasksJsonString) || [];

        stored.forEach(cat => {
            let categoryTasks: Task[] = [];

            //Parse tasks
            cat.tasks.forEach(task => {
                categoryTasks.push(new Task({
                    id: task.id,
                    description: task.description,
                    type: task.type,
                    completedAt: task.completedAt != null ? new Date(task.completedAt) : null
                }));
            });

            let category = new TaskCategory;

            category.name = cat.name;
            category.tasks = categoryTasks;

            taskCategories.push(category);
        });

        return taskCategories;
    }

    private saveTasks(): void {
        var tasksJson = JSON.stringify(this.getTasks());
        localStorage.setItem(this.LOCAL_STORED_TASKS, tasksJson);
    }

    public getCategories(): String[] {

        let ret: String[] = [];

        this.taskCategories.forEach(cat => {
            ret.push(cat.name);
        });

        return ret;
    }
}
