(function($){
    $(window).scroll(function(){
        var amatop = $('.amArea').offset().top;
        var sTop = document.body.scrollTop;
        if(sTop > 200){
            $('.image-wrapper').animate({opacity: 1}).addClass('bounceInLeft')
        }else{
            $('.image-wrapper').animate({'opacity': 0});
        }
    });
})(jQuery);
//--for admin login page
(function($){
    $('.alert').slideDown();
    var hideAlert = function(){
        $('.alert-danger').slideUp();
    };
    var hideSuc = function(){
        $('.alert-success').slideUp();
    }
    setTimeout(hideAlert, 3000);
    setTimeout(hideSuc, 3000);
    $('.login-admin').click(function() {
        var userid = $('.userid').val();
        var pwd = $('.pwd').val();
        var callback = function(data) {
            alert(data.success)
        };
        jsonServ.send({
            url: 'admin/manage',
            para: {
                accountname: userid,
                password: pwd
            },
            type: true,
            callback: callback
        });
        return false;
    });
    //----for frontend register page
    $('#login1').click(function() {
        location.href = 'login';
    });
    $('#register1').click(function() {
        var username = $('#username').val();
        var password = $('#password').val();
        var password1 = $('#password1').val();
        var email = $('#useremail').val();
        var regcode = $('#regcode').val();
        if (password !== password1) {
            $('#password').css('border', '1px solid red');
            $('#password1').css('border', '1px solid red');
        } else if (password === password1 && username && password && password1) {
            var data = {
                'uname': username,
                'upwd': password,
                'email': email,
                'regcode': regcode
            };
            $.ajax({
                url: '/register',
                type: 'post',
                data: data,
                success: function(data, status) {
                    if (status == 'success') {
                        location.href = 'login';
                    }
                },
                error: function(data, err) {
                    location.href = 'register';
                }
            });
        }
    });
    //---for frontend login page
    $("#register0").click(function(){
        location.href = 'register';
    });
    $("#login0").click(function(){
        var username = $("#username").val();
        var password = $("#password").val();
        var code = $("#code").val();
        var data = {"uname":username,"upwd":password, "code": code};
        $.ajax({
            url:'/login',
            type:'post',
            data: data,
            dateType: 'json',
            success: function(data,status){
                if(status == 'success'){
                    location.href = '/';
                }
            },
            error: function(data,status){
                console.log(data)
                if(status == 'error'){
                    location.href = 'login';
                }
            }
        });
    });
    //--for verification elements
    var getCcap = function() {
        $.ajax({
            type: "GET",
            url: "/verify",
            headers: {
            Accept: "image/png",
                "Content-Type": "image/png"
        },
        }).done(function(data) {
            console.log(data);
            $('.verify').attr('src', '/verify');
            //$('.verify').html(data);
        }).fail(function() {
            console.error('Fail to get captcha from server!')
        });
    };
    $('.verify').on('click', function() {
        getCcap();
    });
    //--for home page ajax
    $('.save-btn').click(function(){
        var e_val = $('#piFrom').formSerialize();
    });
})(jQuery);

