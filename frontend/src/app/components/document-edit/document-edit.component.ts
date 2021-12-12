import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;
  fileToUpload: File | null = null;

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      fullName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    let id = this.actRoute.snapshot.paramMap.get('id');
    console.log(id)
    this.getDocument(id);
  }

  get myForm() {
    return this.editForm.controls;
  }

  getDocument(id: string | null) {
    this.apiService.getDocument(id).subscribe(data => {
      this.editForm.setValue({
        fullName: data['fullName'],
        description: data['description'],
      });
    });
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
    if (!this.editForm.valid && this.fileToUpload != null) {
      return false;
    } else {
      if (window.confirm('Are you sure?')) {
        const formData = new FormData();
        formData.append('fullName', this.editForm.value.fullName);
        formData.append('description', this.editForm.value.description);
        formData.append('doc', this.fileToUpload!);

        let id = this.actRoute.snapshot.paramMap.get('id');
        this.apiService.updateDocument(id, formData).subscribe(
          (res) => {
            let id = this.actRoute.snapshot.paramMap.get('id');
            console.log('Document successfully created!')
            this.router.navigateByUrl('/documents-list');
          }, (error) => {
            console.log(error);
          });
      }
      return true
    }
  }
}
