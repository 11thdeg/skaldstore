import { serverTimestamp, Timestamp, FieldValue } from '@firebase/firestore'
import type { DocumentData } from '@firebase/firestore'
import type { User } from '@firebase/auth'
import { Storable } from './Storable'

export type watchEntry = {
  key: string
  lastSeen: Timestamp | FieldValue
}

export class Account extends Storable {
  email: string
  displayName: string
  photoURL: string
  uid: string
  isAnonymous: boolean
  providerId: string
  lightMode: string = ''
  updatedAt: Timestamp | null = null
  locale: string = 'en'
  watched: watchEntry[] = []
  seenSince: Timestamp | null = null
  lastLogin: Timestamp | null = null
  eulaAccepted: boolean = false

  constructor(user: User | DocumentData | null) {
    super()
    this.email = user?.email || ''
    this.displayName = user?.displayName || ''
    this.photoURL = user?.photoURL || ''
    this.uid = user?.uid || ''
    this.key = this.uid
    user && !user.isAnonymous ? (this.isAnonymous = false) : (this.isAnonymous = true)
    this.providerId = user?.providerId || ''
    if (user && Object.keys(user).includes('lightMode')) {
      this.lightMode = (user as DocumentData).lightMode
    }
    if (user && Object.keys(user).includes('watched')) {
      this.watched = (user as DocumentData).watched as watchEntry[]
    }
    if (user && Object.keys(user).includes('seenSince')) {
      this.seenSince = (user as DocumentData).seenSince
    }
  }

  /**
   * Dries up the Account to a plain object, storable to Firebase with generated-values for timestamps. Do note that this data is locked by Firestore
   * rules in the database and can only be set by the owner. The data is only visible to the owner and the service admins.
   *
   * @returns {DocumentData} with updatedAt corresponding to the point in time when App updates the account info. (i.e. when the user logs in).
   * the DocumentData is scrapped of any personal data used by the app, while running in a browser.
   */
  get docData(): DocumentData {
    if (this.isAnonymous) throw new Error('Anonymous accounts cannot be stored in the database')
    const data = {} as DocumentData
    data.uid = this.uid
    data.updatedAt = serverTimestamp()
    data.lightMode = this.lightMode || 'light'
    data.locale = this.locale || 'en'
    if (this.watched && this.watched.length > 0) data.watched = this.watched
    if (this.seenSince) data.seenSince = this.seenSince
    this.lastLogin ? (data.lastLogin = this.lastLogin) : (data.lastLogin = serverTimestamp())

    // This is a special field that is set to true, the first time the user logs in, and the Account
    // is created. It is used to check if the user has accepted the EULA.
    data.eulaAccepted = true
    return data
  }

  /**
   * Set the fields settable from the DB here.
   */
  set docData(data: DocumentData) {
    // uid is never set, nor is the key (which is the uid)
    this.updatedAt = data.updatedAt || null
    this.lightMode = data.lightMode || 'light'
    this.locale = data.locale || 'en'
    this.watched = data.watched || []
    this.seenSince = data.seenSince || null
    this.lastLogin = data.lastLogin || null
    this.eulaAccepted = data.eulaAccepted || false // See comment in docData getter
  }

  public static get collectionName(): string {
    return 'account'
  }
  public getFirestorePath(): string[] {
    return [Account.collectionName]
  }
}
