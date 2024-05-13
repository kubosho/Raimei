import MockDate from 'mockdate';

const mockDate = new Date('2024-01-01T00:00:00Z');

export function setMockDate(): void {
  MockDate.set(mockDate);
}

export function resetMockDate(): void {
  MockDate.reset();
}
