/**
 * 键盘按键英文输入监听
 * @author Edwin Young
 * @desc 依赖Tool.js，需在tool.js之后引入
 */

(function(window) {
    if ('object' !== typeof tool) window.tool = {};
    tool.KeyCode = function() {
        var Input,    //回调函数
            Enter,     //回车键监听
            CapsLock = false,    //大写锁是否打开
            code = [],    //英文键盘编码
            chCode = {
                Space:' ',NumpadDecimal:'.',Comma:',', Period:'.', Slash:'/',Semicolon:';',Quote:'\'',BracketLeft:'[',BracketRight:']',Minus:'-',
                Equal:'=',Backslash:'\\',NumpadDivide:'/',NumpadMultiply:'*',NumpadSubtract:'-',NumpadAdd:'+',Backquote:'`',shift_Backquote:'~',
                shift_Digit1:'!',shift_Digit2:'@',shift_Digit3:'#',shift_Digit4:'$',shift_Digit5:'%',shift_Digit6:'^',shift_Digit7:'&',shift_Digit8:'*',
                shift_Digit9:'(',shift_Digit0:')',shift_Minus:'_',shift_Equal:'+',shift_BracketLeft:'{',shift_BracketRight:'}',shift_Backslash:'|',
                shift_Semicolon:':',shift_Quote:'"',shift_Comma:'<',shift_Period:'>',shift_Slash:'?'
            };           //中文键盘code映射

        //键盘映射ASCII表    最大键盘码为222，大于222的keyCode即为中文输入法
        //code[8] = 'Backspace';code[13] = 'Enter';code[16] = 'Shift';code[17] = 'Control';code[18] = 'Alt';code[27] = 'Esc';code[46] = 'Delete';
        code[32] = ' ';code[33] = '!';
        code[34] = '"';code[35] = '#';
        code[36] = '$';code[37] = '%';
        code[38] = '&';code[39] = '\'';
        code[40] = '(';code[41] = ')';
        code[42] = '*';code[43] = '+';
        code[44] = ',';code[45] = '-';
        code[46] = '.';code[47] = '/';
        code[48] = '0';code[49] = '1';
        code[50] = '2';code[51] = '3';
        code[52] = '4';code[53] = '5';
        code[54] = '6';code[55] = '7';
        code[56] = '8';code[57] = '9';
        code[58] = ':';code[59] = ';';
        code[60] = '<';code[61] = '=';
        code[62] = '>';code[63] = '?';
        code[64] = '@';code[91] = '[';
        code[92] = '\\';code[93] = ']';
        code[94] = '^';code[95] = '_';
        code[96] = '`';code[123] = '{';
        code[124] = '|';code[125] = '}';code[126] = '~';
        //字母映射
        code[65] = 'A';code[97] = 'a';
        code[66] = 'B';code[98] = 'b';
        code[67] = 'C';code[99] = 'c';
        code[68] = 'D';code[100] = 'd';
        code[69] = 'E';code[101] = 'e';
        code[70] = 'F';code[102] = 'f';
        code[71] = 'G';code[103] = 'g';
        code[72] = 'H';code[104] = 'h';
        code[73] = 'I';code[105] = 'i';
        code[74] = 'J';code[106] = 'j';
        code[75] = 'K';code[107] = 'k';
        code[76] = 'L';code[108] = 'l';
        code[77] = 'M';code[109] = 'm';
        code[78] = 'N';code[110] = 'n';
        code[79] = 'O';code[111] = 'o';
        code[80] = 'P';code[112] = 'p';
        code[81] = 'Q';code[113] = 'q';
        code[82] = 'R';code[114] = 'r';
        code[83] = 'S';code[115] = 's';
        code[84] = 'T';code[116] = 't';
        code[85] = 'U';code[117] = 'u';
        code[86] = 'V';code[118] = 'v';
        code[87] = 'W';code[119] = 'w';
        code[88] = 'X';code[120] = 'x';
        code[89] = 'Y';code[121] = 'y';
        code[90] = 'Z';code[122] = 'z';
        /**
         * 键盘输入法强制英文监听 tool.KeyCode.listen
         * @param {*object} node 元素节点对象
         * @param {*function} onInput 输入回调函数
         * @param {*function} onInputEnter 输入回车回调函数
         */
        this.listen = function(node, onInput, onInputEnter) {
            if (node instanceof Node) {
                node.onkeydown = this.onkeydown;
                node.onkeypress = this.onkeypress;
                node.onkeyup = this.onkeyup;
                if ('function' === typeof onInput) Input = onInput;
                if ('function' === typeof onInputEnter) Enter = onInputEnter;
            }
        }
        /**
         * 键盘回车键监听
         * @param {object} node 元素节点对象
         * @param {function} onInputEnter 输入回调函数
         */
        this.listenEnter = function (node, onInputEnter) {
            if (
                'object' === typeof node
                && 
                node instanceof Node
                &&
                'function' === typeof onInputEnter
            ) {
                node.onkeydown = function(e) {'Enter' === e.code && onInputEnter();}
            }
        }
        this.onkeydown = function(e) {
            console.log(Input, Enter);
            console.log('onkeydown', e);
            if ('Backspace' === e.code || 'Delete' === e.code) return Input && Input('');
            var keyCode = e.keyCode||e.which;    //按键的keyCode
            if (e instanceof KeyboardEvent && keyCode > 222) {    //中文输入法判断
                var value = this.value,
                    mapCode = e.shiftKey && 'string' === typeof chCode['shift_' + e.code] ? chCode['shift_' + e.code] : chCode[e.code];    //获取中文键盘映射的值
                if ('string' === typeof mapCode) {
                    value += mapCode;
                } else if ('Enter' === e.code) {
                    return null !== Enter && Enter();
                } else {
                    if (
                        -1 === e.code.indexOf('Key')
                        &&
                        -1 === e.code.indexOf('Digit')
                        &&
                        -1 === e.code.indexOf('Numpad')
                    ) return;
                    var tempVal = e.code.replace('Key','').replace('Digit', '').replace('Numpad', '');
                    value += (!e.shiftKey && isNaN(tempVal)) ? tempVal.toLowerCase() : tempVal;
                }
                Input && Input(value.trim());
            }
        }
        this.onkeypress = function(e) {
            console.log('onkeypress', e);
            var keyCode = e.keyCode||e.which,    //按键的keyCode 
                value = code[keyCode];         //对应键盘值
            if (13 == keyCode) return Enter && Enter();
            if (e instanceof KeyboardEvent && 'string' === typeof value) {    //英文输入法判断
                if (
                    ((keyCode > 64 && keyCode < 91 ) && !e.shiftKey)    //大写锁打开，且没有按住shift键 
                    || 
                    ((keyCode > 96 && keyCode < 123 ) && e.shiftKey)    //大写锁打开，且按住shift键 
                ){
                    CapsLock = true;
                }
                Input && Input( (this.value + value).trim() );
            }
        }
        this.onkeyup = function(e) {
            console.log('onkeyup', e);
            if (e instanceof KeyboardEvent && 20 == (e.keyCode||e.which)) CapsLock = !CapsLock;
        }
    }
})(window);
