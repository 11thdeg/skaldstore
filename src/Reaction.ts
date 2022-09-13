import { DocumentData, serverTimestamp, Timestamp } from "firebase/firestore"
import { Storable } from "./Storable"

export class Reaction extends Storable {
  public static readonly FIRESTORE_COLLECTION_NAME = 'reactions'

  // Types
  public static readonly TYPE_LOVE = 'love'
  public static readonly TYPE_UNLOVE = 'unlove'
  public static readonly TYPE_WATCH = 'watch'
  public static readonly TYPE_UNWATCH = 'unwatch'
  public static readonly TYPE_REPLY = 'reply'
  // Type validation
  private static validTypes = [
    Reaction.TYPE_LOVE,
    Reaction.TYPE_UNLOVE,
    Reaction.TYPE_WATCH,
    Reaction.TYPE_UNWATCH,
    Reaction.TYPE_REPLY
  ]

  private _key:string = ''
  public actor: string = ''
  public targetEntry: string = ''
  public targetKey: string = ''
  public targetActor: string = ''
  private _type: string = ''
  private _createdAt: Timestamp | undefined = undefined
  
  constructor (data?: DocumentData, key?: string) {
    super()
    if (data) this.docData = data
    if (key) this._key = key
  }

  get key(): string {
    return this._key
  }

  get createdAt(): Timestamp | null {
    return this._createdAt || null
  }

  get type(): string {
    return this._type
  }
  set type(type:string) {
    if (!Reaction.validTypes.includes(type)) throw new Error('Invalid reaction type')
    this._type = type
  }

  /**
   * Dries up the Entry to a plain object, storable to Firebase with automatic values for timestamps.
   */
   get docData(): DocumentData {
    const data = {} as DocumentData
    data.actor = this.actor
    data.targetEntry = this.targetEntry
    data.targetActor = this.targetActor
    data.type = this.type
    data.createdAt = this.createdAt || serverTimestamp()
    data.targetKey = this.targetKey
    return data
  }

  /**
   * Hydrates the Entry from a plain object, as retrieved from Firebase.
   */
  set docData(data: DocumentData) {
    this.actor = data.actor || ''
    this.targetEntry = data.targetEntry || ''
    this.targetActor = data.targetActor || ''
    this.type = data.type || ''
    this._createdAt = data.createdAt || undefined
    this.targetKey = data.targetKey || ''
  }

  public static get collectionName(): string {
    return Reaction.FIRESTORE_COLLECTION_NAME
  }
}