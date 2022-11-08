import { DocumentData } from '@firebase/firestore'
import { Entry } from '..'

export const THREAD_SYNDICATE = 1
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
  public images: string[] | undefined = undefined
  private _poster: string | undefined = undefined
  private _replyCount: number = 0
  private _lovedCount: number = 0
  private _followerCount: number = 0
  public public: boolean = true // we need to set visibility to be able to query ir from firebase: thus by default we set it to true
  public sticky: boolean = false // if the thread is sticky

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
    if (this.youtubeId) data.youtubeId = this.youtubeId
    if (this.poster) data.poster = this.poster
    if (this.images) data.images = this.images
    data.sticky = this.sticky
    data.public = this.public

    data.seenCount = this.followerCount // Heritage site overide
    // data.subscriberCount is handled by automation outside this entity
    return data
  }

  set docData(data: DocumentData) {
    super.docData = data
    this.title = data.title

    // Regression: author field is used on Pelilauta 13 and below, replace it with owners [0]
    if (data.author && !data.owners) this.author = data.author

    this.htmlContent = data.content || ''
    this.markdownContent = data.markdownContent || ''
    this._followerCount = data.subscriberCount || data.seenCount || 0
    this._lovedCount = data.lovedCount || 0
    this._replyCount = data.replyCount || 0
    if (data.public === false) this.public = false
    // in case of empty, etc, we set it to true
    else this.public = true
    if (data.site) this.siteid = data.site
    if (data.topic) this.topicid = data.topic
    if (data.images && Array.isArray(data.images)) this.images = data.images
    if (data.youtubeId) this.youtubeId = data.youtubeId
    if (data.poster) this.poster = data.poster
    this.sticky = data.sticky || false // [undefined/null/false] -> false
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

  get poster(): string | undefined {
    if (!this._poster && this.images && this.images.length > 0) return this.images[0]
    return this._poster
  }
  set poster(poster: string | undefined) {
    this._poster = poster
  }

  get threadType(): number {
    if (this.syndicateURL) return THREAD_SYNDICATE
    if (this.youtubeId) return THREAD_YOUTUBE
    if (this.images) return THREAD_ASSETS
    return 0
  }

  static get collectionName(): string {
    return 'stream'
  }
}
