from pymongo import MongoClient

'''
Utility for removing unwanted values from building fields
'''

if __name__ == '__main__':
  
  # config
  client = MongoClient('localhost', 27017)
  db = client['nhba']

  styles = [
    'Colonial / Georgian'
    'Federal'
    'Greek Revival'
    'Moorish / Egyptianate / Eclectic Revival'
    'Gothic Revival'
    'Italianate'
    'Second Empire'
    'Stick Style'
    'Queen Anne'
    'Shingle Style'
    'Chateauesque'
    'Romanesque Revival'
    'Beaux Arts Neoclassical'
    'Renaissance Revival'
    'Colonial Revival'
    'Dutch Colonial Revival'
    'Tudor / English Vernacular Revival'
    'Spanish / Mission / Mediterranean Revival'
    'Prairie'
    'Arts and Crafts'
    'Collegiate Gothic'
    'Art Deco'
    'Streamlined Moderne'
    'Streamlined Neoclassical'
    'Modernist'
    'Miesian'
    'Brutalist'
    'Postmodern'
    'Shed Style'
    'Mansard'
    'Contemporary'
  ]

  buildings = list(db['buildings'].find({}))
  for i in buildings:
    for j in i['current_uses']:
      if j == 'Mixed Use':
        i['current_uses'].remove(j)

    for j in i['street_visibilities']:
      if j in ['high', 'low']:
        i['street_visibilities'].remove(j)

    for j in i['styles']:
      if j not in styles:
        i['styles'].remove(j)

    query = {'_id':i['_id']}
    db['buildings'].update_one(query, {'$set': i})