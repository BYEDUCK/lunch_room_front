import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LunchWsService } from '../service/lunch-ws.service';
import { Proposal } from 'src/app/model/lunch/Proposal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem } from 'src/app/model/lunch/MenuItem';

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.css']
})
export class CreateProposalComponent implements OnInit, OnDestroy {

  public proposalId: string;
  public proposalTitle = '';
  public proposalMenuUrl = '';
  public menuItems: MenuItem[] = [];

  constructor(private lunchServiceWs: LunchWsService, public activeModal: NgbActiveModal) {

  }

  ngOnInit() {
    if (!this.proposalId) {
      this.menuItems.push(this.emptyMenuItem());
    }
  }

  ngOnDestroy(): void {
  }

  addProposal() {
    if (!this.proposalId) {
      this.lunchServiceWs.addProposal(this.proposalTitle, this.proposalMenuUrl, this.menuItems);
      this.activeModal.close();
    }
  }

  editProposal() {
    if (this.proposalId) {
      this.lunchServiceWs.editProposal(this.proposalId, this.proposalTitle, this.proposalMenuUrl, this.menuItems);
      this.activeModal.close();
    }
  }

  emptyMenuItem(): MenuItem {
    return new MenuItem('', 0.00);
  }

  addItem() {
    if (this.menuItems.length < 4) {
      this.menuItems.push(this.emptyMenuItem());
    }
  }

  removeItem() {
    if (this.menuItems.length > 0) {
      this.menuItems.splice(-1, 1);
    }
  }

}
