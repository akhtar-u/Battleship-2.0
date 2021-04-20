"use strict";
var test = /** @class */ (function () {
    function test() {
        var _this = this;
        var testbtn = document.getElementById("pcarrier");
        testbtn.addEventListener("click", function (ev) { return _this.printName(); });
    }
    test.prototype.printName = function () {
    };
    return test;
}());
new test();
