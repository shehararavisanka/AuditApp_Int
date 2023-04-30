import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  group:any="";
constructor( public router:Router){
 this.group =localStorage.getItem('groupno') ;
}

logout(){
  this.group =localStorage.getItem('groupno') ;
  this.router.navigate(['/']) 
}
}
