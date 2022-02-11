import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'

/**
 * A Reply to a Thread
 */
export class Reply extends Entry {

  public htmlContent = ''
  public markdownContent = ''
  public lovesCount = 0
  protected _lovers:Array<string> = []

  constructor(data?: DocumentData, key?: string) {
    super(data, key)
  }

  public get docData (): DocumentData {
    const data = super.docData
    data.author = this.owners[0]
    if (this.htmlContent) data.content = this.htmlContent
    if (this.markdownContent) data.markdownContent = this.markdownContent
    return data
  }

  public set docData (data: DocumentData) {
    super.docData = data
    if (data.author && !data.owners) this.owners = [data.author] // Legacy replies support
    this.htmlContent = data.htmlContent || ''
    this.markdownContent = data.markdownContent || ''
    this.lovesCount = data.lovesCount || 0
    this._lovers = data.lovers
  }

  public get lovers (): Array<string> {
    return [...this._lovers]
  }

  /** 
   * A Reply can only have an owner, overriding the default behaviour of an Entry
   * */
  public get owners(): string | string[] {
    return this._owners[0]
  }
  /**
   * A Reply can only have an owner, overriding the default behaviour of an Entry
   * */
  public set owners(owners: string | string[]) {
    this._owners = typeof owners === 'string' ? [owners] : [owners[0]]
  }
}