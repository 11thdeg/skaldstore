import { Article } from '../contentEntries/Article'
import { DocumentData, Timestamp } from 'firebase/firestore'

describe('Article', () => {
  it('Should be defined', () => {
    expect(Article).toBeDefined()
  }),
  it('Should have a constructor', () => {
    expect(Article.prototype.constructor).toBeDefined()
  }),
  it('Should have a createdAt', () => {
    const doc = {} as DocumentData
    const ts = Timestamp.now()
    doc.createdAt = ts
    const article = new Article(doc)
    expect(article.createdAt).toBe(ts)
  })
  it('Should have an updatedAt', () => {
    const doc = { id: 'test for updatedAt' } as DocumentData
    const ts = Timestamp.now()
    doc.updatedAt = ts
    const article = new Article(doc)
    expect(article.updatedAt).toBe(ts)
  })
  it('Should have a flowTime', () => {
    const doc = {} as DocumentData
    const ts = Timestamp.now()
    doc.updatedAt = ts
    const article = new Article(doc)
    expect(article.flowTime).toBe(ts.toMillis())
  })
  it('Should have an owners', () => {
    const doc = { owners: ['a', 'b'] } as DocumentData
    const article = new Article(doc)
    expect(article.owners).toEqual(['a', 'b'])
  })
  it('Should return owners as a string if there is only an owner', () => {
    const doc = { owners: ['a', 'b'] } as DocumentData
    const article = new Article(doc)
    expect(article.owners).toEqual(['a', 'b'])
  })

})