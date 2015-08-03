function domobj(){
  var self        = this;
  self.products   = [];

  self.getproducts = function(url){
    $.getJSON(url, function(response){
        for(var i = 0; i < response.sales.length ; i++) {
          self.products.push( new productobj(response.sales[i], i));
        }
    });
  };

  self.updateproducthtml = function(){
    for(var i = 0; i < self.products.length ; i++){
      self.products[i].updatehtml();
    }
  };

  // Update the progress bar as the products are added.
  self.updatedom = function(){
    var i = 0;
    var numProducts = self.products.length;
    thishtml='';
    for( i = 0; i < numProducts ; i++){
      thishtml += self.products[i].htmlview;
      var percent = ((i + 1) / numProducts) * 100;
      self.progressBar(percent);
    }
    $("#content").append(thishtml);
    self.overlay();
    self.removeProduct();
  };

  // Adds overlay to the product on mouseover
  self.overlay = function () {
    $(".product-container").mouseenter(function (){
      var $product = $(event.currentTarget);
      var overlay = $product.find(".overlay");
      overlay.removeClass("hidden");
    })
    .mouseleave(function () {
      var $product = $(event.currentTarget);
      var overlay = $product.find(".overlay");
      overlay.addClass("hidden");
    });
  };

  // Add a progress bar until items are loaded into the dom
  self.progressBar = function (percentComplete) {
    var valueString = percentComplete + "%";
    $progressBar = $(".progress-bar");
    $progressBar.css({ "width" : valueString});
  };

  // Removes a product from the DOM when the x is clicked
  self.removeProduct = function () {
    $(".close").click(function () {
      var $button = $(event.currentTarget);
      var $product = $button.parent();
      $product.remove();
    });
  };
}

function productobj(product, i){
  var self          = this;
  self.photo        = product.photos.medium_half;
  self.title        = product.name;
  self.tagline      = product.tagline;
  self.url          = product.url;
  self.htmlview     = "";
  self.description  = product.description;

  self.updatehtml= function(){
    $.get('product-template.html', function(template){
      self.htmlview = template.replace('{image}', self.photo).replace('{title}', self.title).replace('{tagline}', self.tagline).replace('{url}', self.url).replace('{description}', self.description).replace('{id}', self.id).replace('{custom_class}', self.custom_class);
    });
  };
}

// Check for changes to the view port size
$(window).resize(function () {
  windowSize();
});

// Sets the width based on the viewport
function windowSize() {
  var width = $(window).width();
  var bodyWidth = (Math.floor(width / 320) * 320);
  $("#body").width(bodyWidth);
}

var page = new domobj();
// Set initial viewport size
windowSize();
page.getproducts('data.json');
setTimeout("console.log('building html');page.updateproducthtml();",20);
setTimeout("page.updatedom()",500);
// Removes progress bar after DOM has loaded
setTimeout(function () {$(".progress-container").remove()}, 2000);
