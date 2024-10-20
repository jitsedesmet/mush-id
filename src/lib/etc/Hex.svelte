<div class="container">
    <div class="hexagon-container">
        <div class="hexagon"></div>
        <div class="button button1"></div>
        <div class="button button2"></div>
        <div class="button button3"></div>
        <div class="button button4"></div>
        <div class="button button5"></div>
        <div class="button button6"></div>
    </div>
</div>


<style>
    .container {
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: fit-content;
    }

    .hexagon-container {
        position: relative;
        width: 230px;
        height: 260.94px; /* add additional 30 for the buttons */
    }

    .hexagon {
        position: absolute;
        margin-top: 15px;
        margin-left: 15px;
        width: 200px;
        height: 230.94px;
        background-color: #3498db; /* Change the background color as needed */
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        cursor: pointer;
    }

    .button {
        position: absolute;
        width: 30px; /* Adjust button size as needed */
        height: 30px;
        background-color: #2ecc71; /* Change the button color as needed */
        border-radius: 50%;
        cursor: pointer;
        transform-box: content-box;
        transform: translate(-50%, 0%);
    }

    .button1 { left: 50%; top: 0; }
    .button2 { left: 93%; top: 25%; }
    .button3 { left: 93%; top: 67%; }
    .button4 { left: 50%; top: 89%; }
    .button5 { left: 6%; top: 67%; }
    .button6 { left: 6%; top: 25%; }
</style>
