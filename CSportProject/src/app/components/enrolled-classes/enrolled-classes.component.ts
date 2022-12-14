import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Class } from 'src/app/Classes';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/User';
import { ClassesService } from 'src/app/services/classes.service';
import { first } from 'rxjs';
import { PaymentService } from 'src/app/services/payment.service';
import { Transaction } from 'src/app/Transaction';
import { TransactionHistoryComponent } from '../transaction-history/transaction-history.component';
import { CustomerDashboardComponent } from '../customer-dashboard/customer-dashboard.component';
import {Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-enrolled-classes',
  templateUrl: './enrolled-classes.component.html',
  styleUrls: ['./enrolled-classes.component.css']
})
export class EnrolledClassesComponent implements OnInit {


  classes: Class[] = [];
  tempClasses: Class[] = [];
  user!: User;

  loading: boolean = true;
  canDropClass: boolean = true;

  columnsToDisplay = ['name', 'time', 'date', 'description', 'seats', 'actions'];

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public classesService: ClassesService,
    public transactionService: PaymentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
// Pipe sets up the code to unsubscirbe after it finishes it's task
// first postions ourseleves to the first set of data
// subscribe allows us to do stuff from what comes out off "all transactions"


  ngOnInit(): void {
    this.userService.getUser(this.authService.userData.UID).pipe(first()).subscribe(data => this.getUserHere(data));
  }

  private getUserHere(user: User[]) {
    this.user = user[0];
    this.refreshClassList();
  }

  private getClassesThenShowThem(classes: Class[]) {
    this.classes = classes;
    this.tempClasses = [];
    if (this.user.ClassIDList.length > 0) {
      this.tempClasses = this.classes.filter(element => this.user.ClassIDList.includes(element._id!));
    }
    this.loading = false;
  }

  dropClassHere(classID: string) {
    const classIndex = this.user.ClassIDList.indexOf(classID);
    if (classIndex !== -1) {
      this.user.ClassIDList.splice(classIndex, 1);      
    }
    this.transactionService.getAllTransactions().pipe(first()).subscribe(data => this.dropTransactionHere(data, classID));  
  }

  dropTransactionHere(allTransaction: Transaction[], classID: string){
    var transactionID = "";
    allTransaction.forEach(transaction => {
      if(transaction.CID === classID){
        transactionID = transaction._id!;
      }
    })
    const transactionIndex = this.user.TransactionHistory.indexOf(transactionID);
    if (transactionIndex !== -1) {
      this.user.TransactionHistory.splice(transactionIndex, 1);      
    }
    this.userService.editUser(this.user).pipe(first()).subscribe(data => this.editClassSeatsHere(data, classID));
  }

  viewTransaction(cid: string) {
    sessionStorage.setItem("transactionId", cid);
    //this.cd.setView(3);
    this.router.navigate(['../account-transaction-history'], {relativeTo: this.route});

  }

  private editClassSeatsHere(user: User, classID: string) {
    var tempClass = this.classes.find(x => x._id === classID);
    tempClass!.ClassSeats = (~~tempClass!.ClassSeats + 1).toString();

    this.classesService.editClass(tempClass!).pipe(first()).subscribe(data => this.refreshClassList());
  }

  private refreshClassList() {
    this.loading = true;
    this.tempClasses = [];
    this.classesService.getAllClasses().pipe(first()).subscribe(data => this.getClassesThenShowThem(data));
  }
}