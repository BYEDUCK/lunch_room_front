import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-summary-popup',
  templateUrl: './summary-popup.component.html'
})
export class SummaryPopupComponent implements OnInit {

  @Input()
  summaries: Summary[] = []

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}

export class Summary {
  constructor(
    public date: string,
    public winnerNick: string,
    public winnerProposalTitle: string
  ) {

  }
}
