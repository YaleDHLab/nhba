var db = {}

db.user = {
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  token: String,
  validated: Boolean
}

db.select = {
  field: String,
  options: [String]
}

db.building = {

  sql_building_id: Number,

  // overview
  building_name: String,
  address: String,
  year_built: String,
  styles: [String],
  current_uses: [String],
  current_tenant: String,
  neighborhoods: [String],
  eras: [String],
  architect: String,
  client: String,
  owner: String,
  status: String,
  tour_ids: [Number],
  researcher: String,
  overview_description: String,
  storymap_url: String,

  // data and history
  historic_use: String,
  past_tenants: String,
  street_visibilities: [String],
  accessibilities: [String],
  dimensions: String,
  levels: String,
  materials: [String],
  structures: [String],
  roof_types: [String],
  roof_materials: [String],
  structural_conditions: [String],
  external_conditions: [String],
  threats: [String],
  physical_description: String,
  streetscape: String,
  social_history: String,
  site_history: String,
  archive_documents: [{
    filename: String,
    label: String
  }],

  // image gallery
  images: [{
    filename: String,
    caption: String
  }],

  // fields not in admin ui
  courses: [String],
  tour_position: Number
}

module.exports = db