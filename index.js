var express = require('express');
var http = require('http');
var superagent = require('superagent');
var cheerio = require('cheerio');
var app = express();

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var app = express();

var server = http.createServer(app);

app.get('/', function (req, res, next) {
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get('https://cnodejs.org/')
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // console.log(sres.text);
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#topic_list .cell').each(function (idx, element) {
        var $element = $(element);
        items.push({
          img: $element.find($('.pull-right')).attr('href'),
          title: $element.find($('.topic_title')).attr('title'),
          href: $element.find($('.topic_title')).attr('href')
        });
      });

      res.send(items);
    });
});


server.listen(port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}