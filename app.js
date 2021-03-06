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
            app.fn.getPlayer($(this).val());
    });

    $('#createMatches').on('click', function() {
        app.fn.getMatches();
        app.fn.renderAll(app.currentPlayer);
    });

    var app = {
        currentPlayer: '',
        players: [],
        fn: {
            getPlayer: function(playerName) {
                $.get("https://api.playbattlegrounds.com/shards/pc-eu/players?filter[playerNames]=" + playerName)
                .done(function(result) {
                    var newPlayer = new app.fn.Player(result);
                    app.players.push(newPlayer);
                    app.currentPlayer = newPlayer;
                    app.fn.handleMatches(newPlayer.rawMatches.data);
                })
                .fail(function(response){
                    response = JSON.parse(response.responseText);
                    alert('' + response.errors[0].title + ' - ' + response.errors[0].detail);
                    $('#matches').html('');
                });
            },
            Player: function(playerData) {
                this.name = playerData.data[0].attributes.name;
                this.shard = playerData.data[0].attributes.shardId;
                this.id = playerData.data[0].id;
                this.rawMatches = playerData.data[0].relationships.matches;
                this.rawMatchData = {};
                this.filteredMatches = {};
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
                    app.currentPlayer.rawMatchData[matchId] = JSON.parse(localStorage.getItem(app.savedMatchIds[matchDataIndex]));
                else {
                    $.get("https://api.playbattlegrounds.com/shards/pc-eu/matches/" + matchId, function() {})
                    .done(function(responseData) {
                        app.savedMatchIds.push(matchId);
                        localStorage.setItem('savedMatchIds', JSON.stringify(app.savedMatchIds));
                        localStorage.setItem(matchId, JSON.stringify(responseData));
                        app.currentPlayer.rawMatchData[matchId] = responseData;
                    });
                }
            },
            MatchStats: function(match, currentPlayer) {
                this.basic = {};
                this.basic.duration = match.data.attributes.duration;
                this.basic.createdAt = match.data.attributes.createdAt;
                this.basic.gameMode = match.data.attributes.gameMode;
                this.basic.map = match.data.attributes.mapName;

                if (currentPlayer) {

                    var playerStats = match.included.filter(function(player) {
                        return player.type === 'participant' && player.attributes.stats.name === currentPlayer;
                    });

                    this.player = {};
                    this.player.name = currentPlayer;
                    this.player.stats = playerStats[0].attributes.stats;
                }
            },
            getMatches: function() {
                var matchData = app.currentPlayer.rawMatchData;
                for (var match in matchData)
                    if (matchData.hasOwnProperty(match))
                        publicData.currentPlayer.filteredMatches[match] = new publicData.fn.MatchStats(matchData[match], publicData.currentPlayer.name);
            },
            renderAll: function(player) {
                $('#matches').html('');
                for (var match in player.filteredMatches) {
                    if (player.filteredMatches.hasOwnProperty(match))
                        app.fn.render(player.filteredMatches[match]);
                }
            },
            render: function(match) {

                var template = `<div class="match-wrapper">
                                    <span>${match.player.name}</span>
                                    <div class="basic-stats">
                                        <span>duration: ${match.basic.duration}</span>
                                        <span>created at: ${match.basic.createdAt}</span>
                                        <span>game mode: ${match.basic.gameMode}</span>
                                        <span>map: ${match.basic.map}</span>
                                    </div>
                                    <div class="player-stats">
                                        <span>downed enemies: ${match.player.stats.DBNOs}</span>
                                        <span>assists: ${match.player.stats.assists}</span>
                                        <span>boosters used: ${match.player.stats.boosts}</span>
                                        <span>total damage dealt: ${match.player.stats.damageDealt}</span>
                                        <span>killed by: ${match.player.stats.deathType}</span>
                                        <span>headshot kills: ${match.player.stats.headshotKills}</span>
                                        <span>heals used ${match.player.stats.heals}</span>
                                        <span>kills: ${match.player.stats.kills}</span>
                                        <span>kill points: ${match.player.stats.killPoints}</span>
                                        <span>kill points delta: ${match.player.stats.killPointsDelta}</span>
                                        <span>revives: ${match.player.stats.revives}</span>
                                        <span>meters driven per car/bike: ${match.player.stats.rideDistance}</span>
                                        <span>meters walked: ${match.player.stats.walkDistance}</span>
                                        <span>roadkills: ${match.player.stats.roadKills}</span>
                                        <span>teamkills: ${match.player.stats.teamKills}</span>
                                        <span>time survived: ${match.player.stats.timeSurvived}</span>
                                        <span>vehicles destroyed: ${match.player.stats.vehicleDestroys}</span>
                                        <span>finished place: ${match.player.stats.winPlace}</span>
                                        <span>win points: ${match.player.stats.winPoints}</span>
                                        <span>win points delta: ${match.player.stats.winPointsDelta}</span>
                                    </div>
                                </div>`;

                $('#matches').append(template);
            }
        },
        savedMatchIds: JSON.parse(localStorage.getItem('savedMatchIds')) || []
    };

    return app;
})();
