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
  if (!wechat_obj.bot.logonoff())
  {
    res.redirect('/');
    return;
  }

  const contactList = await wechat_obj.bot.Contact.findAll()
  console.log('Bot Contact number: ' + contactList.length)

  var statistic_info = {official: [], friend_list: [], no_friend_list: [], friend_cnt: 0, friend_male: 0, friend_female: 0, no_friend_male: 0, friend_unknown_gender: 0, no_friend_female: 0};

  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i]
    if (contact.type() === Contact.Type.Official)
    {
      console.log('Bot', `official ${i}: ${contact}`)
      statistic_info.official.push({name: contact.name()});
    }
    else if (contact.type() === Contact.Type.Personal)
    {
      var info = {
        id: contact.id,
        name: contact.name(),
        gender: contact.gender(),
        type: contact.type(),
        alias: await contact.alias(),
        avatar: await contact.avatar()
      };
      if (contact.friend())
      {
        statistic_info.friend_cnt++;
        if (info.gender == Contact.Gender.Male)
        {
          statistic_info.friend_male++;
        }
        else if (info.gender == Contact.Gender.Female)
        {
          statistic_info.friend_female++;
        }
        else
        {
          statistic_info.friend_unknown_gender++;
        }

        statistic_info.friend_list.push(info)
      }
      else
      {
        statistic_info.no_friend_list.push(info)
      }
      //console.log('Bot', `personal ${friend_count}/${i}: ${contact.type()} : ${contact.name()} : ${await contact.alias()} : ${contact.id}`)
    }
  }

  res.render('dashboard', {title: "Dashboard", statistic: statistic_info});
  //res.render('contact', {title: "Contact", officials: official_array, friends: friend_array, no_friends: no_friend_array});
});

module.exports = router;
