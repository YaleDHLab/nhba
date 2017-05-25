'''
This script denormalizes a wp db into the format required by the nhba db

# posts:
db.wp_posts.distinct('post_type')
  db.wp_posts.distinct('post_type')
  "post",
  "page",
  "acf",
  "buildings",
  "attachment",
  "tours",
  "nav_menu_item",
  "revision"

# images:
The following fields within a building post contain image metadata:

historical_photo [gallery ids="1540"]
exterior_photo  [gallery ids="1537"]
map   [gallery ids="1541,1542,1543"]
interior_photo  [gallery ids="1538"]

# master container with all images
images_and_documents  [gallery ids="1537,1540,1538,1541,1542,1543"]

# get categories (aka terms)
# find all terms for buliding id 2999 (= building named 15 High Street)
db.wp_term_relationships.find({object_id: 2999})
{ "_id" : ObjectId("58e3c763c57d2065a80058e9"), "object_id" : 2999, "term_taxonomy_id" : 303, "term_order" : 0 }
{ "_id" : ObjectId("58e3c763c57d2065a80058ea"), "object_id" : 2999, "term_taxonomy_id" : 335, "term_order" : 0 }
{ "_id" : ObjectId("58e3c763c57d2065a80058eb"), "object_id" : 2999, "term_taxonomy_id" : 339, "term_order" : 0 }
{ "_id" : ObjectId("58e3c763c57d2065a80058ec"), "object_id" : 2999, "term_taxonomy_id" : 366, "term_order" : 0 } *** focus
{ "_id" : ObjectId("58e3c763c57d2065a80058ed"), "object_id" : 2999, "term_taxonomy_id" : 379, "term_order" : 0 }

db.wp_term_taxonomy.find({term_taxonomy_id: 366})
{ "_id" : ObjectId("58e3c763c57d2065a8005987"), "term_taxonomy_id" : 366, "term_id" : 354, "taxonomy" : "original_program", "description" : "", "parent" : 0, "count" : 37 }

> db.wp_terms.find({term_id: 291})
{ "_id" : ObjectId("58e3c763c57d2065a80059b4"), "term_id" : 291, "name" : "1910-1950", "slug" : "1900-1949", "term_group" : 0 }

> db.wp_terms.find({term_id: 354})
{ "_id" : ObjectId("58e3c763c57d2065a80059f3"), "term_id" : 354, "name" : "Residential", "slug" : "residential", "term_group" : 0 }

# tours:
db.wp_postmeta.find({'meta_key': 'tour'})

'''

from collections import defaultdict
from subprocess import call
from pymongo import MongoClient
import json, os, random

def get_list_fields():
  '''
  Get a list of fields that need to be represented as lists in mongo
  '''
  return ['styles', 'current_uses','neighborhoods', 'eras']

def get_nhba_to_wp():
  '''
  Map wp fields to fields for this app
  '''
  return {

    'sql_building_id': 'pre_mongified_id',

    # overview fields
    'building_name': 'building_name', # possibly 'name'
    'address': 'address',
    'year_built': 'date_constructed', # possibly 'year', 'constructed'
    'styles': 'architectural_style',
    'current_uses': 'current_program',
    'current_tenant': 'current_tenant',
    'neighborhoods': 'neighborhoods',  # list field
    'eras': 'eras',                    # list field
    'architect': 'architect',
    'client': 'client',
    'owner': '',
    'status': '',
    'tour_ids': 'tour', # requires lookup in  wp_posts where post_type = tours
    'researcher': 'researcher', # possibly 'author' requires lookup in wp_users
    'overview_description': 'post_content',
    'storymap_url': '',

    # data and history
    'historic_use': 'original_program',
    'past_tenants': '',
    'street_visibilities': [''],
    'accessibilities': [''],
    'dimensions': '',
    'levels': '',
    'materials': [''],
    'structures': [''],
    'roof_types': [''],
    'roof_materials': [''],
    'structural_conditions': [''],
    'external_conditions': [''],
    'threats': [''],
    'physical_description': '',
    'streetscape': '',
    'social_history': '',
    'site_history': '',
    'archive_documents': [''],

    # image gallery - these require separate logic
    # 'images': [{ # images_and_documents requires lookup
    #   url: String,
    #   caption: String
    # }],

    'courses': ['']
  }

