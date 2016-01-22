/**
 * Created by Benjaco on 12-01-2016.
 */

var REST_helpers = {
    option: function(option, default_options){
        for(var settings in option) {
            default_options[settings]=option[settings];
        }
        return default_options;
    }
};