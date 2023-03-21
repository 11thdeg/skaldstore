export type FirestoreEntry = {
  key: string
  parentKey?: string
  getFirestorePath: () => string[]
}