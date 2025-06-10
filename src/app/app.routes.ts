import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent) 
  },
  { 
    path: 'cards', 
    loadComponent: () => import('./components/card-list/card-list.component')
      .then(m => m.CardListComponent) 
  },
  { 
    path: 'cards/new', 
    loadComponent: () => import('./components/card-form/card-form.component')
      .then(m => m.CardFormComponent) 
  },
  { 
    path: 'cards/:id/edit', 
    loadComponent: () => import('./components/card-form/card-form.component')
      .then(m => m.CardFormComponent) 
  },
  { 
    path: 'cards/:id/history', 
    loadComponent: () => import('./components/card-history/card-history.component')
      .then(m => m.CardHistoryComponent) 
  },
  { 
    path: 'upload', 
    loadComponent: () => import('./components/file-upload/file-upload.component')
      .then(m => m.FileUploadComponent) 
  },
  { path: '**', redirectTo: '/dashboard' }
];
