import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'new',
  templateUrl: './new.html',
  styleUrls: ['./new.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class NewComponent implements OnDestroy, OnInit{

  constructor(
  ) {
  }

  public ngOnInit():void{
  }

  public ngOnDestroy():void{
    
  }

}
