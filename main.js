if (!String.prototype.format) {
    String.prototype.format = function() {
        let args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

input_snipet = `
    <div id="option">
        <input type="text" id="option{0}" title="option{0}">
        <input type="text" id="probability{0}" title="probability{0}" class="hidden">
    </div>
`;

let curr = 1;
let toggle = false;

$(document).ready(function () {
    $("#add").click(function () {
        curr += 1;
        $("#options").append(input_snipet.format(curr))
    });
    $("#toggle_custom").click(function () {
        if(!toggle){
            $("[id^=\"probability\"]").show();
            $("#toggle_btn").text("Disable custom probabiltiy");
            toggle = !toggle;
        }else{
            $("[id^=\"probability\"]").hide();
            $("#toggle_btn").text("Enable custom probabiltiy");
            toggle = !toggle;
        }
    });
    $("#spin").click(function () {
        let choices = "";
        if(!toggle){
            $("input[id^=\"option\"]").each(function() {
                choices += "1:"+$(this).val()+",";
            });
            choices = choices.slice(0, -1);
        }else{
            $("input[id^=\"option\"]").each(function(index) {
                let prob = $("input[id^=\"probability\"]");
                choices += $(prob.get(index)).val()+":"+$(this).val()+",";
            });
            choices = choices.slice(0, -1);
        }

        $.get( "https://l8qdlfzei5.execute-api.us-east-1.amazonaws.com/prod/pickRandom", { choices: choices }, function (data) {
            $("#result").text(data.draw);
        });
    })
});