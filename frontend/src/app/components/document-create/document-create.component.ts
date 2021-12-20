import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-document-create',
  templateUrl: './document-create.component.html',
  styleUrls: ['./document-create.component.css']
})
export class DocumentCreateComponent implements OnInit {
  submitted = false;
  documentForm: FormGroup;
  fileToUpload: File | null = null;

  constructor(public fb: FormBuilder, private router: Router, private ngZone: NgZone, private apiService: ApiService) {
    this.documentForm = this.fb.group({
      fullName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.documentForm = this.fb.group({
      fullName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    })
  }

  get myForm() {
    return this.documentForm.controls;
  }

  handleFileInput(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileToUpload = file
      console.log(file)
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.documentForm.valid && this.fileToUpload != null) {
      const formData = new FormData();
      formData.append('fullName', this.documentForm.value.fullName);
      formData.append('description', this.documentForm.value.description);
      formData.append('doc', this.fileToUpload!);

      this.apiService.createDocument(formData).subscribe(
        (res) => {
          console.log('Document successfully created!')
          this.ngZone.run(() => this.router.navigateByUrl('/documents-list'))
        }, (error) => {
          console.log(error);
        });
    }
  }
}
