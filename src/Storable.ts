import { DocumentData } from "firebase/firestore"

export class Storable {
    public static get collectionName(): string {
      throw new Error('A Storable needs to implement a get collection() method')
    }
    public key: string | undefined
    public get docData(): DocumentData {
      throw new Error('A Storable needs to implement a get docData() method')
    }
    public set docData(data: DocumentData) {
      throw new Error('A Storable needs to implement a set docData() method')
    }
  }