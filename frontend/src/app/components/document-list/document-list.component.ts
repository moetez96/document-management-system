import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  Document: any = [];

  constructor(private apiService: ApiService) {
    this.allDocuments();
  }

  ngOnInit() {
  }

  allDocuments() {
    this.apiService.getDocuments().subscribe((data) => {
      this.Document = data;
    })
  }

  date(date: any) {
    return (date.substring(0, 10) + " " + date.substring(11, 19))
  }
  getfile(fileName: any) {
    this.apiService.getFile(fileName).subscribe(data => {
      let downloadURL = window.URL.createObjectURL(data);
      window.open(downloadURL);
    })
  }
  removeDocument(document: any, index: Number) {
    if (window.confirm('Are you sure?')) {
      this.apiService.deleteDocument(document._id).subscribe((data) => {
        this.Document.splice(index, 1);
      }
      )
    }
  }

}
