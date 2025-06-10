import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardService } from '../../services/card.service';
import { Card, PaginatedCardsResponse } from '../../models/card.model';

@Component({
  selector: 'app-card-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './card-list.html',
  styleUrl: './card-list.scss'
})
export class CardList implements OnInit {
  cards = signal<Card[]>([]);
  filteredCards = signal<Card[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(30);
  totalItems = signal(0);
  totalPages = signal(0);
  
  // Filtros
  searchName = signal('');
  searchSet = signal('');
  searchCollectorNumber = signal('');
  sortBy = signal<'name' | 'set' | 'price' | 'date'>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  constructor(private cardService: CardService) {}

  ngOnInit() {
    this.loadCards();
  }

  loadCards(page: number = 1) {
    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(page);
    
    this.cardService.getCards(page, this.itemsPerPage()).subscribe({
      next: (response: PaginatedCardsResponse) => {
        this.cards.set(response.cards);
        this.totalItems.set(response.total);
        this.totalPages.set(response.total_pages);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar cartas: ' + err.message);
        this.loading.set(false);
      }
    });
  }

  applyFilters() {
    let filtered = this.cards();
    
    // Aplicar filtros de busca
    if (this.searchName()) {
      filtered = filtered.filter(card => 
        card.name.toLowerCase().includes(this.searchName().toLowerCase())
      );
    }
    
    if (this.searchSet()) {
      filtered = filtered.filter(card => 
        card.set.toLowerCase().includes(this.searchSet().toLowerCase())
      );
    }
    
    if (this.searchCollectorNumber()) {
      filtered = filtered.filter(card => 
        card.collector_number.includes(this.searchCollectorNumber())
      );
    }
    
    // Aplicar ordenação
    filtered = filtered.sort((a, b) => {
      let valueA: any, valueB: any;
      
      switch (this.sortBy()) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'set':
          valueA = a.set.toLowerCase();
          valueB = b.set.toLowerCase();
          break;
        case 'price':
          valueA = a.last_price || 0;
          valueB = b.last_price || 0;
          break;
        case 'date':
          valueA = new Date(a.last_update);
          valueB = new Date(b.last_update);
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }
      
      if (this.sortDirection() === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
    
    this.filteredCards.set(filtered);
  }

  onSearchChange() {
    this.applyFilters();
  }

  onSortChange(sortBy: 'name' | 'set' | 'price' | 'date') {
    if (this.sortBy() === sortBy) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(sortBy);
      this.sortDirection.set('asc');
    }
    this.applyFilters();
  }

  deleteCard(id: number) {
    if (confirm('Tem certeza que deseja excluir esta carta?')) {
      this.cardService.deleteCard(id).subscribe({
        next: () => {
          this.loadCards(); // Recarregar a lista
        },
        error: (err) => {
          this.error.set('Erro ao excluir carta: ' + err.message);
        }
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPriceChangeClass(change: number): string {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  }

  getPriceChangeIcon(change: number): string {
    if (change > 0) return '📈';
    if (change < 0) return '📉';
    return '➖';
  }

  // Função para calcular valor absoluto (pode ser usada no template)
  abs(value: number): number {
    return Math.abs(value);
  }
}
