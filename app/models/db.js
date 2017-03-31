var db = {}

db.user = {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  token: String,
  validated: Boolean
}

db.building = {

  // public profile
  name: String,
  address: String,
  style: String,
  yearBuilt: String,
  currentUse: String,
  historicUse: String,
  neighborhood: String,

  tour: String,
  description: String,
  streetscape: String,
  socialHistory: String,
  storyMapURL: String,
  archiveDocuments: [{
    url: String,
    label: String
  }],
  resources: [{
    url: String,
    label: String
  }],

  // building history
  currentTenant: String,
  pastTenant: String,
  architect: String,
  client: String,
  owner: String,
  status: String,
  streetVisibility: String,
  accessibility: String,
  explain: String,
  dimensions: String,
  stories: String,
  material: String,
  structure: String,
  roofType: String,
  roofMaterial: String,
  structuralCondition: String,
  externalCondition: String,
  threats: String,
  physicalDescription: String,
  streetscape: String,
  socialHistory: String,
  siteHistory: String,
  additionalInformation: String,

  // media gallery
  coverPhoto: String,
  gallery: [String],
  submissions: [String],

  // non-form fields
  location: {
    latitude: String,
    longitude: String
  },

  // from internal db
  researcher: String
}

module.exports = db