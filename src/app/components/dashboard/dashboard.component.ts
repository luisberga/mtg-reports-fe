import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardService } from '../../services/card.service';
import { Card, PaginatedCardsResponse } from '../../models/card.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalCards = 0;
  foilCards = 0;
  uniqueSets = 0;
  totalValue = 0;
  isLoading = true;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load first page to get statistics - we'll need to load all cards for accurate stats
    // For now, let's use a large limit to get most cards in one request
    this.cardService.getCards(1, 100).subscribe({
      next: (response: PaginatedCardsResponse) => {
        this.calculateStats(response.cards);
        // Update total cards from API response
        this.totalCards = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cards:', error);
        this.isLoading = false;
      }
    });
  }

  private calculateStats(cards: Card[]): void {
    // Note: These stats are based on the sample loaded, not all cards
    // For accurate stats, we'd need to load all cards or get stats from backend
    this.foilCards = cards.filter(card => card.foil).length;
    this.uniqueSets = [...new Set(cards.map(card => card.set))].length;
    this.totalValue = cards.reduce((sum, card) => sum + (card.last_price || 0), 0);
  }
} 