var publicData = (function() {
    "use strict";

    /** init **/

    $.ajaxSetup({
        headers: {
            Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4NDI5YmQyMC0xOTUzLTAxMzYtNjVkNS00ZDI4ZmVkOTQyNTUiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTIyNzQ5NTIzLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InN0YXRncmFwaDNkIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MTB9.KoGJMKnYPLVFP0bVQ_c8vvsb5kdOEauQZbcgp8AFAMI",
            Accept: "application/vnd.api+json",
        }
    });

    $('#name').on('keyup', function(e) {
        if (e.keyCode === 13)
            app.fn.searchPlayer($(this).val());
    });

    var app = {
        currentPlayer: '',
        players: [],
        fn: {
            getPlayer: function() {
                $.get("https://api.playbattlegrounds.com/shards/pc-eu/players?filter[playerNames]=" + app.player)
                .done(function(result) {
                    var newPlayer = new app.Player(result);
                    app.players.push(newPlayer);
                    app.currentPlayer = newPlayer;
                    app.fn.handleMatches(newPlayer.matches);
                });
            },
            Player: function(playerData) {
                this.name = playerData.data[0].attributes.name;
                this.shard = playerData.data[0].attributes.shardId;
                this.id = playerData.data[0].id;
                this.matches = playerData.data[0].matches;
            },
            handleMatches: function(matchArray) {
                matchArray.forEach(function(match, index) {
                    if (index < 8)
                        app.fn.getMatch(match.id);
                    else {}
                        // TODO: push matches to Queue
                });
            },
            getMatch: function(matchId) {

                var matchDataIndex = app.savedMatchIds.indexOf(matchId);

                if (matchDataIndex > -1 )
                    app.currentPlayer.matchData[matchId] = localStorage.getItem(JSON.parse(app.savedMatchIds[matchDataIndex]));
                else {
                    $.get("https://api.playbattlegrounds.com/shards/pc-eu/matches/" + matchId, function() {})
                    .done(function(responseData) {
                        app.savedMatchIds.push(matchId);
                        localStorage.setItem('savedMatchIds', JSON.stringify(app.savedMatchIds));
                        localStorage.setItem(matchId, JSON.stringify(responseData));
                        app.currentPlayer.matchData[matchId] = responseData;
                    });
                }
            },
        },
        savedMatchIds: localStorage.getItem('savedMatchIds')
    };

    return app;
})();
