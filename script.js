$(document).ready(pageStart);

function pageStart() {
    $('div.start, div.play, #reset').css('display', '');

    $('#numberOfCards').val(5);
    $('#highestNumber').val(5);

    $("#colours option").prop("selected", false);
    $.each('f00,ff0,0f0,00f,fff'.split(","), function (i, e) {
        $("#colours option[value='" + e + "']").prop("selected", true);
    });

    ['numberOfCards', 'highestNumber'].forEach(function (i) {
        if (localStorage.getItem(i) !== null) {
            $('#' + i).val(localStorage.getItem(i));
        }
    });

    if (localStorage.getItem('colours') !== null) {
        $("#colours option").prop("selected", false);

        $.each(localStorage.getItem('colours').split(","), function (i, e) {
            $("#colours option[value='" + e + "']").prop("selected", true);
        });
    }

    cardsFunc();
    $('#numberOfCards').change(cardsFunc);

    $('input[name=cardIs]').change(function () {
        if ($('input[name=cardIs]:checked').val() == 'replaced') {
            $('#isOnly, #not').prop("disabled", true);
            $('#isOnly').prop("checked", true);
            $('#not').prop("checked", false);
            $('label:has(#cardNumber), label:has(#cardColour)').css('display', 'none');
        } else {
            $('#isOnly, #not').prop("disabled", false);

            if ($('input[name=cardIs]:checked').val() == 'number') {
                $('label:has(#cardNumber)').css('display', 'initial');
                $('label:has(#cardColour)').css('display', 'none');
            } else {
                $('label:has(#cardNumber)').css('display', 'none');
                $('label:has(#cardColour)').css('display', 'initial');
            }
        }
    });

    readyLowerForm();
    $('#colours, #highestNumber').change(readyLowerForm);

    if (localStorage.getItem('cards') !== null) {
        window.headerPlay = true;
        $('div.start').css('display', 'none');
        $('div.play, #reset').css('display', 'block');

        colours = {};
        numbers = {};

        $("#colours option:selected").each(function () {
            colours[$(this).text()] = true;
        });

        for (var i = 1; i <= $('#highestNumber').val(); i++) {
            numbers[i] = true;
        }

        cards = JSON.parse(localStorage.getItem('cards'));
        $('#numberOfCards').val(cards.length);
        console.log($('#numberOfCards').val(), cards);
        cardsFunc();
        repaint();

        // close form
        $('th, td').removeClass('selected');
        thisCardIs();
    } else {
        delete cards;
    }

    $('#ok, #reset, #addCardToHand, #removeCardFromHand').off('click');

    $('#ok').click(ok);
    $('#reset').click(reset);
    $('#removeCardFromHand').click(removeCardFromHand);

    if (typeof cards != 'undefined' && cards.length >= 10) {
        $('#addCardToHand').off('click');
        $('#addCardToHand').prop('disabled', true);
    } else {
        $('#addCardToHand').click(addCardToHand);
        $('#addCardToHand').prop('disabled', false);
    }
}

function removeCardFromHand() {
    if ($('body').hasClass('one')) {
        var message = "You will lose colours and numbers for this card. Remove card?";
    } else {
        var message = "You will lose colours and numbers for these cards. Remove cards?";
    }

    if (confirm(message)) {
        var list = [];

        $("th.selected").each(function () {
            list.push($(this).data('cardNo'));
        });

        $("th.selected, td.selected").removeClass('selected');

        list.reverse().forEach(function (a) {
            cards.splice(a, 1);
        });

        $('#numberOfCards').val(cards.length);
        localStorage.setItem('cards', JSON.stringify(cards));
        console.log($('#numberOfCards').val(), cards);

        cardsFunc();
        repaint();
        thisCardIs();
    }
}

