import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/User';
import { getCurrencySymbol } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { first } from 'rxjs';
import { ClassesService } from 'src/app/services/classes.service';
import { Class } from 'src/app/Classes';
@Component({
  selector: 'app-admins-usersinfo',
  templateUrl: './admins-usersinfo.component.html',
  styleUrls: ['./admins-usersinfo.component.css']
})
export class AdminsUsersinfoComponent implements OnInit {
  user !: User;
  Class !:Class;
  check_addclass : boolean = true;
  check_editClass: boolean = true;

  // users : User[] = USERS;
  users : User[] = [];
  classes : Class[] =[]
  constructor(private userService: UserService,
    private classService : ClassesService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users) => this.users = users);
    this.classService.getAllClasses2().subscribe((classes)=>this.classes = classes)
    //if get class Name at class side that would be more easy 
  }

   addUserclass(user_1 : User){ 
    this.userService.editUser(user_1).subscribe();
  }

  delteUserclass(user_1 : User){ 
    this.userService.editUser(user_1).subscribe();
  }

  editUser(user_1 : User){ 
    this.userService.editUser(user_1).subscribe();
  }

  deleteUserAccount(user_1 : User){
    this.userService.deleteUser2(user_1.UID).subscribe(() => (this.users = this.users.filter((t) => t.UID !== user_1.UID)));
  }
}
