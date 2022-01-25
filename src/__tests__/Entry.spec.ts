import { Entry } from '../Entry'
import { DocumentData, Timestamp } from 'firebase/firestore'

describe(
  'Entry', () => {
    it('Should be defined', () => {
      expect(Entry).toBeDefined()
    }),
    it('Should have a constructor', () => {
      expect(Entry.prototype.constructor).toBeDefined()
    }),
    it('Should have a createdAt', () => {
      const doc = { } as DocumentData
      const ts = Timestamp.now()
      doc.createdAt = ts
      const entry = new Entry(doc)
      expect(entry.createdAt).toBe(ts)
    }),
    it('Should have an updatedAt', () => {
      const doc = { id: 'test for updatedAt' } as DocumentData
      const ts = Timestamp.now()
      doc.updatedAt = ts
      const entry = new Entry(doc)
      expect(entry.updatedAt).toBe(ts)
    }),
    it('Should have a flowTime', () => {
      const doc = { } as DocumentData
      const ts = Timestamp.now()
      doc.updatedAt = ts
      const entry = new Entry(doc)
      expect(entry.flowTime).toBe(ts.toMillis())
    }),
    it('Should have an owners', () => {
      const doc = { owners: ['a', 'b'] } as DocumentData
      const entry = new Entry(doc)
      expect(entry.owners).toEqual(['a', 'b'])
    }),
    it('Should return owners as a string if there is only an owner', () => {
      const doc = { owners: ['a', 'b'] } as DocumentData
      const entry = new Entry(doc)
      expect(entry.owners).toEqual(['a', 'b'])
    }),
    it('Should throw error when setting owners to emtpy', () => {
      const doc = { } as DocumentData
      try {
        const entry = new Entry(doc)
        entry.owners = []
      } catch (e: unknown) {
        expect(e).toBeInstanceOf(Error)
        expect((e as Error).message).toBe('At least an owner is required')
      }
    }),
    it('Should return valid docData', () => {
      const doc = { id: 'test for docData' } as DocumentData
      const ts = Timestamp.now()
      doc.createdAt = ts
      doc.updatedAt = ts
      const docData = new Entry(doc).docData
      expect(docData.id).not.toBe('test for docData')
      expect(docData.createdAt).toBe(ts)
      expect(docData.updatedAt).not.toBe(ts)
    })
    it('Should accept a string as owners array', () => {
      const entry = new Entry({
        id: 'test for owners',
        owners: 'a'
      })
      expect(entry.owners).toEqual('a')
      expect(entry.hasOwner('a')).toBe(true)
    })
    it('Should be comparable to another Entry with a flowTime', () => {
      const entry1 = new Entry()
      const entry2 = new Entry()
      entry1.docData = { updatedAt: new Timestamp(1, 1) }
      entry2.docData = { updatedAt: new Timestamp(2, 2) }
      expect(entry1.flowTime).toBe(1000)
      expect(entry2.flowTime).toBe(2000)
      expect(entry1.compareFlowTime(entry2)).toBe(1)
      expect(entry2.compareFlowTime(entry1)).toBe(-1)
    })
  }
)