function addCardToHand() {
    colours = {};
    numbers = {};

    $("#colours option:selected").each(function () {
        colours[$(this).text()] = true;
    });

    for (var i = 1; i <= $('#highestNumber').val(); i++) {
        numbers[i] = true;
    }

    cards.push({ 'colours': copy(colours), 'numbers': copy(numbers) });

    $('#numberOfCards').val(cards.length);
    console.log($('#numberOfCards').val(), cards);

    localStorage.setItem('cards', JSON.stringify(cards));
    localStorage.setItem('numberOfCards', $('#numberOfCards').val());
    localStorage.setItem('colours', $('#colours').val());
    localStorage.setItem('highestNumber', $('#highestNumber').val());

    cardsFunc();

    if (cards.length >= 10) {
        $('#addCardToHand').off('click');
        $('#addCardToHand').prop('disabled', true);
    }
}

function reset() {
    if (confirm("You will lose colours and numbers for all cards. Maybe take a screenshot first. Reset?")) {
        localStorage.removeItem('cards');
        localStorage.removeItem('colours');
        localStorage.removeItem('highestNumber');
        localStorage.removeItem('numberOfCards');
        $('#numberOfCards, #colours, #highestNumber').prop("disabled", false);
        $('tr').empty();
        window.headerPlay = false;
        pageStart();
    }
}

function cardsFunc() {
    while ($('#numberOfCards').val() != $('th').length) {
        if ($('#numberOfCards').val() < $('th').length) {
            $('th:last-child, td:last-child').remove();
        } else {
            cardNo = $('th').length;
            $("tr:nth-child(1)").append("<th data-card-no='" + cardNo + "'><img draggable='false' alt='image of card back' class='card' src='image/card.svg' /></th>");
            $("tr:nth-child(2), tr:nth-child(3)").append("<td data-card-no='" + cardNo + "'><i>unknown</i></td>");
        }
    }
    $('th, td').off('click');
    $('th, td').click(function () {
        cardNo = $(this).data('cardNo');
        console.log('cardNo:', cardNo);
        cardNo = cardNo + 1;  // css is 1 based
        $('th:nth-child(' + cardNo + '), td:nth-child(' + cardNo + ')').toggleClass('selected');

        thisCardIs();
    });
}

function copy(i) {
    return JSON.parse(JSON.stringify(i));
}

function thisCardIs() {
    if ($('th.selected').length) { // > 0
        if ($('th.selected').length > 1) {
            $('body').addClass('two').removeClass(['zero', 'one']);
        } else {
            $('body').addClass('one').removeClass(['zero', 'two']);
        }

        $('#removeCardFromHand').prop('disabled', false);
    } else {
        $('body').addClass('zero').removeClass(['one', 'two']);
        $('#removeCardFromHand').prop('disabled', true);

        // Reset form
        $('input[type=radio], #not').prop("checked", false);
        $('#isOnly, #isNumber').prop("checked", true);
        $('#isOnly, #not').prop("disabled", false);
        $('#cardNumber').val(1);

        if ($('input[name=cardIs]:checked').val() == 'number') {
            $('label:has(#cardNumber)').css('display', 'initial');
            $('label:has(#cardColour)').css('display', 'none');
        } else {
            $('label:has(#cardNumber)').css('display', 'none');
            $('label:has(#cardColour)').css('display', 'initial');
        }
    }
}

function initCards() {
    cards = [];
    colours = {};
    numbers = {};

    $("#colours option:selected").each(function () {
        colours[$(this).text()] = true;
    });

    for (var i = 1; i <= $('#highestNumber').val(); i++) {
        numbers[i] = true;
    }

    for (var i = 0; i < $('#numberOfCards').val(); i++) {
        cards.push({ 'colours': copy(colours), 'numbers': copy(numbers) });
    }
}

