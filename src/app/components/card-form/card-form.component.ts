import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Card, CreateCardRequest, UpdateCardRequest } from '../../models/card.model';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit {
  card: Card = {
    id: 0,
    name: '',
    set: '',
    collector_number: '',
    foil: false,
    last_price: 0,
    old_price: 0,
    price_change: 0,
    last_update: ''
  };

  isEditMode = false;
  isLoading = false;
  isSaving = false;
  cardId: number | null = null;
  
  errorMessage = '';
  successMessage = '';

  constructor(
    private cardService: CardService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.cardId = parseInt(id, 10);
      await this.loadCard();
    }
  }

  private async loadCard(): Promise<void> {
    if (!this.cardId) return;

    this.isLoading = true;
    try {
      this.card = await this.cardService.getCard(this.cardId).toPromise() || this.card;
    } catch (error) {
      console.error('Error loading card:', error);
      this.errorMessage = 'Error loading card data';
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.isSaving) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      if (this.isEditMode && this.cardId) {
        const updateRequest: UpdateCardRequest = {
          name: this.card.name
        };
        await this.cardService.updateCard(this.cardId, updateRequest).toPromise();
        this.successMessage = 'Card updated successfully!';
      } else {
        const createRequest: CreateCardRequest = {
          name: this.card.name,
          set_name: this.card.set,
          collector_number: this.card.collector_number,
          foil: this.card.foil
        };
        await this.cardService.createCard(createRequest).toPromise();
        this.successMessage = 'Card added successfully!';
      }

      setTimeout(() => {
        this.router.navigate(['/cards']);
      }, 1500);

    } catch (error) {
      console.error('Error saving card:', error);
      this.errorMessage = this.isEditMode 
        ? 'Error updating card. Please check the data and try again.'
        : 'Error adding card. Please check the data and try again.';
    } finally {
      this.isSaving = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/cards']);
  }

  getPriceChange(): number {
    return this.card.last_price - (this.card.old_price || 0);
  }

  getPercentageChange(): string {
    if (!this.card.old_price || this.card.old_price === 0) {
      return '0.00';
    }
    
    const percentage = ((this.card.last_price - this.card.old_price) / this.card.old_price) * 100;
    return percentage.toFixed(2);
  }
} 