if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const { Client } = require('whatsapp-web.js')
// const { LocalAuth } = require('whatsapp-web.js')
// const qrcode = require('qrcode-terminal')

const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const helmet = require('helmet')

const mongoSanitize = require('express-mongo-sanitize')
const Egg = require('./models/eggs')
const Price = require('./models/prices')
const Cocoon = require('./models/cocoons')
const CocoonSell = require('./models/cocoonSell')

const eggRoutes = require('./routes/eggs')
const userRoutes = require('./routes/users')
const priceRoutes = require('./routes/prices')
const cocoonRoutes = require('./routes/cocoons')
// const dbUrl = 'mongodb://localhost:27017/seri-easy'
//  'mongodb://localhost:27017/yelp-camp';
// process.env.DB_URL

const groupRoutes = require('./routes/groups')
const discussionRoutes = require('./routes/discussions')
const cocoonSellRoutes = require('./routes/cocoonSell')
const MongoDBStore = require('connect-mongo')(session)

const dateOb = new Date()
const date = ('0' + dateOb.getDate()).slice(-2)
const month = ('0' + (dateOb.getMonth() + 1)).slice(-2)
const year = dateOb.getFullYear()
const hours = dateOb.getHours()
const minutes = dateOb.getMinutes()
const seconds = dateOb.getSeconds()

let eggDate
let eggLocation
let eggQuantity
let eggContact
let priceMin
let priceMax
let priceAvg
let priceMarket
let priceDate
let msgCount = 0
let msg1Count = 0
let count = 0
let count1 = 0

console.log(date, month, year, hours, minutes, seconds)

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/seri-easy';
mongoose.connect(dbUrl)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('database connected')
})

const msg = '918074725017@c.us'
const msg1 = '918074725017@c.us'

const eggSave = async () => {
  count = 0
  msgCount = 0
  const egg = new Egg()
  egg.date = eggDate
  egg.location = eggLocation
  egg.quantity = eggQuantity
  egg.contact = eggContact
  await egg.save()
}

const priceSave = async () => {
  count1 = 0
  msg1Count = 0
  const price = new Price()
  price.date = priceDate
  price.marketName = priceMarket
  price.minimumPrice = priceMin
  price.maximumPrice = priceMax
  price.averagePrice = priceAvg
  await price.save()
}

const client = new Client()
//   {
//   authStrategy: new LocalAuth()
// }

client.on('qr', (qr) => {
  // qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
  console.log('Client is ready!')
  if (hours > 10 && hours < 24) {
    client.sendMessage(msg, 'hi')
    client.sendMessage(msg1, 'hii')
  }
})

client.on('message', (message) => {
  if (
    message.body === 'Hi' ||
    message.body === 'hi' ||
    message.body === 'Hii' ||
    message.body === 'hii'
  ) {
    message.reply('hey!')
    console.log('from', message.from)
  }
})

client.on('message', (message) => {
  console.log(message.body, message.timestamp)
  if (message.from === msg) {
    // if(false) {
    if (msgCount === 0) {
      client.sendMessage(msg, 'Do you wanna update info? type yes to continue')
      count = message.timestamp
      msgCount = 1
    }
    if (message.timestamp > count && msgCount === 1) {
      client.sendMessage(msg, 'Enter date')
      msgCount = 2
      count = message.timestamp
    }
    if (message.timestamp > count && msgCount === 2) {
      eggDate = message.body
      console.log('egg date', eggDate)
      msgCount = 3
      count = message.timestamp
      client.sendMessage(msg, 'enter location')
    }
    if (message.timestamp > count && msgCount === 3) {
      eggLocation = message.body
      console.log('egg loc', eggLocation)
      count = message.timestamp
      client.sendMessage(msg, 'enter quantity')
      msgCount = 4
    }
    if (message.timestamp > count && msgCount === 4) {
      eggQuantity = message.body
      console.log('egg quantity', eggQuantity)
      count = message.timestamp
      client.sendMessage(msg, 'enter contact')
      msgCount = 5
    }
    if (message.timestamp > count && msgCount === 5) {
      eggContact = message.body
      console.log('egg contact', eggContact)
      count = message.timestamp
      client.sendMessage(msg, `Date : ${eggDate}`)
      client.sendMessage(msg, `location: ${eggLocation}`)
      client.sendMessage(msg, `quantity: ${eggQuantity}`)
      client.sendMessage(msg, `Contact : ${eggContact}`)
      client.sendMessage(msg, 'type confirm if details are correct')
      msgCount = 6
    }
    if (
      message.timestamp > count &&
      msgCount === 6 &&
      message.body === 'confirm'
    ) {
      client.sendMessage(msg, 'okay! details are saved')
      count = message.timestamp
      msgCount = 7
      eggSave()
    }
  }
})

