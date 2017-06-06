from pymongo import MongoClient

'''
This helper remove tour_id attributes from all buildings,
and adds a new tours [] string to each building with
the title of the given tour
'''

if __name__ == '__main__':

  # config
  client = MongoClient('localhost', 27017)
  db = client['nhba']

  tours = list(db['wptours'].find({}))
  buildings = list(db['buildings'].find({}))

  tour_id_to_name = {}
  for i in tours:
    tour_id_to_name[i['tour_id']] = i['post_title']

  for i in buildings:
    tours = []
    for j in i['tour_ids']:
      tours.append(tour_id_to_name[j])

    query = {'_id':i['_id']}
    db['buildings'].update_one(query, {'$unset': {'tour_ids': ''}})
    db['buildings'].update_one(query, {'$set': {'tours': tours}}, upsert=False)