import { Component, OnInit , Output, EventEmitter} from '@angular/core';
import { Class } from 'src/app/Classes';
@Component({
  selector: 'app-admin-add-class',
  templateUrl: './admin-add-class.component.html',
  styleUrls: ['./admin-add-class.component.css']
})
export class AdminAddClassComponent implements OnInit {


  // Data binding From here to admins. 
  @Output() 
  onAddClass : EventEmitter<Class> = new EventEmitter();

  
  //variables for adding Class.
  name !: string;
  desc !: string;
  start !: string;
  end !: string;
  sets !: string;
  Tdate !: string;
  price !: number;

  // variable for checking if you want to add or not.
  check_add !: boolean;


  constructor() { }
  ngOnInit(): void {
  }

  // Check if you want to add or not.
  checkAddClass(){
    this.check_add = !this.check_add;
    console.log(this.check_add);
  }

  // This method will change value the class you want to fix and the index will display as emtpty again.
  onCreatClass(){
    if(!this.name || !this.desc || !this.start || !this.end){
      alert("Please check again.");
    }

    else{

      this.startTimeChange(this.start);
      this.endTimeChange(this.end);
      const addClass = {
        Name : this.name,
        Descript : this.desc,
        STime : this.start,
        ETime : this.end,
        Date: this.Tdate,
        ClassSeats: this.sets,
        Price : this.price,
      } as Class
  
      this.onAddClass.emit(addClass);

      this.name = "";
      this.desc = "";
      this.start = "";
      this.end = "";
      this.sets = "";
      this.check_add = !this.check_add;
    }
  }


  // Time formating as  AM, Pm  
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
    
    this.start = hours + ':' + minutes + ' ' + meridian;
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
    
    this.end = hours + ':' + minutes + ' ' + meridian;
  }


}
