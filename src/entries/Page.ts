import { DocumentData } from '@firebase/firestore'
import { Entry } from '..'

export class Page extends Entry {
  public name: string = ''
  public markdownContent: string = ''
  public htmlContent: string = ''
  public category: string = ''
  private _seenCount: number = 0

  constructor(data?: DocumentData, key?: string) {
    super(data, key)
    if (data) this.docData = data
  }

  static get collectionName(): string {
    return 'pages'
  }

  public get seenCount(): number {
    return this._seenCount
  }
  public get docData(): DocumentData {
    const data = super.docData
    data.name = this.name
    if (this.markdownContent) data.markdownContent = this.markdownContent
    if (this.htmlContent) data.htmlContent = this.htmlContent
    if (this.category) data.category = this.category
    return data
  }
  public set docData(data: DocumentData) {
    super.docData = data
    this.name = data.name || ''
    this.markdownContent = data.markdownContent || ''
    this.htmlContent = data.htmlContent || ''
    this.category = data.category || ''
    this._seenCount = data.seenCount || 0
  }
}
