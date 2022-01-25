import { DocumentData, Timestamp, serverTimestamp } from '@firebase/firestore'

/**
 * A base class providing timestaps, ownership and helper methods for _Entries_ to the skald store.
 */
export class Entry {
  protected _createdAt: Timestamp | undefined
  protected _updatedAt: Timestamp | undefined
  protected _flowTime: Timestamp | undefined
  protected _owners: string[] = []

  constructor(entry?: DocumentData) {
    if (entry)
      this.docData = entry
  }

  get createdAt(): Timestamp | undefined {
    return this._createdAt
  }

  get updatedAt(): Timestamp | undefined {
    return this._updatedAt
  }

  get flowTime(): number {
    return Math.floor(
      this._flowTime?.toMillis() ||
      this.updatedAt?.toMillis() ||
      this._createdAt?.toMillis() ||
      0
    )
  }

  get owners(): string|string[] {
    if (this._owners.length === 1) return this._owners[0]
    return [...this._owners]
  }

  set owners(owners: string|string[]) {
    if (typeof owners === 'string') {
      this.owners = [owners]
      return
    }
    if (owners.length < 1) {
      throw new Error('At least an owner is required')
    }
    // Remove duplicates from the array
    this._owners = [...new Set(owners)]
  }

  /**
   * Dries up the Entry to a plain object, storable to Firebase with automatic values for timestamps.
   */
  get docData(): DocumentData {
    const data = {} as DocumentData
    data.createdAt = this._createdAt || serverTimestamp()
    data.updatedAt = serverTimestamp() // Will be automatically updated by the server
    data.flowTime = serverTimestamp() // Will be automatically updated by the server
    if (this.owners.length > 0) data.owners = this._owners // Perhaps we should throw an error if this is empty?
    return data
  }

  /**
   * Hydrates the Entry from a plain object, as retrieved from Firebase.
   */
  set docData(data: DocumentData) {
    if (data.createdAt) this._createdAt = data.createdAt as Timestamp
    if (data.updatedAt) this._updatedAt = data.updatedAt as Timestamp
    if (data.flowTime) this._flowTime = data.flowTime as Timestamp

    if (data.owners) {
      if (Array.isArray(data.owners)) {
        this.owners = data.owners
      }
      else {
        this.owners = [data.owners as string]
      }
    }
  }

  hasOwner(userId: string): boolean {
    return this.owners.includes(userId)
  }

  compareFlowTime(other: Entry): number {
    if (other.flowTime === this.flowTime) return 0
    return this.flowTime > other.flowTime ? -1 : 1
  }
}