const fs = require('fs')
const { faker } = require('@faker-js/faker')
const { Factory } = require('rosie')
const _ = require('lodash')

Factory.define('Record')
  .sequence('id')
  .attr('createdAt', () => faker.date.recent({ days: 10 }))
  .attr('updatedAt', ['createdAt'], (from, to = new Date()) => faker.date.between({ from, to }))

Factory.define('Business').extend('Record')
  .attr('name', () => faker.company.name())

Factory.define('Category').extend('Record')
  .attr('name', () => faker.commerce.department())

Factory.define('BusinessCategory')
  .sequence('businessId')
  .sequence('categoryId')

Factory.define('Campaign').extend('Record')
  .sequence('businessId')
  .attr('name', () => faker.company.buzzPhrase())
  .attr('budget', () => 2000 + faker.number.int(18000))

Factory.define('Location').extend('Record')
  .sequence('businessId')
  .attr('latitude', () => faker.location.latitude({ min: 40.7079853, max: 40.7229593, precision: 14 }))
  .attr('longitude', () => faker.location.longitude({ min: -74.00791979999997, max: -74.0027179, precision: 14 }))

Factory.define('ExternalSystem').extend('Record')
  .attr('name', () => faker.company.name())
  .attr('provider', () => faker.lorem.word(5))
  .attr('baseUrl', () => faker.internet.url())

Factory.define('ExternalSystemInstallation').extend('Record')
  .sequence('businessId')
  .sequence('externalSystemId')
  .attr('encryptedPrivateApiKey', () => faker.number.int(9000) + 1000)

const cogs = Factory.build('ExternalSystem', { name: "Cogswell's Cogs", provider: 'cogs', baseUrl: 'https://cogswells-cogs.up.railway.app' })
const sprockets = Factory.build('ExternalSystem', { name: "Spaceley's Sprockets", provider: 'sprockets', baseUrl: 'https://spaceleys-sprocket.up.railway.app' })
const externalSystems = [ cogs, sprockets ]

const retail = Factory.build('Category', { name: 'Food Stores-Retail' })
const eating = Factory.build('Category', { name: 'Eating and Drinking Places' })
const other  = Factory.build('Category', { name: 'Other Medical Facilities' })
const categories = [
  retail,
  eating,
  other,
  ...Factory.buildList('Category', 10),
]

const brfg = Factory.build('Business', { name: 'Blue Ribbon Federal Grill' })
const gg   = Factory.build('Business', { name: 'Gourmet Garage' })
const hjb  = Factory.build('Business', { name: "Hank's Juicy Beef" })
const kws  = Factory.build('Business', { name: 'Keste Wall Street' })
const ua   = Factory.build('Business', { name: 'Unity Acupuncture' })
const businesses = [
  brfg,
  ...Factory.buildList('Business', 25),
  gg,
  ...Factory.buildList('Business', 38),
  hjb,
  ...Factory.buildList('Business', 34),
  kws,
  ...Factory.buildList('Business', 12),
  ua,
  ...Factory.buildList('Business', 20)
]

const businessesCategories = [
  Factory.build('BusinessCategory', { businessId: brfg.id, categoryId: retail.id }),
  Factory.build('BusinessCategory', { businessId: gg.id,   categoryId: retail.id }),
  Factory.build('BusinessCategory', { businessId: hjb.id,  categoryId: retail.id }),
  Factory.build('BusinessCategory', { businessId: kws.id,  categoryId: eating.id }),
  Factory.build('BusinessCategory', { businessId: ua.id,   categoryId: other.id }),
]

const campaigns = [
  Factory.build('Campaign', { budget: 3200,  businessId: brfg.id, name: 'Burger Bonanza'      }),
  Factory.build('Campaign', { budget: 8300,  businessId: brfg.id, name: 'Fried Chicken Sale'  }),
  Factory.build('Campaign', { budget: 2000,  businessId: brfg.id, name: 'Salad, salad salad!' }),
  Factory.build('Campaign', { budget: 20000, businessId: gg.id,   name: 'Lunch Time'          }),
  Factory.build('Campaign', { budget: 12000, businessId: hjb.id,  name: 'Sausage Sale'        }),
  Factory.build('Campaign', { budget: 6000,  businessId: hjb.id,  name: 'All the fixings'     }),
  Factory.build('Campaign', { budget: 12000, businessId: ua.id,   name: 'Campaign 1'          }),
  Factory.build('Campaign', { budget: 4870,  businessId: ua.id,   name: 'Campaign 2'          }),
  Factory.build('Campaign', { budget: 73048, businessId: ua.id,   name: 'Campaign 3'          }),
  Factory.build('Campaign', { budget: 9872,  businessId: ua.id,   name: 'Campaign 4'          }),
  Factory.build('Campaign', { budget: 17805, businessId: ua.id,   name: 'Campaign 5'          }),
  Factory.build('Campaign', { budget: 7100,  businessId: ua.id,   name: 'Campaign 6'          })
]

const locations = [
  Factory.build('Location', { businessId: brfg.id, latitude: 40.7079853,        longitude: -74.0077109 }),
  Factory.build('Location', { businessId: gg.id,   latitude: 40.7229593,        longitude: -74.0027179 }),
  Factory.build('Location', { businessId: hjb.id,  latitude: 40.7143487,        longitude: -74.00721469999996 }),
  Factory.build('Location', { businessId: kws.id,  latitude: 40.7092842,        longitude: -74.00492600000001 }),
  Factory.build('Location', { businessId: ua.id,   latitude: 40.71438860000001, longitude: -74.00791979999997 }),
]

const externalSystemInstallations = [
  Factory.build('ExternalSystemInstallation', { businessId: brfg.id, externalSystemId: cogs.id,      encryptedPrivateApiKey: 100 }),
  Factory.build('ExternalSystemInstallation', { businessId: gg.id,   externalSystemId: cogs.id,      encryptedPrivateApiKey: 100002 }),
  Factory.build('ExternalSystemInstallation', { businessId: hjb.id,  externalSystemId: sprockets.id, encryptedPrivateApiKey: 10004 }),
  Factory.build('ExternalSystemInstallation', { businessId: ua.id,   externalSystemId: sprockets.id, encryptedPrivateApiKey: 1006 }),
  Factory.build('ExternalSystemInstallation', { businessId: kws.id,  externalSystemId: cogs.id,      encryptedPrivateApiKey: 18 }),
]

for (const business of businesses) {
  const id = business.id
  if (!_.find(businessesCategories, { businessId: id })) {
    businessesCategories.push(Factory.build('BusinessCategory', {
      businessId: id,
      categoryId: _.sample(categories).id
    }))
  }

  if (!_.find(externalSystemInstallations, { businessId: id })) {
    externalSystemInstallations.push(Factory.build('ExternalSystemInstallation', {
      businessId: id,
      externalSystemId: _.sample(externalSystems).id
    }))
  }

  if ((id != kws.id) && (!_.find(campaigns, { businessId: id }))) {
    campaigns.push(...Factory.buildList('Campaign', 3 + faker.number.int(10), { businessId: id }))
  }

  if (!_.find(locations, { businessId: id })) {
    locations.push(Factory.build('Location', { businessId: id }))
  }
}

const data = {
  categories,
  businesses,
  businessesCategories,
  campaigns,
  locations,
  externalSystems,
  externalSystemInstallations
}

for (const name in data) {
  const records = data[name]
  fs.writeFileSync(`./db/${name}.json`, JSON.stringify(records, null, 2))
}
