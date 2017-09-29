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
/******/ 	return __webpack_require__(__webpack_require__.s = 32);
/******/ })
/************************************************************************/
/******/ ({

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar MenuConfig = function MenuConfig() {\n    _classCallCheck(this, MenuConfig);\n\n    return [{\n        id: 1,\n        selection: {\n            id: 'order',\n            text: '线上订单',\n            status: true\n        },\n        option: {\n            id: 12,\n            items: [{ id: 121, text: '订单查询' }, { id: 122, text: '订单处理' }]\n        }\n    }, {\n        id: 2,\n        selection: {\n            id: 'finance',\n            text: '线下收银',\n            status: false\n        },\n        option: {\n            id: 22,\n            items: [{ id: 221, text: '收衣' }, { id: 222, text: '送洗' }, { id: 223, text: '上挂' }, { id: 224, text: '取衣' }, { id: 225, text: '会员管理' }, { id: 226, text: '业务统计' }]\n        }\n    }, {\n        id: 3,\n        selection: {\n            id: 'manage',\n            text: '商家管理',\n            status: false\n        },\n        option: {\n            id: 32,\n            items: [{ id: 321, text: '商品管理' }, { id: 322, text: '财务对账' }, { id: 323, text: '经营分析' }, { id: 324, text: '员工管理' }, { id: 325, text: '返现记录' }, { id: 326, text: '消息通知' }, { id: 327, text: '用户评价' }, { id: 328, text: '门店信息' }]\n        }\n    }];\n};\n\nexports.default = new MenuConfig();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tZW51LmpzPzQwOGEiXSwibmFtZXMiOlsiTWVudUNvbmZpZyIsImlkIiwic2VsZWN0aW9uIiwidGV4dCIsInN0YXR1cyIsIm9wdGlvbiIsIml0ZW1zIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7SUFDTUEsVSxHQUNGLHNCQUFlO0FBQUE7O0FBQ1gsV0FBTyxDQUNIO0FBQ0lDLFlBQUcsQ0FEUDtBQUVJQyxtQkFBVTtBQUNORCxnQkFBRyxPQURHO0FBRU5FLGtCQUFLLE1BRkM7QUFHTkMsb0JBQU87QUFIRCxTQUZkO0FBT0lDLGdCQUFPO0FBQ0hKLGdCQUFHLEVBREE7QUFFSEssbUJBQU0sQ0FDRixFQUFDTCxJQUFHLEdBQUosRUFBU0UsTUFBSyxNQUFkLEVBREUsRUFFRixFQUFDRixJQUFHLEdBQUosRUFBU0UsTUFBSyxNQUFkLEVBRkU7QUFGSDtBQVBYLEtBREcsRUFnQkg7QUFDSUYsWUFBRyxDQURQO0FBRUlDLG1CQUFVO0FBQ05ELGdCQUFHLFNBREc7QUFFTkUsa0JBQUssTUFGQztBQUdOQyxvQkFBTztBQUhELFNBRmQ7QUFPSUMsZ0JBQU87QUFDSEosZ0JBQUcsRUFEQTtBQUVISyxtQkFBTSxDQUNGLEVBQUNMLElBQUcsR0FBSixFQUFTRSxNQUFLLElBQWQsRUFERSxFQUVGLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLElBQWQsRUFGRSxFQUdGLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLElBQWQsRUFIRSxFQUlGLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLElBQWQsRUFKRSxFQUtGLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLE1BQWQsRUFMRSxFQU1GLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLE1BQWQsRUFORTtBQUZIO0FBUFgsS0FoQkcsRUFtQ0g7QUFDSUYsWUFBRyxDQURQO0FBRUlDLG1CQUFVO0FBQ05ELGdCQUFHLFFBREc7QUFFTkUsa0JBQUssTUFGQztBQUdOQyxvQkFBTztBQUhELFNBRmQ7QUFPSUMsZ0JBQU87QUFDSEosZ0JBQUcsRUFEQTtBQUVISyxtQkFBTSxDQUNGLEVBQUNMLElBQUcsR0FBSixFQUFTRSxNQUFLLE1BQWQsRUFERSxFQUVGLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLE1BQWQsRUFGRSxFQUdGLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLE1BQWQsRUFIRSxFQUlGLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLE1BQWQsRUFKRSxFQUtGLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLE1BQWQsRUFMRSxFQU1GLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLE1BQWQsRUFORSxFQU9GLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLE1BQWQsRUFQRSxFQVFGLEVBQUNGLElBQUcsR0FBSixFQUFTRSxNQUFLLE1BQWQsRUFSRTtBQUZIO0FBUFgsS0FuQ0csQ0FBUDtBQXlESCxDOztrQkFHVSxJQUFJSCxVQUFKLEUiLCJmaWxlIjoiMzIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5jbGFzcyBNZW51Q29uZmlnIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6MSxcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb246e1xuICAgICAgICAgICAgICAgICAgICBpZDonb3JkZXInLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0Oifnur/kuIrorqLljZUnLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6dHJ1ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3B0aW9uOntcbiAgICAgICAgICAgICAgICAgICAgaWQ6MTIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOltcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpZDoxMjEsIHRleHQ6J+iuouWNleafpeivoid9LFxuICAgICAgICAgICAgICAgICAgICAgICAge2lkOjEyMiwgdGV4dDon6K6i5Y2V5aSE55CGJ31cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6MixcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb246e1xuICAgICAgICAgICAgICAgICAgICBpZDonZmluYW5jZScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6J+e6v+S4i+aUtumTticsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czpmYWxzZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3B0aW9uOntcbiAgICAgICAgICAgICAgICAgICAgaWQ6MjIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOltcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpZDoyMjEsIHRleHQ6J+aUtuihoyd9LFxuICAgICAgICAgICAgICAgICAgICAgICAge2lkOjIyMiwgdGV4dDon6YCB5rSXJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICB7aWQ6MjIzLCB0ZXh0OifkuIrmjIInfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpZDoyMjQsIHRleHQ6J+WPluihoyd9LFxuICAgICAgICAgICAgICAgICAgICAgICAge2lkOjIyNSwgdGV4dDon5Lya5ZGY566h55CGJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICB7aWQ6MjI2LCB0ZXh0OifkuJrliqHnu5/orqEnfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDozLFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjp7XG4gICAgICAgICAgICAgICAgICAgIGlkOidtYW5hZ2UnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OifllYblrrbnrqHnkIYnLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wdGlvbjp7XG4gICAgICAgICAgICAgICAgICAgIGlkOjMyLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczpbXG4gICAgICAgICAgICAgICAgICAgICAgICB7aWQ6MzIxLCB0ZXh0OifllYblk4HnrqHnkIYnfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpZDozMjIsIHRleHQ6J+i0ouWKoeWvuei0pid9LFxuICAgICAgICAgICAgICAgICAgICAgICAge2lkOjMyMywgdGV4dDon57uP6JCl5YiG5p6QJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICB7aWQ6MzI0LCB0ZXh0OiflkZjlt6XnrqHnkIYnfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpZDozMjUsIHRleHQ6J+i/lOeOsOiusOW9lSd9LFxuICAgICAgICAgICAgICAgICAgICAgICAge2lkOjMyNiwgdGV4dDon5raI5oGv6YCa55+lJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICB7aWQ6MzI3LCB0ZXh0OifnlKjmiLfor4Tku7cnfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpZDozMjgsIHRleHQ6J+mXqOW6l+S/oeaBryd9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgTWVudUNvbmZpZygpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9tYWluL21lbnUuanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///32\n");

/***/ })

/******/ });