import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'

/**
 * A Public Profile of a user.
 */
export class Asset extends Entry {
  url: string | undefined
  description: string
  license: number
  site: string | undefined
  name: string
  mimetype: string
  storagePath: string | undefined

  constructor(asset: string | DocumentData) {
    super(asset)
    if (typeof asset === 'string') {
      this.url = asset
      this.description = ''
      this.license = 0
      this.site = undefined
      this.name = asset
      this.mimetype = ''
    } else {
      this.url = asset.url || undefined
      this.description = asset.description || ''
      this.license = asset.license || 0
      this.site = asset.site || undefined
      this.name = asset.name || ''
      this.mimetype = asset.mimetype || ''
      this.storagePath = asset.storagePath || undefined
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
    this.license = data.license || 0
    this.site = data.site || undefined
    this.name = data.name || ''
    this.mimetype = data.mimetype || ''
    this.storagePath = data.storagePath || undefined
  }
}