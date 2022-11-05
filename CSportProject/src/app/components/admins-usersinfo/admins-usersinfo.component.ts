import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/User';
import { USERS } from 'src/app/mock-Profiles';
import { getCurrencySymbol } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-admins-usersinfo',
  templateUrl: './admins-usersinfo.component.html',
  styleUrls: ['./admins-usersinfo.component.css']
})
export class AdminsUsersinfoComponent implements OnInit {

  user !: User;
  
  // users : User[] = USERS;
  users : User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users) => this.users = users);
  }

 
  editUserclass(user_1 : User){ 
    this.userService.editUser(user_1).subscribe();
  }










}
