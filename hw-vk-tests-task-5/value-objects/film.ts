interface FilmData {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

// Value Object: страницы работают с объектом фильма, а не с отдельными id и названием.
export class Film {
  constructor(readonly id: string, readonly name: string, readonly description: string) {
    Object.freeze(this);
  }

  static from(data: FilmData): Film {
    return new Film(data.id, data.name, data.description);
  }

  get path(): string {
    return `/films/${this.id}`;
  }

  equals(other: Film): boolean {
    return this.id === other.id && this.name === other.name && this.description === other.description;
  }
}
