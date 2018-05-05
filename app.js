var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multichain = require("multichain-node")({
  port: 7324,
  host: 'localhost',
  user: "multichainrpc",
  pass: "7ec1vy5PLyzeBvQp8W9pDuMq9i9MGSd4aU87AaWoB7Tb"
});
var handlebars = require('handlebars');
var routes = require('./routes/index');
var users = require('./routes/users');
var voteadmin = require('./routes/voteadmin');
var voterdemo = require('./routes/voterdemo');

var app = express();
//app.listen(4000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/voteadmin', voteadmin);
app.use('/voterdemo', voterdemo);

app.get('/getinfo', function(req, res) {
  multichain.getInfo(function (err, info) {
    if (err) {
      throw err;
    }
    res.json(info);
  });

});
app.get('/getnewaddy', function(req, res) {
  multichain.getNewAddress(function (err, info) {
    if (err) {
      throw err;
    }
    res.json(info);
  });
});

app.get('/getaddresses', function(req, res) {
  multichain.getAddresses(function (err, addresses) {
    //multichain.createMultiSig({ nrequired: 2, keys: addresses }, function (err, wallet) {
      res.json(addresses)
    //});
  });
});
app.get('/getassets', function(req, res) {
  var assettype = "*" | req.params.assettype;
  multichain.listAssets(function (err, assets) {
    if (err) {
      throw err;
    }
    res.json(assets)

  });
});
app.get('/getperms', function(req, res) {
  var assettype = "*" | req.params.assettype;
  multichain.listPermissions(function (err, assets) {
    if (err) {
      throw err;
    }
    res.json(assets)

  });
});
app.get('/gettx/:txid', function(req, res) {
  var txid = req.params.txid;
  multichain.getRawTransaction({ txid: txid }, function (err, tx) {
    multichain.decodeRawTransaction({ "hexstring": tx }, function (err, dTx) {
      if (err) {
        throw err;
      }
      res.json({
       info: dTx
       });
    });
  });

});
app.get('/sendtokentovoter/:address', function(req, res) {
  var address = req.params.address;
  var info1, info2, info3;
  multichain.grantFrom({from: "189MD9zo3C6daV4xzFSdtwaHFGupKJCupJWy1j", to: address, permissions: "receive" }, function (err, tx) {
    if (err) {
      throw err.message;
    }
        info1= tx;
    multichain.sendAssetToAddress({ address: address, asset: "tokens", qty: 1 }, function (err, tx) {
      if (err) {
        throw err.message;
      }
      info2= tx;
      multichain.revoke({ addresses: address, permissions: "receive" }, function (err, tx) {
        if (err) {
          throw err.message;
        }
        info3= tx;
      });
    });
  });
  res.json({
    info1: info1,
    info2: info2,
    info3: info3
  });
});



app.get('/gettokenbalance/:address*', function(req, res) {
  var address = req.params.address;

  multichain.getMultiBalances({ addresses: address, assets: ["tokens"] }, function (err, tx) {
    if (err) {
      throw err.message;
    }
    res.json({
      balance: tx
    });
  });

});

app.get('/gettokenbalances', function(req, res) {

  multichain.getMultiBalances({ assets: ["tokens"] }, function (err, tx) {
    if (err) {
      throw err.message;
    }
    res.json({
      balances: tx
    });
  });

});


app.get('/vote/:fromaddress/:toaddress', function(req, res) {
  var toaddress = req.params.toaddress;
  var fromaddress = req.params.fromaddress;
  multichain.grantFrom({from: "189MD9zo3C6daV4xzFSdtwaHFGupKJCupJWy1j", to: fromaddress, permissions: "send" }, function (err, tx) {
    if (err) {
      console.error(err.message);
      throw err.message;
    }
    multichain.sendAssetFrom({ from: fromaddress, to: toaddress, asset: "tokens", qty: 1, comment: "Casting Vote" }, function (err, res) {
      if (err) {
        console.error(err.message);
        throw err.message;
      }
      multichain.revoke({ addresses: fromaddress, permissions: "send" }, function (err, res) {
        if (err) {
          console.error(err.message);
          throw err.message;
        }
      });
    });
  });


});



/*multichain.issue({ address: someAddress, asset: "token", qty: 1, units: 0.01, details: { hello: "world" } }, function (err, res) {
  console.log(res);
});
multichain.sendAssetFrom({ from: someAddress, to: someOtherAddress, asset: "token", qty: 1 }, function (err, tx) {
  console.log(tx);
});
multichain.getAddresses(function (err, addresses) {
  multichain.createMultiSig({ nrequired: 2, keys: addresses }, function (err, wallet) {
    console.log(wallet);
  });
});
multichain.getRawTransaction({ txid: someTxId }, function (err, tx) {
  multichain.decodeRawTransaction({ "hexstring": tx }, function (err, dTx) {
    console.log(dTx);
  });
});*/



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
