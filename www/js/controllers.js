angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $httpParamSerializerJQLike) {
  $scope.init = function(){
    $http.get("http://pickmycloth.com/api/dashboarddata" ) 
    .success(function (data, status, headers, config) {
      $scope.categories = data["categories"]
      $scope.products = data["products"]
      $scope.customers = data["customers"]
      $scope.payments = data["payments"]
      $scope.purchases = data["purchases"]
      $scope.usercampaigns = data["usercampaigns"]
      $scope.help = data["help"]
    });
  }
  $scope.init();
})

.controller('productCtrl', function($scope, $http, $state ){
  // console.log()
  console.log($state)
})
.controller('productsCtrl', function($scope, $http) {

  $scope.userId = window.localStorage.getItem("UserId")
  $http.post("http://pickmycloth.com/api/manageproducts", { "adminid" : $scope.userId} ) 
  .success(function (data, status, headers, config) {
    // console.log(data)
    $scope.products = data["data"]
  });
})

.controller('AddProductCtrl' , function($scope, $http){
  $scope.attributes_data = {}
  $scope.images = []
  $scope.selected_category = 0
  $http.post("http://pickmycloth.com/api/attributegroups", { "adminid" : $scope.userId} ) 
  .success(function (data, status, headers, config) {
    $.each(data["data"], function(i, j ){
      console.log(j)
       $http.post("http://pickmycloth.com/api/attributeslist", { "attributegroups_id" : j["attributegroups_id"]} ) 
      .success(function (data, status, headers, config) {
        if(j["attributegroups_name"] == "Number")
        {
          $scope.number_attr = data["data"]
        }
        if(j["attributegroups_name"] == "Color"){
          $scope.color_attr = data["data"]
        }
        if(j["attributegroups_name"] == "size"){
          $scope.size_attr = data["data"]
        }
      })
    })
  });

  $http.get("http://pickmycloth.com/api/maincategories" ) 
  .success(function (data, status, headers, config) {
      $scope.main_category = data["data"]
  })


  $scope.imageUpload = function (event) {
      var input = event.target;
      if (input.files && input.files[0]) {
        $(input.files).each(function () {
            var reader = new FileReader();
            reader.readAsDataURL(this);
            reader.onload = function (e) {
            $scope.images = $scope.images + [ e.target.result]
              $("#previewImg").append("<img class='thumb' src='" + e.target.result + "'>");
            }
        });
    }
  }
  $scope.submitProduct = function(){

    $scope.userId = window.localStorage.getItem("UserId")
    $scope.category  = "" + $scope.category_s  + ", " + $scope.category_ss +"," + $scope.set_ssscategory
    $scope.images_string = ""
    // console.log($scope.images_string)
    $scope.oredrs = ""
    $.each($scope.modifiedOrder, function( index, value ) {
      $scope.oredrs = $scope.oredrs + "," + value
    });
    params = {
              "name" : "Admin",
              "adminid" : $scope.userId,
              "title" : this.title, 
              "productdesc" : this.discription, 
              "qty" :  this.quantity,
              "price" : this.discount_price,
              "orginal_price" : this.original_price, 
              "productcode" : Math.floor((Math.random() * 10000) + 1),
              "measurements" : "yes",
              "bulkupload" : "yes", 
              "category_id" : $scope.category,
              "attributegroups_id" : "1,4,5",
              "attribute_id" : $scope.oredrs,
              "product_image" : $scope.images_string
             }
    // console.log(pa/rams)
    $http.post("http://pickmycloth.com/api/addproduct", params) 

    .success(function (data, status, headers, config) {
      console.log(params)
      console.log(data)
    });
  }
  $scope.get_subcategories = function(e){
    $scope.category_s = e.item["category_id"]
    var paramsVal={ 
        "category_id" : e.item["category_id"]
    };
      $http.post("http://pickmycloth.com/api/subcategories?", paramsVal) 
      .success(function (data, status, headers, config) {
          $scope.sub_category = data["data"]
      })
  }
  $scope.set_ssscategory = function(e){
    $scope.set_ssscategory = e.item["category_id"]
  }
  $scope.get_sscategories = function(e){
    $scope.category_ss = e.item["category_id"]
    var paramsVal={ 
        "category_id" : e.item["category_id"]
    };
      $http.post("http://pickmycloth.com/api/subcategories?", paramsVal) 
      .success(function (data, status, headers, config) {
          $scope.ss_category = data["data"]    
      })
  }

  $scope.order={};

  $scope.format=function(){
    $scope.modifiedOrder=[];
    angular.forEach($scope.order, function(value, key) {
      if(value){
        $scope.modifiedOrder.push(parseInt(key));
      }
    });
    // alert()
    console.log($scope.modifiedOrder)
  }

})
.controller('ChatsCtrl', function($scope, Chats) {
})
.controller('LoginCtrl', function($scope, $http, $httpParamSerializerJQLike, $location) {
  $scope.data = {}
  $scope.login = function(){

    // console.log($scope.data.username, $scope.data.password )
    var paramsVal={ 
        "username" : $scope.data.username,
        "password" : $scope.data.password  
    };

    $http.post("http://pickmycloth.com/api/adminlogin", paramsVal ) 
    .success(function (data, status, headers, config) {
      // console.log(data)
        if(data.response == "1"){
           window.localStorage.setItem("loggedIn", "1");
           window.localStorage.setItem("UserId",data["data"]["userid"] );
           $location.path("/tab/dash");
        }
    });
  }
})
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $location) {
  $scope.init = function(){
    window.localStorage.setItem("loggedIn", "0");
    window.localStorage.setItem("UserId", "0");
    $location.path("/login");

  }
  $scope.init()
});


