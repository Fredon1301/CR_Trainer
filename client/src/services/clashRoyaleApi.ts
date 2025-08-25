import { apiRequest } from '@/lib/queryClient';

export interface ClanSearchParams {
  name?: string;
  locationId?: string;
  minMembers?: string;
  maxMembers?: string;
  minScore?: string;
}

export interface TournamentSearchParams {
  name?: string;
}

export class ClashRoyaleApiService {
  static async searchClans(params: ClanSearchParams) {
    const searchParams = new URLSearchParams();
    
    if (params.name) searchParams.append('name', params.name);
    if (params.locationId) searchParams.append('locationId', params.locationId);
    if (params.minMembers) searchParams.append('minMembers', params.minMembers);
    if (params.maxMembers) searchParams.append('maxMembers', params.maxMembers);
    if (params.minScore) searchParams.append('minScore', params.minScore);

    const response = await apiRequest('GET', `/api/clash-royale/clans/search?${searchParams.toString()}`);
    return await response.json();
  }

  static async getClanById(clanTag: string) {
    const encodedTag = encodeURIComponent(clanTag);
    const response = await apiRequest('GET', `/api/clash-royale/clans/${encodedTag}`);
    return await response.json();
  }

  static async getClanMembers(clanTag: string) {
    const encodedTag = encodeURIComponent(clanTag);
    const response = await apiRequest('GET', `/api/clash-royale/clans/${encodedTag}/members`);
    return await response.json();
  }

  static async getClanWarLog(clanTag: string) {
    const encodedTag = encodeURIComponent(clanTag);
    const response = await apiRequest('GET', `/api/clash-royale/clans/${encodedTag}/warlog`);
    return await response.json();
  }

  static async getPlayerById(playerTag: string) {
    const encodedTag = encodeURIComponent(playerTag);
    const response = await apiRequest('GET', `/api/clash-royale/players/${encodedTag}`);
    return await response.json();
  }

  static async getPlayerBattleLog(playerTag: string) {
    const encodedTag = encodeURIComponent(playerTag);
    const response = await apiRequest('GET', `/api/clash-royale/players/${encodedTag}/battlelog`);
    return await response.json();
  }

  static async getPlayerUpcomingChests(playerTag: string) {
    const encodedTag = encodeURIComponent(playerTag);
    const response = await apiRequest('GET', `/api/clash-royale/players/${encodedTag}/upcomingchests`);
    return await response.json();
  }

  static async searchTournaments(params: TournamentSearchParams) {
    const searchParams = new URLSearchParams();
    
    if (params.name) searchParams.append('name', params.name);

    const response = await apiRequest('GET', `/api/clash-royale/tournaments?${searchParams.toString()}`);
    return await response.json();
  }

  static async getTournamentById(tournamentTag: string) {
    const encodedTag = encodeURIComponent(tournamentTag);
    const response = await apiRequest('GET', `/api/clash-royale/tournaments/${encodedTag}`);
    return await response.json();
  }

  static async getCards() {
    const response = await apiRequest('GET', '/api/clash-royale/cards');
    return await response.json();
  }
}
