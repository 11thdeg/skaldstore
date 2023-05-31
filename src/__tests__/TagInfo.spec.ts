import { DocumentData, Timestamp } from 'firebase/firestore'
import { TagInfo } from '../TagInfo'

describe('TagInfo', () => {
  it('Should support key', () => {
    const tagInfo = new TagInfo('test')
    expect(tagInfo.key).toBe('test')
  })
  it('Should support getFirestorePath', () => {
    const tagInfo = new TagInfo('test')
    expect(tagInfo.getFirestorePath()).toEqual(['tags', 'test'])
  })
  it('Should support getting docData', () => {
    const tagInfo = new TagInfo('test')
    tagInfo.entryPath = ['site', 'w4234edlnqwkr2', 'page', 'w4234edlnqdwwkr2']
    tagInfo.entryTitle = 'A test site / A test entry'
    tagInfo.tags = ['test', 'tag']
    expect(tagInfo.docData).toEqual({
      entryPath: ['site', 'w4234edlnqwkr2', 'page', 'w4234edlnqdwwkr2'],
      entryTitle: 'A test site / A test entry',
      tags: ['test', 'tag']
    })
  })
  it('Should support setting docData', () => {
    const tagInfo = new TagInfo('test')
    tagInfo.docData = {
        entryPath: ['site', 'w4234edlnqwkr2', 'page', 'w4234edlnqdwwkr2'],
        entryTitle: 'A test site / A test entry',
        tags: ['test', 'tag']
    }
    expect(tagInfo.entryPath).toEqual(['site', 'w4234edlnqwkr2', 'page', 'w4234edlnqdwwkr2'])
    expect(tagInfo.entryTitle).toEqual('A test site / A test entry')
    expect(tagInfo.tags).toEqual(['test', 'tag'])
  })
  it('Should provide a collection name', () => {
    expect(TagInfo.collectionName).toBe('tags')
  })
  it('Should throw an error when created without a key', () => {
    expect(() => new TagInfo('')).toThrowError('A key is required to construct a TagInfo')
  })
  it('Should support creation with docData', () => {
    const tagInfo = new TagInfo('test', {
        entryPath: ['site', 'w4234edlnqwkr2', 'page', 'w4234edlnqdwwkr2'],
        entryTitle: 'A test site / A test entry',
        tags: ['test', 'tag']
    })
    expect(tagInfo.entryPath).toEqual(['site', 'w4234edlnqwkr2', 'page', 'w4234edlnqdwwkr2'])
    expect(tagInfo.entryTitle).toEqual('A test site / A test entry')
    expect(tagInfo.tags).toEqual(['test', 'tag'])
  })
  it('Should support creation with empty docData', () => {
    const tagInfo = new TagInfo('test', {})
    expect(tagInfo.entryPath).toEqual([])
    expect(tagInfo.entryTitle).toEqual('')
    expect(tagInfo.tags).toEqual([])
  })
})
