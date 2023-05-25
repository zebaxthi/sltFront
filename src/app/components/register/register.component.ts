import { Component, OnInit } from '@angular/core';
import { TreeRegister } from 'primeng/api';
import { RegisterService } from '../../service/register.service';

@Component({
    selector: 'tree-single-register',
    templateUrl: './tree-single-register.html'
})
export class TreeSingleRegister implements OnInit {
    files: TreeRegister[];

    selectedFile: TreeRegister;

    constructor(private registerService: RegisterService) {}

    ngOnInit() {
        this.registerService.getFiles().then((data) => (this.files = data));
    }
}
