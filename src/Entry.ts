/**
 * A base class providing timestaps, ownership and helper methods for _Entries_ to the skald store.
 */
export class Entry {
  _id = ''

  constructor(entry: string) {
    this._id = entry
  }

  get id() {
    return this._id
  }

}