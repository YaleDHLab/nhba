from pymongo import MongoClient
import re

'''
This simple helper removes images and tags from the buildings extracted
through a WP import, and also normalizes text line breaks
'''

def get_buildings():
  '''
  Return a list of all buildings in the db
  '''
  return list(db['buildings'].find({}))

def clean_text(s):
  '''
  Remove all content between angle brackets
  '''
  assert(len(s.split('<')) == len(s.split('>')))
  s = s.replace('&nbsp;','')
  s = s.replace('\r','\n')
  s = s.replace('<br/>','\n\n').replace('<br />','\n\n').replace('<br>','\n\n')
  s = s.replace('</p>', '\n\n</p>')
  s = s.replace('</div>', '\n\n</div>')
  s = re.sub(r'\n+', '\n\n', s).strip()
  return re.sub(r'<.+?>', '', s)

def remove_images(s):
  '''
  Remove all image assets from a wp string in nhba
  '''
  split_captions = s.split('[caption')
  clean = [ split_captions[0] ]
  for i in split_captions[1:]:
    clean.append( i.split(']')[1].split('[/caption')[0] )

  return ' '.join(clean)

def update_document(d):
  '''
  Update a document in mongo
  '''
  db['buildings'].update_one({'_id':d['_id']}, {'$set':d}, upsert=False)

if __name__ == '__main__':

  # config
  client = MongoClient('localhost', 27017)
  db = client['nhba']

  buildings = get_buildings()
  for b in buildings:
    b['overview_description'] = clean_text(b['overview_description'])
    b['overview_description'] = remove_images(b['overview_description'])
    update_document(b)
