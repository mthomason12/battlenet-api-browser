import { CommonModule } from '@angular/common';
import { Component, ContentChild, input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-page-selector',
  imports: [ MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './page-selector.component.html',
  styleUrl: './page-selector.component.scss'
})
export class PageSelectorComponent implements OnInit{

  pages = input.required<Array<object>>(); //an array of objects to use as pages
  selector = input.required<string>();     //the field in the objects to use as page names
  currentPage?: object = {};
  currentIndex = new FormControl(0);

  @ContentChild(TemplateRef) templateRef?: TemplateRef<any>;

  ngOnInit(): void {
    this.currentPage = this.pages()[0];
    console.dir(this.currentPage);
  }

  getItem(item: object): any {
    return item as any;
  }

  selectChanged() {
    this.currentPage = this.pages()[this.currentIndex.value!];
    console.dir(this.currentPage);
  }

}
