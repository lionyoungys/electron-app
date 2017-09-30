/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ({

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * 菜单导航栏配置\n * @author yangyunlong\n */\nvar Menus = function Menus() {\n    _classCallCheck(this, Menus);\n\n    return [{\n        id: 1,\n        selection: {\n            id: 'order',\n            text: '线上订单'\n        },\n        options: [{ id: 11, text: '订单查询' }, { id: 12, text: '订单处理' }]\n    }, {\n        id: 2,\n        selection: {\n            id: 'finance',\n            text: '线下收银'\n        },\n        options: [{ id: 21, text: '收衣' }, { id: 22, text: '送洗' }, { id: 23, text: '上挂' }, { id: 24, text: '取衣' }, { id: 25, text: '会员管理' }, { id: 26, text: '业务统计' }]\n    }, {\n        id: 3,\n        selection: {\n            id: 'manage',\n            text: '商家管理'\n        },\n        options: [{ id: 31, text: '商品管理' }, { id: 32, text: '财务对账' }, { id: 33, text: '经营分析' }, { id: 34, text: '员工管理' }, { id: 35, text: '返现记录' }, { id: 36, text: '消息通知' }, { id: 37, text: '用户评价' }, { id: 38, text: '门店信息' }]\n    }];\n};\n\nexports.default = new Menus();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgvbWVudXMuanM/NGI5ZiJdLCJuYW1lcyI6WyJNZW51cyIsImlkIiwic2VsZWN0aW9uIiwidGV4dCIsIm9wdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7SUFJTUEsSyxHQUNGLGlCQUFlO0FBQUE7O0FBQ1gsV0FBTyxDQUNIO0FBQ0lDLFlBQUcsQ0FEUDtBQUVJQyxtQkFBVTtBQUNORCxnQkFBRyxPQURHO0FBRU5FLGtCQUFLO0FBRkMsU0FGZDtBQU1JQyxpQkFBUSxDQUNKLEVBQUNILElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFESSxFQUVKLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFGSTtBQU5aLEtBREcsRUFZSDtBQUNJRixZQUFHLENBRFA7QUFFSUMsbUJBQVU7QUFDTkQsZ0JBQUcsU0FERztBQUVORSxrQkFBSztBQUZDLFNBRmQ7QUFNSUMsaUJBQVEsQ0FDSixFQUFDSCxJQUFHLEVBQUosRUFBUUUsTUFBSyxJQUFiLEVBREksRUFFSixFQUFDRixJQUFHLEVBQUosRUFBUUUsTUFBSyxJQUFiLEVBRkksRUFHSixFQUFDRixJQUFHLEVBQUosRUFBUUUsTUFBSyxJQUFiLEVBSEksRUFJSixFQUFDRixJQUFHLEVBQUosRUFBUUUsTUFBSyxJQUFiLEVBSkksRUFLSixFQUFDRixJQUFHLEVBQUosRUFBUUUsTUFBSyxNQUFiLEVBTEksRUFNSixFQUFDRixJQUFHLEVBQUosRUFBUUUsTUFBSyxNQUFiLEVBTkk7QUFOWixLQVpHLEVBMkJIO0FBQ0lGLFlBQUcsQ0FEUDtBQUVJQyxtQkFBVTtBQUNORCxnQkFBRyxRQURHO0FBRU5FLGtCQUFLO0FBRkMsU0FGZDtBQU1JQyxpQkFBUSxDQUNKLEVBQUNILElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFESSxFQUVKLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFGSSxFQUdKLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFISSxFQUlKLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFKSSxFQUtKLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFMSSxFQU1KLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFOSSxFQU9KLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFQSSxFQVFKLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFSSTtBQU5aLEtBM0JHLENBQVA7QUE2Q0gsQzs7a0JBR1UsSUFBSUgsS0FBSixFIiwiZmlsZSI6IjQ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiDoj5zljZXlr7zoiKrmoI/phY3nva5cbiAqIEBhdXRob3IgeWFuZ3l1bmxvbmdcbiAqL1xuY2xhc3MgTWVudXMge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDoxLFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjp7XG4gICAgICAgICAgICAgICAgICAgIGlkOidvcmRlcicsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6J+e6v+S4iuiuouWNlSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6W1xuICAgICAgICAgICAgICAgICAgICB7aWQ6MTEsIHRleHQ6J+iuouWNleafpeivoid9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MTIsIHRleHQ6J+iuouWNleWkhOeQhid9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDoyLFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjp7XG4gICAgICAgICAgICAgICAgICAgIGlkOidmaW5hbmNlJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDon57q/5LiL5pS26ZO2J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3B0aW9uczpbXG4gICAgICAgICAgICAgICAgICAgIHtpZDoyMSwgdGV4dDon5pS26KGjJ30sXG4gICAgICAgICAgICAgICAgICAgIHtpZDoyMiwgdGV4dDon6YCB5rSXJ30sXG4gICAgICAgICAgICAgICAgICAgIHtpZDoyMywgdGV4dDon5LiK5oyCJ30sXG4gICAgICAgICAgICAgICAgICAgIHtpZDoyNCwgdGV4dDon5Y+W6KGjJ30sXG4gICAgICAgICAgICAgICAgICAgIHtpZDoyNSwgdGV4dDon5Lya5ZGY566h55CGJ30sXG4gICAgICAgICAgICAgICAgICAgIHtpZDoyNiwgdGV4dDon5Lia5Yqh57uf6K6hJ31cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOjMsXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uOntcbiAgICAgICAgICAgICAgICAgICAgaWQ6J21hbmFnZScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6J+WVhuWutueuoeeQhidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6W1xuICAgICAgICAgICAgICAgICAgICB7aWQ6MzEsIHRleHQ6J+WVhuWTgeeuoeeQhid9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MzIsIHRleHQ6J+i0ouWKoeWvuei0pid9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MzMsIHRleHQ6J+e7j+iQpeWIhuaekCd9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MzQsIHRleHQ6J+WRmOW3peeuoeeQhid9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MzUsIHRleHQ6J+i/lOeOsOiusOW9lSd9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MzYsIHRleHQ6J+a2iOaBr+mAmuefpSd9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MzcsIHRleHQ6J+eUqOaIt+ivhOS7tyd9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MzgsIHRleHQ6J+mXqOW6l+S/oeaBryd9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IE1lbnVzKCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4L21lbnVzLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///44\n");

/***/ })

/******/ });