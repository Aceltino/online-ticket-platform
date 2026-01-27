import { BusinessError } from '@org/errors';

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  static check(email: string): Email {
    if (!this.isValid(email)) {
      throw new BusinessError('Invalid email format', 'INVALID_EMAIL');
    }
    return new Email(email.toLowerCase());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  private static isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
