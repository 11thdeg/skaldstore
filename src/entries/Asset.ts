import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'

/**
 * A Public Profile of a user.
 */
export class Asset extends Entry {
  url: string | undefined
  description = ''
  _license = ''
  site: string | undefined
  name = ''
  mimetype?: string
  storagePath: string | undefined

  constructor(asset?: DocumentData, key?: string) {
    super(asset, key)
    if (asset) {
      this.docData = asset
    }
  }

  get license(): string {
    return this._license
  }
  set license(license: string | number | undefined) {
    if (typeof license === 'number') {
      this.license = license.toString()
    } else {
      this._license = license || ''
    }
  }

  get docData(): DocumentData {
    const data = super.docData
    if (this.url) data.url = this.url
    data.description = this.description
    if (this.license) data.license = this.license
    if (this.site) data.site = this.site
    data.name = this.name
    data.mimetype = this.mimetype
    if (this.storagePath) data.storagePath = this.storagePath
    return data
  }

  set docData(data: DocumentData) {
    super.docData = data
    this.url = data.url || undefined
    this.description = data.description || ''
    this.license = data.license || ''
    this.site = data.site || undefined
    this.name = data.name || ''
    this.mimetype = data.mimetype || ''
    this.storagePath = data.storagePath || undefined
  }
  public static get collectionName(): string {
    return 'assets'
  }
}
