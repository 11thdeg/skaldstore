import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'

/**
 * A Public Profile of a user.
 */
export class Profile extends Entry {
  protected _nickname: string | undefined
  protected _avatarURL: string | undefined
  constructor(profile: string | DocumentData) {
    super(profile)
    if (typeof profile === 'string') {
      this._id = profile
    } else {
      this._id = profile.id || ''
      this.docData = profile
    }
  }
  get nickname(): string {
    return this._nickname || ''
  }
  get avatarURL(): string {
    return this._avatarURL || ''
  }
  get docData(): DocumentData {
    const data = super.docData
    data.nickname = this._nickname
    data.avatarURL = this.avatarURL
    return data
  }
  set docData(data: DocumentData) {
    super.docData = data
    this._nickname = data.nickname || ''
    this._avatarURL = data.avatarURL || ''
  }
}