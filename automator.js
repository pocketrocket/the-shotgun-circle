// inner circle bot by pocketrocket

var msgTotal = 0;
var name;
var message;
var minAge = 19;
var maxAge = 32;

function flirt() {
    var undecided = $('.wall-inside .wall-likes').not(':hidden').parent('.wall-inside');
    if (undecided && undecided.length) {
        var nextBigLove = undecided.eq(0);
        var info = nextBigLove.find('.wall-name').text().split(' ')
        name = info[0];

        var age = parseInt(info[info.length - 1].replace('(', '').replace(')', ''));

        if (age > maxAge || age < minAge) {
            nextBigLove.find('.like.wall-like').click();
            nextBigLove.find('.wink').click();
            return;
        }

        message = 'Hey ' + name + ', this is an AUTOMATED SPAM. Cheers';

        if (name.length > 0 && message.length > 0) {

            nextBigLove.find('.like.wall-like').click();
            nextBigLove.find('.wink').click();
            nextBigLove.find('.conversation').click();
            setTimeout(function() {
                $('#text').val(message);
            }, 600);
        }
    } else {
        $('.wall-more').click();
    }
}

function submitFlirt() {
    if (!$('#text').val()) {
        return;
    }

    if ($('.conversation_body .message_body').length == 0 && $('#text').val().length > 0) {
        $('#submit').click();
        msgTotal = msgTotal + 1 || 1;
    }
    setTimeout(function() {
        $('a.back').click();
    }, 200);
}

function findMyNextGirlfriend() {
    setTimeout(function() {
        flirt()
    }, 400);
    setTimeout(function() {
        submitFlirt()
    }, 2500);
    // if it got stuck
    setTimeout(function() {
        $('#text').val(message);
    }, 6000);
}

setInterval(function() {
    findMyNextGirlfriend()
}, 3750);
