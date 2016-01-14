/**
 * Created by Bejamco on 12-01-2016.
 */
var REST_ajax = {
    // hent data
    get: function (url, func, successheader, errorfunc) {
        var x = this.helpers.getRequestObject();

        x.onreadystatechange = function () {
            if (x.readyState == 4 && x.status == successheader) {
                func(x.response)
            }else if(x.readyState==4) {
                errorfunc(x)
            }
        };
        x.open("GET", url, true);
        x.send();
    },
    // indsæt data
    post: function (url, func, data, successheader, errorfunc) {
        var x = this.helpers.getRequestObject();

        x.onreadystatechange = function () {
            if (x.readyState == 4 && x.status == successheader) {
                func(x.response)
            }else if(x.readyState==4) {
                errorfunc(x)
            }
        };
        x.open("POST", url, true);
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        x.send(this.helpers.toQueryString(data));
    },
    // update
    put: function (url, func, data, successheader, errorfunc) {
        var x = this.helpers.getRequestObject();

        x.onreadystatechange = function () {
            if (x.readyState == 4 && x.status == successheader) {
                func(x.response)
            }else if(x.readyState==4) {
                errorfunc(x)
            }
        };

        x.open("POST", url, true);
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        data['_METHOD']="PUT";
        x.send(this.helpers.toQueryString(data));
    },
    // fjern data
    delete: function (url, func,successheader, errorfunc) {
        var x = this.helpers.getRequestObject();

        x.onreadystatechange = function () {
            if (x.readyState == 4 && x.status == successheader) {
                func(x.response)
            }else if(x.readyState==4) {
                errorfunc(x)
            }
        };
        x.open("DELETE", url, true);
        x.send();
    },


    helpers: {
        getRequestObject: function () {
            var x;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                x = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                x = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return x;
        },
        toQueryString: function (obj, urlEncode) {
            //
            // Helper function that flattens an object, retaining key structer as a path array:
            //
            // Input: { prop1: 'x', prop2: { y: 1, z: 2 } }
            // Example output: [
            //     { path: [ 'prop1' ],      val: 'x' },
            //     { path: [ 'prop2', 'y' ], val: '1' },
            //     { path: [ 'prop2', 'z' ], val: '2' }
            // ]
            //
            function flattenObj(x, path) {
                var result = [];

                path = path || [];
                Object.keys(x).forEach(function (key) {
                    if (!x.hasOwnProperty(key)) return;

                    var newPath = path.slice();
                    newPath.push(key);

                    var vals = [];
                    if (typeof x[key] == 'object') {
                        vals = flattenObj(x[key], newPath);
                    } else {
                        vals.push({path: newPath, val: x[key]});
                    }
                    vals.forEach(function (obj) {
                        return result.push(obj);
                    });
                });

                return result;
            } // flattenObj

            // start with  flattening `obj`
            var parts = flattenObj(obj); // [ { path: [ ...parts ], val: ... }, ... ]

            // convert to array notation:
            parts = parts.map(function (varInfo) {
                if (varInfo.path.length == 1) varInfo.path = varInfo.path[0]; else {
                    var first = varInfo.path[0];
                    var rest = varInfo.path.slice(1);
                    varInfo.path = first + '[' + rest.join('][') + ']';
                }
                return varInfo;
            }); // parts.map

            // join the parts to a query-string url-component
            var queryString = parts.map(function (varInfo) {
                return varInfo.path + '=' + varInfo.val;
            }).join('&');
            if (urlEncode) return encodeURIComponent(queryString); else return queryString;
        }
    }
};