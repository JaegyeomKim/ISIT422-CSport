import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { cwd } from 'process';
import { User } from 'src/app/User';
import { Class } from 'src/app/Classes';
import { ClassesService } from 'src/app/services/classes.service';
import { first } from 'rxjs';
import { faL } from '@fortawesome/free-solid-svg-icons';
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
  color : string = "red";
  count : number = 0;
  dic_enrolled_Class = new Set();


  @Input()
  user !: User;
  users : [] = [];
  check_infor : boolean = false;

  @Output()
  onEditUser : EventEmitter<User> = new EventEmitter();

  @Output()
  onAddUserClass : EventEmitter<User> = new EventEmitter();

  @Output()
  onDeleteUserClass : EventEmitter<User> = new EventEmitter();

  @Output()
  onDeleteUser : EventEmitter<User> = new EventEmitter();

  
  @Output()
  test_check_include_classID2 : EventEmitter<Class> = new EventEmitter();

  constructor(private classService : ClassesService) { }

  ngOnInit(): void {
    this.classService.getAllClasses2().subscribe((classes) => this.classes = classes);
    if(this.user.Role == "0"){this.user_status = "Admin"};
    this.fuser_name = this.user.Fname;
    this.luser_name = this.user.Lname;
    this.n_admin_note = this.user.AdminNotes;
    this.birthday = this.user.Birthday;
  }

  onUpdate(user_1 : User){
    user_1.Fname = this.fuser_name;
    user_1.Lname = this.luser_name;
    user_1.Birthday = this.birthday;
    user_1.AdminNotes = this.n_admin_note;
    this.onEditUser.emit(user_1);
    this.check_Edit = false;
  }
  selectChangeHandler (event: any, user : User) {
    user.Role = event.target.value;;
  }

  third_step_Add_class(class_1 : Class, user_1 : User){

    user_1.ClassIDList.push(class_1._id!);
    this.onAddUserClass.emit(user_1);
  }

  third_confirm_edit(user_1 : User){
    this.check_Edit = !this.check_Edit;
    this.onEditUser.emit(user_1);
  }
  onEdit_user(){
    if(this.user.Role == "1"){this.user_status = "Admin"};

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
    this.check_AddClass = false;

    user_1.ClassIDList.forEach((value,index)=>{
      if(value==class1._id) user_1.ClassIDList.splice(index,1)});
      
    this.onDeleteUserClass.emit(user_1);
  }

//userclass_id : string, class_1 :Class
  // totalPriceCal(user_1 : User){
  //     // // Dictionary dose not allow the same key value
  //     // if(userclass_id == class_1._id){
  //     //   this.dic_enrolled_Class.add(class_1.Price);
  //     //   console.log( userclass_id + "   " + this.dic_enrolled_Class.forEach((value) => console.log(value)));
  //     // }
  //     if(user_1.UID =="8VXT9nQ5PqgkkWFWn1FrTFacFul1")
  //     this.count++;
  // }

}