def get_wp_to_nhba():
  '''
  Return a mapping from nhba intternal db field to it's corresponding wp field
  '''
  wp_to_nhba = {}
  for k in nhba_to_wp:
    wp_to_nhba[k] = nhba_to_wp[k]
  return wp_to_nhba

###
# get all buildings
###

def get_building_id_to_building():
  '''
  Return a mapping from building id to building
  '''
  building_query = {'post_type': 'buildings', 'post_status': 'publish'}
  buildings = list(db['wp_posts'].find(building_query))

  building_id_to_building = {}
  for i in buildings:
    building_id_to_building[i['pre_mongified_id']] = i
  return building_id_to_building

###
# Get all terms
###

def get_term_id_to_term():
  '''
  Get all 'terms' (each term is a building category), e.g. 'Gothic', 'Tudor Revival'
  '''
  terms = list(db['wp_terms'].find({}))

  term_id_to_term = {}
  for i in terms:
    term_id = i['term_id']
    term_id_to_term[term_id] = i
  return term_id_to_term

def get_term_taxonomy_id_to_term():
  '''
  Get a mapping d[term_taxonomy_id] = {term_id: term_id, term_label: term_label}
  '''
  term_taxonomies = list(db['wp_term_taxonomy'].find({}))
  term_taxonomy_id_to_term_id = defaultdict()
  for i in term_taxonomies:
    term_taxonomy_id = i['term_taxonomy_id']
    term_id = i['term_id']
    term_label = i['taxonomy']
    term_taxonomy_id_to_term_id[term_taxonomy_id] = {
      'term_id': term_id,
      'term_label': term_label
    }
  return term_taxonomy_id_to_term_id

def get_building_id_to_term_taxonomy_ids():
  '''
  Return a mapping from builidng id to term_taxonomy id
  '''
  term_relationships = list(db['wp_term_relationships'].find({}))
  d = defaultdict(list)
  for i in term_relationships:
    building_id = i['object_id']
    term_taxonomy_id = i['term_taxonomy_id']
    d[building_id].append(term_taxonomy_id)
  return d

def get_building_id_to_terms():
  '''
  Return a mapping from building id to a list of d[term_label] = term_value
  '''

  # use lists because each term belongs to an array field in mongo
  building_id_to_terms = defaultdict(lambda: defaultdict(list))
  for building_id in building_id_to_term_taxonomy_ids.iterkeys():
    term_taxonomy_ids = building_id_to_term_taxonomy_ids[building_id]
    for term_taxonomy_id in term_taxonomy_ids:
      term = term_taxonomy_id_to_term[term_taxonomy_id]
      term_label = term['term_label']
      term_id = term['term_id']
      term_value = term_id_to_term[term_id]['name']
      building_id_to_terms[building_id][term_label].append(term_value)
  return building_id_to_terms

###
# Get building id to metadata
###

def get_building_id_to_metadata():
  '''
  Return a mapping from building id to metadata information

  the post_id key in building_metadata corresponds to
  the pre_mongified_id in buildings
  '''
  building_metadata_query = {}
  building_metadata = list(db['wp_postmeta'].find(building_metadata_query))

  building_id_to_metadata = defaultdict(lambda: defaultdict())
  for i in building_metadata:
    post_id = int(i['post_id'])
    meta_key = i['meta_key']
    meta_value = i['meta_value']
    building_id_to_metadata[post_id][meta_key] = meta_value
  return building_id_to_metadata

###
# Get attachments
###

