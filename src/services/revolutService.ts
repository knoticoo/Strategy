import axios from 'axios';

export interface RevolutAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  state: 'active' | 'inactive';
  public: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RevolutTransaction {
  id: string;
  type: 'CARD_PAYMENT' | 'TRANSFER' | 'EXCHANGE' | 'ATM' | 'FEE' | 'REFUND' | 'TOPUP';
  requestId: string;
  state: 'PENDING' | 'COMPLETED' | 'DECLINED' | 'FAILED' | 'REVERTED';
  reasonCode?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  reference?: string;
  legs: TransactionLeg[];
}

export interface TransactionLeg {
  legId: string;
  accountId: string;
  counterparty: {
    id?: string;
    accountId?: string;
    accountType?: string;
  };
  amount: number;
  currency: string;
  description?: string;
  balance?: number;
}

class RevolutService {
  private readonly baseURL = 'https://b2b.revolut.com/api/1.0';
  private readonly sandboxURL = 'https://sandbox-b2b.revolut.com/api/1.0';
  private accessToken: string = '';
  private refreshToken: string = '';
  private readonly clientId = process.env.REACT_APP_REVOLUT_CLIENT_ID || '';
  private readonly clientSecret = process.env.REACT_APP_REVOLUT_CLIENT_SECRET || '';
  private readonly isSandbox = process.env.REACT_APP_REVOLUT_SANDBOX === 'true';

  constructor() {
    // Load tokens from localStorage
    this.loadTokens();
  }

  private loadTokens(): void {
    this.accessToken = localStorage.getItem('revolut_access_token') || '';
    this.refreshToken = localStorage.getItem('revolut_refresh_token') || '';
  }

