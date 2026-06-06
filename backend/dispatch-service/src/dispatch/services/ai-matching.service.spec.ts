import { Test, TestingModule } from '@nestjs/testing';
import { AiMatchingService } from './ai-matching.service';
import { QueueService } from './queue.service';

describe('AiMatchingService', () => {
  let service: AiMatchingService;
  let queueService: QueueService;

  beforeEach(async () => {
    // Mock the QueueService dependency
    const mockQueueService = {
      startWaterfallPing: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiMatchingService,
        { provide: QueueService, useValue: mockQueueService },
      ],
    }).compile();

    service = module.get<AiMatchingService>(AiMatchingService);
    queueService = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should prioritize a 4.9 rating driver over a closer 4.2 rating driver', async () => {
    // We are testing the hybrid logic here.
    // The AiMatchingService has a mockDriverDB in memory.
    // driver_1: 4.9 rating, driver_2: 4.2 rating.

    const mockDispatchDto = {
      rideId: 'RIDE_001',
      customerId: 'CUST_001',
      pickupLat: 6.5244,
      pickupLng: 3.3792,
    };

    await service.findBestDriver(mockDispatchDto);

    // The logic should sort driver_1 higher than driver_2
    expect(queueService.startWaterfallPing).toHaveBeenCalled();
    const mockCallArgs = (queueService.startWaterfallPing as jest.Mock).mock.calls[0];
    const orderedDriverIds = mockCallArgs[1]; // The second argument is the array of sorted drivers
    
    // Validate driver_1 comes before driver_2
    expect(orderedDriverIds.indexOf('driver_1')).toBeLessThan(orderedDriverIds.indexOf('driver_2'));
  });
});
