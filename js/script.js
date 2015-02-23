var fullContact = {
  url : "https://api.fullcontact.com",

  enableButtonClick: function() {
    $("#personmail").keydown(function(e){
        if(event.keyCode === 13) {
          var check = $("#personmail").val();
        }
      });
  },

  firstStep : function () {
    $("#fullSearch").click(function() {
      var check = $("#personmail").val();
      if(!fullContact.validation(check)) {
        return;
      }
      fullContact.enableButtonClick();
      fullContact.search(check);
      $("#alert-input").hide();
      $("#error").hide();
      $("#personmail").val('');
    });
  },

  search : function (personmail) {
    var key = 'cb84fc768271ac1d';
    var pics;
    $.getJSON(this.url+'/v2/person.json?email='+personmail+'&apiKey='+key, function (response) {
      var photos = response.photos;
        $.each(photos, function(index, photo) {
            $('.img-circle').attr('src', photo.url);
        });
      function validateCountry() {
        if(!response.demographics.locationDeduced) {
          return 'Location not found';
        }
        if(!photos) {
          return 'Photo not found';
        }
      }

      function validateAge() {
        if(!response.demographics.age) {
          return 'Age not found';
        }
      }
        $(".panel-title").text(response.contactInfo.fullName);
        $(".location").text(validateCountry());
        $(".age").text(validateAge());
        $(".gender").text(response.demographics.gender);

    }).fail(function(error) {
        if(error.status === 403) {
          $("#error").html('<p>Please try again later</p>').show();
        }
        else if(error.status === 404) {
          $("#error").html('<p>email not found</p>').show();
        }
        else {
          $("#error").html('<p>No match found</p>').show();
          $("#details").empty(); 
        }
      });
      $("#personmail").val('');
  },

  validation: function (input) {
    if(input.trim() === "") {
      $("#alert-input").show();
    }
    else {
      return true;
    }
    return false;
  }

};
$(document).ready(function(){
  $("#alert-input").hide();
  $("#error").hide();
  fullContact.firstStep();
});