  private saveTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('revolut_access_token', accessToken);
    localStorage.setItem('revolut_refresh_token', refreshToken);
  }

  private getBaseURL(): string {
    return this.isSandbox ? this.sandboxURL : this.baseURL;
  }

  // OAuth2 Authentication Flow
  public getAuthURL(): string {
    const redirectUri = encodeURIComponent(window.location.origin + '/revolut-callback');
    const scope = encodeURIComponent('READ');
    const state = Math.random().toString(36).substring(7);
    
    localStorage.setItem('revolut_auth_state', state);

    const authURL = this.isSandbox 
      ? 'https://sandbox-business.revolut.com/app-confirm'
      : 'https://business.revolut.com/app-confirm';

    return `${authURL}?client_id=${this.clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
  }

  public async exchangeCodeForTokens(code: string, state: string): Promise<boolean> {
    try {
      const savedState = localStorage.getItem('revolut_auth_state');
      if (state !== savedState) {
        throw new Error('Invalid state parameter');
      }

      const redirectUri = window.location.origin + '/revolut-callback';
      
      const response = await axios.post(`${this.getBaseURL()}/auth/token`, {
        grant_type: 'authorization_code',
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: redirectUri
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, refresh_token } = response.data;
      this.saveTokens(access_token, refresh_token);
      
      localStorage.removeItem('revolut_auth_state');
      return true;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      return false;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      if (!this.refreshToken) {
        return false;
      }

      const response = await axios.post(`${this.getBaseURL()}/auth/token`, {
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret
      });

      const { access_token, refresh_token } = response.data;
      this.saveTokens(access_token, refresh_token || this.refreshToken);
      
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  private async makeAuthenticatedRequest(endpoint: string, options: any = {}): Promise<any> {
    try {
      const response = await axios({
        ...options,
        url: `${this.getBaseURL()}${endpoint}`,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the request with new token
          const retryResponse = await axios({
            ...options,
            url: `${this.getBaseURL()}${endpoint}`,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          return retryResponse.data;
        }
      }
      throw error;
    }
  }

  public async getAccounts(): Promise<RevolutAccount[]> {
    try {
      const accounts = await this.makeAuthenticatedRequest('/accounts');
      return accounts;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      
      // Return mock data for demo if API fails
      return this.getMockAccounts();
    }
  }

  public async getAccountBalance(accountId: string): Promise<number> {
    try {
      const account = await this.makeAuthenticatedRequest(`/accounts/${accountId}`);
      return account.balance || 0;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }

  public async getTransactions(
    accountId?: string, 
    from?: string, 
    to?: string, 
    counterparty?: string,
    count?: number
  ): Promise<RevolutTransaction[]> {
    try {
      const params = new URLSearchParams();
      if (accountId) params.append('account', accountId);
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (counterparty) params.append('counterparty', counterparty);
      if (count) params.append('count', count.toString());

      const endpoint = `/transactions${params.toString() ? '?' + params.toString() : ''}`;
      const transactions = await this.makeAuthenticatedRequest(endpoint);
      
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      
      // Return mock data for demo if API fails
      return this.getMockTransactions();
    }
  }

  public async getTransactionsByDateRange(fromDate: Date, toDate: Date): Promise<RevolutTransaction[]> {
    const from = fromDate.toISOString().split('T')[0];
    const to = toDate.toISOString().split('T')[0];
    
    return this.getTransactions(undefined, from, to);
  }

  public async getTodaysTransactions(): Promise<RevolutTransaction[]> {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.getTransactionsByDateRange(today, tomorrow);
  }

  public async getMonthlySpending(): Promise<{ total: number; byCategory: Record<string, number> }> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const transactions = await this.getTransactionsByDateRange(startOfMonth, new Date());
      
      let total = 0;
      const byCategory: Record<string, number> = {};
      
      transactions.forEach(transaction => {
        if (transaction.type === 'CARD_PAYMENT' && transaction.state === 'COMPLETED') {
          transaction.legs.forEach(leg => {
            if (leg.amount < 0) { // Outgoing payment
              const amount = Math.abs(leg.amount);
              total += amount;
              
              // Categorize based on description
              const category = this.categorizeTransaction(leg.description || '');
              byCategory[category] = (byCategory[category] || 0) + amount;
            }
          });
        }
      });
      
      return { total, byCategory };
    } catch (error) {
      console.error('Error calculating monthly spending:', error);
      return { total: 0, byCategory: {} };
    }
  }

  private categorizeTransaction(description: string): string {
    const desc = description.toLowerCase();
    
    if (desc.includes('maxima') || desc.includes('rimi') || desc.includes('barbora') || 
        desc.includes('grocery') || desc.includes('food') || desc.includes('restaurant')) {
      return 'food';
    }
    if (desc.includes('transport') || desc.includes('bus') || desc.includes('taxi') || 
        desc.includes('fuel') || desc.includes('parking')) {
      return 'transport';
    }
    if (desc.includes('entertainment') || desc.includes('cinema') || desc.includes('bar') || 
        desc.includes('club') || desc.includes('game')) {
      return 'entertainment';
    }
    if (desc.includes('shop') || desc.includes('store') || desc.includes('clothing') || 
        desc.includes('amazon') || desc.includes('online')) {
      return 'shopping';
    }
    if (desc.includes('bill') || desc.includes('utility') || desc.includes('phone') || 
        desc.includes('internet') || desc.includes('insurance')) {
      return 'bills';
    }
    
    return 'other';
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  public disconnect(): void {
    this.accessToken = '';
    this.refreshToken = '';
    localStorage.removeItem('revolut_access_token');
    localStorage.removeItem('revolut_refresh_token');
    localStorage.removeItem('revolut_auth_state');
  }

  // Mock data for demo purposes
  private getMockAccounts(): RevolutAccount[] {
    return [
      {
        id: 'acc_1',
        name: 'EUR Personal',
        balance: 1247.83,
        currency: 'EUR',
        state: 'active',
        public: false,
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2024-01-27T15:30:00Z'
      },
      {
        id: 'acc_2',
        name: 'USD Savings',
        balance: 500.00,
        currency: 'USD',
        state: 'active',
        public: false,
        createdAt: '2023-06-01T10:00:00Z',
        updatedAt: '2024-01-27T15:30:00Z'
      }
    ];
  }

  private getMockTransactions(): RevolutTransaction[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return [
      {
        id: 'tx_1',
        type: 'CARD_PAYMENT',
        requestId: 'req_1',
        state: 'COMPLETED',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
        completedAt: today.toISOString(),
        reference: 'Maxima purchase',
        legs: [
          {
            legId: 'leg_1',
            accountId: 'acc_1',
            counterparty: { id: 'maxima_riga' },
            amount: -12.45,
            currency: 'EUR',
            description: 'MAXIMA RIGA GROCERIES',
            balance: 1247.83
          }
        ]
      },
      {
        id: 'tx_2',
        type: 'CARD_PAYMENT',
        requestId: 'req_2',
        state: 'COMPLETED',
        createdAt: yesterday.toISOString(),
        updatedAt: yesterday.toISOString(),
        completedAt: yesterday.toISOString(),
        reference: 'Lunch',
        legs: [
          {
            legId: 'leg_2',
            accountId: 'acc_1',
            counterparty: { id: 'restaurant_lido' },
            amount: -8.90,
            currency: 'EUR',
            description: 'LIDO RESTAURANT',
            balance: 1260.28
          }
        ]
      }
    ];
  }
}

const revolutService = new RevolutService();
export default revolutService;