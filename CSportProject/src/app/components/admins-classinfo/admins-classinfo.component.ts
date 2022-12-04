import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
import { Class } from 'src/app/Classes';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faPenNib } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-admins-classinfo',
  templateUrl: './admins-classinfo.component.html',
  styleUrls: ['./admins-classinfo.component.css']
})
export class AdminsClassinfoComponent implements OnInit {

  @Input()
  class !: Class;
  @Output() 
  onDeleteClass : EventEmitter<Class> = new EventEmitter();
  @Output()
  onUpateClass : EventEmitter<Class> = new EventEmitter();
  @Output()
  onAddClass : EventEmitter<Class> = new EventEmitter();

  columnsToDisplay = ['name', 'Descript', 'STime', 'ETime', 'Date', 'ClassSeats', "Price", "Delete/Edit"];



  check_edit : boolean = false;
  name_fix !: string;
  desc_fix !: string;
  start_fix !: string;
  end_fix !: string;
  sets_fix!: number;
  price_fix !: number;
  date_fix !:string;
  // check_add !: boolean;


  faTimes = faTimes; // 2. From angular-fontawesome
  faPenNib = faPenNib; // 2. From angular-fontawesome

  constructor() { }

  ngOnInit(): void {
  }

  // onAdd(class2 : Class){
  //   this.onAddClass.emit(class2);
  // }

  onDelete(class2 : Class){
    this.onDeleteClass.emit(class2);
  }

  onUpdate(class2 : Class){
    this.startTimeChange(this.start_fix)
    this.endTimeChange(this.end_fix)
    class2.Name = this.name_fix;
    class2.Descript = this.desc_fix;
    class2.STime = this.start_fix;
    class2.ETime = this.end_fix;
    class2.Price = this.price_fix;
    class2.Date = this.date_fix;
    class2.ClassSeats = this.sets_fix.toString();
    this.check_edit = false;
    this.onUpateClass.emit(class2);
  }


  onDisplay_Update_function(class2 : Class){

    this.name_fix = class2.Name;
    this.desc_fix = class2.Descript;
    this.start_fix = class2.STime;
    this.end_fix = class2.ETime;
    this.price_fix = class2.Price;
    this.date_fix = class2.Date;
    this.sets_fix = Number(class2.ClassSeats);

    this.check_edit = !this.check_edit;
  }
  
  startTimeChange(inputEle : String) {
    var timeSplit = inputEle.split(':'),
      hours,
      minutes,
      meridian;
    hours =  Number(timeSplit[0]);
    minutes = timeSplit[1];


    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }
    
    this.start_fix = hours + ':' + minutes + ' ' + meridian;
  }
  endTimeChange(inputEle : String) {
    var timeSplit = inputEle.split(':'),
      hours,
      minutes,
      meridian;
    hours =  Number(timeSplit[0]);
    minutes = timeSplit[1];


    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }
    
    this.end_fix = hours + ':' + minutes + ' ' + meridian;
  }
}
