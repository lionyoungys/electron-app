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
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar MenuConfig = function MenuConfig() {\n    _classCallCheck(this, MenuConfig);\n\n    return [{\n        id: 1,\n        selection: {\n            id: 'order',\n            text: '线上订单'\n        },\n        options: [{ id: 11, text: '订单查询' }, { id: 12, text: '订单处理' }]\n    }, {\n        id: 2,\n        selection: {\n            id: 'finance',\n            text: '线下收银'\n        },\n        options: [{ id: 21, text: '收衣' }, { id: 22, text: '送洗' }, { id: 23, text: '上挂' }, { id: 24, text: '取衣' }, { id: 25, text: '会员管理' }, { id: 26, text: '业务统计' }]\n    }, {\n        id: 3,\n        selection: {\n            id: 'manage',\n            text: '商家管理'\n        },\n        options: [{ id: 31, text: '商品管理' }, { id: 32, text: '财务对账' }, { id: 33, text: '经营分析' }, { id: 34, text: '员工管理' }, { id: 35, text: '返现记录' }, { id: 36, text: '消息通知' }, { id: 37, text: '用户评价' }, { id: 38, text: '门店信息' }]\n    }];\n};\n\nexports.default = new MenuConfig();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tZW51LmpzPzQwOGEiXSwibmFtZXMiOlsiTWVudUNvbmZpZyIsImlkIiwic2VsZWN0aW9uIiwidGV4dCIsIm9wdGlvbnMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztJQUNNQSxVLEdBQ0Ysc0JBQWU7QUFBQTs7QUFDWCxXQUFPLENBQ0g7QUFDSUMsWUFBRyxDQURQO0FBRUlDLG1CQUFVO0FBQ05ELGdCQUFHLE9BREc7QUFFTkUsa0JBQUs7QUFGQyxTQUZkO0FBTUlDLGlCQUFRLENBQ0osRUFBQ0gsSUFBRyxFQUFKLEVBQVFFLE1BQUssTUFBYixFQURJLEVBRUosRUFBQ0YsSUFBRyxFQUFKLEVBQVFFLE1BQUssTUFBYixFQUZJO0FBTlosS0FERyxFQVlIO0FBQ0lGLFlBQUcsQ0FEUDtBQUVJQyxtQkFBVTtBQUNORCxnQkFBRyxTQURHO0FBRU5FLGtCQUFLO0FBRkMsU0FGZDtBQU1JQyxpQkFBUSxDQUNKLEVBQUNILElBQUcsRUFBSixFQUFRRSxNQUFLLElBQWIsRUFESSxFQUVKLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLElBQWIsRUFGSSxFQUdKLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLElBQWIsRUFISSxFQUlKLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLElBQWIsRUFKSSxFQUtKLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFMSSxFQU1KLEVBQUNGLElBQUcsRUFBSixFQUFRRSxNQUFLLE1BQWIsRUFOSTtBQU5aLEtBWkcsRUEyQkg7QUFDSUYsWUFBRyxDQURQO0FBRUlDLG1CQUFVO0FBQ05ELGdCQUFHLFFBREc7QUFFTkUsa0JBQUs7QUFGQyxTQUZkO0FBTUlDLGlCQUFRLENBQ0osRUFBQ0gsSUFBRyxFQUFKLEVBQVFFLE1BQUssTUFBYixFQURJLEVBRUosRUFBQ0YsSUFBRyxFQUFKLEVBQVFFLE1BQUssTUFBYixFQUZJLEVBR0osRUFBQ0YsSUFBRyxFQUFKLEVBQVFFLE1BQUssTUFBYixFQUhJLEVBSUosRUFBQ0YsSUFBRyxFQUFKLEVBQVFFLE1BQUssTUFBYixFQUpJLEVBS0osRUFBQ0YsSUFBRyxFQUFKLEVBQVFFLE1BQUssTUFBYixFQUxJLEVBTUosRUFBQ0YsSUFBRyxFQUFKLEVBQVFFLE1BQUssTUFBYixFQU5JLEVBT0osRUFBQ0YsSUFBRyxFQUFKLEVBQVFFLE1BQUssTUFBYixFQVBJLEVBUUosRUFBQ0YsSUFBRyxFQUFKLEVBQVFFLE1BQUssTUFBYixFQVJJO0FBTlosS0EzQkcsQ0FBUDtBQTZDSCxDOztrQkFHVSxJQUFJSCxVQUFKLEUiLCJmaWxlIjoiMzIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5jbGFzcyBNZW51Q29uZmlnIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6MSxcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb246e1xuICAgICAgICAgICAgICAgICAgICBpZDonb3JkZXInLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0Oifnur/kuIrorqLljZUnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOltcbiAgICAgICAgICAgICAgICAgICAge2lkOjExLCB0ZXh0OiforqLljZXmn6Xor6InfSxcbiAgICAgICAgICAgICAgICAgICAge2lkOjEyLCB0ZXh0OiforqLljZXlpITnkIYnfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6MixcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb246e1xuICAgICAgICAgICAgICAgICAgICBpZDonZmluYW5jZScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6J+e6v+S4i+aUtumTtidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6W1xuICAgICAgICAgICAgICAgICAgICB7aWQ6MjEsIHRleHQ6J+aUtuihoyd9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MjIsIHRleHQ6J+mAgea0lyd9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MjMsIHRleHQ6J+S4iuaMgid9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MjQsIHRleHQ6J+WPluihoyd9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MjUsIHRleHQ6J+S8muWRmOeuoeeQhid9LFxuICAgICAgICAgICAgICAgICAgICB7aWQ6MjYsIHRleHQ6J+S4muWKoee7n+iuoSd9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDozLFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjp7XG4gICAgICAgICAgICAgICAgICAgIGlkOidtYW5hZ2UnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OifllYblrrbnrqHnkIYnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOltcbiAgICAgICAgICAgICAgICAgICAge2lkOjMxLCB0ZXh0OifllYblk4HnrqHnkIYnfSxcbiAgICAgICAgICAgICAgICAgICAge2lkOjMyLCB0ZXh0OifotKLliqHlr7notKYnfSxcbiAgICAgICAgICAgICAgICAgICAge2lkOjMzLCB0ZXh0Oifnu4/okKXliIbmnpAnfSxcbiAgICAgICAgICAgICAgICAgICAge2lkOjM0LCB0ZXh0OiflkZjlt6XnrqHnkIYnfSxcbiAgICAgICAgICAgICAgICAgICAge2lkOjM1LCB0ZXh0Oifov5TnjrDorrDlvZUnfSxcbiAgICAgICAgICAgICAgICAgICAge2lkOjM2LCB0ZXh0Oifmtojmga/pgJrnn6UnfSxcbiAgICAgICAgICAgICAgICAgICAge2lkOjM3LCB0ZXh0OifnlKjmiLfor4Tku7cnfSxcbiAgICAgICAgICAgICAgICAgICAge2lkOjM4LCB0ZXh0Oifpl6jlupfkv6Hmga8nfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBNZW51Q29uZmlnKCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21haW4vbWVudS5qcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///32\n");

/***/ })

/******/ });