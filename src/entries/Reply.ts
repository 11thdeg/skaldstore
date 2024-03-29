import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'

/**
 * A Reply to a Thread
 */
export class Reply extends Entry {
  public htmlContent = ''
  public markdownContent = ''
  public quoteRef: string | undefined
  public images: string[] | undefined
  public lovesCount = 0
  public threadKey = ''
  protected _lovers: string[] = []

  constructor(data?: DocumentData, key?: string, threadKey?: string) {
    super(data, key)
    if (data) this.docData = data
    if (threadKey) this.threadKey = threadKey
  }

  public get docData(): DocumentData {
    const data = super.docData
    data.author = this.author
    if (this.htmlContent) data.content = this.htmlContent
    if (this.markdownContent) data.markdownContent = this.markdownContent
    if (this.quoteRef) data.quoteRef = this.quoteRef
    if (this.images && this.images.length > 0) data.images = this.images
    return data
  }

  public set docData(data: DocumentData) {
    super.docData = data
    if (data.author && !data.owners) this._owners = [data.author] // Legacy replies support
    if (data.created) this._createdAt = data.created // Legacy replies support
    this.htmlContent = data.content || ''
    this.markdownContent = data.markdownContent || ''
    this.lovesCount = data.lovesCount || 0
    this._lovers = data.lovers || [] // We iterate over these in the class, so we need to have an empty array as default
    this.images = data.images // undefined is a valid value, thus no need to check if it exists
    this.quoteRef = data.quoteRef // undefined is a valid value, thus no need to check if it exists
  }

  public get lovers(): string[] {
    return [...this._lovers]
  }

  public get author(): string {
    return typeof this._owners === 'string' ? this._owners : this._owners[0]
  }
  public set author(a: string) {
    this._owners = [a]
  }

  /**
   * A Reply can only have an owner, overriding the default behaviour of an Entry
   */
  public get owners(): string | string[] {
    return typeof this._owners === 'string' ? this._owners : this._owners[0]
  }
  public set owners(o: string | string[]) {
    this._owners = typeof o === 'string' ? [o] : o
  }

  public isQuoting(): boolean {
    return !!this.quoteRef
  }

  public getFirestorePath(): string[] {
    const path = [
      'stream',
      this.threadKey,
      Reply.collectionName
    ]
    if (this.key) path.push(this.key)

    return path
  }

  public static get collectionName(): string {
    return 'comments'
  }
}
