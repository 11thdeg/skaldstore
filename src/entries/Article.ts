import { Entry, EntryType } from "../Entry"
import type { DocumentData } from '@firebase/firestore'

export class Article extends Entry implements EntryType {

  public origin = ''
  public title = ''
  public content = ''
  public tags: string[] = []
  public releaseTime: number = 0
  
  constructor(data?: DocumentData, key?: string) {
    super(data, key)
    if (data) this.docData = data
  }

  get docData(): DocumentData {
    const data = super.docData
    data.origin = this.origin
    data.title = this.title
    data.content = this.content
    data.tags = this.tags
    data.releaseTime = this.releaseTime
    return data
  }

  set docData(data: DocumentData) {
    super.docData = data
    this.origin = data.origin || ''
    this.title = data.title || ''
    this.content = data.content || ''
    this.tags = data.tags || []
    this.releaseTime = data.releaseTime || 0
  }

  toJSON(): Record<string, unknown> {
    const data = super.toJSON()
    data.origin = this.origin
    data.title = this.title
    data.content = this.content
    data.tags = this.tags
    data.releaseTime = this.releaseTime
    return data
  }

  static get collectionName() {
    return 'articles'
  }
  public getFirestorePath(): string[] {
    return [Article.collectionName, this.key]
  }
}