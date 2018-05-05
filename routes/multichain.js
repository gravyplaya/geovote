var express = require('express');
var router = express.Router();
router.use(express.static(__dirname + '/public'));

var multichain = require("multichain-node")({
    port: 7324,
    host: '10.240.132.189',
    user: "multichainrpc",
    pass: "7ec1vy5PLyzeBvQp8W9pDuMq9i9MGSd4aU87AaWoB7Tb"
});
var getData = function() {
    return Math.random().toString();
}

router.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});


router.get('/', function(req, res, next) {
    res.render('mcadmin', { title: 'Voting POC Admin' });
    //res.send(req.params);
    var chaininfo = {};
    var trans = {test: "free"};


    /*   multichain.getInfo(function (err, info) {
        if (err) {
            throw err;
        }
        res.json({chaininfo: info});
        chaininfo = info;
    });
    multichain.listWalletTransactions(function (err, info) {
        if (err) {
            throw err;
        }

        //trans = info;
    });*/


    //res.render('index', { title: 'Block info', results: chaininfo, trans: trans });
    next();
});

router.get('/getinfo', function(req, res, next) {
    multichain.getInfo(function (err, info) {
        if (err) {
            throw err;
        }
        res.json(info);
    });
    next();
});
router.get('/getnewaddy', function(req, res, next) {
    multichain.getNewAddress(function (err, info) {
        if (err) {
            throw err;
        }
        res.json(info);
    });
    next();
});

router.get('/getaddresses', function(req, res, next) {
    multichain.getAddresses(function (err, addresses) {
        //multichain.createMultiSig({ nrequired: 2, keys: addresses }, function (err, wallet) {
        res.json(addresses)
        //});
    });

    next();
});
router.get('/getassets', function(req, res, next) {
    var assettype = "*" | req.params.assettype;
    multichain.listAssets(function (err, assets) {
        if (err) {
            throw err;
        }
        res.json(assets)

    });
    next();
});
router.get('/getperms', function(req, res, next) {
    var assettype = "*" | req.params.assettype;
    multichain.listPermissions(function (err, assets) {
        if (err) {
            throw err;
        }
        res.json(assets)

    });
    next();
});
router.get('/gettx/:txid', function(req, res) {
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
router.get('/sendtokentovoter/:address', function(req, res) {
    var address = req.params.address;
    var info1, info2, info3;
    multichain.grantFrom({from: "19Vwa8thz4QsoX73hjYy7H6rztocxcY5CCGVbA", to: address, permissions: "receive" }, function (err, tx) {
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



router.get('/gettokenbalance/:address*', function(req, res) {
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

router.get('/gettokenbalances', function(req, res, next) {

    multichain.getMultiBalances({ assets: ["tokens"] }, function (err, tx) {
        if (err) {
            throw err.message;
        }
        res.json({
            balances: tx
        });
    });
    next();
});


router.get('/vote/:fromaddress/:toaddress', function(req, res) {
    var toaddress = req.params.toaddress;
    var fromaddress = req.params.fromaddress;
    multichain.grantFrom({from: "19Vwa8thz4QsoX73hjYy7H6rztocxcY5CCGVbA", to: fromaddress, permissions: "send" }, function (err, tx) {
        if (err) {
            throw err.message;
        }
        multichain.sendAssetFrom({ from: fromaddress, to: toaddress, asset: "tokens", qty: 1, comment: "Casting Vote" }, function (err, res) {
            if (err) {
                throw err.message;
            }
            multichain.revoke({ addresses: fromaddress, permissions: "send" }, function (err, res) {
                if (err) {
                    throw err.message;
                }
            });
        });
    });


});





/*router.get('/gettxid/:txid', function(req, res, next) {
    var txid = req.params.txid;
    multichain.getRawTransaction({ txid: txid }, function (err, tx) {
        multichain.decodeRawTransaction({ "hexstring": tx }, function (err, dTx) {
/!*            res.json({
                info: dTx
            });*!/
            console.log(dTx);
            res.render('index', { title: 'Transaction info', tinfo: dTx });
        });
    });
});

router.get('/getnewaddress', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    //res.send(req.params);
    var newaddy = "";


    multichain.getNewAddress(function (err, info) {
        if (err) {
            throw err;
        }
        res.locals.info = info;
        console.log(info);
        newaddy = info;
    });

    console.log(newaddy);
    res.render('index', { title: 'Get new address', newaddy: newaddy});
});*/



module.exports = router;