import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardService } from '../../services/card.service';
import { Card, ResponsePaginatedCards } from '../../models/card.model';

@Component({
  selector: 'app-card-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card-history.component.html',
  styleUrls: ['./card-history.component.scss']
})
export class CardHistoryComponent implements OnInit {
  cardId: string = '';
  historyCards: Card[] = [];
  isLoading = true;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cardId = params['id'];
      this.loadCardHistory();
    });
  }

  private loadCardHistory(page: number = 1): void {
    this.isLoading = true;
    this.currentPage = page;
    
    this.cardService.getCardHistory(this.cardId, page, this.itemsPerPage).subscribe({
      next: (response: ResponsePaginatedCards) => {
        this.historyCards = response.cards;
        this.currentPage = response.page;
        this.itemsPerPage = response.limit;
        this.totalItems = response.total;
        this.totalPages = response.total_pages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading card history:', error);
        this.isLoading = false;
      }
    });
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadCardHistory(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadCardHistory(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadCardHistory(this.currentPage - 1);
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
    this.loadCardHistory(1); // Reset to first page when changing items per page
  }

  onItemsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.changeItemsPerPage(+target.value);
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