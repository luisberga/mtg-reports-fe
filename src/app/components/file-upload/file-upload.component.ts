import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardService } from '../../services/card.service';
import { BulkInsertResponse } from '../../models/card.model';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  uploadProgress = 0;
  uploadStatus = '';
  uploadResults: BulkInsertResponse | null = null;
  errorMessage = '';

  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor(
    private cardService: CardService,
    private router: Router
  ) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    this.clearError();

    // Validar tipo de arquivo
    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      this.errorMessage = 'Por favor, selecione um arquivo CSV válido.';
      return;
    }

    // Validar tamanho do arquivo
    if (file.size > this.maxFileSize) {
      this.errorMessage = 'O arquivo é muito grande. O tamanho máximo permitido é 10MB.';
      return;
    }

    this.selectedFile = file;
  }

  removeFile(): void {
    this.selectedFile = null;
    this.clearError();
  }

  async uploadFile(): Promise<void> {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadStatus = 'Preparando upload...';
    this.clearError();

    try {
      // Simular progresso inicial
      this.uploadProgress = 10;
      this.uploadStatus = 'Enviando arquivo...';

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Simular progresso durante upload
      this.uploadProgress = 50;
      this.uploadStatus = 'Processando cartas...';

             this.uploadResults = await this.cardService.bulkUpload(this.selectedFile).toPromise() || { processed: 0, not_processed: 0 };

      // Finalizar progresso
      this.uploadProgress = 100;
      this.uploadStatus = 'Upload concluído!';

    } catch (error) {
      console.error('Erro no upload:', error);
      this.errorMessage = 'Erro ao fazer upload do arquivo. Verifique o formato e tente novamente.';
      this.uploadResults = null;
    } finally {
      this.isUploading = false;
    }
  }

  resetUpload(): void {
    this.selectedFile = null;
    this.uploadResults = null;
    this.uploadProgress = 0;
    this.uploadStatus = '';
    this.clearError();
  }

  clearError(): void {
    this.errorMessage = '';
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadTemplate(): void {
    const csvContent = `name,set_name,collector_number,foil
Sauron the Dark Lord,LTR,001,false
Gandalf the Grey,LTR,002,true
Nazgûl,LTR,003,false
Aragorn King of Gondor,LTR,004,false
Frodo Baggins,LTR,005,true`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = 'mtg_cards_template.csv';
    link.click();
    
    window.URL.revokeObjectURL(url);
  }

  viewCollection(): void {
    this.router.navigate(['/cards']);
  }

  goBack(): void {
    this.router.navigate(['/cards']);
  }
} 