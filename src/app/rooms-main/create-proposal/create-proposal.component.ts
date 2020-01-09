import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuItem } from 'src/app/model/lunch/MenuItem';
import { Subscription } from 'rxjs';
import { LunchWsService } from '../service/lunch-ws.service';
import { Room } from 'src/app/model/Room';

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.css']
})
export class CreateProposalComponent implements OnInit, OnDestroy {
  
  checkoutForm: FormGroup;
  @Input() roomDetail: Room;
  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder, private lunchServiceWs: LunchWsService) {
    this.checkoutForm = this.formBuilder.group({
      'title': '',
      'description': '',
      'url': '',
      'price': 0.00
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onSubmit(proposal) {
    this.lunchServiceWs.addProposal(proposal.title, proposal.url, [new MenuItem(proposal.description, proposal.price)]);
  }

}
