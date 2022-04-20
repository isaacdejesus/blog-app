const listHelper = require('../utils/list_helpers.js')
describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '33232',
            title: "ghjksdjks",
            author: 'ssdwe',
            url: 'ferww',
            likes: 5,
            __v: 0
        }
    ]

    test('when list only has one blog, equals the likes of that', ()=> {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
})
