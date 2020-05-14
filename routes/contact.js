var express = require('express');
var router = express.Router();

const { 
  Contact,
  log,
  Wechaty, 
}           = require('wechaty')
var wechat_obj = require('../wechat_bot');

/* GET users listing. */
router.get('/', async function(req, res, next) {

  const contactList = await wechat_obj.bot.Contact.findAll()
  console.log('Bot Contact number: ' + contactList.length)

  //official contacts list
  var official_array = new Array();
  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i]
    if (contact.type() === Contact.Type.Official) {
      console.log('Bot', `official ${i}: ${contact}`)
      official_array.push({name: contact.name()});
    }
  }

  //personal contact list
  var friend_count = 0;
  var friend_array = new Array();
  var no_friend_array = new Array();
  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i]
    if (contact.type() === Contact.Type.Personal) {
      var info = {
        id: contact.id,
        name: contact.name(),
        type: contact.type(),
        alias: await contact.alias(),
        avatar: await contact.avatar()
      };
      if (contact.friend())
      {
        friend_count++;
        friend_array.push(info)
      }
      else
      {
        no_friend_array.push(info)
      }
      //console.log('Bot', `personal ${friend_count}/${i}: ${contact.type()} : ${contact.name()} : ${await contact.alias()} : ${contact.id}`)
    }
  }

  res.render('contact', {title: "Contact", officials: official_array, friends: friend_array, no_friends: no_friend_array});
});

module.exports = router;
