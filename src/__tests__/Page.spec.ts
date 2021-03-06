import { Page } from '../entries/Page'
import { DocumentData, Timestamp } from 'firebase/firestore'

describe('Page', () => {
  it('Supports core fields', () => {
    const page = new Page({
      name: 'Page name',
      markdownContent: '# Page title',
      htmlContent: '<h1>Page title</h1>',
      category: 'category',
      createdAt: new Timestamp(100, 200),
      updatedAt: new Timestamp(300, 400),
      seenCount: 7
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
  })
})
