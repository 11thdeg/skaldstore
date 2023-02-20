import { DocumentData, serverTimestamp, Timestamp } from 'firebase/firestore'
import { Profile } from './entries/Profile'
import { Reply } from './entries/Reply'
import { Site } from './entries/Site'
import { Storable } from './Storable'

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

  // Target Entries
  public static readonly TARGET_ENTRY_REPLY = Reply.collectionName
  public static readonly TARGET_ENTRY_SITE = Site.collectionName
  // Target Entry validation
  private static validTargetEntries = [
    Reaction.TARGET_ENTRY_SITE,
    Reaction.TARGET_ENTRY_REPLY
  ]

  public actor: string = ''
  private _targetEntry: string = ''
  public targetKey: string = ''
  public targetActor: string = ''
  private _type: string = ''
  private _createdAt: Timestamp | undefined = undefined

  constructor(data?: DocumentData, key?: string) {
    super()
    if (data) this.docData = data
    if (key) this.key = key
  }

  get createdAt(): Timestamp | null {
    return this._createdAt || null
  }

  get type(): string {
    return this._type
  }
  set type(type: string) {
    if (!Reaction.validTypes.includes(type))
      throw new Error('Invalid reaction type, valid types are: ' + Reaction.validTypes.join(','))
    this._type = type
  }

  get targetEntry(): string {
    return this._targetEntry
  }
  set targetEntry(targetEntry: string) {
    if (!Reaction.validTargetEntries.includes(targetEntry))
      throw new Error('Invalid target entry, valid types are: ' + Reaction.validTargetEntries.join(','))
    this._targetEntry = targetEntry
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

  /**
   * Please note, that reactions are stored in a subcollection of the target Entry
   *
   * @returns 'reactions'
   */
  public static get collectionName(): string {
    return Reaction.FIRESTORE_COLLECTION_NAME
  }

  /**
   * Reactions are stored in a subcollection of the target Entry.
   *
   * @returns [targetEntry, targetKey, Reaction.FIRESTORE_COLLECTION_NAME]
   */
  public getFirestorePath(): string[] {
    return [
      Profile.collectionName, 
      this.actor,
      Reaction.collectionName
    ]
  }
}
