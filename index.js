const PORT =8000;
const axios = require('axios');
const cheerio = require('cheerio');


const express = require('express');
const app = express();
       const newspapers = [
        {
            name: 'The Guardian',
            address: 'https://www.theguardian.com/environment/climate-crisis',
            base: ''
        },
 
    {
        name: 'The Washington Post',
        address: 'https://www.washingtonpost.com/climate-environment/',
        base: ''
    },
    {
        name: 'The Wall Street Journal',
        address: 'https://www.wsj.com/search?query=climate&mod=searchresults_viewallresults',
        base: ''
   
    },
    {
        name:'telegraph',
        address:'https://www.telegraph.co.uk/climate-change/', 
        base:'https://www.telegraph.co.uk'
    },
    {
        name:'NASA',
        address:'https://climate.nasa.gov/ask-nasa-climate/?page=0&per_page=40&order=publish_date+desc%2C+created_at+desc&search=&hide_filter_bar=true&grid_list_klass=full_news_list&category=25',
        base:''
        
    },
    {
        name:'National Geographic',
        address:'https://www.nationalgeographic.com/search?q=climate%20change&location=srp&type=recommended',
        base:''
    }
];

  const articles = [];

  newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
               const html = response.data;
       const $ = cheerio.load(html);
       $('a:contains("climate")', html).each(function() {
             const title = $(this).text();
           const url = $(this).attr('href');
           
           articles.push({
               title,  
                url : newspaper.base + url,
                source: newspaper.name
            });
 
        });
    }).catch(console.error);
});



app.get('/', (req, res) => {
  res.json('Climate Change API');
});

app.get('/climate', (req, res) => {     
    res.json(articles);

});
app.get('/climate/:newspaperId', async(req, res) => {     
  const newspaperId = req.params.newspaperId;
  const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;
const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base;
 axios.get(newspaperAddress)
 .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const specificArticles = [];
    $('a:contains("climate")', html).each(function() {
        const title = $(this).text();
        const url = $(this).attr('href');
        specificArticles.push({
            title,
            url: newspaperBase + url,
            source: newspaperId
        });
    });
res.json(specificArticles);
 }).catch(console.error);

console.log(newspaperAddress);
});
    
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}   );
