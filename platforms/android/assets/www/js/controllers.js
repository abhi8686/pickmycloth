angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})
.controller('LoginCtrl', function($scope, $http, $httpParamSerializerJQLike, $location) {
  $scope.data = {}
  $scope.login = function(){

    console.log($scope.data.username, $scope.data.password )
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


