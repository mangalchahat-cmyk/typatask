"use strict";
function Greeting(props) {
    return "Hello " + props.name;
}
document.body.textContent = Greeting({ name: "Bishwas" });
