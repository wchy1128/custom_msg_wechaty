var express = require('express');
var router = express.Router();
var mongodb = require('../database/connectMongoDB');
var wechat_obj = require('../wechat_bot');

var index_status = 'init';
var old_qrcode = '';
router.get('/', async function(req, res, next) {

  if (wechat_obj.bot.logonoff())
  {
    res.redirect('/dashboard');
  }
  else
  {
    if (index_status == 'init')
    {
      wechat_obj.bot.start().catch(console.error);
      wechat_obj.event.on('on_scan', function(qrcode){
        console.log('Get new qrcode: ' + qrcode);
        index_status = 'wait_scan';
        old_qrcode = qrcode;
      });

      res.render('index', { title: 'Scan qrcode'});
    }
    else
    {
      res.render('index', { title: 'Scan qrcode',qrcode_url: `/qr_image?text=${encodeURIComponent(old_qrcode)}`});
    }
  }

  /*
  eventEmitter.once('on_login', function(){
    res.redirect('/contact');
  });
  */

});

router.get('/check_login', async function(req, res, next) {
  if (wechat_obj.bot.logonoff()) {
    console.log('Bot logined');
    //res.redirect('/contact');
    //res.send(true);
    res.json({logonoff: true});
  } else {
    console.log('Bot not logined');
    //res.send(false);
    res.json({logonoff: false, qrcode: old_qrcode});
  }

});

module.exports = router;