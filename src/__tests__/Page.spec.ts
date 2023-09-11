import { Page } from '../contentEntries/Page'
import { DocumentData, Timestamp } from 'firebase/firestore'
import { Site } from '../entries/Site'

describe('Page', () => {
  it('Supports core fields', () => {
    const page = new Page({
      name: 'Page name',
      markdownContent: '# Page title',
      htmlContent: '<h1>Page title</h1>',
      category: 'category',
      createdAt: new Timestamp(100, 200),
      updatedAt: new Timestamp(300, 400),
      seenCount: 7,
      tags: ['tag1', 'tag2']
    })
    expect(page.name).toBe('Page name')
    expect(page.docData?.name).toBe('Page name')
    expect(page.markdownContent).toBe('# Page title')
    expect(page.docData?.markdownContent).toBe('# Page title')
    expect(page.htmlContent).toBe('<h1>Page title</h1>')
    expect(page.docData?.htmlContent).toBe('<h1>Page title</h1>')
    expect(page.category).toBe('category')
    expect(page.docData?.category).toBe('category')
    expect(page.createdAt).toEqual(new Timestamp(100, 200))
    expect(page.docData?.createdAt).toEqual(new Timestamp(100, 200))
    expect(page.updatedAt).toEqual(new Timestamp(300, 400))
    expect(page.docData?.updatedAt).not.toEqual(new Timestamp(300, 400))
    expect(page.seenCount).toBe(7)
    expect(page.docData?.seenCount).toBeUndefined()
    expect(page.tags).toEqual(['tag1', 'tag2'])
    expect(page.docData?.tags).toEqual(['tag1', 'tag2'])
  }),
    it('Provides a collection name', () => {
      expect(Page.collectionName).toBe('pages')
    }),
    it('Saves content', () => {
      const page = new Page(
        {
          name: 'Page name',
          markdownContent: '',
          htmlContent: '',
          category: 'category',
          createdAt: new Timestamp(100, 200),
          updatedAt: new Timestamp(300, 400),
          seenCount: 7
        },
        'ade'
      )
      page.markdownContent = '# Page title 1'
      page.htmlContent = '<h1>Page title</h1>'
      expect(page.docData.markdownContent).toBe('# Page title 1')
      expect(page.docData.htmlContent).toBe('<h1>Page title</h1>')
      expect(page.markdownContent).toBe('# Page title 1')
      expect(page.htmlContent).toBe('<h1>Page title</h1>')
    })
  it('Loads content', () => {
    const page = new Page({}, 'ade')
    page.docData = {
      markdownContent: '# Page title 1',
      htmlContent: '<h1>Page title</h1>'
    }
    expect(page.docData.markdownContent).toBe('# Page title 1')
    expect(page.docData.htmlContent).toBe('<h1>Page title</h1>')
    expect(page.markdownContent).toBe('# Page title 1')
    expect(page.htmlContent).toBe('<h1>Page title</h1>')
  })
  it('Saves a revision', () => {
    const page = new Page(
      {
        name: 'Page name',
        markdownContent: '',
        htmlContent: '',
        category: 'category',
        createdAt: new Timestamp(100, 200),
        updatedAt: new Timestamp(300, 400),
        seenCount: 7,
        owners: ['goo']
      },
      'ade'
    )
    page.markdownContent = '# Page title 1'
    page.htmlContent = '<h1>Page title</h1>'
    page.saveRevision()
    expect(page.revisionHistory.length).toBe(1)
    expect(page.revisionHistory[0].markdownContent).toBe('# Page title 1')
    expect(page.revisionHistory[0].createdAt).toEqual(new Timestamp(300, 400))
    expect(page.revisionHistory[0].author).toBe('goo')
  })
  it('Returns an author', () => {
    const page = new Page(
      {
        name: 'Page name',
        markdownContent: '',
        htmlContent: '',
        category: 'category',
        createdAt: new Timestamp(100, 200),
        updatedAt: new Timestamp(300, 400),
        seenCount: 7,
        owners: ['goo', 'foo']
      },
      'ade'
    )
    expect(page.author).toBe('goo')
  })
  it('Returns an error for firestorePath without parent key', () => {
    const page = new Page(
      {
        name: 'Page name',
        markdownContent: '',
        htmlContent: '',
        category: 'category',
        createdAt: new Timestamp(100, 200),
        updatedAt: new Timestamp(300, 400),
        seenCount: 7,
        owners: ['goo', 'foo']
      },
      'ade'
    )
    expect(page.getFirestorePath).toThrowError()
  })
  it('Returns a firestore path', () => {
    const page = new Page(
      {
        name: 'Page name',
        markdownContent: '',
        htmlContent: '',
        category: 'category',
        createdAt: new Timestamp(100, 200),
        updatedAt: new Timestamp(300, 400),
        seenCount: 7,
        owners: ['goo', 'foo']
      },
      'ade',
      'fefaewfa'
    )
    expect(page.getFirestorePath().toString()).toBe([Site.collectionName, 'fefaewfa', Page.collectionName, 'ade'].toString())
  })
  // Throws an error if we try to revision the page before it has been updated
  it('Throws an error if we try to revision the page before it has been updated', () => {
    const page = new Page()
    expect(() => page.saveRevision()).toThrow()
  })
})
