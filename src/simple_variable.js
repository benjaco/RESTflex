/**
 * Created by Bejamco on 12-01-2016.
 */

function REST_variable(url, options){
    this.data = false;
    this.url = url;
    var loaded = false;
    var object = this;

    options = (typeof options !== "undefined" ? options : {});

    this.options = REST_helpers.option(options, {
        "readOnCreated": true,
        "successGetHeader": 200,
        "successPostHeader": 201,
        "successDeleteHeader": 204,
        "successPutHeader": 200,
        "name": url,
        "get": function(){
            REST_ajax.get(url, function(data){
                object.data = data;
                if(!loaded) {
                    loaded=true;
                    REST_notifyer.emitLoaded(object.options.name);
                }else {
                    REST_notifyer.emitUpdate(object.options.name);
                }
            }, object.options.successGetHeader, function(x){
                object.options.getError();
            })
        },
        "delete": function(){
            console.error("Simple variables cant be deleted or added by default");
        },
        "add": function(){
            console.error("Simple variables cant be deleted or added by default");
        },
        "update": function(data){
            REST_ajax.put(url, function(Rdata){
                object.data = data;
                REST_notifyer.emitUpdate(object.options.name);
            }, {data:data}, object.options.successPutHeader, function (x) {
                object.options.updateError(x)
            })
        },
        "getError": function(x){
            console.error("REST GET ERROR");
            console.error(x);
        },
        "addError": function(x){
            console.error("REST ADD ERROR");
            console.error(x);
        },
        "deleteError": function(x){
            console.error("REST DELETE ERROR");
            console.error(x);
        },
        "updateError": function(x){
            console.error("REST UPDATE ERROR");
            console.error(x);
        }
    });

    this.get = function(){
        this.options.get()
    };
    this.delete = function(){
        this.options.delete()
    };
    this.update = function(data){
        this.options.update(data)
    };
    this.add = function(data){
        this.options.add(data)
    };
    if(this.options.readOnCreated) {
        this.options.get()
    }

}