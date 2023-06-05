import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loan } from 'src/app/domain/loan';
import { Patch } from 'src/app/domain/patch';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoanService {

    private urlMicroServiceSTL = '';

    constructor(public http: HttpClient) {
      this.urlMicroServiceSTL = `${environment.urlMicroServiceSTL}/api/v1/rest`;
    }

    getLoans() {
        const url = `${this.urlMicroServiceSTL}/loans`;
        return this.http.get(url);
    }

    postLoan(loan: Loan){
        const url = `${this.urlMicroServiceSTL}/loans`;
        let json = {
            personUser: loan.person.id,
            personMonitor: loan.monitor.id,
            article: loan.article.id,
            qtyArticle: loan.quantityArticle,
            dateStart: loan.startDate,
            dateEnd: loan.endDate,
            isReturned: loan.returned
        }
        return this.http.post(url, json);
    }

    patchLoan(id: string, patch: Patch){
        const url = `${this.urlMicroServiceSTL}/loans/${id}`;
        return this.http.patch(url, patch);
    }

    deleteLoan(id: string){
        const url = `${this.urlMicroServiceSTL}/loans`;
        return this.http.delete(url, {params: {id: id}});
    }

    getPersons(){
        const url = `${this.urlMicroServiceSTL}/persons`;
        return this.http.get(url);
    }

    getArticles() {
        const url = `${this.urlMicroServiceSTL}/articles`;
        return this.http.get(url);
    }

};
