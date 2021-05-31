function cards(){
	while($('#numberOfCards').val() != $('th').length){
		if($('#numberOfCards').val() < $('th').length){
			$('th:last-child, td:last-child').remove();
		}else{
			cardNo = $('th').length;
			$("tr:nth-child(1)").append("<th data-card-no='" + cardNo + "'><img class='card' src='res/card.svg' /></th>");
			$("tr:nth-child(2), tr:nth-child(3)").append("<td data-card-no='" + cardNo + "'><i>unknown</i></td>");
		}
	}
	$('th, td').off('click');
	$('th, td').click(function(){
		cardNo = $(this).data('cardNo');
		console.log('cardNo', cardNo);
		cardNo = cardNo + 1;  // css is 1 based
		$('th:nth-child('+cardNo+'), td:nth-child('+cardNo+')').toggleClass('selected');

		thisCardIs();
	});
}

function copy(i){
	return JSON.parse(JSON.stringify(i));
}

function thisCardIs(){
	if($('th.selected').length){
		$('#thisCardIs h2 span:nth-of-type(1), #thisCardIs p:first-of-type, #isReplaced, label[for=isReplaced]').css('display', 'initial');
		$('#thisCardIs h2 span:nth-of-type(3), #thisCardIs h2 span:nth-of-type(2)').css('display', 'none');

		if($('th.selected').length > 1){
			$('#thisCardIs h2 span:nth-of-type(2)').css('display', 'initial');
			$('#thisCardIs').addClass('plural');

			if($('input[name=cardIs]:checked').val() == 'replaced'){
				$('input[type=radio]').prop("checked", false);
				$('#isNumber').prop("checked", true);
				$('#isOnly').prop("disabled", false);
			}
		}else{
			$('#thisCardIs').removeClass('plural');
		}
	}else{
		$('#thisCardIs h2 span:nth-of-type(1), #thisCardIs h2 span:nth-of-type(2), #thisCardIs p:first-of-type, #isReplaced, label[for=isReplaced]').css('display', 'none');
		$('#thisCardIs h2 span:nth-of-type(3)').css('display', 'initial');

		// Reset form
		$('input[type=radio]').prop("checked", false);
		$('#isNumber').prop("checked", true);
		$('#isOnly').prop("checked", true);
		$('#isOnly').prop("disabled", false);
		$('#cardNumber').val(1);
		$('label[for=cardNumber], #cardNumber').css('display', 'initial');
		$('label[for=cardColour], #cardColour').css('display', 'none');
	}
}

function initCards(){
	cards = [];
	colours = {};
	numbers = {};

	$("#colours option:selected").each(function(){
    	colours[$(this).text()] = true;
	});

	for(var i=1; i<=$('#highestNumber').val(); i++){
		numbers[i] = true;
	}

	for(var i=0; i<$('#numberOfCards').val(); i++){
		cards.push({'colours': copy(colours), 'numbers': copy(numbers)});
	}
}

function repaint(){
	for(cardNumber in cards){
		if(JSON.stringify(cards[cardNumber].colours) == JSON.stringify(colours)){
			$('tr:nth-of-type(2) td[data-card-no='+cardNumber+']').html('<i>unknown</i>');
		}else{
			var td = $('tr:nth-of-type(2) td[data-card-no='+cardNumber+']');
			td.empty();
			td.append('<span></span>');
			td.find('span').first().css('border', '1px solid #000');
			for(colour in colours){
				if(cards[cardNumber].colours[colour]){
					td.find('span').first().append('<span></span>');
					if(colour.charAt(0) == ' '){
						td.find('span').first().find('span').last().html('&nbsp;');
					}else{
						td.find('span').first().find('span').last().text(colour.charAt(0));
					}
					//td.find('span').first().find('span').last().addClass('noinvert');
					td.find('span').first().find('span').last().addClass('colour');
					td.find('span').first().find('span').last().css({
						'background-color': '#'+$("option").filter(function(){return $(this).text() === colour;}).first().val(),
					});
				}
			}
		}
		if(JSON.stringify(cards[cardNumber].numbers) == JSON.stringify(numbers)){
			$('tr:nth-of-type(3) td[data-card-no='+cardNumber+']').html('<i>unknown</i>');
		}else{
			var td = $('tr:nth-of-type(3) td[data-card-no='+cardNumber+']');
			td.empty();
			for(number in numbers){
				if(cards[cardNumber].numbers[number]){
					td.append(' '+number);
				}
			}
		}
	}
}

function ok(){
	// First-time set lock top form
	if(!$('#numberOfCards, #colours, #highestNumber').prop("disabled")){
		$('#numberOfCards, #colours, #highestNumber').prop("disabled", true);
		initCards();
	}

	if($('input[name=cardIs]:checked').val() == 'colour'){
		if($('#isOnly').is(':checked')){
			for(var i=0; i<$('#numberOfCards').val(); i++){
				cards[i].colours[$('#cardColour option:selected').text()] = false;
			}
		}

		$("th.selected").each(function(){
			a = $(this).data('cardNo');

			for(key in colours){
				cards[a].colours[key] = false;
			}

			cards[a].colours[$('#cardColour option:selected').text()] = true;
		});
	}else if($('input[name=cardIs]:checked').val() == 'number'){
		if($('#isOnly').is(':checked')){
			for(var i=0; i<$('#numberOfCards').val(); i++){
				cards[i].numbers[$('#cardNumber').val()] = false;
			}
		}

		$("th.selected").each(function(){
			a = $(this).data('cardNo');

			for(var i=1; i<=$('#highestNumber').val(); i++){
				cards[a].numbers[i] = false;
			}

			cards[a].numbers[$('#cardNumber').val()] = true;
		});
	}else if($('input[name=cardIs]:checked').val() == 'replaced'){
		$("th.selected").each(function(){
			a = $(this).data('cardNo');
			cards[a].colours = copy(colours);
			cards[a].numbers = copy(numbers);
		});
	}

	console.log(cards);
	repaint();

	// close form
	$('th, td').removeClass('selected');
	thisCardIs();
}

function readyLowerForm(){
	$('#cardNumber').attr("max", $('#highestNumber').val());
	$('#cardColour').empty();
	$('#colours option:selected').clone().appendTo('#cardColour');
	$('#cardColour option').prop("selected", false);
	if($('#cardNumber').val() > $('#highestNumber').val()){
		$('#cardNumber').val($('#highestNumber').val());
	}
}

$(document).ready(function(){
	cards();
	$('#numberOfCards').change(cards);

	$('input[name=cardIs]').change(function(){
		if($('input[name=cardIs]:checked').val() == 'replaced'){
			$('#isOnly').prop("checked", true);
			$('#isOnly').prop("disabled", true);
			$('label[for=cardNumber], #cardNumber, label[for=cardColour], #cardColour').css('display', 'none');
		}else{
			$('#isOnly').prop("disabled", false);

			if($('input[name=cardIs]:checked').val() == 'number'){
				$('label[for=cardNumber], #cardNumber').css('display', 'initial');
				$('label[for=cardColour], #cardColour').css('display', 'none');
			}else{
				$('label[for=cardNumber], #cardNumber').css('display', 'none');
				$('label[for=cardColour], #cardColour').css('display', 'initial');
			}
		}
	});

	readyLowerForm();
	$('#colours, #highestNumber').change(readyLowerForm);

	$('#ok').click(ok);
});
