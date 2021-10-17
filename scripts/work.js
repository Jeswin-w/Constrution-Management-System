!function(){
    "use strict";
    var worker_records=[
    {"SNo":"0","Name":"franklin","work":"Carpenter","email":"frank@gmail.com","Phone":"8329481939"},
        { "SNo": "1", "Name": "ram", "work": "plumber", "email": "ram4@gmail.com", "Phone": "7929481945"},
        { "SNo": "2", "Name": "muthu", "work": "electrician", "email": "muthu@gmail.com", "Phone": "9029481939"},
        { "SNo": "3", "Name": "kumar", "work": "painter", "email": "kumar@gmail.com", "Phone": "8829481945"},
 
    ];
    
    
    angular.module('myApp',[])
    .controller('firstController',firstController)
    .factory('fac', function() {
        var factory = {};
        factory.Remove = function(index) {
            worker_records.splice(index,1)
            
        };
        factory.Add = function(name1, work1,email,phone) {
            worker_records.push({'Name':name1,'work':work1,'email':email,'Phone':phone})
        };
        return factory;
    });
    
    firstController.$inject=['$scope',fac,'$http'];
    function firstController($scope,fac,$http){
        $http.get('/worker').then(function(data){
            $scope.worker_records = data.data;
            
        });
        
        $scope.addwork=function(){
            $scope.result=fac.Add($scope.name1, $scope.work1,$scope.email,$scope.phone);};
        $scope.removework=function(idx){
            $scope.result=fac.Remove(idx);
        };
        
    }
}();
