import { Component, Input, OnInit } from '@angular/core';

/**Card de productos */
@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() card;
  constructor() {}

  public ngOnInit() {
  }
}