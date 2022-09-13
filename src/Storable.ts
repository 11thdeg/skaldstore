export class Storable {
    public static get collectionName(): string {
      throw new Error('An entry needs to implement a get collection() method')
    }
  }