// Value Object: неизменяемые учетные данные сравниваются по значениям полей.
export class Credentials {
  constructor(readonly email: string, readonly password: string) {
    Object.freeze(this);
  }

  equals(other: Credentials): boolean {
    return this.email === other.email && this.password === other.password;
  }
}
