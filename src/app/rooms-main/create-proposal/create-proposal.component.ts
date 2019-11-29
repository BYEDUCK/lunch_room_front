import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { LunchService } from '../service/lunch.service';
import { FormBuilder } from '@angular/forms';
import { RoomDetail } from 'src/app/model/RoomDetail';
import { MenuItem } from 'src/app/model/lunch/MenuItem';
import { Subscription } from 'rxjs';
import { Proposal } from 'src/app/model/lunch/Proposal';

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.css']
})
export class CreateProposalComponent implements OnInit, OnDestroy {
  
  checkoutForm;
  @Input() roomDetail: RoomDetail;
  subscriptions: Subscription[] = [];
  @Output() proposalEvent: EventEmitter<Proposal> = new EventEmitter()

  constructor(private lunchService: LunchService, private formBuilder: FormBuilder) {
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
    this.subscriptions.push(this.lunchService.addProposal(
      this.roomDetail.roomId, menuItem.title, [new MenuItem(menuItem.description, menuItem.price)]
    ).subscribe({
      next: resp => {
        console.log(resp);
        this.proposalEvent.emit(resp);
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        console.log('completed');
      }
    }));
  }

}
