import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Task } from '../../../models/task';
import { TasksService } from '../../../services/tasks.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {


  @Input()
  public tasks: Task[];

  @Input()
  public name: string;

  public editMode: boolean = false;

  constructor(private taskService: TasksService, public snackBar: MatSnackBar) { }

  ngOnInit() {

  }

  onRemove(id: string) {
    this.taskService.deleteTask(id);
    this.openDeletedSnackBar();
  }

  openDeletedSnackBar() {
    let snackBarRef = this.snackBar.open("Task deleted.", "UNDO", { duration: 3000 });
    snackBarRef.onAction().subscribe(() => {
      this.taskService.undoDelete();
    });
  }

  onSelect(opt, task) {
    if (opt.selected) {
      this.taskService.completeTask(task.id);
    }
    else {
      this.taskService.incompleteTask(task.id);
    }
  }

  onEditMode() {
    this.editMode = !this.editMode;
  }

  onDrop(dropResult) {
    this.taskService.move(dropResult.removedIndex, dropResult.addedIndex);
  }
}
