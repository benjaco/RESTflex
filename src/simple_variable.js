/**
 * Created by Benjaco on 12-01-2016.
 */

function REST_variable(url, options, func){
    this.data = false;
    this.url = url;
    var loaded = false;
    var object = this;

    options = (typeof options !== "undefined" ? options : {});

    this.options = REST_helpers.option(options, {
        "readOnCreated": REST.defaults.readOnCreated,
        "successGetHeader": REST.defaults.successGetHeader,
        "successPostHeader": REST.defaults.successPostHeader,
        "successDeleteHeader": REST.defaults.successDeleteHeader,
        "successPutHeader": REST.defaults.successPutHeader,
        "converter": REST.defaults.variable_converter,
        "name": url,
        "get": function(func){
            REST_ajax.get(url, function(data){
                object.data = object.options.converter(data);
                if(!loaded) {
                    loaded=true;
                    if(typeof func == "function" ){
                        func(object.data);
                    }
                    REST_notifyer.emitLoaded(object.options.name, object.data);
                }else {
                    REST_notifyer.emitUpdate(object.options.name, object.data);
                }
            }, object.options.successGetHeader, function(x){
                object.options.getError(x);
            })
        },
        "delete": function(){
            console.error("Simple variables cant be deleted or added by default");
        },
        "add": function(){
            console.error("Simple variables cant be deleted or added by default");
        },
        "update": function(data, func){
            REST_ajax.put(url, function(Rdata){
                object.data = data;

                if(typeof func == "function" ){
                    func(data);
                }
                REST_notifyer.emitUpdate(object.options.name, data);
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

    this.get = function(func){
        this.options.get(func)
    };
    this.delete = function(){
        this.options.delete()
    };
    this.update = function(data, func){
        this.options.update(data, func)
    };
    this.add = function(data){
        this.options.add(data)
    };

    this.onLoaded = function(func){
        REST_notifyer.onLoaded(options.name, func);
    };
    this.onUpdate = function(func){
        REST_notifyer.onUpdate(options.name, func);
    };
    this.onAdd = function(func){
        REST_notifyer.onAdd(options.name, func);
    };
    this.onDelete = function(func){
        REST_notifyer.onDelete(options.name, func);
    };

    this.REST_variable = function (subUrl, options, func) {
        return new REST_variable(this.url + "/" + subUrl, REST_helpers.option(options, {
            "name": this.options.name + "/" + url
        }), func)
    };
    this.REST_list = function (subUrl, options, func) {
        return new REST_list(this.url + subUrl, REST_helpers.option(options, {
            "name": this.options.name + "/" + url
        }), func)
    };

    if(this.options.readOnCreated) {
        this.options.get(func)
    }

}