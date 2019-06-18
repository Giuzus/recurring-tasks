import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, TaskTypeEnum } from '../../models/task';
import { TasksService } from '../../services/tasks.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tasksService: TasksService,
    public fb: FormBuilder,
    public snackBar: MatSnackBar) { }

  public taskForm: FormGroup;

  task: Task;
  category: String;

  categories: String[];

  ngOnInit() {
    this.categories = this.tasksService.getCategories();
    this.route.params.subscribe(params => {
      var id = params['id'];
      if (id) {
        let resp = this.tasksService.getTask(id);
        this.task = resp.task;
        this.category = resp.categoryName;
      }
      else {
        this.task = new Task();
      }

      this.taskForm = this.fb.group({
        'description': [this.task.description, Validators.required],
        'type': [this.task.type, Validators.required],
        'category': [this.category],
        'newCategory': [""]
      });
    });
  }

  openSnackBar() {
    this.snackBar.open("Saved", "", { duration: 500 });
  }

  onSubmit(): void {
    this.task.description = this.taskForm.get('description').value;
    this.task.type = this.taskForm.get('type').value as TaskTypeEnum;

    let category: String = this.taskForm.get('category').value || this.taskForm.get('newCategory').value;

    if (!this.task.id) {
      this.tasksService.addTask(this.task, category);
    }
    else {
      this.tasksService.updateTask(this.task, category);
    }


    this.router.navigate(['/']);

    this.openSnackBar();
  }
}
