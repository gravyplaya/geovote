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
app.get('/gettx/:txid', function(req, res) {
    var txid = req.params.txid;
    multichain.getRawTransaction({ txid: txid }, function (err, tx) {
        multichain.decodeRawTransaction({ "hexstring": tx }, function (err, dTx) {
            res.json({
                info: dTx
            });
        });
    });

});