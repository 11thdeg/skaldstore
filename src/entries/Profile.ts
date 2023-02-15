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
  private lovedThreads: string[] = []
  protected _watchThreads = new Map<string, number>()

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
  get uid(): string {
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
    if (this.uid) data.uid = this.uid
    if (this.lovedThreads.length) data.lovedThreads = this.lovedThreads
    if (this._watchThreads.size) data.watchThreads = Object.fromEntries(this._watchThreads)
    return data
  }
  set docData(data: DocumentData) {
    super.docData = data
    this.nick = data.nick || ''
    this.avatarURL = data.avatarURL || data.photoURL || undefined // TODO: remove photoURL when it's deprecated
    this.bio = data.bio || ''
    this._uid = data.uid || this.owners[0] || ''
    this.lovedThreads = data.lovedThreads || []
    this._watchThreads = new Map(Object.entries(data.watchThreads || {}))
  }

  loves(key: string): boolean {
    return this.lovedThreads.includes(key) // || this.lovedPages.includes(key) f.ex.: add pages later?
  }

  seenThreadAt(key: string): number {
    return this._watchThreads.get(key) || 0
  }

  watchThreadAt(key: string, flowTime: number): void {
    this._watchThreads.set(key, flowTime)
  }

  unWatchThread(key: string): void {
    this._watchThreads.delete(key)
  }

  /**
   * Threads that the user is watching. Do note that this is not the same as the threads that the user has loved.
   *
   * @returns {string[]} Containing the keys of the threads that the user is watching.
   */
  get watchThreads(): string[] {
    return Array.from(this._watchThreads.keys())
  }

  public static get collectionName(): string {
    return 'profiles'
  }
}
