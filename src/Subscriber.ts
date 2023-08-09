import { DocumentData, FieldValue, serverTimestamp, Timestamp } from 'firebase/firestore'
import { Storable } from './Storable'

export class Subscriber extends Storable {
  public static readonly FIRESTORE_COLLECTION_NAME = 'subscriptions'

  public static get collectionName(): string {
    return Subscriber.FIRESTORE_COLLECTION_NAME
  }

  public key: string
  private _watched = new Map<string, number>()
  private _muted: string[] = []
  public allSeenAt: number = 0
  private _seenEntities: Record<string, number> = {}
  public messagingTokens: string[] = []

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

    if (this.allSeenAt) data.allSeenAt = this.allSeenAt
    else data.allSeenAt = 0

    if (this._seenEntities) data.seenEntities = this._seenEntities

    if (this.messagingTokens.length > 0) data.messagingTokens = this.messagingTokens

    return data
  }

  /**
   * Hydrates the Entry from a plain object, as retrieved from Firebase.
   */
  set docData(data: DocumentData) {
    if (data.uid !== this.key) throw new Error('The key of the Subscriber does not match the data')
    if (data.watched) this._watched = new Map(Object.entries(data.watched))
    if (data.muted) this._muted = data.muted
    if (data.allSeenAt) this.allSeenAt = data.allSeenAt as number
    if (data.seenEntities) this._seenEntities = data.seenEntities as Record<string, number>
    if (data.messagingTokens) this.messagingTokens = data.messagingTokens as string[]
  }

  addWatch(target: string, atFlowTime: number) {
    // Remove from muted
    if (this._muted.includes(target)) this._muted.splice(this._muted.indexOf(target), 1)
    // Add to watched, if exists, update timestamp
    this._watched.set(target, atFlowTime)
  }

  removeWatch(target: string) {
    // Remove from watched
    if (this._watched.has(target)) this._watched.delete(target)
  }

  addMute(target: string) {
    // Remove from watched
    if (this._watched.has(target)) this._watched.delete(target)
    // Add to muted
    if (!this._muted.includes(target)) this._muted.push(target)
  }

  removeMute(target: string) {
    // Remove from muted
    if (this._muted.includes(target)) this._muted.splice(this._muted.indexOf(target), 1)
  }

  watches(target: string): number {
    if (this._watched.has(target)) {
      return this._watched.get(target) || 0
    }
    return 0
  }

  hasMuted(target: string) {
    return this._muted.includes(target)
  }

  isNew(target: string, flowTime: number) {
    if (this.hasMuted(target)) return false
    if (this.allSeenAt >= flowTime) return false
    const item = this._seenEntities[target]
    if (!item) return false
    return item < flowTime
  }

  markSeen(target: string, flowTime: number) {
    this._seenEntities[target] = flowTime
  }

  shouldNotify(target: string, flowTime: number) {
    if (this.hasMuted(target)) return false
    if (this.allSeenAt >= flowTime) return false
    const lastSeenAtFlowTime = this._watched.get(target)
    if (!lastSeenAtFlowTime) return false
    return lastSeenAtFlowTime < flowTime
  }

  addMessagingToken(token: string) {
    if (!this.messagingTokens.includes(token)) this.messagingTokens.push(token)
  }

  removeMessagingToken(token: string) {
    if (this.messagingTokens.includes(token)) this.messagingTokens.splice(this.messagingTokens.indexOf(token), 1)
  }

  public getFirestorePath(): string[] {
    return [Subscriber.FIRESTORE_COLLECTION_NAME, this.key]
  }
}
