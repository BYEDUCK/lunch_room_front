import { Component, OnInit, Input } from '@angular/core';
import { Proposal } from 'src/app/model/lunch/Proposal';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html'
})
export class SummaryComponent implements OnInit {

  @Input() userNick: string;
  @Input() proposal: Proposal;

  constructor() { }

  ngOnInit() {
  }

}
