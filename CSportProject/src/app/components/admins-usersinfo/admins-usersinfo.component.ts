import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/User';
import { USERS } from 'src/app/mock-Profiles';
import { getCurrencySymbol } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-admins-usersinfo',
  templateUrl: './admins-usersinfo.component.html',
  styleUrls: ['./admins-usersinfo.component.css']
})
export class AdminsUsersinfoComponent implements OnInit {
  ironmancomeing : boolean  = false;// i-m

  user !: User;
  //  <img src="../../../assets/SalmonellaNIAID.jpg" [style.width.px]="getPos()" [style.height.px]="getPos()" (click)="triggerAlert()">

  
  aa = document.getElementById("ironman");

  // users : User[] = USERS;
  users : User[] = [];

  constructor(private userService: UserService,
    public authService: AuthService,
    ) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users) => this.users = users);
  }

 
  editUserclass(user_1 : User){ 
    this.userService.editUser(user_1).subscribe();
  }

  deleteUserAccount(user_1 : User){
    if(user_1.Fname == "Robert"){
      this.ironmancomeing =true;
      alert("iron-man never dies")
    } else {
      this.userService.deleteUser2(user_1.UID).pipe(first()).subscribe(data => this.deletedUser());
      //this.userService.deleteUser2(user_1.UID).subscribe(() => (this.users = this.users.filter((t) => t.UID !== user_1.UID)));
    }
  }

  deletedUser(){
    this.users= [];
    this.userService.getAllUsers().subscribe((users) => this.users = users);
  }

  disappear(){
    this.ironmancomeing = false;
  }
}
