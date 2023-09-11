import type { DocumentData } from '@firebase/firestore'
import { Entry, EntryType } from './Entry'

/**
 * Content entry type
 */
export interface ContentEntryType extends EntryType{
  title: string
  markdownContent: string
  htmlContent?: string
  public: boolean
  sticky: boolean
  tags: string[]
}

/**
 * Default fields for content entries
 * 
 * The htmlContent field is deprecated and included only for compatibility reasons
 */
export class ContentEntry extends Entry implements ContentEntryType{
  public title: string = ''
  public markdownContent: string = ''
  public htmlContent: string = ''
  public public: boolean = true // we need to set visibility to be able to query ir from firebase: thus by default we set it to true
  public sticky: boolean = false // if the thread is sticky
  public tags: string[] = [] // tags for the entry

  constructor(entry?: DocumentData, key?: string) {
    super(entry, key)
    if (entry) this.docData = entry
  }

  get docData(): DocumentData {
    const data = super.docData

    // Content
    data.title = this.title || '' 
    data.markdownContent = this.markdownContent || ''
    data.htmlContent = this.htmlContent || ''
    
    // Visibility
    data.sticky = this.sticky || false
    data.public = this.public || false
    
    // Tags
    this.tags && this.tags.length > 0 ? data.tags = this.tags : data.tags = []

    return data
  }

  set docData(data: DocumentData) {
    super.docData = data
    
    // Content
    this.title = data.title || ''
    this.markdownContent = data.markdownContent || ''
    this.htmlContent = data.htmlContent || ''

    // Visibility
    this.sticky = data.sticky || false
    this.public = data.public || false

    // Tags
    this.tags = data.tags || []
  }
}