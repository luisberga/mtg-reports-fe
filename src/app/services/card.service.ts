import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card, CreateCardRequest, UpdateCardRequest, BulkInsertResponse, PaginatedCardsResponse, ResponseCollectionStats, ResponsePaginatedCards } from '../models/card.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCards(page: number = 1, limit: number = 30): Observable<PaginatedCardsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<PaginatedCardsResponse>(`${this.baseUrl}/cards`, { params });
  }

  getCard(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.baseUrl}/card/${id}`);
  }

  getCollectionStats(): Observable<ResponseCollectionStats> {
    return this.http.get<ResponseCollectionStats>(`${this.baseUrl}/collection-stats`);
  }

  getCardHistory(id: string, page: number = 1, limit: number = 10): Observable<ResponsePaginatedCards> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<ResponsePaginatedCards>(`${this.baseUrl}/card-history/${id}`, { params });
  }

  createCard(card: CreateCardRequest): Observable<Card> {
    const payload = {
      name: card.name,
      set_name: card.set_name,
      collector_number: card.collector_number,
      foil: card.foil
    };
    return this.http.post<Card>(`${this.baseUrl}/card`, payload);
  }

  updateCard(id: number, updates: UpdateCardRequest): Observable<Card> {
    const payload = {
      name: updates.name
    };
    return this.http.patch<Card>(`${this.baseUrl}/card/${id}`, payload);
  }

  deleteCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/card/${id}`);
  }

  bulkUpload(file: File): Observable<BulkInsertResponse> {
    const formData = new FormData();
    formData.append('cards', file);
    return this.http.post<BulkInsertResponse>(`${this.baseUrl}/cards`, formData);
  }
} 