(function (root, factory) {
    /* CommonJS */
    if (typeof exports === 'object')
        module.exports = factory();

    /* AMD module */
    else if (typeof define === 'function' && define.amd)
        define('photoapi', ['jquery', 'sha1'], factory);

    /* Browser global */
    else
        root = factory();

}(this, function () {

    /**
     * @property {Boolean} thisInit Check PhotoAPI.init
     * @property {Array} Requests Array of ajax-Request
     * @type {Object} callbacks
     * @property callbacks.before Fired before addtask request
     * @property callbacks.complete Fired on success or error
     * @property callbacks.success Fired on success
     * @property callbacks.idReceived Fired when request_id is returned in responce to addtask request
     * @property callbacks.error Fired on xhr_error or api_error
     * @property callbacks.xhrError Fired on ajax error
     * @property callbacks.apiError Fired on api error (face not found, bad key etc.)
     * @return {Object}
     */
    PhotoAPI = function () {

        /**
         * @constructor 
         */
        var Process = function () {
            /**
             * Status timer
             */
            this.timer;

            /**
             * callbacks
             * @type {Object} 
             */
            this._callbacks = {
                before: [],
                complete: [],
                success: [],
                idReceived: [],
                ajaxError: [],
                apiError: []
            };

            /**
             * Active ajax-requests
             * @type {Array.<Object>} 
             */
            this.Requests = [];

            /**
             * @type {String}
             */
            this.request_id;
        };

        Process.prototype = {
            /**
             * Ready status timer
             */
            getTimer: function () {
                var self = this;

                if (self.timer)
                    clearTimeout(self.timer);

                self.timer = setTimeout(function () {
                    checkResult(self);
                }, 900);

                self.abortAll.timer = self.timer;
            },
            /**
             * Stop ready status timer
             */
            abort: function () {
                clearTimeout(this.timer);
                return false;
            },
            /**
             * Delete active ajax-requests
             */
            delRequests: function (jqXHR) {
                var index = $.inArray(jqXHR, this.Requests);
                if (index > -1) {
                    this.Requests.splice(index, 1);
                }
            },
            /**
             * Stop running processes
             */
            abortAll: {
                timer: this.timer,
                Requests: this.Requests,
                abort: function () {
                    var self = this;

                    if (self.timer)
                        clearTimeout(self.timer);

                    $.each(self.Requests, function (e) {
                        self.Requests[e].abort();
                    });
                    self.Requests.length = 0;

                    return false;
                }
            }
        };

        var callbacks = {
            before: [],
            complete: [],
            success: [],
            idReceived: [],
            ajaxError: [],
            apiError: []
        };

        var thisInit = false;

        function getEachCallbacks(_callbacks, arg, args) {
            var self = this;
            self.abortAll.Requests = self.Requests;

            var transArgs = [];
            transArgs[0] = self.request_id;
            transArgs = transArgs.concat(args);

            $.each(_callbacks[arg], function (e) {
                _callbacks[arg][e].apply(self.abortAll, transArgs);
            });
        }

        function getCallbacks(arg) {
            var args = Array.prototype.slice.call(arguments);
            args = args.slice(1);
            getEachCallbacks.call(this, callbacks, arg, args);
            getEachCallbacks.call(this, this._callbacks, arg, args);
        }

        /**
         * @param {Object} json Image processing options
         * @property {String} json.image_url
         * @property {Object|Array.<Object>} json.methods_list
         * @property {Number} json.result_size 
         * @property {Boolean} json.crop_portrait
         */
        function jsonParamsToXml(json) {
            var xml;

            var objXML = {
                _xml: '<image_process_call>',
                object: function (key, value) {
                    (Object.hasOwnProperty.call(objXML, key) && objXML[key])(value);
                },
                image_url: function (value) {
                    if ($.isArray(value)) {
                        $.each(value, function (k, v) {
                            objXML._xml += '<image_url order="' + (k + 1) + '">' + v + '</image_url>';
                        });
                    }
                },
                methods_list: function (value) {
                    objXML._xml += "<methods_list>";
                    if ($.isArray(value)) {
                        $.each(value, function (k, v) {
                            objXML._xml += '<method order="' + (k + 1) + '">';
                            objXML._xml += '<name>' + v['name'] + '</name><params>' + v['params'] + '</params>';
                            objXML._xml += '</method>';
                        });
                    } else {
                        objXML._xml += '<method>';
                        objXML._xml += '<name>' + value['name'] + '</name><params>' + value['params'] + '</params>';
                        objXML._xml += '</method>';
                    }
                    // objXML._xml += '<crop_portrait>FALSE</crop_portrait>';
                    objXML._xml += '</methods_list>';
                },
                _default: function (key, value) {
                    objXML._xml += '<' + key + '>' + value + '</' + key + '>';
                }
            };

            $.each(json, function (key, value) {
                (Object.hasOwnProperty.call(objXML, (typeof value)) && objXML[(typeof value)] || objXML._default)(key, value);
            });

            xml = objXML._xml + '</image_process_call>';

            return xml;
        }

        function xmlParamsToJson(xml) {
            var json = {};

            var $xml = $(xml);
            var $xmlChild = $xml.find('image_process_response').children();
            $.each($xmlChild, function (e) {
                json[$xmlChild[e].tagName] = $xml.find($xmlChild[e].tagName).text();
            })

            return json;
        }

        /**
         * Check status
         * @param self This process
         */
        var attempts = 0;
        function checkResult(self) {
            attempts += 1;
            $.ajax({
                url: thisInit.getResultUrl,
                dataType: 'xml',
                cache: false,
                type: 'GET',
                data: 'request_id=' + self.request_id,
                beforeSend: function (jqXHR) {
                    self.Requests.push(jqXHR);
                },
                success: function (xml) {
                    var $xml = $(xml);
                    var status = $xml.find('status').text();

                    if (status == 'OK') {
                        attempts = 0;
                        var json = xmlParamsToJson.call(self, xml);
                        getCallbacks.call(self, 'success', json);

                        self.abort();
                    }
                    else if (status == 'InProgress' && attempts < 5) {
                        attempts += 1;
                        self.getTimer();
                    }
                    else {
                        attempts = 0;
                        getCallbacks.call(self, 'apiError', $xml.find('description').text(), $xml.find('err_code').text());
                        self.abort();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    getCallbacks.call(self, 'ajaxError', textStatus, errorThrown);
                    self.abort();
                },
                complete: function (jqXHR) {
                    self.delRequests(jqXHR);

                    getCallbacks.call(self, 'complete');
                }
            });
        }

        /**
         * Start image processing
         * @param xml 
         */
        function addTaskRequest(xml) {
            var self = this;

            var shaObj = new jsSHA(xml, 'ASCII');
            var hmac = shaObj.getHMAC(thisInit.apiKey, 'ASCII', 'HEX');

            var data = $.param({
                app_id: thisInit.appId,
                data: xml,
                sign_data: hmac
            });

            $.ajax({
                url: thisInit.addTaskUrl,
                dataType: 'xml',
                type: 'POST',
                cache: false,
                data: data,
                beforeSend: function (jqXHR) {
                    self.Requests.push(jqXHR);

                    getCallbacks.call(self, 'before');
                },
                success: function (xml) {
                    var $xml = $(xml);
                    var status = $xml.find('status').text();

                    if (status == 'OK') {
                        self.request_id = $xml.find('request_id').text();
                        self.getTimer();
                        getCallbacks.call(self, 'idReceived');
                    } else {
                        getCallbacks.call(self, 'apiError', $xml.find('description').text());

                        self.abort();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    getCallbacks.call(self, 'ajaxError', textStatus, errorThrown);

                    self.abort();
                },
                complete: function (jqXHR) {
                    self.delRequests(jqXHR);
                }
            });
        }

        /**
         * Save callbacks
         * @param {Object} _callbacks
         * @param {Object} data
         */
        function _bind(_callbacks, data) {
            $.each(_callbacks, function (e) {
                if (data[e] && typeof (data[e]) === 'function')
                    _callbacks[e].push(data[e]);
                else if (typeof (data[e]) === 'object')
                    _callbacks[e] = _callbacks[e].concat(data[e]);
            });

            return _callbacks;
        }

        return {
            /**
             * @param {Object} data
             * @property {String} data.appId
             * @property {String|Number} data.userId
             * @property {String} data.apiKey
             * @property {String data.addTaskUrl
             * @property {String data.getResultUrl
             */
            init: function (data) {
                thisInit = data;

                var _thisInit = '';

                if ((typeof (data.userId) !== 'string' && typeof (data.userId) !== 'number') || (!data.userId))
                    _thisInit += 'data.userId = ' + typeof (data.userId) + '; ';
                if (typeof (data.apiKey) !== 'string' || (!data.apiKey))
                    _thisInit += 'data.apiKey = ' + typeof (data.apiKey) + '; ';
                if (typeof (data.appId) !== 'string' || (!data.appId))
                    _thisInit += 'data.appId = ' + typeof (data.appId) + '; ';

                if (_thisInit != '')
                    thisInit = _thisInit;
            },
            /**
             * @param {Object} data - callbacks
             */
            bind: function (data) {
                callbacks = _bind(callbacks, data);
            },
            /**
             * @param {Object|String} params Image processing options
             * @param {Object} clbacks Optional obj with before, complete, error, success, error, xhr_error, api_error collbacks
             * @return {Object} _procces.abortAll Interrupt request
             */
            process: function (params, clbacks) {
                if (thisInit === false || typeof (thisInit) === 'string') {
                    throw new Error("Initialization - " + thisInit);
                    return false;
                }

                var _procces = new Process;

                if (clbacks)
                    _procces._callbacks = _bind(_procces._callbacks, clbacks);

                if (typeof (params) === 'object') {
                    var xml = jsonParamsToXml(params);
                    addTaskRequest.call(_procces, xml);
                }
                else if (typeof (params) === 'string') {
                    _procces.request_id = params;
                    _procces.getTimer();
                }

                return _procces.abortAll;
            }
        };
    };
    return PhotoAPI;
}
)
);

// ----

var photoObj = {
    photoLoading: 'img/preview_wait.gif',
    //addTaskUrl: 'http://opeapi.ws.pho.to/addtask',
    langsObj: {
        'en': 'English',
        'ru': 'Ð ÑƒÑÑÐºÐ¸Ð¹'
    },
    data: {
        appId: '9EBA5B355E5273A9DE3833A02609',
        // appId: 'af757f925eee7e5d6fd944dfecc4444c',
        userId: '1',
        apiKey: 'CB97F3379DAA4D4035FC47E2FD29',
        // apiKey: '11759d5e7aca60c77de402cb1b254f07',
        getResultUrl: 'https://opeapi.ws.pho.to/getresult',
        addTaskUrl: 'https://opeapi.ws.pho.to/addtask',
    },
    paramsObj: {
        image_url: '',
        methods_list: {
            name: 'collage',
            params: ''
        },
        template_watermark: false,
        lang: 'en',
        result_size: 700,
        result_quality: 90
    },
    sharedPages: {},
    result: {},
    effects: {
        "trending": ['Soft Lilac', 'Lilac Dreams', 'Sweet Caramel', 'Light Bokeh', 'Antique Oil Painting', 'Old Style Bw', 'Washed Out Edges', 'Dreams Of Love', 'Tropical Butterflies', 'Vintage Card'],
        "stylized": ['Old Style Bw', 'Soft Lilac', 'Dramatic Bronze', 'Vintage Card', 'Old Photo', 'Retro Film', 'Triptych Effect', 'Sweet Caramel'],
        "lighting": ['Rainbow Rays', 'Dawn Light', 'Floodlights', 'Mysterious Rays', 'Moon Night', 'Romantic Landscape', 'Evening Light'],
        "color": ['Poster Look', 'Dreamy Retro', 'Retro Sepia', 'Caramel Haze', 'Bronze Sepia', 'Dramatic Look', 'Sunny Retro', 'Fantasy Blue', 'Hdr', 'Hot Sunset', 'Dramatic Retro'],
        "fancy_filters": ['Puzzle', 'Edge Detection', 'Cartoon', 'Dave Hill', 'Infrared', 'Neon', 'Crazy Fractal', 'Matrix', 'Fire', 'Kaleidoscope', 'Underwater', /*'Mosaic Friends',*/ 'Plastic', 'Engraving', 'Cross Stitch', 'Circle Mosaic', 'Isolines', 'Mosaic', 'Image To Text Effect', 'Pixelation'],
        "background": ['Light Bokeh', 'Dreams Of Love', 'Lilac Dreams', 'Christmas Bokeh', 'Frozen Window', 'Sunny Field', 'Old Cityscape', 'Old Street Frame', 'Winter Scenery', 'Flower Dream', 'Tropical Butterflies', 'In The Wave', 'Dreamlike Scenery', 'Industrial'],
        "painting-and-drawing": ['Antique Oil Painting', 'Fusain Painting', 'Sketch', 'Charcoal', 'Pen And Ink', 'Frosty Pattern', 'Plumbago', 'Pencil Painting', 'Impressionism', 'Pointillism', 'Van Gogh Style', 'Painting'],
        "borders": ['Washed Out Edges', 'Semi Transparent Frame', 'Rounded Border', 'Simple Edge', 'Stamp Frame', 'Postage Frame']
    },
    getSharePage: function (url, callback) {
        // Cache it!
        if (photoObj.sharedPages[url]) {
            callback(photoObj.sharedPages);
        } else {
            var data = [
                'images[src]=' + url,
                'images[src_type]=url',
                'images[caption]=Photo effect applied at <a href="http://art.pho.to">Art.pho.to</a>',
                "app_key=0a074e7405a015b8"
            ].join('&');

            $.ajax({
                url: '/api-share-pho-to-proxy/v1/images',
                type: "POST",
                data: data,
                dataType: 'json',
                success: function (response) {
                    //Its url page for sharing social
                    var link = response[0]['links']['web_page'];
                    photoObj.sharedPages[url] = link;
                    photoObj.sharedPages['name'] = response[0]['name'] + '_o.' + response[0]['format'];
                    if (typeof callback == 'function')
                        callback(photoObj.sharedPages);
                },
                error: function () {
                    alert("Creating sharing page failed :(");
                }
            });
        }
    }
};

var p = new PhotoAPI;
p.init(photoObj.data);

function photoAPIApplyFilter(effect, template, image_url, callback, name = "collage") {

    // var effect = 'trending'
    photoObj.result['process'] = {};
    photoObj.result['process'][effect] = {};
    photoObj.result['process'][effect] = photoObj.effects[effect].length;

    // var template = 'Puzzle';
    var obj = {};
    photoObj.paramsObj.methods_list.name = name;
    $.extend(obj, photoObj.paramsObj);
    obj.image_url = image_url + "?v=" + Math.round(10000000 * Math.random());
    obj.methods_list.params = 'template_name=' + template;
    obj.result_size = 600;

    p.process(obj, callback);

}
// ----
