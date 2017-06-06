from pymongo import MongoClient

'''
Utility for renaming fields
'''

if __name__ == '__main__':
  
  # config
  client = MongoClient('localhost', 27017)
  db = client['nhba']
  db.buildings.update({}, {
    '$rename': {
      'streetscape': 'urban_setting',
      'footnotes': 'sources',
      'status': 'related_outbuildings'
    }
  }, upsert=False, multi=True)
