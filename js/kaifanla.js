/**
 * Created by bjwsl-001 on 2016/12/9.
 */

var app = angular.module('kaifanla', ['ionic']);

app.config(function ($stateProvider,$ionicConfigProvider, $urlRouterProvider) {

  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
    .state('start', {
      url: '/KflStart',
      templateUrl: 'tpl/start.html'
    })
    .state('main', {
      url: '/KflMain',
      templateUrl: 'tpl/main.html',
      controller: 'mainCtrl'
    })
    .state('detail', {
      url: '/KflDetail/:id',
      templateUrl: 'tpl/detail.html',
      controller: 'detailCtrl'
    })
    .state('order', {
      url: '/KflOrder/:id',
      templateUrl: 'tpl/order.html',
      controller: 'orderCtrl'
    })
    .state('myOrder', {
      url: '/KflMyOrder',
      templateUrl: 'tpl/myOrder.html',
      controller:'myOrderCtrl'
    })

  $urlRouterProvider.otherwise('KflStart');

})

app.controller('parentCtrl', ['$scope', '$state',
  function ($scope, $state) {

    $scope.jump = function (state, arg) {
      $state.go(state, arg)
    }

  }]);

app.controller('mainCtrl',
  ['$scope', '$http',
    function ($scope, $http) {

      $scope.dishList = [];
      $scope.hasMore = true;
      $scope.inputObj = {kw: ''};

      $http.get('data/dish_getbypage.php')
        .success(function (data) {
          $scope.dishList = data;
        })

      $scope.loadMore = function () {
        //如果输入框当中是由内容，不用处理加载更多的业务逻辑
        //if($scope.inputObj.kw)
        $http.get('data/dish_getbypage.php?start='
        + $scope.dishList.length)
          .success(function (data) {
            if (data.length < 5) {
              $scope.hasMore = false;
            }
            if (data.length > 0) {
              $scope.dishList = $scope.dishList.concat(data);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

          })
      }

      $scope.$watch('inputObj.kw', function () {
        console.log($scope.inputObj.kw);
        if ($scope.inputObj.kw) {
          $http.get('data/dish_getbykw.php?kw=' + $scope.inputObj.kw)
            .success(function (data) {
              $scope.dishList = data;
            })
        }

      })
    }])

app.controller('detailCtrl', ['$scope', '$http', '$stateParams',
  function ($scope, $http, $stateParams) {
    console.log($stateParams.id);

    $http.get('data/dish_getbyid.php?id=' + $stateParams.id)
      .success(function (data) {
        console.log(data);
        $scope.dish = data[0];
      });

  }
])

app.controller('orderCtrl',
  ['$scope', '$http', '$stateParams','$httpParamSerializerJQLike',
    function ($scope, $http, $stateParams,$httpParamSerializerJQLike) {
      console.log($stateParams.id);
      $scope.order = {did:$stateParams.id};


      $scope.submitOrder = function(){

      //  序列化：将对象转换成字符串 & &
        var str = $httpParamSerializerJQLike($scope.order);
        console.log(str);

        $http.get('data/order_add.php?'+str)
          .success(function(data){
            console.log(data);

            if(data[0].msg == 'success')
            {
              $scope.succMsg = '下单成功，订单编号为'+data[0].oid;
              sessionStorage.setItem('phone',$scope.order.phone)
            }
            else
            {
              $scope.errMsg = '下单失败';
            }

          })


      }


    }
  ])

app.controller('myOrderCtrl',
['$scope','$http',
  function ($scope,$http) {
    var userPhone = sessionStorage.getItem('phone');
    console.log(userPhone);

    $http.get('data/order_getbyphone.php?phone='+userPhone)
      .success(function (data) {
        console.log(data);
        $scope.orderList = data;
      })
  }
])