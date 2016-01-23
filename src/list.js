/**
 * Created by Benjaco on 15-01-2016.
 */


function REST_list(url, options, func){
    this.data = false;
    this.id = false;

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
        "converter": REST.defaults.list_converter,
        "getParameter": {},
        "reGenarateIds": function(){
            object.id = [];
            for (var i = 0; i < object.data.length; i++) {
                if(typeof object.data[i] !== "undefined") {
                    object.id[object.data[i].id] = i;
                }
            }
        },
        "name": url,
        "get": function(func){
            REST_ajax.get(url+"?"+REST_ajax.helpers.toQueryString(object.options.getParameter), function(data){

                var dataC = object.options.converter(data);

                if(dataC === false) {
                    object.options.dataError();
                }else {
                    object.data = dataC.items;
                    object.id = dataC.id;

                    if(!loaded) {
                        loaded=true;
                        if(typeof func == "function" ){
                            func(object.data);
                        }
                        REST_notifyer.emitLoaded(object.options.name, object.data);
                    }else {
                        REST_notifyer.emitUpdate(object.options.name, object.data);
                    }
                }
            }, object.options.successGetHeader, function(x){
                object.options.getError(x);
            })
        },
        "delete": function(id, func){
            REST_ajax.delete(url+"/"+id, function(){
                if(typeof object.id[id] !== "undefined") {
                    delete object.data[object.id[id]];
                    delete object.id[id];
                    object.options.reGenarateIds();

                    if(typeof func == "function" ){
                        func(id);
                    }
                    REST_notifyer.emitDelete(object.options.name, id);
                }
            }, object.options.successDeleteHeader, function(x){
                object.options.deleteError(x);
            })
        },
        "add": function(data, func){
            REST_ajax.post(url, function(id){
                if( /^[0-9]+$/.test(id) ) {
                    if(typeof object.data[id] == "undefined") {
                        data.id = id;
                        object.data.push(data);
                        object.id[id] =  object.data.push(data);

                        if(typeof func == "function" ) {
                            func(data);
                        }
                        REST_notifyer.emitAdd(object.options.name, data);
                    }else {
                        object.options.addError("id allready exist")
                    }
                }else {
                    object.options.addError("id isnt a int")
                }
            }, data, object.options.successPostHeader, function(x){
                object.options.addError(x);
            })
        },
        "update": function(id, data, func){
            REST_ajax.put(url+"/"+id, function(){
                for(var key in data) {
                    object.data[object.id[id]][key] = data[key];
                }
                if(typeof func == "function" ) {
                    func(data);
                }
                REST_notifyer.emitUpdate(object.options.name, id, data)
            }, data, object.options.successPutHeader, function(x){
                object.options.updateError(x);
            });
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
        },
        "dataError": function(){
            console.error("REST FORMATTED DATA ERROR")
        }
    });



    this.get = function(func){
        this.options.get(func)
    };
    this.delete = function(id, func){
        this.options.delete(id, func)
    };
    this.update = function(id, data, func){
        this.options.update(id, data, func)
    };
    this.add = function(data, func){
        this.options.add(data, func)
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

    this.find = function(id){
        if(typeof this.data[id] == "undefined") {
            return false;
        }
        return new REST_item(id, this.data[id], this.options, url);
    };

    this.REST_variable = function(subUrl, options, func){
        return new REST_variable(this.url+"/"+subUrl, REST_helpers.option(options, {
            "name": this.options.name+"/"+url
        }), func)
    } ;
    this.REST_list = function(subUrl, options, func){
        return new REST_list(this.url+"/"+subUrl, REST_helpers.option(options, {
            "name": this.options.name+"/"+url
        }), func)
    } ;


    if(this.options.readOnCreated) {
        this.options.get(func)
    }
}