import { ContentEntry, ContentEntryType } from "../ContentEntry"
import type { DocumentData } from '@firebase/firestore'

export class Article extends ContentEntry implements ContentEntryType {

  // Article specific fields (not inherited from ContentEntry, or Entry)
  public origin = ''
  public publicationTime: number = 0
  authorName: string = ''
  
  constructor(data?: DocumentData, key?: string) {
    super(data, key)
    if (data) this.docData = data
  }

  get docData(): DocumentData {
    const data = super.docData
    
    data.origin = this.origin || ''
    data.publicationTime = this.publicationTime || 0
    data.authorName = this.authorName || ''

    return data
  }

  set docData(data: DocumentData) {
    super.docData = data

    this.origin = data.origin || ''
    this.publicationTime = data.publicationTime || 0
    this.authorName = data.authorName || ''
  }

  toJSON(): Record<string, unknown> {
    const data = super.toJSON()

    data.origin = this.origin || ''
    data.publicationTime = this.publicationTime || 0

    return data
  }

  static get collectionName() {
    return 'articles'
  }

  public getFirestorePath(): string[] {
    return [Article.collectionName, this.key]
  }
}