import { DocumentData } from '@firebase/firestore'
import { Entry, Site } from '..'
import type { Timestamp } from '@firebase/firestore-types'

interface HistoryEntry {
  createdAt: Timestamp
  author: string
  markdownContent: string
}

export class Page extends Entry {
  public parentKey: string = ''
  public name: string = ''
  public markdownContent: string = ''
  public htmlContent: string = ''
  public category: string = ''
  public sortWeight: number = 0
  private _seenCount: number = 0
  private _revisionHistory: HistoryEntry[] = []

  constructor(data?: DocumentData, key?: string, parentkKey?: string) {
    super(data, key)
    this.parentKey = parentkKey || ''
    if (data) this.docData = data
  }

  static get collectionName(): string {
    return 'pages'
  }

  public get seenCount(): number {
    return this._seenCount
  }

  public get revisionHistory(): HistoryEntry[] {
    return [...this._revisionHistory]
  }

  /**
   * Saves a revision of the page. Should be called before updating the page content or authors.
   */
  public saveRevision() {
    if (!this.updatedAt)
      throw new Error(
        'Cannot save revision of a page without an updatedAt timestamp (as it does not have revisions yet)'
      )
    const revision = {
      createdAt: this.updatedAt,
      author: this.author,
      markdownContent: this.markdownContent
    }
    if (this._revisionHistory.length > 30) this._revisionHistory.shift()
    this._revisionHistory.push(revision)
  }

  get author(): string {
    if (typeof super.owners === 'string') return super.owners
    return super.owners[0]
  }

  public get docData(): DocumentData {
    const data = super.docData
    data.name = this.name
    if (this.markdownContent) data.markdownContent = this.markdownContent
    if (this.htmlContent) data.htmlContent = this.htmlContent
    if (this.category) data.category = this.category
    if (this._revisionHistory.length > 0) data.revisionHistory = this._revisionHistory
    data.sortWeight = this.sortWeight || 0
    return data
  }
  public set docData(data: DocumentData) {
    super.docData = data
    this.name = data.name || ''
    this.markdownContent = data.markdownContent || ''
    this.htmlContent = data.htmlContent || ''
    this.category = data.category || ''
    this._seenCount = data.seenCount || 0
    this._revisionHistory = data.revisionHistory || []
    this.sortWeight = data.sortWeight || 0
  }

  public getFirestorePath(): string[] {
    if (!this.parentKey) throw new Error('Cannot get Firestore path for a page without a parent key')
    return [Site.collectionName, this.parentKey, Page.collectionName, this.key]
  }
}
