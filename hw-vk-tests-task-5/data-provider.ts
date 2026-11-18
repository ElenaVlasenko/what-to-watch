import { user } from './data';
import { Credentials } from './value-objects/credentials';

interface InvalidPasswordCase {
  readonly description: string;
  readonly credentials: Credentials;
}

// Data Provider: отделяет наборы данных авторизации от сценариев тестов.
export class AuthDataProvider {
  static validCredentials(): Credentials {
    return new Credentials(user.email, 'Student123');
  }

  static invalidPasswords(): readonly InvalidPasswordCase[] {
    return [
      { description: 'без цифр', credentials: new Credentials(user.email, 'letters') },
      { description: 'без букв', credentials: new Credentials(user.email, '123456') },
      { description: 'пустой', credentials: new Credentials(user.email, '') },
    ];
  }
}
