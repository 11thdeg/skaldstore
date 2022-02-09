import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'

/**
 * A Public Profile of a user.
 */
export class Profile extends Entry {
  public nick = ''
  public avatarURL: string | undefined
  public bio = ''
  constructor(profile?: DocumentData) {
    super(profile)
    if (profile) {
      this.docData = profile
    }
  }
  get docData(): DocumentData {
    const data = super.docData
    data.nick = this.nick
    if (this.avatarURL) data.avatarURL = this.avatarURL
    if (this.bio) data.bio = this.bio
    return data
  }
  set docData(data: DocumentData) {
    super.docData = data
    this.nick = data.nick || ''
    this.avatarURL = data.avatarURL || data.photoURL || undefined // TODO: remove photoURL when it's deprecated
    this.bio = data.bio || ''
  }
}
