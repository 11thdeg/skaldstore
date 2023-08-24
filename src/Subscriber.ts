import { DocumentData, FieldValue, serverTimestamp, Timestamp } from 'firebase/firestore'
import { Storable } from './Storable'

/**
 * Class handling the data of a subscribed notifications and push messages.
 * 
 * The key is the user's firebase UID, as in Profile.key 
 * and Account.key respectively.
 */
export class Subscriber extends Storable {
  public static readonly FIRESTORE_COLLECTION_NAME = 'subscriptions'

  public static get collectionName(): string {
    return Subscriber.FIRESTORE_COLLECTION_NAME
  }

  public key: string
  public allSeenAt: number = 0
  public seenEntities: Record<string, number> = {}
  public pushMessages: boolean = true
  public notifyOnThreads: boolean = true
  public notifyOnLikes: boolean = true

  // Messaging tokens need to be unique, thus they are not available
  // as public properties, but only through the add/remove methods
  // ( And as docData/JSON export)
  protected messagingTokens: string[] = []

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

    if (this.allSeenAt) data.allSeenAt = this.allSeenAt
    else data.allSeenAt = 0

    if (this.seenEntities) data.seenEntities = this.seenEntities
    if (this.messagingTokens.length > 0) data.messagingTokens = this.messagingTokens

    // Boolean values, default to true if not set
    data.pushMessages = !!this.pushMessages
    data.notifyOnThreads = !!this.notifyOnThreads 
    data.notifyOnLikes = !!this.notifyOnLikes 

    return data
  }

  /**
   * Hydrates the Entry from a plain object, as retrieved from Firebase.
   */
  set docData(data: DocumentData) {
    if (data.uid !== this.key) throw new Error('The key of the Subscriber does not match the data')
    if (data.allSeenAt) this.allSeenAt = data.allSeenAt as number
    if (data.seenEntities) this.seenEntities = data.seenEntities as Record<string, number>
    if (data.messagingTokens) this.messagingTokens = data.messagingTokens as string[]
    if (data.pushMessages !== undefined) this.pushMessages = data.pushMessages
    else this.pushMessages = true
    if (data.notifyOnThreads !== undefined) this.notifyOnThreads = data.notifyOnThreads
    else this.notifyOnThreads = true

    // Likes
    if (data.notifyOnLikes !== undefined) this.notifyOnLikes = data.notifyOnLikes
    else this.notifyOnLikes = true
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
