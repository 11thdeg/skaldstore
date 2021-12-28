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
      it('Should have an id', () => {
        const entry = new Entry('test')
        expect(entry.id).toBe('test')
      })
    it('Should have a createdAt', () => {
      const doc = { id: 'test for createdAt' } as DocumentData
      const ts = Timestamp.now()
      doc.createdAt = ts
      const entry = new Entry(doc)
      expect(entry.createdAt).toBe(ts)
      expect(entry.id).toBe('test for createdAt')
    }),
      it('Should have an updatedAt', () => {
        const doc = { id: 'test for updatedAt' } as DocumentData
        const ts = Timestamp.now()
        doc.updatedAt = ts
        const entry = new Entry(doc)
        expect(entry.updatedAt).toBe(ts)
        expect(entry.id).toBe('test for updatedAt')
      }),
      it('Should have a flowTime', () => {
        const doc = { id: 'test for flowTime' } as DocumentData
        const ts = Timestamp.now()
        doc.updatedAt = ts
        const entry = new Entry(doc)
        expect(entry.flowTime).toBe(ts.toMillis())
        expect(entry.id).toBe('test for flowTime')
      }),
      it('Should have an owners', () => {
        const doc = { id: 'test for owners', owners: ['a'] } as DocumentData
        const entry = new Entry(doc)
        expect(entry.owners).toEqual(['a'])
        expect(entry.id).toBe('test for owners')
      }),
      it('Should throw error when setting owners to emtpy', () => {
        const doc = { id: 'test for owners' } as DocumentData
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
        expect(docData.id).toBe('test for docData')
        expect(docData.createdAt).toBe(ts)
        expect(docData.updatedAt).not.toBe(ts)
      })
    it('Should accept a string as owners array', () => {
      const entry = new Entry({
        id: 'test for owners',
        owners: 'a'
      })
      expect(entry.owners).toEqual(['a'])
      expect(entry.owns('a')).toBe(true)
    })
    it('Should be comparable to another Entry with a flowTime', () => {
      const entry1 = new Entry('id1')
      const entry2 = new Entry('id2')
      entry1.docData = { updatedAt: new Timestamp(1, 1) }
      entry2.docData = { updatedAt: new Timestamp(2, 2) }
      expect(entry1.flowTime).toBe(1000)
      expect(entry2.flowTime).toBe(2000)
      expect(entry1.compareFlowTime(entry2)).toBe(1)
      expect(entry2.compareFlowTime(entry1)).toBe(-1)
    })
  }
)