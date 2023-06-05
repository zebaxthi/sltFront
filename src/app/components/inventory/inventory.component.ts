import { Component, OnInit, forwardRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Article } from '../../domain/article';
import { ArticleService } from '../inventory/service/article.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Patch } from 'src/app/domain/patch';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css'],
    providers: [MessageService, ConfirmationService, {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InventoryComponent),  // replace name as appropriate
      multi: true
    }]
})
export class InventoryComponent implements OnInit{
    articleDialog: boolean = false;

    articles: Article[];

    article: Article;

    oldArticle: Article;

    selectedArticles: Article[];

    submitted: boolean;

    statuses: any[];

    constructor(private articleService: ArticleService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

    ngOnInit() {
        this.articleService.getArticles().subscribe(res => {
            this.articles = res['data'];
        }, error => {
            this.messageService.add({ severity: 'error', summary: 'Unexpected error', detail: 'There was an unexpected error loading articles', life: 3000 });
        });

        this.statuses = [
            { label: 'ACTIVE', value: 'ACTIVE' },
            { label: 'INACTIVE', value: 'INACTIVE' },
        ];
    }

    openNew() {
        this.article = {};
        this.submitted = false;
        this.articleDialog = true;
    }

    deleteSelectedArticles() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected articles?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedArticles.forEach(element => {
                    this.articleService.deleteArticle(element.id).subscribe(res => {
                        this.articles = this.articles.filter((val) => val.id !== element.id);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Article Deleted', life: 3000 });
                    }, error => {
                        this.messageService.add({ severity: 'error', summary: 'Error Deleting Article', detail: 'There was an error trying to delete the article', life: 3000 });
                    });
                });
                this.selectedArticles = null;
            }
        });
    }

    editArticle(article: Article) {
        this.article = { ...article };
        this.oldArticle = { ...article };
        this.articleDialog = true;
    }

    deleteArticle(article: Article) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + article.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.articleService.deleteArticle(article.id).subscribe(res => {
                    this.articles = this.articles.filter((val) => val.id !== article.id);
                    this.article = {};
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Article Deleted', life: 3000 });
                }, error => {
                    this.messageService.add({ severity: 'error', summary: 'Error Deleting Article', detail: 'There was an error trying to delete the article', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.articleDialog = false;
        this.submitted = false;
    }

    saveArticle() {
        this.submitted = true;

        if (this.article.name.trim()) {
            if (this.article.id) {
                let properties = ['name', 'ref', 'quantity', 'status'];
                properties.map(x => {
                    if(this.oldArticle[x] !== this.article[x]){
                        let patch: Patch = {
                            op: 'update',
                            key: x,
                            value: this.article[x]
                        }
                        this.articleService.patchArticle(this.article.id, patch).subscribe(res => {
                            debugger;
                            this.messageService.add({ severity: 'success', summary: 'Article Updated', detail: `updated ${x} property successfully`, life: 3000 });
                        }, error => {
                            this.messageService.add({ severity: 'error', summary: 'Error Updating Article', detail: `Error updating ${x} property the article`, life: 3000 });
                        });
                        this.articles[this.findIndexById(this.article.id)] = this.article;
                    }
                });
            } else {
                this.articleService.postArticle(this.article).subscribe(res => {
                    if(res['status'] === 'CREATED'){
                        this.articles.push(res['data']);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Article Created', life: 3000 });
                    }
                }, error => {
                    this.messageService.add({ severity: 'error', summary: 'Error Creating Article', detail: 'Error creating the article', life: 3000 });
                });
            }
            
            this.articles = [...this.articles];
            this.articleDialog = false;
            this.article = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.articles.length; i++) {
            if (this.articles[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'danger';
            default:
              return "error";
        }
    }
}
