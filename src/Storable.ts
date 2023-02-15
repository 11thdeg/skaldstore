import { DocumentData } from 'firebase/firestore'

/**
 * A Storable is a class that can be stored in Firestore.
 *
 * It has a collection name, a path to the document, and a DocumentData object.
 */
export class Storable {
  public key = ''

  public static get collectionName(): string {
    throw new Error('A Storable needs to implement a get collection() method')
  }
  /**
   * Returns the path to the document, as an array of strings.
   *
   * Usage: `doc(getfirestore(), ...getFirestorePath(), 'docKey')` or `collection(getfirestore(), ...getFirestorePath())`
   */
  public getFirestorePath(): string[] {
    throw new Error('A Storable needs to implement a getFirestorePath() method')
  }
  public get docData(): DocumentData {
    throw new Error('A Storable needs to implement a get docData() method')
  }
  public set docData(data: DocumentData) {
    throw new Error('A Storable needs to implement a set docData() method')
  }
}
