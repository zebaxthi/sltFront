import { Component, OnInit, forwardRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Article } from '../../domain/article';
import { ArticleService } from '../inventory/service/article.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css'],
    providers: [MessageService, ConfirmationService, {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InventoryComponent),  // replace name as appropriate
      multi: true
    }]
})
export class InventoryComponent implements OnInit{
    articleDialog: boolean = false;

    articles: Article[];

    article: Article;

    selectedArticles: Article[];

    submitted: boolean;

    statuses: any[];

    constructor(private articleService: ArticleService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

    ngOnInit() {
        this.articleService.getArticles().then((data) => (this.articles = data));

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
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
                this.articles = this.articles.filter((val) => !this.selectedArticles.includes(val));
                this.selectedArticles = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Articles Deleted', life: 3000 });
            }
        });
    }

    editArticle(article: Article) {
        this.article = { ...article };
        this.articleDialog = true;
    }

    deleteArticle(article: Article) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + article.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.articles = this.articles.filter((val) => val.id !== article.id);
                this.article = {};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Article Deleted', life: 3000 });
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
                this.articles[this.findIndexById(this.article.id)] = this.article;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Article Updated', life: 3000 });
            } else {
                this.article.id = this.createId();
                //this.article.image = 'article-placeholder.svg';
                this.articles.push(this.article);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Article Created', life: 3000 });
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

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
              return "error";
        }
    }
}
