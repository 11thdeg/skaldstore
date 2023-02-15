import { Thread } from ".."
import { Reaction } from "../Reaction"

describe('Reachtion', () => {
    // Storable basics
    it('Should support key', () => {
      const r = new Reaction()
      expect(r.key).toBe('')
    })
    it('Should support getFirestorePath', () => {
      const r = new Reaction()
      r.targetEntry = Reaction.TARGET_ENTRY_THREAD
      r.targetKey = 'test'
      expect(r.getFirestorePath()).toEqual([
        Thread.collectionName,
        'test',
        Reaction.collectionName
      ])
    })
})