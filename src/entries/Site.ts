import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'

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
export class Site extends Entry {
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
    if (this.hidden) data.hidden = this.hidden
    if (this.pageCategories && this.pageCategories.length > 0) data.pageCategories = this.pageCategories
    if (this.players && this.players.length > 0) data.players = this.players
    if (this.posterURL) data.posterURL = this.posterURL
    if (this.avatarURL) data.avatarURL = this.avatarURL
    if (this.links && this.links.length > 0) data.links = this.links
    return data
  }
  set docData(data: DocumentData) {
    super.docData = data
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

    // Legacy data interop
    if (!this._createdAt) this._createdAt = data.lastUpdate
    if (!this._updatedAt) this._updatedAt = data.lastUpdate
  }
  get members(): string[] {
    const owners = this._owners
    return [...owners, ...this.players]
  }
  static get collectionName () {
    return 'sites'
  }
}
