var publicData = (function() {
    "use strict";

    var pubgDataTracker = {
        player: "d4nnyd",
        playerData: {},
        fn: {}
    };

    $.ajaxSetup({
        headers: {
            Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4NDI5YmQyMC0xOTUzLTAxMzYtNjVkNS00ZDI4ZmVkOTQyNTUiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTIyNzQ5NTIzLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InN0YXRncmFwaDNkIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MTB9.KoGJMKnYPLVFP0bVQ_c8vvsb5kdOEauQZbcgp8AFAMI",
            Accept: "application/vnd.api+json",
        }
      });

      pubgDataTracker.fn.searchPlayer = function() {
        $.get("https://api.playbattlegrounds.com/shards/pc-eu/players?filter[playerNames]=" + encodeURI(pubgDataTracker.player), function() {})
        .done(function(result) {

            pubgDataTracker.playerData[pubgDataTracker.player] = result;

            if (result.data[0].relationships.matches.data.length > 0 && typeof pubgDataTracker.playerData[pubgDataTracker.player] !== 'undefined'){
                pubgDataTracker.playerData[pubgDataTracker.player].matches = result.data[0].relationships.matches.data;

                pubgDataTracker.playerData[pubgDataTracker.player].matches.forEach(function(match, index) {

                    if (index > 8)
                        return;

                    $.get("https://api.playbattlegrounds.com/shards/pc-eu/matches/" + match.id, function() {})
                    .done(function(data) {
                        pubgDataTracker.playerData[pubgDataTracker.player].matches[index].fullData = data;
                    });
                });
                console.log(publicData);
            }
        })
        .fail(function() {
            console.log("error");
        });
    };

    $('#name').on('keyup', function(e) {
        if (e.keyCode === 13) {
            publicData.player = $(this).val();
            publicData.fn.searchPlayer();
        }
    });

    return pubgDataTracker;
})();
