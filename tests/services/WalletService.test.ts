import { describe, it, expect } from 'vitest';
import { WalletService } from '@/services/WalletService';

describe('WalletService', () => {
  describe('getTransactionHistory', () => {
    it('should return an array of transactions', () => {
      const history = WalletService.getTransactionHistory();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThan(0);
    });

    it('should return transactions with correct structure', () => {
      const history = WalletService.getTransactionHistory();
      const transaction = history[0];
      
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('type');
      expect(transaction).toHaveProperty('amount');
      expect(transaction).toHaveProperty('date');
    });
  });

  describe('getBalanceDetails', () => {
    it('should calculate balance details correctly from gameData', () => {
      const gameData = {
        gameState: { plannerFunds: 10000 },
        businessData: { totalRevenue: 5000 }
      };
      
      const balanceDetails = WalletService.getBalanceDetails(gameData, 0);
      
      expect(balanceDetails.available).toBe(10000);
      expect(balanceDetails.monthlyIncome).toBe(5000);
      expect(balanceDetails.monthlyExpense).toBe(0);
    });

    it('should use appBalance when gameData is not provided', () => {
      const balanceDetails = WalletService.getBalanceDetails({}, 5000);
      
      expect(balanceDetails.available).toBe(5000);
      expect(balanceDetails.monthlyIncome).toBe(0);
    });
  });

  describe('formatAmount', () => {
    it('should format positive amount with + prefix', () => {
      expect(WalletService.formatAmount(1000)).toBe('+1000');
    });

    it('should format negative amount correctly', () => {
      expect(WalletService.formatAmount(-500)).toBe('-500');
    });

    it('should format zero amount correctly', () => {
      expect(WalletService.formatAmount(0)).toBe('+0');
    });
  });

  describe('getTransactionTypeClass', () => {
    it('should return positive for income type', () => {
      expect(WalletService.getTransactionTypeClass('收入')).toBe('positive');
    });

    it('should return negative for expense type', () => {
      expect(WalletService.getTransactionTypeClass('支出')).toBe('negative');
    });
  });

  describe('addTransaction', () => {
    it('should create a new transaction with correct structure', () => {
      const transaction = WalletService.addTransaction('收入', 1000);
      
      expect(transaction).toHaveProperty('id');
      expect(transaction.type).toBe('收入');
      expect(transaction.amount).toBe(1000);
      expect(transaction).toHaveProperty('date');
    });

    it('should create a transaction with current date', () => {
      const transaction = WalletService.addTransaction('收入', 1000);
      const now = new Date();
      const transactionDate = new Date(transaction.date);
      
      expect(transactionDate.getFullYear()).toBe(now.getFullYear());
      expect(transactionDate.getMonth()).toBe(now.getMonth());
      expect(transactionDate.getDate()).toBe(now.getDate());
    });
  });
});
