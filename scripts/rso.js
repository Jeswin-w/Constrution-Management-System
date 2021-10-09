angular.module('Resapp', [])
    .controller('addres', addres)
    .controller('showres', showres)
    .service('showser', showser)
    .directive("total", function () {
        return {
          template:
            "<p>{{item.quantity * item.price |currency: 'Rs:'  : 0}}</p>",
        };
    });

    function showser() {
        var service = this;
        var items = [{'name':'bricks','quantity':500,'price':5000}];
        service.addItem = function (itemName, quantity,price) {
            var item = { name: itemName, quantity: quantity ,price: price};
            items.push(item);
        };
        service.removeItem = function (itemIndex) {
            items.splice(itemIndex, 1);
        };
        service.getItems = function () { return items; };
    }
    addres.$inject = ['showser'];
    function addres(showser) {
        var itemAdder = this;
        itemAdder.itemName = "";
        itemAdder.itemQuantity = "";
        itemAdder.addItem = function () {
            showser.addItem(itemAdder.itemName,
                itemAdder.itemQuantity,itemAdder.itemprice);
        }
    }
    showres.$inject = ['showser'];
    function showres(showser) {
        var showList = this;
        showList.items = showser.getItems();
        
        showList.removeItem = function (itemIndex) { showser.removeItem(itemIndex); };
}
