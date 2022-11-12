@extends('layouts.typical', [
    'lastChangedDate' => '2021-10-18',
    'allowOnlyContent' => true,
    'githubRepo' => 'jkoop/fireworks',
])
@section('title', 'fireworks')
@section('description', 'hanabi card keeper and basic logic handler')

@section('content')

<link rel="stylesheet" href="/style/fireworks/main.css" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script src="/script/fireworks/main.js"></script>

<div class="start">
    <label>
        Number of cards:
        <input id="numberOfCards" type="number" value="5" min="1" max="10" step="1" />
    </label>

    <label>
        Colours:
        <select id="colours" id="colours" multiple>
            <option value="f00" selected>Red</option>
            <option value="f80">Orange</option>
            <option value="ff0" selected>Yellow</option>
            <option value="0f0" selected>Green</option>
            <option value="0ff">Cyan</option>
            <option value="00f" selected>Blue</option>
            <option value="f0f">Magenta</option>
            <option value="fff" selected>White</option>
            <option value="aaa">Lt Grey</option>
            <option value="666">Dk Grey</option>
            <option value="000">Black</option>
            <option value="spade">&#x2660; Spade</option>
            <option value="heart">&#x2665; Heart</option>
            <option value="club">&#x2663; Club</option>
            <option value="diamond">&#x2666; Diamond</option>
        </select>
    </label>

    <label>
        Highest number:
        <input id="highestNumber" type="number" value="5" min="1" max="10" step="1" />
    </label>
</div>

<div class="play">
    <button id="addCardToHand">Add card</button>
    <button id="removeCardFromHand" disabled>
        <span>Remove card</span>
        <span>Remove cards</span>
    </button>
</div>

<hr />

<table>
    <tr></tr>
    <tr></tr>
    <tr></tr>
</table>

<form onsubmit="return false" id="thisCardIs">
    <h2>
        <span>None of my cards are:</span>
        <span>This card is:</span>
        <span>These cards are:</span>
    </h2>

    <p>
        <label class="only">
            <input type="checkbox" id="isOnly" value="only" checked />
            <span>The only card that is</span>
            <span>The only cards that are</span>
            <br>
        </label>
        <label class="not">
            <input type="checkbox" id="not" value="not" />
            Not
        </label>
    </p>
    <p>
        <label class="colour">
            <input type="radio" id="isColour" name="cardIs" value="colour" />
            Colour
        </label><br>
        <label class="number">
            <input type="radio" id="isNumber" name="cardIs" value="number" checked />
            Number
        </label><br>
        <label class="replaced">
            <input type="radio" id="isReplaced" name="cardIs" value="replaced" />
            Replaced; now unknown
        </label>
    </p>
    <p>
        <label class="cardNumber">
            Number:
            <select id="cardNumber"></select>
        </label>
        <label class="cardColour">
            Colour:
            <select id="cardColour"></select>
        </label>
    </p>
    <p>
        <button id="ok">OK</button>
        <button id="reset" style="float:right">Reset</button>
    </p>
</form>

@endsection
