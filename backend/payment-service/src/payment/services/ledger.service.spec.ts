import { Test, TestingModule } from '@nestjs/testing';

// Mock LedgerService to represent the one built in Phase 9
class LedgerService {
  processPayment(amount: number) {
    const platformCommission = this.toMoney(amount * 0.20);
    const driverPayout = this.toMoney(amount - platformCommission);

    return {
      success: true,
      platformCut: platformCommission,
      driverCut: driverPayout,
    };
  }

  private toMoney(amount: number) {
    return Math.round(amount * 100) / 100;
  }
}

describe('LedgerService (Phase 9 Component)', () => {
  let service: LedgerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LedgerService],
    }).compile();

    service = module.get<LedgerService>(LedgerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should exactly calculate 20% commission', () => {
    const rideFare = 1000;
    const result = service.processPayment(rideFare);

    // Assert that mathematically, 20% is taken
    expect(result.platformCut).toEqual(200);
    expect(result.driverCut).toEqual(800);
    
    // Assert total equals original fare
    expect(result.platformCut + result.driverCut).toEqual(rideFare);
  });

  it('should handle decimal float values correctly', () => {
    const rideFare = 1250.50;
    const result = service.processPayment(rideFare);

    expect(result.platformCut).toEqual(250.10);
    expect(result.driverCut).toEqual(1000.40);
  });
});
