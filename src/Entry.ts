import { DocumentData, Timestamp, serverTimestamp } from 'firebase/firestore'

/**
 * A base class providing timestaps, ownership and helper methods for _Entries_ to the skald store.
 */
export class Entry {
  protected _id: string
  protected _createdAt: Timestamp | undefined
  protected _updatedAt: Timestamp | undefined
  protected _flowTime: Timestamp | undefined
  protected _owners: string[] = []

  constructor(entry: string | DocumentData) {
    if (typeof entry === 'string') {
      this._id = entry
    } else {
      this._id = entry.id || ''
      this.docData = entry
    }
  }

  get id(): string {
    return this._id
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

  get owners(): string[] {
    return [...this._owners]
  }

  set owners(owners: string[]) {
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
    data.id = this._id
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

  owns(userId: string): boolean {
    return this.owners.includes(userId)
  }

  compareFlowTime(other: Entry): number {
    if (other.id === this.id) return 0 // They are the same entity, return 0
    return this.flowTime > other.flowTime ? -1 : 1
  }
}