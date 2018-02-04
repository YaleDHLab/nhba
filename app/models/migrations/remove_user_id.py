from pymongo import MongoClient

'''
This helper removes the superfluous userId atttribute from all users.
'''

if __name__ == '__main__':

  # config
  client = MongoClient('localhost', 27017)
  db = client['nhba']

  db['users'].update({}, {'$unset': {'userId': ''}})
  db['users'].drop_index('userId_1')