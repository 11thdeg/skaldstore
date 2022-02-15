import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'

/**
 * A Site or a Game
 */
export class Site extends Entry {
  public name = ''
  public description = ''

  constructor(data?: DocumentData, key?: string) {
    super(data, key)
    if (data) this.docData = data
  }
  get docData() {
    const data = super.docData
    data.name = this.name || '---'
    if (this.description) data.description = this.description
    return data
  }
  set docData(data: DocumentData) {
    super.docData = data
    this.name = data.name || ''
    this.description = data.description || ''
  }
}
