import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from 'src/app/domain/article';
import { Patch } from 'src/app/domain/patch';
import { environment } from 'src/environments/environment';

@Injectable()
export class ArticleService {

    private urlMicroServiceSTL = '';

    constructor(public http: HttpClient) { 
      this.urlMicroServiceSTL = `${environment.urlMicroServiceSTL}/api/v1/rest`;
    }
    
    getArticles() {
        const url = `${this.urlMicroServiceSTL}/articles`;
        return this.http.get(url);
    }

    postArticle(article: Article){
        const url = `${this.urlMicroServiceSTL}/articles`;
        return this.http.post(url, article);
    }

    patchArticle(id: string, patch: Patch){
        const url = `${this.urlMicroServiceSTL}/articles/${id}`;
        return this.http.patch(url, patch);
    }

    deleteArticle(id: string){
        const url = `${this.urlMicroServiceSTL}/articles`;
        return this.http.delete(url, {params: {id: id}});
    }

};
