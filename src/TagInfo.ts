import { DocumentData } from 'firebase/firestore'
import { Storable } from './Storable'

export class TagInfo extends Storable {
  key: string
  entryPath: string[] = []
  entryTitle: string = ''
  tags: string[] = []

  // Note: key should be the same as a document ID of the Entry in Firestore
  constructor(key: string, data?: DocumentData) {
    super()
    if (!key) throw new Error('A key is required to construct a TagInfo')
    this.key = key
    if (data) this.docData = data
  }

  static get collectionName(): string {
    return 'tags'
  }

  getFirestorePath(): string[] {
    return ['tags', this.key]
  }

  get docData(): DocumentData {
    return {
      entryPath: this.entryPath,
      entryTitle: this.entryTitle,
      tags: this.tags
    }
  }

  set docData(data: DocumentData) {
    this.entryPath = data.entryPath || []
    this.entryTitle = data.entryTitle || ''
    this.tags = data.tags || []
  }
}