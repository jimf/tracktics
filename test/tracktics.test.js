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

            beforeEach(function(done) {
                $('body').html([
                    '<button data-tracktics-on><div class="inner">Foo</div></button>',
                    '<button data-tracktics-on data-tracktics-event="Bar"><div class="inner">Foo</div></button>',
                    '<button data-tracktics-on="click" data-tracktics-baz="foobarbaz"><div class="inner">Baz</div></button>',
                    '<button data-tracktics-on="click" data-tracktics-foo-bar="quux"><div class="inner">Baz</div></button>',
                    '<button><div class="inner">No Tracking</div></button>'
                ].join('\n'));

                tracker.bind();

                $('.inner').each(function() {
                    var evt = document.createEvent('MouseEvent');
                    evt.initEvent('click', true, true);

                    this.dispatchEvent(evt);
                });

                setTimeout(function() {
                    done();
                }, 100);
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

                    $('.inner').each(function() { $(this).click(); });
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
                    '<button data-tracktics-on="mouseup"><div class="inner">Foo</div></button>',
                    '<button data-tracktics-on="mouseup" data-tracktics-event="Bar"><div class="inner">Foo</div></button>',
                    '<button data-tracktics-on="mouseup" data-tracktics-baz="foobarbaz"><div class="inner">Baz</div></button>',
                    '<button data-tracktics-on="mouseup" data-tracktics-foo-bar="quux"><div class="inner">Baz</div></button>',
                    '<button><div class="inner">No Tracking</div></button>'
                ].join('\n'));

                tracker.bind();

                $('.inner').each(function() {
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

                    $('.inner').each(function() {
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
                    '<button data-tracktics-on="mousedown"><div class="inner">Foo</div></button>',
                    '<button data-tracktics-on="mousedown" data-tracktics-event="Bar"><div class="inner">Foo</div></button>',
                    '<button data-tracktics-on="mousedown" data-tracktics-baz="foobarbaz"><div class="inner">Baz</div></button>',
                    '<button data-tracktics-on="mousedown" data-tracktics-foo-bar="quux"><div class="inner">Baz</div></button>',
                    '<button><div class="inner">No Tracking</div></button>'
                ].join('\n'));

                tracker.bind();

                $('.inner').each(function() {
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

                    $('.inner').each(function() {
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
