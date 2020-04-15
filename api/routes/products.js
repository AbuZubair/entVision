var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.json({ product: [
      {id:'1', name: 'Product1', stok:0, img:'https://images.pexels.com/photos/669006/pexels-photo-669006.jpeg?w=1260'},
      {id:'2', name: 'Product2', stok:0, img:'https://images.pexels.com/photos/669006/pexels-photo-669006.jpeg?w=1260'},
      {id:'3', name: 'Product3', stok:0, img:'https://images.pexels.com/photos/669006/pexels-photo-669006.jpeg?w=1260'},
      {id:'4', name: 'Product4', stok:0, img:'https://i.picsum.photos/id/237/200/300.jpg'},
      {id:'5', name: 'Product5', stok:0, img:'https://i.picsum.photos/id/237/200/300.jpg'},
      {id:'6', name: 'Product6', stok:0, img:'https://i.picsum.photos/id/237/200/300.jpg'},
      {id:'7', name: 'Product7', stok:0, img:'https://i.picsum.photos/id/237/200/300.jpg'},
      {id:'8', name: 'Product8', stok:0, img:'https://picsum.photos/seed/picsum/200/300'},
      {id:'9', name: 'Product9', stok:0, img:'https://picsum.photos/seed/picsum/200/300'},
      {id:'10', name: 'Product10', stok:0, img:'https://picsum.photos/seed/picsum/200/300'},
    ]
  });
});

module.exports = router;
