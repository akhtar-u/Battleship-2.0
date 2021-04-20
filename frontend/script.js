"use strict";
var buttons = /** @class */ (function () {
    function buttons() {
        this.currentShip = "";
        var wrapper = document.getElementById("pships");
        wrapper.addEventListener("click", function (event) {
            var isButton = event.target instanceof HTMLButtonElement;
            if (!isButton) {
                return;
            }
            console.log(event.target.id);
        });
    }
    return buttons;
}());
var button = new buttons();
