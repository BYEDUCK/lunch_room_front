import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LunchService } from '../service/lunch.service';
import { FormBuilder } from '@angular/forms';
import { RoomDetail } from 'src/app/model/RoomDetail';
import { MenuItem } from 'src/app/model/lunch/MenuItem';
import { Subscription } from 'rxjs';
import { LunchWsService } from '../service/lunch-ws.service';

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.css']
})
export class CreateProposalComponent implements OnInit, OnDestroy {
  
  checkoutForm;
  @Input() roomDetail: RoomDetail;
  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder, private lunchServiceWs: LunchWsService) {
    this.checkoutForm = this.formBuilder.group({
      'title': '',
      'description': '',
      'price': 0.00
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onSubmit(menuItem) {
    this.lunchServiceWs.addProposal(menuItem.title, [new MenuItem(menuItem.description, menuItem.price)]);
  }

}
