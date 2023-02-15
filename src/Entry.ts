import { DocumentData, Timestamp, serverTimestamp } from '@firebase/firestore'
import { Storable } from './Storable'

/**
 * A base class providing timestaps, ownership and helper methods for _Entries_ to the skald store.
 */
export class Entry extends Storable {
  protected _createdAt: Timestamp | undefined
  protected _updatedAt: Timestamp | undefined
  protected _flowTime: Timestamp | undefined
  protected _owners: string[] = []
  public key = ''

  constructor(entry?: DocumentData, key?: string) {
    super()
    if (entry) this.docData = entry
    if (key) this.key = key
  }

  get createdAt(): Timestamp | undefined {
    return this._createdAt
  }

  get updatedAt(): Timestamp | undefined {
    return this._updatedAt
  }

  get flowTime(): number {
    return Math.floor(this._flowTime?.toMillis() || this.updatedAt?.toMillis() || this._createdAt?.toMillis() || 0)
  }

  public get owners(): string | string[] {
    if (!this._owners || this._owners.length < 1) return ''
    if (this._owners.length === 1) return this._owners[0]
    return [...this._owners] // Return a copy
  }

  public set owners(owners: string | string[]) {
    this.setOwners(owners)
  }

  private setOwners(newOwners: string[] | string | undefined) {
    if (!newOwners) throw new Error('At least an owner is required')
    else if (typeof newOwners === 'string') this._owners = [newOwners]
    else this._owners = [...new Set(newOwners)]
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
    else if (data.created) this._createdAt = data.created as Timestamp // Legacy support
    if (data.updatedAt) this._updatedAt = data.updatedAt as Timestamp
    else if (data.updated) this._updatedAt = data.updated as Timestamp // Legacy support
    if (data.flowTime) this._flowTime = data.flowTime as Timestamp
    else if (data.flowtime) this._flowTime = data.flow as Timestamp // Legacy support

    if (data.owners) this.setOwners(data.owners)
  }

  addOwner(userId: string): void {
    if (!this.hasOwner(userId)) this._owners.push(userId)
  }

  hasOwner(userId: string): boolean {
    return this._owners.includes(userId)
  }

  compareFlowTime(other: Entry): number {
    if (other.flowTime === this.flowTime) return 0
    return this.flowTime > other.flowTime ? -1 : 1
  }
}
