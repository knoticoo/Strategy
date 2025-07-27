import axios from 'axios';

export interface RevolutAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'current' | 'savings';
}

export interface RevolutTransaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  category: string;
  type: 'debit' | 'credit';
  merchantName?: string;
}

export interface RevolutAuth {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class RevolutService {
  private baseURL = 'https://api.revolut.com';
  private clientId = process.env.REACT_APP_REVOLUT_CLIENT_ID;
  private clientSecret = process.env.REACT_APP_REVOLUT_CLIENT_SECRET;
  private accessToken: string | null = null;

  /**
   * Initialize OAuth flow for Revolut
   * In a real app, this would redirect to Revolut's authorization server
   */
  initiateOAuth(): string {
    const redirectUri = encodeURIComponent(window.location.origin + '/revolut-callback');
    const scopes = encodeURIComponent('READ');
    const state = Math.random().toString(36).substring(7);
    
    // Store state for verification
    localStorage.setItem('revolut_oauth_state', state);
    
    return `https://business.revolut.com/authorize?client_id=${this.clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&state=${state}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, state: string): Promise<RevolutAuth> {
    const storedState = localStorage.getItem('revolut_oauth_state');
    
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    try {
      // In a real app, this should be done on the backend for security
      const response = await axios.post(`${this.baseURL}/auth/token`, {
        grant_type: 'authorization_code',
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      });

      const auth: RevolutAuth = response.data;
      this.accessToken = auth.accessToken;
      
      // Store tokens securely (in a real app, consider using secure storage)
      localStorage.setItem('revolut_access_token', auth.accessToken);
      localStorage.setItem('revolut_refresh_token', auth.refreshToken);
      
      return auth;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to authenticate with Revolut');
    }
  }

  /**
   * Mock function to simulate getting Revolut accounts
   * In a real implementation, this would call the actual Revolut API
   */
  async getAccounts(): Promise<RevolutAccount[]> {
    // Check if we have an access token
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('revolut_access_token');
    }

    if (!this.accessToken) {
      throw new Error('Not authenticated with Revolut');
    }

    try {
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - in real app, this would come from Revolut API
      const mockAccounts: RevolutAccount[] = [
        {
          id: 'acc_1',
          name: 'Main Account',
          balance: 2145.67,
          currency: 'EUR',
          type: 'current'
        },
        {
          id: 'acc_2',
          name: 'Savings',
          balance: 5420.30,
          currency: 'EUR',
          type: 'savings'
        }
      ];

      return mockAccounts;

      // Real implementation would look like:
      // const response = await axios.get(`${this.baseURL}/accounts`, {
      //   headers: {
      //     'Authorization': `Bearer ${this.accessToken}`,
      //   },
      // });
      // return response.data;

    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch Revolut accounts');
    }
  }

  /**
   * Get transactions for a specific account
   */
  async getTransactions(accountId: string, fromDate?: string, toDate?: string): Promise<RevolutTransaction[]> {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('revolut_access_token');
    }

    if (!this.accessToken) {
      throw new Error('Not authenticated with Revolut');
    }

    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock transaction data
      const mockTransactions: RevolutTransaction[] = [
        {
          id: 'txn_1',
          amount: -45.60,
          currency: 'EUR',
          description: 'Grocery Store Purchase',
          date: '2024-01-15T10:30:00Z',
          category: 'Food',
          type: 'debit',
          merchantName: 'Rimi Supermarket'
        },
        {
          id: 'txn_2',
          amount: -12.50,
          currency: 'EUR',
          description: 'Coffee Shop',
          date: '2024-01-15T08:15:00Z',
          category: 'Food',
          type: 'debit',
          merchantName: 'Starbucks'
        },
        {
          id: 'txn_3',
          amount: 2800.00,
          currency: 'EUR',
          description: 'Salary Transfer',
          date: '2024-01-01T09:00:00Z',
          category: 'Income',
          type: 'credit'
        },
        {
          id: 'txn_4',
          amount: -850.00,
          currency: 'EUR',
          description: 'Rent Payment',
          date: '2024-01-01T12:00:00Z',
          category: 'Housing',
          type: 'debit',
          merchantName: 'Real Estate Company'
        }
      ];

      return mockTransactions;

      // Real implementation:
      // const params = new URLSearchParams();
      // if (fromDate) params.append('from', fromDate);
      // if (toDate) params.append('to', toDate);
      
      // const response = await axios.get(`${this.baseURL}/accounts/${accountId}/transactions?${params}`, {
      //   headers: {
      //     'Authorization': `Bearer ${this.accessToken}`,
      //   },
      // });
      // return response.data;

    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch Revolut transactions');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!(this.accessToken || localStorage.getItem('revolut_access_token'));
  }

  /**
   * Logout and clear tokens
   */
  logout(): void {
    this.accessToken = null;
    localStorage.removeItem('revolut_access_token');
    localStorage.removeItem('revolut_refresh_token');
    localStorage.removeItem('revolut_oauth_state');
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<RevolutAuth> {
    const refreshToken = localStorage.getItem('revolut_refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${this.baseURL}/auth/token`, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      });

      const auth: RevolutAuth = response.data;
      this.accessToken = auth.accessToken;
      
      localStorage.setItem('revolut_access_token', auth.accessToken);
      localStorage.setItem('revolut_refresh_token', auth.refreshToken);
      
      return auth;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout(); // Clear invalid tokens
      throw new Error('Failed to refresh Revolut token');
    }
  }
}

export const revolutService = new RevolutService();