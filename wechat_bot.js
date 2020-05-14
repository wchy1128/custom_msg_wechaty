const { Wechaty } = require('wechaty');
const { FileBox }  = require('file-box')

var events = require('events');
var wechat_event = new events.EventEmitter();
var wechat_bot = new Wechaty();

function onScan (qrcode, status) {
    console.log(qrcode + status);
    wechat_event.emit('on_scan', qrcode);
    //qrTerm.generate(qrcode, { small: true })  // show qrcode on console
};
  
function onLogin (user) {
console.log(`${user} login`);
//eventEmitter.emit('on_login', null);
//main()
}
  
function onLogout (user) {
console.log(`${user} logout`);
}
  
function onError (e) {
console.error(e);
}

async function onMessage (msg) {
    console.log(msg.toString())

    if (msg.age() > 60) {
      console.log('Message discarded because its TOO OLD(than 1 minute)')
      return
    }
  
    if (   msg.type() !== wechat_bot.Message.Type.Text
        || !/^(ding|ping|bing|code)$/i.test(msg.text())
        /*&& !msg.self()*/
    ) {
      console.log('Message discarded because it does not match ding/ping/bing/code')
      return
    }
  
    /**
     * 1. reply 'dong'
     */
    await msg.say('dong')
    console.log('REPLY: dong')
  
    /**
     * 2. reply image(qrcode image)
     */
    /*
    const fileBox = FileBox.fromUrl('https://wechaty.github.io/assets/images/bio-photo.png')
  
    await msg.say(fileBox)
    console.log('REPLY: %s', fileBox.toString())
    */
  }

//wechat_bot.start().catch(console.error);

function wechat_reset()
{
    if (wechat_bot.logonoff())
    {
        //wechat_bot.logout();
        wechat_bot.stop();
    }

    /*
    wechat_bot.on('scan', onScan);
    wechat_bot.on('login', onLogin);
    wechat_bot.on('logout', onLogout);
    wechat_bot.on('error', onError);
    */
}

wechat_bot.on('scan', onScan);
wechat_bot.on('login', onLogin);
wechat_bot.on('logout', onLogout);
wechat_bot.on('error', onError);
wechat_bot.on('message',  onMessage)

var wechat_obj = {bot: wechat_bot, event: wechat_event, reset: wechat_reset};

module.exports = wechat_obj;