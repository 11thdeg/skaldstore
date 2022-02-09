import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'

/**
 * A Public Profile of a user.
 */
export class Profile extends Entry {
  public nick = ''
  public avatarURL: string | undefined
  public bio = ''
  private _uid = ''
  constructor(profile?: DocumentData, uid?: string) {
    super(profile, uid)
    if (profile) {
      this.docData = profile
    }
    if (uid) {
      this._uid = uid
      super.owners = uid
    }
  }
  get uid (): string {
    if (!this._uid) {
      if (typeof this.owners === 'string') return this.owners
      else return this.owners[0]
    }
    return this._uid
  }
  get docData(): DocumentData {
    const data = super.docData
    data.nick = this.nick
    if (this.avatarURL) data.avatarURL = this.avatarURL
    if (this.bio) data.bio = this.bio
    data.uid = this.uid
    return data
  }
  set docData(data: DocumentData) {
    super.docData = data
    this.nick = data.nick || ''
    this.avatarURL = data.avatarURL || data.photoURL || undefined // TODO: remove photoURL when it's deprecated
    this.bio = data.bio || ''
    this._uid = data.uid || this.owners[0] || ''
  }
}
