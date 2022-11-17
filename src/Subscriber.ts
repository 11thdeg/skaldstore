import { DocumentData, FieldValue, serverTimestamp, Timestamp } from "firebase/firestore"
import { Storable } from "./Storable"

export class Subscriber extends Storable {
  public static readonly FIRESTORE_COLLECTION_NAME = 'subscriptions'

  public static get collectionName(): string {
    return Subscriber.FIRESTORE_COLLECTION_NAME
  }

  public key: string
  private _watched = new Map<string, FieldValue>()
  private _muted: string[] = []
  private _allSeenAt: FieldValue | undefined

  constructor(key: string, data?: DocumentData) {
    super()
    if (!key) throw new Error('A key is required to construct a Subscriber')
    this.key = key
    if (data) this.docData = data
  }

  /**
   * Dries up the Entry to a plain object, storable to Firebase with automatic values for timestamps.
   */
  get docData(): DocumentData {
    const data = {} as DocumentData
    data.uid = this.key

    const watched = Object.fromEntries(this._watched)
    if (Object.keys(watched).length > 0) data.watched = watched

    if (this._muted.length > 0) data.muted = this._muted

    if (this._allSeenAt) data.allSeenAt = this._allSeenAt
    else data.allSeenAt = serverTimestamp()
    
    return data
  }

  /**
   * Hydrates the Entry from a plain object, as retrieved from Firebase.
   */
  set docData(data: DocumentData) {
    if (data.uid !== this.key) throw new Error('The key of the Subscriber does not match the data')
    if (data.watched) this._watched = new Map(Object.entries(data.watched))
    if (data.muted) this._muted = data.muted
    if (data.allSeenAt) this._allSeenAt = data.allSeenAt as Timestamp
  }

  get allSeenAt(): number {
    if (this._allSeenAt) {
      const ts = this._allSeenAt as Timestamp
      return typeof ts.toMillis === 'function' ? ts.toMillis() : 0
    } 
    return 0
  }

  addWatch (target: string) {
    // Remove from muted
    if (this._muted.includes(target)) this._muted.splice(this._muted.indexOf(target), 1)
    // Add to watched, if exists, update timestamp
    this._watched.set(target, serverTimestamp())
  }

  removeWatch (target: string) {
    // Remove from watched
    if (this._watched.has(target)) this._watched.delete(target)
  }

  addMute (target: string) {
    // Remove from watched
    if (this._watched.has(target)) this._watched.delete(target)
    // Add to muted
    if (!this._muted.includes(target)) this._muted.push(target)
  }

  removeMute (target: string) {
    // Remove from muted
    if (this._muted.includes(target)) this._muted.splice(this._muted.indexOf(target), 1)
  }

  watches (target: string) {
    if (this._watched.has(target)) {
      const ts = this._watched.get(target) as Timestamp
      return typeof ts.toMillis === 'function' ? ts.toMillis() : 1
    }
    return 0
  }

  hasMuted (target: string) {
    return this._muted.includes(target)
  }

  shouldNotify (target: string, flowTime: number) {
    if (this.hasMuted(target)) return false
    if (this.allSeenAt >= flowTime) return false
    const item = this._watched.get(target)
    if (!item) return false
    const ts = item as Timestamp
    return typeof ts.toMillis === 'function' ? ts.toMillis() < flowTime : false
  }

}