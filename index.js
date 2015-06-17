'use strict';

var ATTR_PREFIX = 'data-tracktics-';

/**
 * Transform hyphenated string to camelcase.
 *
 * @param {string} str String to transform
 * @return {string}
 */
function camelify(str) {
    return str.replace(/-([a-z])/g, function(match, $1) {
        return $1.toUpperCase();
    });
}

/**
 * Return string with first character uppercased.
 *
 * @param {string} str String to capitalize
 * @return {string}
 */
function capitalize(str) {
    /*istanbul ignore if*/
    if (!str) { return ''; }
    return str[0].toUpperCase() + str.slice(1);
}

/**
 * Dispatch payload to an array of providers. Delegates to a method on the
 * provider based on the value of `payload.type`.
 *
 * @param {object[]} providers Array of providers to dispatch to
 * @param {object} payload Data to send to the provider
 */
function dispatch(providers, payload) {
    providers.forEach(function(provider) {
        var fn = 'track' + capitalize(payload.type);

        if (typeof provider[fn] === 'function') {
            provider[fn](payload.data, payload.extra);
        }
    });
}

/**
 * Returns whether the given attribute is one of interest.
 *
 * @param {object} attr DOM element attribute to test
 * @return {boolean}
 */
function isTrackticsAttr(attr) {
    return attr.name.indexOf(ATTR_PREFIX) === 0;
}

/**
 * Returns whether attribute is of interest and is not one of the primary
 * Tracktics attributes (hence "extra").
 *
 * @param {object} attr DOM element attribute to test
 * @return {boolean}
 */
function isExtraDataAttr(attr) {
    return isTrackticsAttr(attr) &&
        attr.name !== ATTR_PREFIX + 'on' &&
        attr.name !== ATTR_PREFIX + 'event';
}

/**
 * Return attribute as { name, value } object.
 *
 * @param {object} attr DOM element attribute to serialize
 * @return {object}
 */
function serializeAttr(attr) {
    return {
        name: camelify(attr.name.slice(ATTR_PREFIX.length)),
        value: attr.value
    };
}

/**
 * Reducer function to return array of DOM element attributes as a single
 * object with name/value pairs.
 *
 * @param {object} attrs Accumulated DOM element attribute data
 * @param {object} attr Current DOM element attribute
 * @return {object}
 */
function toAttrsObject(attrs, attr) {
    attrs[attr.name] = attr.value;
    return attrs;
}

/**
 * Extract extra tracking data from given element.
 *
 * @param {HTMLElement} el DOM element to extract data from
 * @return {object}
 */
function getTrackticsData(el) {
    return Array.prototype.slice.call(el.attributes)
        .filter(isExtraDataAttr)
        .map(serializeAttr)
        .reduce(toAttrsObject, {});
}

/**
 * Return whether element should be considered for mouse event tracking.
 *
 * @param {HTMLElement} el DOM element to test
 * @param {string} eventName Event name (click/mouseup/mousedown)
 * @return {boolean}
 */
function hasTracking(el, eventName) {
    var attrValue = el.getAttribute(ATTR_PREFIX + 'on');

    return el.hasAttribute(ATTR_PREFIX + 'on') &&
        eventName === 'click' ?
            (attrValue === 'click' || attrValue === '') :
            attrValue === eventName;
}

/**
 * Create event handler for the given event type. Event handler will dispatch
 * data based on the event that gets bound.
 *
 * @param {object[]} providers Array of providers to dispatch to
 * @param {string} eventName Event type to bind (click/mouseup/mousedown)
 * @return {function}
 */
function genEventHandler(providers, eventName) {
    return function(e) {
        if (hasTracking(e.target, eventName)) {
            dispatch(providers, {
                type: 'event',
                data: e.target.getAttribute(ATTR_PREFIX + 'event') || e.target.innerText,
                extra: getTrackticsData(e.target)
            });
        }
    };
}

/**
 * Main Tracktics tracker factory.
 */
module.exports = function() {
    var providers = [],
        trackticsOnClick = genEventHandler(providers, 'click'),
        trackticsOnMouseUp = genEventHandler(providers, 'mouseup'),
        trackticsOnMouseDown = genEventHandler(providers, 'mousedown');

    return {
        /**
         * Register a provider plugin with the running list of providers.
         *
         * @param {object} provider Provider plugin to register
         */
        use: function use(provider) {
            providers.push(provider);
        },

        /**
         * Add event listeners to the DOM.
         */
        bind: function bind() {
            document.body.addEventListener('click',     trackticsOnClick);
            document.body.addEventListener('mouseup',   trackticsOnMouseUp);
            document.body.addEventListener('mousedown', trackticsOnMouseDown);
        },

        /**
         * Remove event listeners from the DOM.
         */
        unbind: function unbind() {
            document.body.removeEventListener('click',     trackticsOnClick);
            document.body.removeEventListener('mouseup',   trackticsOnMouseUp);
            document.body.removeEventListener('mousedown', trackticsOnMouseDown);
        },

        /**
         * Dispatch a payload to the `trackPage` method of every registered
         * provider.
         *
         * @param {string} url URL to track
         * @param {object} options Additional options to pass to the provider
         */
        trackPage: function trackPage(url, options) {
            dispatch(providers, {
                type: 'page',
                data: url,
                extra: options
            });
        },

        /**
         * Dispatch a payload to the `trackEvent` method of every registered
         * provider.
         *
         * @param {string} eventName Event name to track
         * @param {object} options Additional options to pass to the provider
         */
        trackEvent: function trackEvent(eventName, options) {
            dispatch(providers, {
                type: 'event',
                data: eventName,
                extra: options
            });
        },
    };
};
