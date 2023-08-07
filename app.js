const express = require('express');
const { engine } = require('express-handlebars')
const app = express();
const port = 3000;
const restaurants = require('./public/jsons/restaurant.json').results;


app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use('/public/stylesheets', express.static(__dirname + '/public/stylesheets', { 'Content-Type': 'text/css'}));

app.get('/', (req, res) => {
    res.redirect(`/restaurants`)
})

app.get('/restaurants', (req, res) => {
    const keyword = req.query.keyword
    const matchedRestaurants = keyword ? restaurants.filter((restaurant) => 
      Object.values(restaurant).some((property) => {
        if (typeof property === 'string') {
            return (property.toLocaleLowerCase().includes(keyword.toLowerCase())) && (property === restaurant.name || property === restaurant.category || property === restaurant.name_en || property === restaurant.location)
        }
        return false
      })
    ) : restaurants
    res.render('index', { restaurants: matchedRestaurants, keyword})
    })

app.get('/restaurants/:id', (req, res) => {
    const id = req.params.id
    const restaurant = restaurants.find((restaurant) => restaurant.id.toString() === id)
    res.render('detail', {restaurant})
})

app.listen(port, () => {
    console.log(`Start http://localhost:${port}`)
})