# RESTfelx

flexible rest javascript client

(examples uses my [easySqli](https://github.com/benjaco/easySQLI) libery)

license: MIT

## list
init the list
```
var list = new REST_list("api/yourList", {name: "myCostomListName"}, function(data){
    // data from get request
});
```
add
```
list.add({data:value,...}, function(data){
    // data from parameter 1 plus a id feild
});
```
delete
```
list.delete(id);
```
update
```
list.update(id, {data:value,...}, function(data){
    // data there has ben opdated
});
```
get the list / update the list
```
list.get(function(data){
             // data from get request
         });
```


## single variables
init the variable
```
var variable = new REST_variable("api/variabel", {name: "var"});
```

update
```
variable.update("new value")
```


add and delete isn´t callable as default

## event listeners
works on both lists and variables

```
list.onLoaded(function(data){
    // data from get request
})
```
 
```
REST_notifyer.onLoaded("NAME FROM OPTIONS", function (data) {
    // data from get request
})
```
all events:

onLoaded - parameter: the list/variable from the get request

onUpdate - parameter: the item/variable thhere has ben updated

onAdd - parameter: data plus the insert id

onDelete - parameter: the deleted id


## options
define success http code in following: readOnCreated, successGetHeader, successPostHeader, successDeleteHeader, successPutHeader

defaults can be set in REST.defaults.readOnCreated ects.

name: unique name for keep track of event listeners

getError, addError, deleteError, updateError: callback functions on error, callback takes a parameter, parameter is the response form server

get,delete,add,update: functions for ajax requests can be overrided

only simple value:

converter: return the value from get request, default can be set 

only list:

getParameter: set a object of get parameters to send when data retries from server

list_converter: return object of items and id (key:id, valus:item index), defaults can be set 

## http
default status codes:

successGetHeader: 200

successPostHeader: 201

successDeleteHeader: 204

successPutHeader: 200


put request uses a post request with a feild "_METHOD" set to "PUT", as well as "DELETE"



## other information
all callback function are optional

pull requests is welcome

