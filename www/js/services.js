angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])


.factory('Data', function() {
  return {
      btc_address: '',
       btc_price: '',
       expiration_time:  '',
       item_code:  '',
       rate:  '',
       url: '',
       guid:''
    };

  }
)