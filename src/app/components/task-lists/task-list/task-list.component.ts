import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Task } from '../../../models/task';
import { TasksService } from '../../../services/tasks.service';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  constructor(private taskService: TasksService) { }

  @Input()
  public tasks: Task[];

  @Input()
  public name: string;

  public editMode: boolean = false;


  ngOnInit() { 
    
  }

  onRemove(id: string) {
    this.taskService.removeTask(id);
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
