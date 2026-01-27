import { Email } from '../value-objects/email.vo';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = Email.check('user@test.com');
    expect(email.getValue()).toBe('user@test.com');
  });

  it('should throw error for invalid email', () => {
    expect(() => {
      Email.check('invalid-email');
    }).toThrow('Invalid email format');
  });
});
