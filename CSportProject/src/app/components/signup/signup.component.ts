import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/auth.service';
import {User} from '../../User';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../signin/signin.component.css', './signup.component.css'], 
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    email : new FormControl(''),
    password : new FormControl(''),
    fname : new FormControl(''),
    lname : new FormControl(''),
    bday : new FormControl('')
  })
  email !: string;
  fname !: string;
  lname !: string;
  bday !: string;
  
  password !: string;
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  signUpNewUser() {

    const newUser = {
    UID: "",
    Fname: this.fname,
    Lname: this.lname,
    ClassIDList: [],
    ClassHistory: [],
    TransactionHistory: [],
    Birthday: this.bday,
    Email: this.email,
    Role: "0",
    AdminNotes: ""
  } as User

    //Adds user to Firebase Authentication and then to MongoDB
    this.authService.emailSignUp(this.email, this.password, newUser);
  }


}