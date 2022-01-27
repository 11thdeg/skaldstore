import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'

/**
 * A Public Profile of a user.
 */
export class Profile extends Entry {
  public nickname = ''
  public avatarURL: string | undefined
  constructor(profile?: DocumentData) {
    super(profile)
    if (profile) {
      this.docData = profile
    }
  }
  get docData(): DocumentData {
    const data = super.docData
    data.nickname = this.nickname
    if (this.avatarURL) data.avatarURL = this.avatarURL
    return data
  }
  set docData(data: DocumentData) {
    super.docData = data
    this.nickname = data.nickname || ''
    this.avatarURL = data.avatarURL || ''
  }
}
