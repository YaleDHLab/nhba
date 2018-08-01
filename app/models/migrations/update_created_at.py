from pymongo import MongoClient
import bson

'''
Adds updated_at field if missing.
'''

if __name__ == '__main__':

  # config
  client = MongoClient('localhost', 27017)
  db = client['nhba']

  buildings = list(db['buildings'].find({
      'updated_at': {
          '$exists': False
      },
      'created_at': {
          '$exists': True
      }
  }))

  for i in buildings:
      query = { '_id': i['_id'] }
      db['buildings'].update_one(query, {'$set': {'updated_at': i['created_at']}})