// Initialize Firebase
var config = {
    apiKey: "AIzaSyA3f3F9htQrG1AkgTYkyPoVF6eXhO0gxX0",
    authDomain: "voterdemo-ad4c1.firebaseapp.com",
    databaseURL: "https://voterdemo-ad4c1.firebaseio.com",
    storageBucket: "voterdemo-ad4c1.appspot.com",
    messagingSenderId: "840305418724"
};
firebase.initializeApp(config);
AUTH0_CLIENT_ID = 'TWhqFe9oA15xR003gFiVwMLOSHDGpQsj';
AUTH0_DOMAIN = 'maybe.auth0.com';

/*
firebase.initializeApp(config);

firebase.database().ref('stories').on('value', function(data){
    $('#stories').empty();

    data.forEach(function(story){
        generateStory(story);
    })
});

firebase.database().ref('story').on('value', function(data){
    $('#story').empty();
    data.forEach(function(data){
        var emoji = data.val();
        $('#story').append('<i class="em em-' + emoji + '"></i>')
    })
})

function generateStory(story){
    var $div = $("<div><hr></div>")
    $('#stories').prepend($div);
    story.forEach(function(page){
        $($div).append('<i class="em em-' + page.val() + '"></i>');
    })
}

function getRandomEmoji(){
    $('#options').empty();
    for(var i = 0; i < 30; i++){
        var number = randomNum();
        $('#options').append('<i class="em em-' + emoji[number] + '" onclick="addToStory('+ number +')"></i>');
    }
}
getRandomEmoji();

function addToStory(number){
    var current = firebase.database().ref('story');
    current.transaction(function(data){
        if(data){
            console.log(Object.keys(data).length)
            if(Object.keys(data).length == 9){
                data.final = emoji[number];
                firebase.database().ref('stories').push(data);
                firebase.database().ref('story').remove();
            } else {
                firebase.database().ref('story').push(emoji[number]);
            }
        } else {
            firebase.database().ref('story').push(emoji[number]);
        }
    })
}
*/
function randomNum(){
    return Math.floor(Math.random() * (emoji_count - 0)) + 0;
}

function loginWithGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var user = result.user;
    }).catch(function(error) {
        console.log(error);
    });
}

function login(type){
    var lock = new Auth0LockPasswordless(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
    var auth0 = new Auth0({ domain : AUTH0_DOMAIN, clientID: AUTH0_CLIENT_ID });
    var appearanceOpts = { autoclose: true };
console.log(type)

    switch (type) {
        case 'sms':
            lock.sms(appearanceOpts, function (err, profile, id_token, access_token, state, refresh_token) {
                if (!err) {
                    // Save the JWT token.
                    localStorage.setItem('userToken', id_token);
                    localStorage.setItem('profile', JSON.stringify(profile));
                    var options = {
                        id_token: id_token,
                        api: 'firebase',
                        scope: 'openid name email displayName',
                        target: AUTH0_CLIENT_ID
                    };
                    auth0.getDelegationToken(options, function (err, result) {
                        if (!err) {
                            //console.log(result); // returns JWT token from auth0
                            firebase.auth().signInWithCustomToken(result.id_token).catch(function (error) {
                                console.log(error);
                            });
                        }
                    });

                    //console.log('profile', profile);
                    $('.login-box').hide();
                    $('.logged-in-box').show();
                    $('.nickname').text(profile.name);
                    $('.avatar').attr('src', profile.picture);
                }
            });
            break;
        case 'email':
            lock.emailcode(appearanceOpts, function (err, profile, id_token, access_token, state, refresh_token) {
                if (!err) {
                    // Save the JWT token.
                    localStorage.setItem('userToken', id_token);
                    localStorage.setItem('profile', JSON.stringify(profile));
                    var options = {
                        id_token: id_token,
                        api: 'firebase',
                        scope: 'openid name email displayName',
                        target: AUTH0_CLIENT_ID
                    };
                    auth0.getDelegationToken(options, function (err, result) {
                        if (!err) {
                            //console.log(result); // returns JWT token from auth0
                            firebase.auth().signInWithCustomToken(result.id_token).catch(function (error) {
                                console.log(error);
                            });
                        }
                    });

                    //console.log('profile', profile);
                    $('.login-box').hide();
                    $('.logged-in-box').show();
                    $('.nickname').text(profile.name);
                    $('.avatar').attr('src', profile.picture);
                }
            });
            break;

    }




 /*   lock.show({
    }, function(err, profile, id_token) {
        localStorage.setItem('profile', JSON.stringify(profile));
        var options = {
            id_token : id_token,
            api : 'firebase',
            scope : 'openid name email displayName',
            target: AUTH0_CLIENT_ID
        };
        auth0.getDelegationToken(options, function(err, result){
            if(!err){
                firebase.auth().signInWithCustomToken(result.id_token).catch(function(error) {
                    console.log(error);
                });
            }
        });
    }, function() {
        // Error callback
    }); */
}

function logout(){
    localStorage.removeItem('profile');
    firebase.auth().signOut().then(function() {
        console.log("Signout Successful")
    }, function(error) {
        console.log(error);
    });
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var profile = localStorage.getItem('profile');
        profile = JSON.parse(profile);
        $('#logout-btn').show();
        $('#signin-btn').hide();
        $('#contribute').show();
        $('#email').show().append('<span>Welcome: <strong>' + profile.email + '</strong></span>')
    } else {
        $('#logout-btn').hide();
        $('#signin-btn').show();
        $('#contribute').hide();
        $('#email').hide().empty();
    }
});