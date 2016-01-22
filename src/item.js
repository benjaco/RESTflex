/**
 * Created by Benjaco on 17-01-2016.
 */
function REST_item(id, data, options, url) {
    this.data = data;

    this.delete = function (func) {
        options.delete(id, func)
    };
    this.update = function (data, func) {
        options.update(id, data, func)
    };

    this.REST_variable = function (subUrl, options, func) {
        return new REST_variable(url + "/" + id + "/" + subUrl, REST_helpers.option(options, {
            "name": this.options.name + "/" + url
        }), func)
    };
    this.REST_list = function (subUrl, options, func) {
        return new REST_list(url + "/" + id + "/" + subUrl, REST_helpers.option(options, {
            "name": this.options.name + "/" + url
        }), func)
    };


}