def get_attachment_id_to_attachment():
  '''
  Return a mapping from attachment id to attachment

  the pre_mongified_id among posts with post_type attachment
  corresponds to the integers identified within fields of building
  posts
  '''
  attachment_query = {'post_type': 'attachment'}
  attachments = list(db['wp_posts'].find(attachment_query))

  attachment_id_to_attachment = defaultdict(lambda: defaultdict())
  for i in attachments:
    keys = i.keys()
    caption = ''
    if 'post_content' in keys:
      caption = i['post_content']
    if 'post_excerpt' in keys:
      caption = i['post_excerpt']

    attachment_id = int(i['pre_mongified_id'])
    url = i['guid']
    caption = caption

    # remap the image urls so the requests to go our internal filesystem
    filename = url.split('/')[-1]
    filename, file_extension = os.path.splitext(filename)
    random_int = random.randint(0,2**32)
    filename = filename + '-' + str(random_int) + file_extension

    attachment_id_to_attachment[attachment_id] = {
      'filename': filename,
      'caption': caption
    }

    # download the attachments if required
    download_file(url, filename)

  return attachment_id_to_attachment

def download_file(url, filename):
  '''
  Download a file at a given url
  '''
  if download_images == True:
    uploads_dir = '../../../build/assets/uploads/raw'
    if not os.path.exists(uploads_dir):
      os.mkdir(uploads_dir)

    # make requests to the hosted domain
    url = url.replace('nhba.yale.edu', 'live-nhba.pantheonsite.io')
    call(['wget', url, '-O', uploads_dir + '/' + filename])

###
# Get tours
###

def get_tour_id_to_tour():
  '''
  Return a mapping from tour id to tour
  '''
  tour_query = {'post_type': 'tours'}
  tours = list(db['wp_posts'].find(tour_query))

  tour_id_to_tour = defaultdict()
  for i in tours:
    tour_id = int(i['pre_mongified_id'])
    tour = i
    tour_id_to_tour[tour_id] = tour
  return tour_id_to_tour

def get_building_id_to_tour_ids():
  '''
  Return a mapping from a building's id to that building's tour
  '''
  tour_query = {'meta_key': 'tour'}
  building_tours = list(db['wp_postmeta'].find(tour_query))

  building_id_to_tour_ids = defaultdict(list)
  for i in building_tours:
    
    # try catch because two buildings have null values for tour id
    try:
      building_id = i['post_id']
      tour_id = int(i['meta_value'])
      building_id_to_tour_ids[building_id].append(tour_id)
    except ValueError:
      pass

  return building_id_to_tour_ids

###
# Get images
###

def get_image_ids(metadata_value):
  '''
  Read in a value from a building's metadata and return the image ids
  from within that value
  '''
  try:
    ids = metadata_value.split('gallery ids="')[1].split('"')[0]
    return [int(i) for i in ids.split(',')]
  except Exception as exc:
    return []

def get_images(image_ids):
  '''
  Read in a list of integer ids and return a list of image objects
  '''
  return [attachment_id_to_attachment[i] for i in image_ids] 

###
# Get the featured images for each building
###

def get_building_id_to_featured_image():
  '''
  Return a mapping from building id to that building's featured image
  '''
  default_image_id_to_url = {}
  for i in list(db['wp_posts'].find({})):
    try:
      _id = i['pre_mongified_id']
      url = i['guid']
      url = url.replace('http://nhba.yale.edu', 'http://live-nhba.pantheonsite.io/')
      default_image_id_to_url[_id] = url
    except Exception as exc:
      print exc

  building_id_to_featured_image = {}
  for i in list(db['wp_postmeta'].find({'meta_key': '_thumbnail_id'})):
    building_id = i['post_id']
    default_image_id = int(i['meta_value'])
    url = default_image_id_to_url[default_image_id]

    filename = url.split('/')[-1]
    download_file(url, filename)

    building_id_to_featured_image[building_id] = {
      'filename': filename,
      'caption': ''
    }
  return building_id_to_featured_image

###
# Combine building and metadata information
###

