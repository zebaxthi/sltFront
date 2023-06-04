import { Component, OnInit, forwardRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Loan } from '../../domain/loan';
import { LoanService } from './service/loan.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Patch } from 'src/app/domain/patch';
import { User } from 'src/app/domain/user';
import { Article } from 'src/app/domain/article';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
    providers: [MessageService, ConfirmationService, {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LoansComponent),  // replace name as appropriate
      multi: true
    }]
})
export class LoansComponent implements OnInit{

    loanDialog: boolean = false;

    loans: Loan[];

    loan: Loan;

    oldLoan: Loan;

    selectedLoans: Loan[];

    submitted: boolean;

    returnedValues: any[];

    users: User[];

    monitors: User[];

    articles: Article[];

    constructor(private loanService: LoanService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

    ngOnInit() {
        this.loanService.getLoans().subscribe(res => {
            this.loans = res['data'];
        }, error => {
            this.messageService.add({ severity: 'error', summary: 'Unexpected error', detail: 'There was an unexpected error loading loans', life: 3000 });
        });

        this.returnedValues = [
            { label: 'TRUE', value: true },
            { label: 'FALSE', value: false },
        ];
    }

    openNew() {
        this.loan = { 
            startDate: new Date(),
            endDate: new Date(),
            returned: false
        };        this.submitted = false;
        this.loanDialog = true;
    }

    deleteSelectedLoans() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected loans?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedLoans.forEach(element => {
                    this.loanService.deleteLoan(element.id).subscribe(res => {
                        this.loans = this.loans.filter((val) => val.id !== element.id);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Loan Deleted', life: 3000 });
                    }, error => {
                        this.messageService.add({ severity: 'error', summary: 'Error Deleting Loan', detail: 'There was an error trying to delete the loan', life: 3000 });
                    });
                });
                this.selectedLoans = null;
            }
        });
    }

    editLoan(loan: Loan) {
        this.loan = { ...loan };
        this.oldLoan = { ...loan };
        this.loanDialog = true;
    }

    deleteLoan(loan: Loan) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + loan.article.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loanService.deleteLoan(loan.id).subscribe(res => {
                    this.loans = this.loans.filter((val) => val.id !== loan.id);
                    this.loan = { 
                        startDate: new Date(),
                        endDate: new Date(),
                        returned: false
                    };
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Loan Deleted', life: 3000 });
                }, error => {
                    this.messageService.add({ severity: 'error', summary: 'Error Deleting Loan', detail: 'There was an error trying to delete the loan', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.loanDialog = false;
        this.submitted = false;
    }

    saveLoan() {
        this.submitted = true;

        if (this.loan.article.name.trim()) {
            if (this.loan.id) {
                let properties = ['user', 'monitor', 'article', 'quantityArticle', 'startDate', 'endDate', 'returned'];
                properties.map(x => {
                    if(this.oldLoan[x] !== this.loan[x]){
                        let patch: Patch = {
                            op: 'update',
                            key: x,
                            value: this.loan[x]
                        }
                        this.loanService.patchLoan(this.loan.id, patch).subscribe(res => {
                            debugger;
                            this.messageService.add({ severity: 'success', summary: 'Loan Updated', detail: `updated ${x} property successfully`, life: 3000 });
                        }, error => {
                            this.messageService.add({ severity: 'error', summary: 'Error Updating Loan', detail: `Error updating ${x} property the loan`, life: 3000 });
                        });
                        this.loans[this.findIndexById(this.loan.id)] = this.loan;
                    }
                });
            } else {
                this.loanService.postLoan(this.loan).subscribe(res => {
                    if(res['status'] === 'CREATED'){
                        this.loans.push(res['data']);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Loan Created', life: 3000 });
                    }
                }, error => {
                    this.messageService.add({ severity: 'error', summary: 'Error Creating Loan', detail: 'Error creating the loan', life: 3000 });
                });
            }

            this.loans = [...this.loans];
            this.loanDialog = false;
            this.loan = { 
                startDate: new Date(),
                endDate: new Date(),
                returned: false
            };        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.loans.length; i++) {
            if (this.loans[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(returnedValue: boolean) {
        switch (returnedValue) {
            case true:
                return 'success';
            case false:
                return 'danger';
            default:
              return "error";
        }
    }
}
