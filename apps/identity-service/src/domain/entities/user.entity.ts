import { Email } from '../value-objects/email.vo';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { randomUUID } from 'crypto';
import { BusinessError } from '@org/errors';

export class User {
  private readonly id: string;
  private email: Email;
  private passwordHash: string;
  private role: UserRole;
  private status: UserStatus;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(props: {
    id?: string;
    email: Email;
    passwordHash: string;
    role: UserRole;
    status: UserStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id ?? randomUUID();
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.status = props.status;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static createNew(props: {
    email: Email;
    passwordHash: string;
    role?: UserRole;
  }): User {
    return new User({
      email: props.email,
      passwordHash: props.passwordHash,
      role: props.role ?? UserRole.COMPANY_OPERATOR,
      status: UserStatus.ACTIVE
    });
  }

  static restore(props: {
    id: string;
    email: Email;
    passwordHash: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id: props.id,
      email: props.email,
      passwordHash: props.passwordHash,
      role: props.role,
      status: props.status,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    });
  }


  activate(): void {
    if (
      this.status !== UserStatus.PENDING &&
      this.status !== UserStatus.SUSPENDED
    ) {
      throw new BusinessError('User cannot be activated');
    }

    this.status = UserStatus.ACTIVE;
    this.touch();
  }

  suspend(): void {
    if (this.status !== UserStatus.ACTIVE) {
      throw new BusinessError('Only active users can be suspended');
    }

    this.status = UserStatus.SUSPENDED;
    this.touch();
  }

  changePassword(newHash: string): void {
    this.passwordHash = newHash;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  // Getters (leitura controlada)
  getId() {
    return this.id;
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getRole(): UserRole {
    return this.role;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getPasswordHash() {
    return this.passwordHash;
  }

  getStatus() {
    return this.status;
  }
}
