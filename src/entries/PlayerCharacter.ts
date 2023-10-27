import { DocumentData } from '@firebase/firestore'
import { Entry, EntryType } from '../Entry'

export type PlayerCharacterFeature = {
  name: string
  value?: number|string|boolean
}

export type PlayerCharacterType = {
  name: string
  siteKey: string
  description: string
  features: PlayerCharacterFeature[]
} & EntryType

export class PlayerCharacter extends Entry implements PlayerCharacterType {
  public name: string = ''
  public siteKey: string = ''
  public description: string = ''
  public features: PlayerCharacterFeature[] = []

  constructor(entry?: DocumentData, key?: string) {
    super(entry, key)
    if (entry) this.docData = entry
  }

  get docData(): DocumentData {
    const data = super.docData
    if (this.siteKey) data.site = this.siteKey
    data.name = this.name || ''
    data.description = this.description || ''
    data.features = this.features || []

    return data
  }
  set docData(data: DocumentData) {
    super.docData = data
    if (data.site) this.siteKey = data.site
    this.name = data.name || ''
    this.description = data.description || ''
    this.features = data.features || []
  }

  static get collectionName(): string {
    return 'characters'
  }

  public getFirestorePath(): string[] {
    return [PlayerCharacter.collectionName, this.key || '']
  }

}