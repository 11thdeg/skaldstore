import { serverTimestamp } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import type { User } from 'firebase/auth'

export class Account {

  email: string
  displayName: string
  photoURL: string
  uid: string
  isAnonymous: boolean
  providerId: string

  constructor(user: User | null) {
    this.email = user?.email || ''
    this.displayName = user?.displayName || ''
    this.photoURL = user?.photoURL || ''
    this.uid = user?.uid || ''
    user && !user.isAnonymous ? this.isAnonymous = false : this.isAnonymous = true
    this.providerId = user?.providerId || ''
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
    return data
  }

  // set docData(data: DocumentData) _intentionally missing, as the account data can not be set from the database_

}