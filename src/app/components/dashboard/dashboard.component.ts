import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardService } from '../../services/card.service';
import { ResponseCollectionStats } from '../../models/card.model';

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
    this.cardService.getCollectionStats().subscribe({
      next: (stats: ResponseCollectionStats) => {
        this.totalCards = stats.total_cards;
        this.foilCards = stats.foil_cards;
        this.uniqueSets = stats.unique_sets;
        this.totalValue = stats.total_value;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading collection stats:', error);
        this.isLoading = false;
      }
    });
  }
} 