'use strict';

var $ = require('jquery'),
    tracktics = require('..');

describe('Tracktics', function() {
    var tracker, provider1, provider2, provider3;

    beforeEach(function() {
        tracker = tracktics();
        provider1 = jasmine.createSpyObj('provider1', ['trackPage', 'trackEvent']);
        provider2 = jasmine.createSpyObj('provider2', ['trackPage']);
        provider3 = jasmine.createSpyObj('provider3', ['trackEvent']);

        tracker.use(provider1);
        tracker.use(provider2);
        tracker.use(provider3);
    });

    describe('#trackPage', function() {
        var url, options;

        beforeEach(function() {
            url = '/some/url';
            options = {};

            tracker.trackPage(url, options);
        });

        it('should dispatch event to providers that expose "trackPage" method', function() {
            expect(provider1.trackPage).toHaveBeenCalledWith(url, options);
            expect(provider2.trackPage).toHaveBeenCalledWith(url, options);
        });
    });

    describe('#trackEvent', function() {
        var eventName, options;

        beforeEach(function() {
            eventName = 'someEvent';
            options = {};

            tracker.trackEvent(eventName, options);
        });

        it('should dispatch event to providers that expose "trackEvent" method', function() {
            expect(provider1.trackEvent).toHaveBeenCalledWith(eventName, options);
            expect(provider3.trackEvent).toHaveBeenCalledWith(eventName, options);
        });
    });

    describe('when events are bound', function() {

        describe('click events', function() {

            beforeEach(function() {
                $('body').html([
                    '<button data-tracktics-on>Foo</button>',
                    '<button data-tracktics-on data-tracktics-event="Bar">Foo</button>',
                    '<button data-tracktics-on="click" data-tracktics-baz="foobarbaz">Baz</button>',
                    '<button data-tracktics-on="click" data-tracktics-foo-bar="quux">Baz</button>',
                    '<button>No Tracking</button>'
                ].join('\n'));

                tracker.bind();

                $('button').each(function() { $(this).click(); });
            });

            it('should dispatch click events to providers with expected data', function() {
                [provider1, provider3].forEach(function(provider) {
                    expect(provider.trackEvent).toHaveBeenCalledWith('click', { event: 'Foo' });
                    expect(provider.trackEvent).toHaveBeenCalledWith('click', { event: 'Bar' });
                    expect(provider.trackEvent).toHaveBeenCalledWith('click', { event: 'Baz', baz: 'foobarbaz' });
                    expect(provider.trackEvent).toHaveBeenCalledWith('click', { event: 'Baz', fooBar: 'quux' });
                });
            });

            describe('when tracker is unbound', function() {

                beforeEach(function() {
                    tracker.unbind();

                    provider1.trackEvent.calls.reset();
                    provider3.trackEvent.calls.reset();

                    $('button').each(function() { $(this).click(); });
                });

                it('should no longer dispatch click events', function() {
                    [provider1, provider3].forEach(function(provider) {
                        expect(provider.trackEvent).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('mouseup events', function() {

            beforeEach(function() {
                $('body').html([
                    '<button data-tracktics-on="mouseup">Foo</button>',
                    '<button data-tracktics-on="mouseup" data-tracktics-event="Bar">Foo</button>',
                    '<button data-tracktics-on="mouseup" data-tracktics-baz="foobarbaz">Baz</button>',
                    '<button data-tracktics-on="mouseup" data-tracktics-foo-bar="quux">Baz</button>',
                    '<button>No Tracking</button>'
                ].join('\n'));

                tracker.bind();

                $('button').each(function() {
                    var evt = document.createEvent('MouseEvent');
                    evt.initEvent('mouseup', true, true);

                    this.dispatchEvent(evt);
                });
            });

            it('should dispatch mouseup events to providers with expected data', function() {
                [provider1, provider3].forEach(function(provider) {
                    expect(provider.trackEvent).toHaveBeenCalledWith('mouseup', { event: 'Foo' });
                    expect(provider.trackEvent).toHaveBeenCalledWith('mouseup', { event: 'Bar' });
                    expect(provider.trackEvent).toHaveBeenCalledWith('mouseup', { event: 'Baz', baz: 'foobarbaz' });
                    expect(provider.trackEvent).toHaveBeenCalledWith('mouseup', { event: 'Baz', fooBar: 'quux' });
                });
            });

            describe('when tracker is unbound', function() {

                beforeEach(function() {
                    tracker.unbind();

                    provider1.trackEvent.calls.reset();
                    provider3.trackEvent.calls.reset();

                    $('button').each(function() {
                        var evt = document.createEvent('MouseEvent');
                        evt.initEvent('mouseup', true, true);

                        this.dispatchEvent(evt);
                    });
                });

                it('should no longer dispatch mouseup events', function() {
                    [provider1, provider3].forEach(function(provider) {
                        expect(provider.trackEvent).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('mousedown events', function() {

            beforeEach(function() {
                $('body').html([
                    '<button data-tracktics-on="mousedown">Foo</button>',
                    '<button data-tracktics-on="mousedown" data-tracktics-event="Bar">Foo</button>',
                    '<button data-tracktics-on="mousedown" data-tracktics-baz="foobarbaz">Baz</button>',
                    '<button data-tracktics-on="mousedown" data-tracktics-foo-bar="quux">Baz</button>',
                    '<button>No Tracking</button>'
                ].join('\n'));

                tracker.bind();

                $('button').each(function() {
                    var evt = document.createEvent('MouseEvent');
                    evt.initEvent('mousedown', true, true);

                    this.dispatchEvent(evt);
                });
            });

            it('should dispatch mousedown events to providers with expected data', function() {
                [provider1, provider3].forEach(function(provider) {
                    expect(provider.trackEvent).toHaveBeenCalledWith('mousedown', { event: 'Foo' });
                    expect(provider.trackEvent).toHaveBeenCalledWith('mousedown', { event: 'Bar' });
                    expect(provider.trackEvent).toHaveBeenCalledWith('mousedown', { event: 'Baz', baz: 'foobarbaz' });
                    expect(provider.trackEvent).toHaveBeenCalledWith('mousedown', { event: 'Baz', fooBar: 'quux' });
                });
            });

            describe('when tracker is unbound', function() {

                beforeEach(function() {
                    tracker.unbind();

                    provider1.trackEvent.calls.reset();
                    provider3.trackEvent.calls.reset();

                    $('button').each(function() {
                        var evt = document.createEvent('MouseEvent');
                        evt.initEvent('mousedown', true, true);

                        this.dispatchEvent(evt);
                    });
                });

                it('should no longer dispatch mousedown events', function() {
                    [provider1, provider3].forEach(function(provider) {
                        expect(provider.trackEvent).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
