const rx = require('rxjs/Rx')
const {Observable} = rx

module.exports = function getNav (base) {
  return Observable.create(observer => {
    base('Pages').select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 3,
      view: 'Grid view'
    }).firstPage((err, records) => {
      if (err) {
        console.error('Error requesting records')
        console.error(err)
        observer.error(err)
      }
      
      console.log('requested navigation data')
      const model = records.map(item => {
        return {
          name: item.get('Name'),
          slug: item.get('Slug')
        }
      })

      observer.next(model)
      observer.complete()
    })
  })
}