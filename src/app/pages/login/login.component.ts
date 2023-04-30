import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(  public router:Router,public loginserv:CommonService  ) { }
  username:string='';
  password:string='';
  ngOnInit(): void {
  }
  ret:any;
  signin(){

  
    if(this.username==""){
     
    }else if(this.password==""){
       
    } else{
      this.loginserv.login({username:this.username,password:this.password}).then(ret=>{

    
       this.ret=ret;
       if(this.ret.data[0].length>0){
           console.log(this.ret.data[0])
           localStorage.setItem('groupno',this.ret.data[0][0].Userdetails1)
           localStorage.setItem('userIdx',this.ret.data[0][0].Idx)
          this.router.navigate(['/dashboard']) 
       }

         
    });
  }

  }
  signup(){

  }
  forgetpassword(){

  }

}
