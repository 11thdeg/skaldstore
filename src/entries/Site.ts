import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'
import { FirestoreEntry } from '../FirestoreEntry'

export interface PageCategory {
  slug: string
  name: string
}

export interface SiteLink {
  name: string
  url: string
  noun?: string
}

/**
 * A Site or a Game
 */
export class Site extends Entry implements FirestoreEntry {
  static get collectionName() {
    return 'sites'
  }

  static get SORT_BY_NAME () {
    return 'name'
  }
  static get SORT_BY_CREATED_AT () {
    return 'createdAt'
  }
  static get SORT_BY_FLOWTIME () {
    return 'flowTime'
  }
  static get SORT_BY_MANUAL () {
    return 'manual'
  }

  public name = ''
  public description = ''
  public systemBadge = ''
  public system = ''
  public hidden = false
  public pageCategories: PageCategory[] = []
  public players: string[] = []
  public posterURL = ''
  public avatarURL = ''
  public links: SiteLink[] = []
  public license: string = ''
  public lovesCount = 0
  protected _sortOrder: string = Site.SORT_BY_NAME
  public tags: string[] = []
  public customPageKeys = false
  public backgroundURL = ''
  public homepage = ''
  public backgroundSize = 'repeat'

  constructor(data?: DocumentData, key?: string) {
    super(data, key)
    if (data) this.docData = data
  }
  get docData() {
    const data = super.docData
    data.name = this.name || '---'
    if (this.description) data.description = this.description
    if (this.systemBadge) data.systemBadge = this.systemBadge
    if (this.system) data.system = this.system
    if (this.pageCategories && this.pageCategories.length > 0) data.pageCategories = this.pageCategories
    if (this.players && this.players.length > 0) data.players = this.players
    if (this.posterURL) data.posterURL = this.posterURL
    if (this.avatarURL) data.avatarURL = this.avatarURL
    if (this.links && this.links.length > 0) data.links = this.links
    if (this.license) data.license = this.license
    if (this.lovesCount) data.lovesCount = this.lovesCount
    if (this.sortOrder) data.sortOrder = this.sortOrder
    if (this.tags && this.tags.length > 0) data.tags = this.tags
    if (this.backgroundURL) data.backgroundURL = this.backgroundURL
    if (this.backgroundSize) data.backgroundSize = this.backgroundSize
    
    data.customPageKeys = this.customPageKeys || false

    data.hidden = this.hidden || false
    data.homepage = this.homepage
    return data
  }
  set docData(data: DocumentData) {
    super.docData = data

    // This should be moved to super
    if (!this.key && data.key) this.key = data.key

    this.name = data.name || ''
    this.description = data.description || ''
    this.systemBadge = data.systemBadge || ''
    this.system = data.system || ''
    this.hidden = data.hidden || false
    this.pageCategories = data.pageCategories || []
    this.players = data.players || []
    this.avatarURL = data.avatarURL || ''
    this.posterURL = data.posterURL || ''
    this.links = data.links || []
    this.homepage = data.homepage || ''
    this.license = data.license || ''
    this.lovesCount = data.lovesCount || 0
    this.sortOrder = data.sortOrder || Site.SORT_BY_NAME
    this.tags = data.tags || []
    this.backgroundURL = data.backgroundURL || ''
    if (this.backgroundURL) this.backgroundSize = data.backgroundSize || 'repeat'

    this.customPageKeys = data.customPageKeys || false

    // Legacy data interop
    if (!this._createdAt) this._createdAt = data.lastUpdate
    if (!this._updatedAt) this._updatedAt = data.lastUpdate
  }
  get members(): string[] {
    const owners = this._owners
    return [...owners, ...this.players]
  }

  get sortOrder() {
    return this._sortOrder
  }
  set sortOrder(order: string) {
    if ([
      Site.SORT_BY_NAME,
      Site.SORT_BY_CREATED_AT,
      Site.SORT_BY_FLOWTIME,
      Site.SORT_BY_MANUAL
    ].includes(order)) this._sortOrder = order
  }

  public getFirestorePath(): string[] {
    return [Site.collectionName, this.key]
  }

  toJSON(): DocumentData {
    const data = super.toJSON()
    
    if (this.name) data.name = this.name
    if (this.description) data.description = this.description
    if (this.systemBadge) data.systemBadge = this.systemBadge
    if (this.system) data.system = this.system
    if (this.pageCategories && this.pageCategories.length > 0) data.pageCategories = this.pageCategories
    if (this.players && this.players.length > 0) data.players = this.players
    if (this.links && this.links.length > 0) data.links = this.links
    if (this.license) data.license = this.license
    if (this.lovesCount) data.lovesCount = this.lovesCount
    if (this.sortOrder) data.sortOrder = this.sortOrder
    if (this.tags && this.tags.length > 0) data.tags = this.tags

    // Theming support
    if (this.backgroundURL) data.backgroundURL = this.backgroundURL
    if (this.posterURL) data.posterURL = this.posterURL
    if (this.avatarURL) data.avatarURL = this.avatarURL

    return data
  }

  static fromJSON(data: DocumentData, key?: string): Site {
    const entryKey = key || data.key
    if (!entryKey) throw new Error('Site.fromJSON: Missing entry.key')
    return new Site(data, entryKey)
  }
}
