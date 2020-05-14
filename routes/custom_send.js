var express = require('express');
var mongodb = require('../database/connectMongoDB');
var router = express.Router();

const { 
  Contact,
  log,
  Wechaty, 
}           = require('wechaty')
var wechat_obj = require('../wechat_bot');

var statistic_info = {};

/* GET users listing. */
router.get('/', async function(req, res, next) {
  if (!wechat_obj.bot.logonoff())
  {
    res.redirect('/');
    return;
  }

  statistic_info = {official: [], friend_list: [], no_friend_list: [], friend_cnt: 0, friend_male: 0, friend_female: 0, no_friend_male: 0, friend_unknown_gender: 0, no_friend_female: 0};

  const contactList = await wechat_obj.bot.Contact.findAll()
  console.log('Bot Contact number: ' + contactList.length)

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
        is_friend: contact.friend(),
        gender: contact.gender(),
        province: contact.province(),
        city: contact.city(),
        type: contact.type(),
        //tags: await contact.tags(),
        alias: await contact.alias(),
        avatar: await contact.avatar()
      };

      if (info.is_friend)
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

  /*
  
    var UserEntity = new mongodb.userModel({
    name : 'wiliam',
    age : 22,
    email :'wiliam@ss.com'
  });
  UserEntity.save(function(error,doc){
      if(error){
          console.log('error :' + error);
      }else{
          console.log(doc);
          console.log('保存成功');
      }
  });

  mongodb.userModel.find({name:'wiliam'}, function(error, docs) {
        if(error){
            console.log('error :' + error);
            res.render('index', { title: 'Express',msg:'查询出错啦'+docs});
        }else{
            console.log(docs);
            console.log('查询成功');
            res.render('index', { title: 'Express',msg:'查出数据啦'+docs});
        }
  });
  
  */

  // Store the contact info
  for (let i = 0; i < statistic_info.friend_list.length; i++)
  {
    item = statistic_info.friend_list[i];
    result = await mongodb.contact_model.find({id: item.id});
    if (res.length)
    {
      item.custom_str = result[0].custom_str;
      if (item.custom_str == null)
      {
        console.log('Error null');
      }
    }
    else
    {
      if(item.alias == null)
      {
        item.custom_str = 'This is a test, ' + item.name;
      }
      else
      {
        item.custom_str = 'This is a test, ' + item.alias;
      }

      mongodb.contact_model.updateOne({id: item.id}, item, {upsert: true}, function(err, res){
        if(err){
            console.log('error :' + err);
        }else{
            //console.log(res);
        }
      });
    }
  }

  res.render('custom_send', {title: "Custom Send", statistic: statistic_info});
  //res.render('contact', {title: "Contact", officials: official_array, friends: friend_array, no_friends: no_friend_array});
});

router.get('/send_batch_msg', async function(req, res, next) {
  for (let i = 0; i < statistic_info.friend_list.length; i++)
  {
    item = statistic_info.friend_list[i];

    if (item.alias == "李雪莉")
    {
      console.log('Send %s msg: %s', item.alias, item.custom_str);
      const contactList = await wechat_obj.bot.Contact.find({ alias: item.alias});
      contactList.say(item.custom_str);
    }
  }

  res.json({result: true});
});

module.exports = router;
