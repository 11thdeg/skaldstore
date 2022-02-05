import { DocumentData } from '@firebase/firestore'
import { Entry } from '..'

export const THEAD_SYNDICATE = 1
export const THREAD_YOUTUBE = 2
export const THREAD_ASSETS = 3

export class Thread extends Entry {
  public title: string = ''
  public htmlContent: string = ''
  public markdownContent: string = ''
  public siteid: string | undefined = undefined // the site id of the thread, if the thread is linked to a site
  public topicid: string | undefined = undefined // the topic id of the thread, if the thread is linked to a topic
  public youtubeId: string | undefined = undefined
  public syndicateURL: string | undefined = undefined
  public assets: Map<string, string> = new Map()
  private _replyCount: number = 0
  private _lovedCount: number = 0
  private _followerCount: number = 0
  public public: boolean = true // we need to set visibility to be able to query ir from firebase: thus by default we set it to true

  constructor(thread?: DocumentData, key?: string) {
    super(thread, key)
    if (thread) this.docData = thread
  }

  get docData(): DocumentData {
    const data = super.docData
    data.title = this.title
    data.author = this.author // Regression: author field is used on Pelilauta 13 and below, replace it with owners [0]
    if (this.htmlContent) data.content = this.htmlContent // Regression: content field is used on Pelilauta 13 and below
    if (this.markdownContent) data.markdownContent = this.markdownContent
    if (this.siteid) data.site = this.siteid
    if (this.topicid) data.topic = this.topicid
    data.public = this.public

    // Convert Assets Map to an array
    if (this.assets.size > 0) {
      const assets = []
      for (const [key, value] of this.assets) {
        assets.push([key, value])
      }
      data.assets = assets
    }

    return data
  }

  set docData(data: DocumentData) {
    super.docData = data
    this.title = data.title

    // Regression: author field is used on Pelilauta 13 and below, replace it with owners [0]
    if (data.author && !data.owners) this.author = data.author

    this.htmlContent = data.content || ''
    this.markdownContent = data.markdownContent || ''
    this._followerCount = data.seenCount || 0
    this._lovedCount = data.lovedCount || 0
    this._replyCount = data.replyCount || 0
    if (data.public === false) this.public = false // in case of empty, etc, we set it to true
    else this.public = true
    if (data.site) this.siteid = data.site
    if (data.topic) this.topicid = data.topic
    if (data.assets) this.assets = new Map(data.assets)
  }

  get replyCount(): number {
    return this._replyCount
  }

  get lovedCount(): number {
    return this._lovedCount
  }

  get followerCount(): number {
    return this._followerCount
  }

  get author(): string {
    if (typeof super.owners === 'string') return super.owners
    return super.owners[0]
  }

  set author(author: string) {
    super.owners = author
  }

  get threadType(): number {
    if (this.syndicateURL) return THEAD_SYNDICATE
    if (this.youtubeId) return THREAD_YOUTUBE
    if (this.assets) return THREAD_ASSETS
    return 0
  }
}
