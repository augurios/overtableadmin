(function () {
    'use strict';

 angular
        .module('application.config', ['application.thirdparty'])

	    .config(config)

        config.$inject = ['$stateProvider', '$urlRouterProvider','$locationProvider', '$httpProvider','$compileProvider', 'cfpLoadingBarProvider','localStorageServiceProvider','datetimepickerProvider','$translateProvider'];
		/* ngInject */
	    function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider,$compileProvider,cfpLoadingBarProvider,localStorageServiceProvider,datetimepickerProvider,$translateProvider) {
		cfpLoadingBarProvider.includeSpinner = true;
		    localStorageServiceProvider
			    .setPrefix('meanApp')
			    .setStorageType('localStorage')
			    .setNotify(true, true)
			    .setStorageCookie(1, '<path>');

			 $compileProvider.debugInfoEnabled(false);

			if (!$httpProvider.defaults.headers.get) {
		        $httpProvider.defaults.headers.get = {};
		    }
		    datetimepickerProvider.setOptions({
                locale: 'en',format: 'DD/MM/YYYY'
            });

		    $httpProvider.defaults.useXDomain = true;
		    delete $httpProvider.defaults.headers.common['X-Requested-With'];
		    $httpProvider.interceptors.push('httpRequestInterceptor');
		    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
		    $httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE';
		    $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
		    $httpProvider.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true';

		    $translateProvider
			  .useStaticFilesLoader({
			    prefix: './public/app/translations/locale-',
			    suffix: '.json'
			  })
			  .useMissingTranslationHandlerLog()
		      .useSanitizeValueStrategy()
		      .useStorage('translationService')
		      .registerAvailableLanguageKeys(['en', 'sp'])
		      .preferredLanguage('en')
		      .fallbackLanguage('en')

	    }



})();