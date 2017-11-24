var _App;
(function($) {
    "use strict";

    var obj = function(host) {
        this.ip = host.replace(/https*:\/\//, (host.match(/https:\/\//))? 'wss://' : 'ws://');
        console.log('format', host, this.ip);
        var s = this.ip.split(':');
        s[s.length - 1] = Number(s[s.length - 1]);
        this.ip = s.join(':');
        console.log('end', this.ip);
        this._open = false;
        this._cache = [];
        this._event = new $.event();
        this._reconnect = true;

        var self = this;
        this.connect().then(function() {
            self.init();
        });

        this._event.on('error', function(e) {
            console.error('error: ', e);
        });
    };
    obj.prototype = {
        _connnect: function() {
            var p = new $.promise();
            try {
                this.socket = new WebSocket(this.ip);
                p.resolve(this.socket);
            } catch(e) {
                p.reject(e);
            }
            return (p);
        },
        connect: function() {
            var self = this;
            return (self._connnect().then(function() {
                return (null);
            }, function() {
                return (self._connnect());
            }));
        },
        init: function() {
            var self = this;

            console.info('ws connect init');

            this.socket.onclose = function() {
                self._open = false;
                self._event.emit('close');
                if (self._reconnect) {
                    self.connect().then(function() {
                        self._event.emit('reconnect');
                        self.init();
                    });
                }
            };

            this.socket.onerror = function(e) {
                self._event.emit('error', e);
            };

            this.socket.onopen = function() {
                self._open = true;
                self._event.emit('open');
            };

            this.socket.onmessage = function(m) {
                try {
                    var data = JSON.parse(m.data);
                    self._event.emit(data.type, data.data);
                    self._event.emit('message', data);
                } catch (e) {
                    console.warn('error: ws message event not json.', e, e.stack);
                }
            }
        },
        send: function(action, value) {
            var p = new $.promise(), self = this;

            var data = JSON.stringify({action: action, value: value});
            if (this._open) {
                try {
                    this.socket.send(data);
                    this.once('message').then(function(m) {
                        if (m.action === action) {
                            p.resolve(m.value);
                        }
                    });
                } catch(e) {
                    this._event.emit('error', e);
                }
            } else {
                this._cache.push(data);
            }

            return (p);
        },
        emit: function(a, b) {
            return (this.send(a, b));
        },
        close: function() {
            this._reconnect = false;
            this.socket.close();
            return (this.once('close'));
        },
        on: function(event, func) {
            this._event.on(event, func);
            return (this);
        },
        once: function(event, func) {
            if (!func) {
                var p = new $.promise();

                this._event.once(event, function (a) {
                    p.resolve(a);
                });

                return (p);
            }
            this._event.once(event, func);
            return (this);
        },
        removeListener: function(event, func) {
            return (this._event.removeListener(event, func));
        }
    };

    $.webSocket = obj;

    var _cache = {};
    $.socket = function(host) {
        if (!_cache[host]) {
            _cache[host] = new $.webSocket(host);
        }
        //console.log('connect socket to', host);
        return (_cache[host]);
    };
})(_App || (_App = {}));