def get_building_and_metadata():
  '''
  Combine building and metadata information and return a d with shape:
    d[building_id][building_metadata_field] = value
  '''
  image_fields = [
    'historical_photo',
    'exterior_photo',
    'map',
    'interior_photo',
    'other_media',

    'images_and_documents' # superset of all of the above image fields
  ]

  building_and_metadata = defaultdict(lambda: defaultdict())
  for i in building_id_to_building.keys():
    building = building_id_to_building[i]
    for j in building:
      building_and_metadata[i][j] = building[j]

    # now add the metadata fields
    building_metadata = building_id_to_metadata[i]
    for j in building_metadata.keys():
      
      # handle images
      if j in image_fields:
        image_ids = get_image_ids(building_metadata[j])
        images = get_images(image_ids)
        building_and_metadata[i][j] = images

      else:
        building_and_metadata[i][j] = building_metadata[j]

    # add the 'term' values (e.g. Gothic) to the current building
    for j in building_id_to_terms[i].keys():
      building_and_metadata[i][j] = building_id_to_terms[i][j]

  return building_and_metadata

def get_migrated_buildings():
  '''
  Prepare the buildings in format required by app db
  '''
  migrated_buildings = []
  for building_id in building_and_metadata.iterkeys():
    building = building_and_metadata[building_id]
    migrated_building = {}

    # iterate over all keys required for each building
    for nhba_key in nhba_to_wp.iterkeys():
      wp_key = nhba_to_wp[nhba_key]

      # strip text fields before writing them to the db (as some fields have " ")
      if wp_key in building.iterkeys():
        if isinstance(building[wp_key], basestring):
          migrated_building[nhba_key] = building[wp_key].strip()
        else:
          migrated_building[nhba_key] = building[wp_key]
      
      # if this field is missing, add empty values of the appropriate type
      else:
        if nhba_key in list_fields:
          migrated_building[nhba_key] = []

        elif isinstance(nhba_to_wp[nhba_key], basestring):
          migrated_building[nhba_key] = ''

        else:
          migrated_building[nhba_key] = []

    # add feature image and all other images to this building
    migrated_building['images'] = building['images_and_documents']

    try:
      featured_image = building_id_to_featured_image[building_id]
      migrated_building['images'] = [featured_image] + migrated_building['images']

    except KeyError:
      print ' * no featured image was available for building id', building_id

    # attempt to add the building's tour id to the building
    try:
      migrated_building['tour_ids'] = building_id_to_tour_ids[building_id]
    except KeyError:
      print ' * no tour was available for building id', building_id

    # add this building to the list of migrated buildings
    migrated_buildings.append(migrated_building)

  return migrated_buildings

def save_migrated_buildings():
  '''
  Save each of the migrated buildings to the internal app db
  '''
  if save_records == True:
    for c, i in enumerate(migrated_buildings):
      try:
        client['nhba'].buildings.insert_one(i)
      except Exception as exc:
        print 'could not save building index', c, exc

def save_tours():
  '''
  Write the tour json to disk so it's available when we need it
  '''
  client = MongoClient('localhost', 27017)
  for i in tour_id_to_tour.iterkeys():
    tour = tour_id_to_tour[i]
    tour['tour_id'] = i
    client['nhba'].wptours.insert_one(tour)

if __name__ == '__main__':

  # config
  download_images = False
  save_records = False
  client = MongoClient('localhost', 27017)
  db = client['nhba-wp']

  # a list of fields to store as list fields
  list_fields = get_list_fields()

  # internal db field mappings
  nhba_to_wp = get_nhba_to_wp()
  wp_to_nhba = get_nhba_to_wp()

  # mappings to denormalize wordpress db
  building_id_to_building = get_building_id_to_building()
  
  # term mappings
  term_id_to_term = get_term_id_to_term()
  term_taxonomy_id_to_term = get_term_taxonomy_id_to_term()
  building_id_to_term_taxonomy_ids = get_building_id_to_term_taxonomy_ids()
  building_id_to_terms = get_building_id_to_terms()

  # images and attachments
  building_id_to_metadata = get_building_id_to_metadata()
  attachment_id_to_attachment = get_attachment_id_to_attachment()
  building_id_to_featured_image = get_building_id_to_featured_image()  

  # tours
  tour_id_to_tour = get_tour_id_to_tour()
  building_id_to_tour_ids = get_building_id_to_tour_ids()
  
  # combine and parse building metadata for output
  building_and_metadata = get_building_and_metadata()
  migrated_buildings = get_migrated_buildings()

  # save results
  save_migrated_buildings()
  save_tours()
