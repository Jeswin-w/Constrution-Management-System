!function(){
    "use Strict";
    angular.module("getwork",[])
    .filter('cusfil',function()
    {
        return function(x) {
           var c=[];
           c= x.split('.');
           
           
           return c;
          };

    })
    .controller("myctrl",function($scope){
        
       
    });
}();