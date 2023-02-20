import { Profile } from ".."
import { Reaction } from "../Reaction"

describe('Reaction', () => {
    // Storable basics
    it('Should support key', () => {
      const r = new Reaction()
      expect(r.key).toBe('')
    })
    it('Should support getFirestorePath', () => {
      const r = new Reaction()
      r.targetEntry = Reaction.TARGET_ENTRY_SITE
      r.targetKey = 'test'
      r.actor = 'dwdwaf'
      expect(r.getFirestorePath()).toEqual([
        Profile.collectionName,
        'dwdwaf',
        Reaction.collectionName
      ])
    })
})