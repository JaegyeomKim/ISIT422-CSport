import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { cwd } from 'process';
import { User } from 'src/app/User';
import { Class } from 'src/app/Classes';
import { ClassesService } from 'src/app/services/classes.service';
import { first } from 'rxjs';
@Component({
  selector: 'app-admins-usersinfo-unit',
  templateUrl: './admins-usersinfo-unit.component.html',
  styleUrls: ['./admins-usersinfo-unit.component.css']
})
export class AdminsUsersinfoUnitComponent implements OnInit {

  class !: Class;
  classes : Class[] =[]


  check_classList : boolean = false;
  check_Edit : boolean = false;
  check_AddClass : boolean = false;

  fuser_name !: string;
  luser_name !: string;
  n_admin_note !: string;
  birthday !: string;

  user_status !: string;

  @Input()
  user !: User;
  check_infor : boolean = false;

  @Output()
  onEditUser : EventEmitter<User> = new EventEmitter();

  @Output()
  onAddUserClass : EventEmitter<User> = new EventEmitter();

  @Output()
  onDeleteUserClass : EventEmitter<User> = new EventEmitter();

  @Output()
  onDeleteUser : EventEmitter<User> = new EventEmitter();

  constructor(private classService : ClassesService) { }

  ngOnInit(): void {
    this.classService.getAllClasses().subscribe((classes) => this.classes = classes);
    if(this.user.Role == "0"){this.user_status = "Admin"};
  }

  submit(user_1 : User){
    user_1.Fname = this.fuser_name;
    user_1.Lname = this.luser_name;
    user_1.Birthday = this.birthday;
    user_1.AdminNotes = this.n_admin_note;
    this.onEditUser.emit(user_1);
    this.check_Edit = false;
  }

  third_step_Add_class(class_1 : Class, user_1 : User){

    user_1.ClassIDList.push(class_1._id!);
    this.onAddUserClass.emit(user_1);
  }

  selectChangeHandler (event: any, user : User) {
    user.Role = event.target.value;;
    console.log(user.Role);
  }

  onEdit_user(){
    if(this.check_AddClass){this.check_AddClass = !this.check_AddClass}
    this.check_Edit = !this.check_Edit;

  }
  onShowClass(){
    if(this.check_Edit){this.check_Edit = !this.check_Edit}
    this.check_AddClass = !this.check_AddClass;
  }

  onDelete_user(user_1 : User){
    this.onDeleteUser.emit(user_1);
  }

  checkClassList(){

    this.check_classList = !this.check_classList;
      
  }

  delteClassID_Middle(class1 : Class, user_1: User){
    console.log(class1._id);
    user_1.ClassIDList.forEach((value,index)=>{
      if(value==class1._id) user_1.ClassIDList.splice(index,1)});
      
    console.log(user_1.ClassIDList);
    this.onDeleteUserClass.emit(user_1);
  }

}
