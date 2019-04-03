/**
 * Created by guiqijiang on 12/19/18.
 */
$(function () {
    $("#set_app_id").click(function () {
        $.get("/test/appid?appid=" + $("#app_id").val(), function (e) {
            $("#msg").text(e);
        })
    })
    $("#set_secret").click(function () {
        $.get("/test/secret?secret=" + $("#secret").val(), function (e) {
            $("#msg").text(e);
        })
    })

    $("#make_order").click(function () {
        var url = "/test/order";
        url += "?subject=" + $("#subject").val();
        url += "&detail=" + $("#detail").val();
        url += "&totalFee=" + $("#totalFee").val();
        $.get(url, function (e) {
            $("#ordersn").text(e);
        })
    })

    $("#login").click(function () {
        var url = "/test/login";
        url += "?userName=" + $("#userName").val();
        url += "&password=" + $("#password").val();
        url += "&userType=" + $("#userType").val();
        $.get(url, function (e) {
            $("#msg").text(e);
        })
    })

    $("#submit_order").click(function () {
        var url = "/test/submit";
        url += "?orderSn=" + $("#order_sn").val();
        url += "&tradeChannel=" + $("#tradeChannel").val();
        url += "&form=" + $("#form").val();
        $.get(url, function (e) {
            $("#code").html("");
            var qrcode = new QRCode('code');
            $("#msg").text(e);
            try {
                var j = JSON.parse(e);
                qrcode.makeCode(j["code"]);
            } catch (err) {

            }
        })
    })

    setInterval(function () {
        orderSN = $("#order_sn").val();
        if (orderSN != "") {
            var url = "/test/paystats?orderSn=" + $("#order_sn").val();
            $.get(url, function (e) {
                $("#pay_status").text(e);
            })
        }
    }, 1000)

})