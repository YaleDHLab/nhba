from pymongo import MongoClient
import bson

'''
This removes deleted buildings from the user model's
buildings attribute.
'''

if __name__ == '__main__':

  # config
  client = MongoClient('localhost', 27017)
  db = client['nhba']

  users = list(db['users'].find({}))

  for i in users:
    for j in i['buildings']:
      if not db['buildings'].find_one({'_id': j}):
        db['users'].update_one({'_id': i['_id']}, {'$pull': {'buildings': j}})