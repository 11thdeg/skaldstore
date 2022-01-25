import type { DocumentData } from '@firebase/firestore'
import { Entry } from '../Entry'

/**
 * A Public Profile of a user.
 */
export class Profile extends Entry {
  protected _nickname: string | undefined
  protected _avatarURL: string | undefined
  constructor(profile?: DocumentData) {
    super(profile)
    if ( profile ) {
      this.docData = profile
    }
  }
  get nickname(): string {
    return this._nickname || ''
  }
  set nickname (nickname: string) {
    if (!nickname || nickname.length < 4) throw new Error('A nickname must be at least 4 characters long')
    this._nickname = nickname
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