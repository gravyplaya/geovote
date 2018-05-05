/*var app=angular.module('two_way',[]);
app.controller('two_way_control',function($scope,$rootScope,$http,$interval,$filter){
    $rootScope.newaddys = {};
    //load_pictures();
    ///$interval(function(){
    ///    load_pictures();
    ///},300);
    //function load_pictures(){
        $http.get('/getaddresses').success(function(data){
            var items=data.map(function(name){ return { addy:name,value:null}; })
            $rootScope.newaddys = items;
            //angular.copy(data, $scope.newaddy);
            console.log($rootScope.newaddys)
        });
    //};
    console.log($rootScope.newaddys)
    $scope.usingservice = $filter('findobj')($rootScope.newaddys,[1,3])
});

app.filter('findobj', function() {

    return function(list, obj) {

        return list.filter(function(l) {
            if (obj.indexOf(l.name) >= 0) {
                return true;
            }
        });

    };
})*/





var currentAssets = {};

/*function getassets() {
    $.get( "/getassets", function( data ) {

        $.each(data, function( index, value ) {
            $( "#currentAssets" ).append("<li>"+value.name+" <br>Qty Issued:"+value.issueqty+"<br>ID: "+value.issuetxid+"<br>Asset Ref: "+value.assetref+"</li>" );
        });
    });

};

function getaddresses() {
    $.get( "/getaddresses", function( data ) {
        $.each(data, function( index, value ) {
            $( "#currentAddys" ).append("<li>"+value+"</li>" );
        });
    });
};*/
function getperms() {
    $.get( "/getperms", function( data ) {
        $.each(data, function( index, value ) {
            $( "#currentPerms" ).append("<li>"+value.address+":"+value.type+"</li>" );
        });

    });
};
function getnewaddy() {
    $.get( "/getnewaddy", function( data ) {
        $( "#mynewaddy" ).html( data );
        console.log(data);
    });
};

function sendTokenToVoter() {
    var voterAddy = $( "#voterAddress" ).val();
    $.get( "/sendtokentovoter/"+voterAddy, function( data ) {
        //$( "#sendTokenStatus" ).html( "token sent to "+voterAddy );
        console.log(data);
    })  .done(function(data) {
        $( "#sendTokenStatus" ).html( "token sent to "+voterAddy );
        console.log(data);
    })
        .fail(function(error) {
            console.log( error );
        });
};

function getTokenBalance() {
    var checkerAddress = $( "#checkerAddress" ).val();
    //if (typeof (checkerAddress == undefined)) { checkerAddress = "*" } else {checkerAddress = $( "#checkerAddress" ).val()};

    $.get( "/gettokenbalance/"+checkerAddress, function( data ) {
        //$( "#sendTokenStatus" ).html( "token sent to "+voterAddy );

    })  .done(function(data) {
        var total = data.balance.total;
        if (total.length >= 1) {
            $( "#tokenBalance" ).html( "Token Balance: "+total[0].qty );
        } else {
            $( "#tokenBalance" ).html( "Token Balance: 0" );
        }
        $( "#tokenBalance" ).fadeIn('fast').delay(5000).fadeOut('slow');

    })
        .fail(function(error) {
            console.log( error.responseText );
        });
};
function getTokenBalances() {
    $.get( "/gettokenbalances/", function( data ) {
        $( "#tokenBalances" ).html("");
    })  .done(function(data) {
        
        $.each(data.balances, function( name, value ) {
            $( "#tokenBalances" ).append("<li>"+name+": "+value[0].qty+"</li>" );
        });
        //$( "#tokenBalances" ).fadeIn('fast').delay(5000).fadeOut('slow');

    })
        .fail(function(error) {
            console.log( error.responseText );
        });
};

function vote() {
    var fromAddress = $( "#fromAddress" ).val();
    var toAddress = $("#toAddress option:selected").text(); //$( "#toAddress" ).val();
    $.get( "/vote/"+fromAddress+"/"+toAddress, function( data ) {
        //$( "#sendTokenStatus" ).html( "token sent to "+voterAddy );
        console.log("here")
    })  .done(function(data) {
        console.log(data);

        $( "#voteResults" ).html( "Vote has been sucessfully cast." );

    }).fail(function(error) {
            console.log( error );
        });
};
/*

address for candidate1. candidates only have recieve permissions to recieve tokens
1MCUxo4Dv2B2yE861TXxoLZyAC1JbZtodTVBWg
candidate 2
 1QzS7XcfAh56T4uzowr3Bw9poNT9oZhcUqpCvL

poll server address. has full perms. issue tokens from poll server to voter server.
 19Vwa8thz4QsoX73hjYy7H6rztocxcY5CCGVbA

address for voter server/multichain address -  has send and receive perms. recieves tokens from poll server
    1D1QEvQa7BBFvDAUv2nbXDyRnnMGn7dgSAJxJu, send,receive

issue 10000 tokens to poll server
 multichain-cli chain1 issue 19Vwa8thz4QsoX73hjYy7H6rztocxcY5CCGVbA '{"name":"tokens","open":true}' 10000 1
 {"method":"issue","params":["19Vwa8thz4QsoX73hjYy7H6rztocxcY5CCGVbA",{"name":"tokens","open":true},10000,1],"id":1,"chain_name":"chain1"}

 bef05f2edb96f18ac0fa1f347fecbc8efe1c6fcdfb527733617abebdbd49793b

test voters = 1WEu2hQrYcyuwMCbdqfJgXJ1Gs7y8xGtdvXSyK,1G2M84VZegjnKgweBdEnUHMthvARwnZ2aT7nxD

stream address  67ddfb47fab790aaf06811a3a818486ff35d06adf3adce774466db9be9512c1d
*/