function repaint() {
    for (cardNumber in cards) {
        var isUnknown = true;
        var isNone = true;

        for (var key in cards[cardNumber].colours) {
            if (cards[cardNumber].colours[key]) {
                isNone = false;
            } else {
                isUnknown = false;
            }
        }

        if (isUnknown) {
            $('tr:nth-of-type(2) td[data-card-no=' + cardNumber + ']').html('<i>unknown</i>');
        } else if (isNone) {
            $('tr:nth-of-type(2) td[data-card-no=' + cardNumber + ']').html('<i>none</i>');
        } else {
            var td = $('tr:nth-of-type(2) td[data-card-no=' + cardNumber + ']');
            td.empty();
            td.append('<span></span>');
            td.find('span').first().css('border', '1px solid #000');
            for (colour in colours) {
                if (cards[cardNumber].colours[colour]) {
                    td.find('span').first().append('<span class="colour"></span>');
                    if (colour.charCodeAt(0) > 200) {
                        td.find('span').first().find('span').last().text(colour.charAt(0));
                        td.find('span').first().find('span').last().css('background-color', '#fff');
                    } else {
                        td.find('span').first().find('span').last().html('&nbsp;');
                        td.find('span').first().find('span').last().css(
                            'background-color',
                            '#' + $("option").filter(function () {
                                return $(this).text() === colour;
                            }).first().val(),
                        );
                    }
                }
            }
        }

        var isUnknown = true;
        var isNone = true;

        for (var key in cards[cardNumber].numbers) {
            if (cards[cardNumber].numbers[key]) {
                isNone = false;
            } else {
                isUnknown = false;
            }
        }

        if (isUnknown) {
            $('tr:nth-of-type(3) td[data-card-no=' + cardNumber + ']').html('<i>unknown</i>');
        } else if (isNone) {
            $('tr:nth-of-type(3) td[data-card-no=' + cardNumber + ']').html('<i>none</i>');
        } else {
            var td = $('tr:nth-of-type(3) td[data-card-no=' + cardNumber + ']');
            td.empty();
            for (number in numbers) {
                if (cards[cardNumber].numbers[number]) {
                    td.append(' ' + number);
                }
            }
        }
    }
}

function ok() {
    // First-time set lock top form
    if (typeof headerPlay == 'undefined' || window.headerPlay == false) {
        window.headerPlay = true;
        initCards();
        $('div.start').css('display', 'none');
        $('div.play, #reset').css('display', 'block');
    }

    localStorage.setItem('numberOfCards', $('#numberOfCards').val());
    localStorage.setItem('colours', $('#colours').val());
    localStorage.setItem('highestNumber', $('#highestNumber').val());

    if ($('input[name=cardIs]:checked').val() == 'colour') {
        if ($('#isOnly').is(':checked')) {
            for (var i = 0; i < $('#numberOfCards').val(); i++) {
                cards[i].colours[$('#cardColour option:selected').text()] = $('#not').is(':checked');
            }
        }

        $("th.selected").each(function () {
            a = $(this).data('cardNo');

            if (!$('#not').is(':checked')) {
                for (key in colours) {
                    cards[a].colours[key] = false;
                }
            }

            cards[a].colours[$('#cardColour option:selected').text()] = !$('#not').is(':checked');
        });
    } else if ($('input[name=cardIs]:checked').val() == 'number') {
        if ($('#isOnly').is(':checked')) {
            for (var i = 0; i < $('#numberOfCards').val(); i++) {
                cards[i].numbers[$('#cardNumber').val()] = $('#not').is(':checked');
            }
        }

        $("th.selected").each(function () {
            a = $(this).data('cardNo');

            if (!$('#not').is(':checked')) {
                for (var i = 1; i <= $('#highestNumber').val(); i++) {
                    cards[a].numbers[i] = $('#not').is(':checked');
                }
            }

            cards[a].numbers[$('#cardNumber').val()] = !$('#not').is(':checked');
        });
    } else if ($('input[name=cardIs]:checked').val() == 'replaced') {
        $("th.selected").each(function () {
            a = $(this).data('cardNo');
            cards[a].colours = copy(colours);
            cards[a].numbers = copy(numbers);
        });
    }

    localStorage.setItem('cards', JSON.stringify(cards));
    console.log($('#numberOfCards').val(), cards);
    repaint();

    // close form
    $('th, td').removeClass('selected');
    thisCardIs();
    $('div.start').css('display', 'none');
    $('div.play').css('display', 'block');
}

function readyLowerForm() {
    $('#cardColour').empty();
    $('#colours option:selected').clone().appendTo('#cardColour');
    $('#cardColour option').prop("selected", false);

    $('#cardNumber').empty();
    for (let i = 0; i < $('#highestNumber').val(); i++) {
        $('#cardNumber').append('<option>' + (i + 1) + '</option>');
    }
}
