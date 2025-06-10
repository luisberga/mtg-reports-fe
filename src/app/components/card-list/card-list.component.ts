import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardService } from '../../services/card.service';
import { Card, PaginatedCardsResponse } from '../../models/card.model';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  cards: Card[] = [];
  isLoading = true;
  isDeleting = false;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 30;
  totalItems = 0;
  totalPages = 0;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.loadCards();
  }

  private loadCards(page: number = 1): void {
    this.isLoading = true;
    this.currentPage = page;
    
    this.cardService.getCards(page, this.itemsPerPage).subscribe({
      next: (response: PaginatedCardsResponse) => {
        this.cards = response.cards;
        this.currentPage = response.page;
        this.itemsPerPage = response.limit;
        this.totalItems = response.total;
        this.totalPages = response.total_pages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cards:', error);
        this.isLoading = false;
      }
    });
  }

  deleteCard(cardId: number): void {
    if (this.isDeleting) return;
    
    if (confirm('Are you sure you want to delete this card?')) {
      this.isDeleting = true;
      
      this.cardService.deleteCard(cardId).subscribe({
        next: () => {
          // Reload the current page after deletion
          this.loadCards(this.currentPage);
          this.isDeleting = false;
        },
        error: (error) => {
          console.error('Error deleting card:', error);
          alert('Error deleting card. Please try again.');
          this.isDeleting = false;
        }
      });
    }
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadCards(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadCards(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadCards(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  }

  changeItemsPerPage(newLimit: number): void {
    this.itemsPerPage = newLimit;
    this.loadCards(1); // Reset to first page when changing items per page
  }

  onItemsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.changeItemsPerPage(+target.value);
  }

  // Helper methods for template
  getTotalValue(): number {
    return this.cards.reduce((total, card) => total + card.last_price, 0);
  }

  trackByCardId(index: number, card: Card): number {
    return card.id;
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  }

  // Make Math available in template
  Math = Math;
} 