client.on('message', (message) => {
  console.log(message.body, message.timestamp)
  if (message.from === msg1) {
    if (msg1Count === 0) {
      client.sendMessage(
        msg1,
        'Do you wanna update prices information? type yes to continue'
      )
      msg1Count = 1
      count1 = message.timestamp
    }
    if (
      message.body === 'yes' &&
      msg1Count === 1 &&
      message.timestamp > count1
    ) {
      client.sendMessage(msg1, 'Enter Date')
      count1 = message.timestamp
      msg1Count = 2
    }
    if (message.timestamp > count1 && msg1Count === 2) {
      priceDate = message.body
      console.log('price date', priceDate)
      client.sendMessage(msg1, 'Enter market name')
      count1 = message.timestamp
      msg1Count = 3
    }
    if (message.timestamp > count1 && msg1Count === 3) {
      count1 = message.timestamp
      msg1Count = 4
      priceMarket = message.body
      client.sendMessage(msg1, 'Enter minimum price')
    }
    if (message.timestamp > count1 && msg1Count === 4) {
      count1 = message.timestamp
      msg1Count = 5
      priceMin = message.body
      client.sendMessage(msg1, 'Enter average price')
    }
    if (message.timestamp > count1 && msg1Count === 5) {
      count1 = message.timestamp
      msg1Count = 6
      priceAvg = message.body
      client.sendMessage(msg1, 'Enter maximum price')
    }
    if (message.timestamp > count1 && msg1Count === 6) {
      count1 = message.timestamp
      msg1Count = 7
      priceMax = message.body
      client.sendMessage(msg1, 'done')
      client.sendMessage(msg1, `Date: ${priceDate}`)
      client.sendMessage(msg1, `Market: ${priceMarket}`)
      client.sendMessage(msg1, `Average Price ${priceAvg}`)
      client.sendMessage(msg1, `minimum price ${priceMin}`)
      client.sendMessage(msg1, `maximum price ${priceMax}`)
      client.sendMessage(msg1, 'type confirm if all details are correct')
    }
    if (
      message.timestamp > count1 &&
      msg1Count === 7 &&
      message.body === 'confirm'
    ) {
      count1 = message.timestamp
      msg1Count = 7
      client.sendMessage(msg1, 'okayy! details are saved')
      priceSave()
      client.sendMessage(
        msg1,
        'type something if you want to update more details'
      )
    }
  }
})

client.initialize()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(mongoSanitize())

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60
})

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(helmet())

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css',
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://kit.fontawesome.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net'
]
const styleSrcUrls = [
  'https://kit-free.fontawesome.com/',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css',
  'https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjxAwXjeu.woff2',
  'https://stackpath.bootstrapcdn.com/',
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://use.fontawesome.com/'
]
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/'
]
const fontSrcUrls = []
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/douqbebwk/', // SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        'https://images.unsplash.com/'
      ],
      fontSrc: ["'self'", ...fontSrcUrls]
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

app.get('/', async (req, res) => {
  const prices = await Price.find()
  const sellers = await Cocoon.find().populate('owner')
  const eggs = await Egg.find()
  const cocoonSellers = await CocoonSell.find()
  console.log(sellers)
  res.render('home', { prices, sellers, eggs, cocoonSellers })
})

app.use('/discussions', discussionRoutes)
app.use('/groups', groupRoutes)
app.use('/eggs', eggRoutes)
app.use('/', userRoutes)
app.use('/prices', priceRoutes)
app.use('/cocoons', cocoonRoutes)
app.use('/cocoonSell', cocoonSellRoutes)

const port=process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
