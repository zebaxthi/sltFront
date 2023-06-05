import { Component, OnInit, forwardRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Loan } from '../../domain/loan';
import { LoanService } from './service/loan.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Patch } from 'src/app/domain/patch';
import { User } from 'src/app/domain/user';
import { Article } from 'src/app/domain/article';
import { forkJoin } from 'rxjs';

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

    DataViewOverlayPanel: any[];

    colsDynamic: any[];

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
        const apisInit = forkJoin({
            'persons': this.loanService.getPersons(),
            'articles': this.loanService.getArticles(),
            'loans': this.loanService.getLoans()
        });

        apisInit.subscribe(res => {
            let persons: User[] = res['persons']['data'];
            this.users = persons;
            this.monitors = persons.filter(x => x.rol === 'monitor');
            this.articles = res['articles']['data'];
            this.loans = res['loans']['data'].map(x => {
                return {
                    id: x['id'],
                    person: this.users.find(y => y.id === x['personUser']),
                    monitor: this.monitors.find(y => y.id === x['personMonitor']),
                    article: this.articles.find(y => y.id === x['article']),
                    quantityArticle: x['qtyArticle'],
                    startDate: new Date(x['dateStart']),
                    endDate: new Date(x['dateEnd']),
                    returned: x['isReturned'],
                }
            });
        }, error => {
            this.messageService.add({ severity: 'error', summary: 'Unexpected error', detail: 'There was an unexpected error loading data', life: 3000 });
        });

        this.returnedValues = [
            { label: 'true', value: true },
            { label: 'false', value: false },
        ];
    }

    openNew() {
        this.loan = { 
            startDate: null,
            endDate: null,
            returned: false
        };       
        this.submitted = false;
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
                        startDate: null,
                        endDate: null,
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
        let loanNew = {...this.loan};
        if (loanNew.article.name.trim()) {
            if (loanNew.id) {
                let properties = [
                    { label: 'user', value: 'personUser' }, 
                    { label: 'monitor', value: 'personMonitor' }, 
                    { label: 'article', value: 'article' }, 
                    { label: 'quantityArticle', value: 'qtyArticle' }, 
                    { label: 'startDate', value: 'dateStart' }, 
                    { label: 'endDate', value: 'dateEnd' }, 
                    { label: 'returned', value: 'isReturned' }];
                properties.map(x => {
                    if(this.oldLoan[x.label] !== loanNew[x.label]){
                        let patch: Patch = {
                            op: 'update',
                            key: x.value,
                            value: loanNew[x.label]
                        }
                        this.loanService.patchLoan(loanNew.id, patch).subscribe(res => {
                            this.messageService.add({ severity: 'success', summary: 'Loan Updated', detail: `updated ${x} property successfully`, life: 3000 });
                        }, error => {
                            this.messageService.add({ severity: 'error', summary: 'Error Updating Loan', detail: `Error updating ${x} property the loan`, life: 3000 });
                        });
                        this.loans[this.findIndexById(loanNew.id)] = loanNew;
                    }
                });
            } else {
                this.loanService.postLoan(loanNew).subscribe(res => {
                    this.loans.push(loanNew);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Loan Created', life: 3000 });
                }, error => {
                    this.messageService.add({ severity: 'error', summary: 'Error Creating Loan', detail: 'Error creating the loan', life: 3000 });
                });
            }
            
            this.loans = [...this.loans];
            this.loanDialog = false;
            this.loan = { 
                startDate: null,
                endDate: null,
                returned: false
            };        
        }
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

    setDataViewOverlayPanel(info: any){
        this.colsDynamic = Object.entries(info).map(x => {
            return {
                field: x[0],
                header: x[0]
            }
        });
        this.DataViewOverlayPanel = [];
        this.DataViewOverlayPanel.push(info);
    }
}
