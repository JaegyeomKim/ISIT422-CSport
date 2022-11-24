import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/Transaction';
import { User } from 'src/app/User';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ClassesService } from 'src/app/services/classes.service';
import { Class } from 'src/app/Classes';
import { getMatInputUnsupportedTypeError } from '@angular/material/input';
import { first } from 'rxjs';


@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  
  tempTransactions: Transaction[] = [];
  tempClasses: Class[] = [];
  user!: User;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public transactionService: PaymentService,
    public classService: ClassesService
  ) { }

  ngOnInit(): void {
    this.userService.getUser(this.authService.userData.UID).pipe(first()).subscribe(data => this.getUser(data[0]));
  }

  getUser(user: User) {
    this.user = user;
    console.log(user);
    this.transactionService.getAllTransactions().pipe(first()).subscribe(data => this.getTransaction(data) );
  }

  getTransaction(transactions: Transaction[]){
    console.log(transactions);
    this.tempTransactions = transactions.filter(element => this.user.TransactionHistory.includes(element._id!));
    this.getClasses()
  }

  getClasses(){
    this.classService.getAllClasses2().subscribe(classList => this.displayClasses(classList))
  }

  displayClasses(classList: Class[]){
    console.log(classList)
    console.log(this.user.TransactionHistory)
    classList.forEach(classs => {
      this.tempTransactions.forEach(transaction => {
        if(transaction.CID === classs._id){
        this.tempClasses.push(classs)
        }
      })
    });
    console.log(this.tempClasses);
  }

}
