from pymongo import MongoClient
import bson

'''
This helper adds a new empty buildings [] ObjectId attribute to each user
and sets the creator attribute of each building to null. This allows for
old documents before the creation of the relationship to continue working.
'''

if __name__ == '__main__':

  # config
  client = MongoClient('localhost', 27017)
  db = client['nhba']

  users = list(db['users'].find({}))
  buildings = list(db['buildings'].find({}))

  for i in users:
    if not hasattr(i, 'buildings'):
      query = {'_id':i['_id']}
      db['users'].update_one(query, {'$set': {'buildings': []}})

  for i in buildings:
    if not hasattr(i, 'creator'):
      query = {'_id':i['_id']}
      db['buildings'].update_one(query, {'$set': {'creator': None}})