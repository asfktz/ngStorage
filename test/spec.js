'use strict';

describe('ngStorage', function() {
    var PREFIX = 'ngStorage-';
    var $localStorage, $sessionStorage, $rootScope;

    function getFrom(webStoarge, key) {
        return angular.fromJson(window[webStoarge].getItem(PREFIX + key));
    }

    function update () {
        $rootScope.$apply();

        // wait for debouncing to end..
        jasmine.clock().tick(101);
    }

    beforeEach(function() {
        localStorage.clear();
        sessionStorage.clear();
        jasmine.clock().install();

        module('ngStorage');
    });

    beforeEach(inject(function(_$localStorage_, _$sessionStorage_, _$rootScope_) {
        $localStorage = _$localStorage_;
        $sessionStorage = _$sessionStorage_;
        $rootScope = _$rootScope_;
    }));

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it('should contain a $localStorage service', inject(function(
        $localStorage
    ) {
        expect($localStorage).not.to.equal(null);
    }));


    describe('Sync with webStorage', function () {
        
        it('should save value to webStorage', function() {
            $localStorage.someKey = 'value1';
            $sessionStorage.someKey = 'value2';

            update();

            // data been saved as json
            expect(getFrom('localStorage', 'someKey')).to.equal('value1');
            expect(getFrom('sessionStorage', 'someKey')).to.equal('value2');
        });

        it('should delete value to webStorage', function() {
            $localStorage.someKey = 'value1';
            $sessionStorage.someKey = 'value2';
            
            update();

            expect(getFrom('localStorage', 'someKey')).to.equal('value1');
            expect(getFrom('sessionStorage', 'someKey')).to.equal('value2');

            delete $localStorage.someKey;
            delete $sessionStorage.someKey;

            update();
            
            expect(getFrom('localStorage', 'someKey')).to.equal(null);
            expect(getFrom('sessionStorage', 'someKey')).to.equal(null);
        });

    });

    describe('$default functionality', function () {
        it('should set default values', function() {
            $localStorage.$default({
                someKey : 'default value'
            });

            update();

            expect(getFrom('localStorage', 'someKey')).to.equal('default value');
        });

        it('should override default values', function() {
            $localStorage.$default({
                someKey : 'default value'
            });

            update();

            expect(getFrom('localStorage', 'someKey')).to.equal('default value');

            $localStorage.someKey = 'override value';

            update();

            expect(getFrom('localStorage', 'someKey')).to.equal('override value');
        });


        it('should not override existing value with default values', function() {
            $localStorage.someKey = 'existing value';

            update();
            
            expect(getFrom('localStorage', 'someKey')).to.equal('existing value');

            $localStorage.$default({
                someKey : 'default value'
            });

            update();

            expect(getFrom('localStorage', 'someKey')).to.equal('existing value');
        });
    });

    describe('$reset functionality', function () {
        it('should reset storage', function() {
            $localStorage.someKey = 'value';
            update();

            expect(getFrom('localStorage', 'someKey')).to.equal('value');
            
            $localStorage.$reset();
            update();

            expect(getFrom('localStorage', 'someKey')).to.equal(null);
        });

        it('should reset storage to given object', function() {
            $localStorage.someKey = 'value';
            update();

            expect(getFrom('localStorage', 'someKey')).to.equal('value');
            
            $localStorage.$reset({
                someOtherKey : 'value'
            });

            update();

            expect(getFrom('localStorage', 'someKey')).to.equal(null);
            expect(getFrom('localStorage', 'someOtherKey')).to.equal('value');
        });
    });
});
