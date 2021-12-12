import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentCreateComponent } from './components/document-create/document-create.component';
import { DocumentEditComponent } from './components/document-edit/document-edit.component';
import { DocumentListComponent } from './components/document-list/document-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'documents-list' },
  { path: 'create-document', component: DocumentCreateComponent },
  { path: 'edit-document/:id', component: DocumentEditComponent },
  { path: 'documents-list', component: DocumentListComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
