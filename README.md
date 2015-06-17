# Tracktics

Tracktics provides a framework-agnostic, pluggable inversion-of-control
container for analytics tracking. Analytics events may be specified manually
using the tracker API, or declaratively using `data-tracktics-*` DOM element
attributes.

[![npm Version][npm-badge]][npm]
[![Build Status][build-badge]][build-status]
[![Test Coverage][coverage-badge]][coverage-result]
[![Dependency Status][dep-badge]][dep-status]

## Installation

Install using npm:

    $ npm install tracktics

## Browser Support

IE9+

## Examples

### Basic Usage

Basic usage that integrates with Google Analytics in a simple jQuery app:

```js
'use strict';

var $ = require('jquery'),
    tracktics = require('tracktics'),
    tracker = tracktics();

// Register the Google Analytics plugin.
tracker.use(require('tracktics-google-analytics'));

$(document).ready(function() {
    // Add event listeners for mouse events on elements that have had
    // data-tracktics-* attributes defined.
    tracker.bind();
});
```

### Basic Usage with Page Tracking

Similar to the previous example, but adds a hook into the Backbone router to
provide additional page navigation.

```js
'use strict';

var $ = require('jquery'),
    Backbone = require('backbone'),
    tracktics = require('tracktics'),
    tracker = tracktics(),
    app = require('./app');

tracker.use(require('tracktics-google-analytics'));

$(document).ready(function() {
    app.init();

    Backbone.history.on('route', function() {
        var url = Backbone.history.root + Backbone.history.getFragment();
        tracker.trackPage(url);
    });

    Backbone.history.start();
});
```

## Supported Analytics Providers

 * Google Analytics ([tracktics-google-analytics](https://github.com/jimf/tracktics-google-analytics))
 * KISSmetrics ([tracktics-kissmetrics](https://github.com/jimf/tracktics-kissmetrics))
 * Mixpanel ([tracktics-mixpanel](https://github.com/jimf/tracktics-mixpanel))

## API

### `tracktics()`

```js
var tracktics = require('tracktics'),
    tracker = tracktics();
```

The main Tracktics export, `tracktics` is a factory function for generating
Tracktics tracker instances. Calling this method returns a tracker object that
can be used to register one or more analytics provider plugins. Once any number
of plugins have been registered, the tracker can then be used to manually
dispatch events to the providers, or to bind event handlers for having events
of interest be dispatched automatically.

### `#use(<AnalyticsProviderPlugin>)`

```js
tracker.use(myAnalyticsProvider);
```

Register a Tracktics analytics provider plugin. A provider plugin can be any
object that exposes either or both methods `trackPage` and `trackEvent`. It's
then up to the plugin to handle event data and payload.

### `#bind()`

```js
tracker.bind();
```

Bind event listeners for handling mouse events on DOM elements that include
Tracktics `data-tracktics-*` attributes. These listeners are bound to
`document.body` and operate via event delgation to keep the footprint low.

### `#unbind()`

```js
tracker.unbind();
```

Unbind event listeners for handling Tracktics mouse events.

### `#trackPage(url, [options])`

```js
tracker.trackPage('/some/url');
```

Method for manual page tracking. Options will vary depending on the provider.

### `#trackEvent(eventName, [options])`

```js
tracker.trackEvent('someEvent');
```

Method for manual event tracking. Options will vary depending on the provider.

## Declarative Analytics Tracking

Tracktics allows and encourages the use of declarative markup for configuring
event-based tracking. This is done by adding `data-tracktics-*` attributes to
any DOM elements of interest, and then calling `.bind()` on the Tracktics
tracker instance:

```html
<button id="purchase-button" type="button" data-tracktics-on="click">Purchase</button>
```

```js
var tracktics = require('tracktics'),
    tracker = tracktics();

// ... register provider plugin(s), then:
tracker.bind();
```

### `data-tracktics-on` (*required*)

The only required attribute for event delegation to function,
`data-tracktics-on` is used to identify DOM elements of interest and specify
what DOM event type should be listened to for the given element. Valid values
for this attribute include "click", "mouseup", and "mousedown". If no value is
specified, "click" is the default behavior.

### `data-tracktics-event`

Use this attribute to manually specify the event name that gets dispatched to
`trackEvent`. If this attribute is missing, the DOM element's innerText is used
instead.

### `data-tracktics-*`

Any other `data-tracktics-*` attributes may be specified. This data will be
passed along to the registered provider plugins via the `options` object. For
example, if a DOM element were to define `data-tracktics-category="Sales"`, the
provider would receive `{ category: "Sales" }` via `options`. This gives
powerful flexibility to provider plugins, and the means to be able to support a
wide array of capabilities.

## Provider Plugins

Any JavaScript object can serve as a Tracktics provider plugin, provided that
it exposes a `trackPage` and/or `trackEvent` method. These methods will be
called on registered provider plugins when an analytics event is dispatched,
and it is up to the plugin to define how that event gets handled.

### `#trackPage(url, [options])`

Vendor-specific handler for page tracking. Tracktics page tracking is currently
a manual process. This method will be called on registered provider plugins
with the exact same data that was passed to the tracker's `trackPage` method.

### `#trackEvent(eventName, [options])`

Vendor-specific handler for event tracking. Event tracking can be done manually
via the tracker's `trackEvent` method, or declaratively via `data-tracktics-*`
attributes. This method will be called on registered provider plugins with the
event name and any optional associated data for the event.

## License

MIT

[build-badge]: https://img.shields.io/travis/jimf/tracktics/master.svg
[build-status]: https://travis-ci.org/jimf/tracktics
[npm-badge]: https://img.shields.io/npm/v/tracktics.svg
[npm]: https://www.npmjs.org/package/tracktics
[coverage-badge]: https://img.shields.io/coveralls/jimf/tracktics.svg
[coverage-result]: https://coveralls.io/r/jimf/tracktics
[dep-badge]: https://img.shields.io/david/jimf/tracktics.svg
[dep-status]: https://david-dm.org/jimf/tracktics
