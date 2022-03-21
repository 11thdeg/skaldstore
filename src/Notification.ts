import { DocumentData, serverTimestamp, Timestamp } from 'firebase/firestore'

export class Notification {
  private _key: string = ''
  private _createdAt: Timestamp|undefined = undefined
  public from: string = ''
  public to: string = ''
  public message: string = ''
  public targetKey: string = ''
  public targetType: string = ''
  public read: boolean = false
  public static readonly FIRESTORE_COLLECTION_NAME = 'notifications'

  constructor(data?: DocumentData, key?: string) {
    if (data) this.docData = data
    if (key) this._key = key
  }
  get key(): string {
    return this._key
  }
  get createdAt(): Timestamp|undefined {
    return this._createdAt
  }
  get docData(): DocumentData {
    const data: DocumentData = {}
    if (this.from) data.from = this.from
    if (this.to) data.to = this.to
    if (this.message) data.message = this.message
    if (this.targetKey) data.targetKey = this.targetKey
    if (this.targetType) data.targetType = this.targetType
    data.read = this.read || false

    // Serverside timestamp for new entries!
    data.createdAt = this.createdAt || serverTimestamp()

    return data
  }
  set docData(data: DocumentData) {
    if (data.to) this.to = data.to
    if (data.from) this.from = data.from
    if (data.message) this.message = data.message
    if (data.targetKey) this.targetKey = data.targetKey
    if (data.targetType) this.targetType = data.targetType
    if (data.createdAt) this._createdAt = data.createdAt 
    this.read = data.read || false
  }
}