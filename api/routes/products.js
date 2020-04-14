var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.json({ product: [
      {id:'1', name: 'Product1', stok:0},
      {id:'2', name: 'Product2', stok:0},
      {id:'3', name: 'Product3', stok:0},
      {id:'4', name: 'Product4', stok:0},
      {id:'5', name: 'Product5', stok:0},
      {id:'6', name: 'Product6', stok:0},
      {id:'7', name: 'Product7', stok:0},
      {id:'8', name: 'Product8', stok:0},
      {id:'9', name: 'Product9', stok:0},
      {id:'10', name: 'Product10', stok:0},
    ]
  });
});

module.exports = router;
