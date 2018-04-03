(function() {
    "use strict";

    $.ajaxSetup({
        headers: {
            Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4NDI5YmQyMC0xOTUzLTAxMzYtNjVkNS00ZDI4ZmVkOTQyNTUiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTIyNzQ5NTIzLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InN0YXRncmFwaDNkIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MTB9.KoGJMKnYPLVFP0bVQ_c8vvsb5kdOEauQZbcgp8AFAMI",
            Accept: "application/vnd.api+json",
            "Accept-Encoding": "gzip"
        }
      });
      $.get("https://api.playbattlegrounds.com/shards/pc-eu/players?filter[playerNames]=d4nnyd", function() {
          console.log("dannyd request sent");
      }).done(function(data) {
        alert( "request done" );
        console.log(data);
      })
      .fail(function() {
        alert( "error" );
      });
})();

var XMLReq = new XMLHttpRequest();
XMLReq.open("GET", "https://api.playbattlegrounds.com/shards/pc-eu/players?filter[playerNames]=d4nnyd");
XMLReq.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4NDI5YmQyMC0xOTUzLTAxMzYtNjVkNS00ZDI4ZmVkOTQyNTUiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTIyNzQ5NTIzLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InN0YXRncmFwaDNkIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MTB9.KoGJMKnYPLVFP0bVQ_c8vvsb5kdOEauQZbcgp8AFAMI");
XMLReq.setRequestHeader("Accept", "application/vnd.api+json");
XMLReq.setRequestHeader("Accept-Encoding","gzip");
XMLReq.send(null);