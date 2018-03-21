import connectArea from '../../src/features/connect_area/connect-area'

describe('euclidean distance', () => {
  it('happy path' , () => {
    const testPts = [
      {x: 100, y: 153},
      {x: 1566, y: 8564}
    ]
    expect(connectArea.euclideanDistaceToOrigin(testPts[0])).toBe(182.7812900709479 )
    expect(connectArea.euclideanDistaceToOrigin(testPts[1])).toBe(8706.000918906453 )
  })
})

// describe('sort via euclidean distance', () => {
//   it("happy path", () => {
//     expect(connectArea.areaDistancesToOrigin(contentStorage)).toBe(5)
//   })
// })

