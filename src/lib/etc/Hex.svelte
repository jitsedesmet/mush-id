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
        width: 200px;
        height: 227px;
    }

    .hexagon {
        position: absolute;
        margin-top: 13px;
        margin-left: 13px;
        width: 174px;
        height: 200px;
        background: linear-gradient(135deg, var(--c-primary-mid) 0%, var(--c-primary-dark) 100%);
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        cursor: pointer;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,.2));
    }

    .button {
        position: absolute;
        width: 26px;
        height: 26px;
        background: var(--c-amber);
        border-radius: 50%;
        cursor: pointer;
        transform-box: content-box;
        transform: translate(-50%, 0%);
        box-shadow: 0 2px 6px rgba(0,0,0,.25);
    }

    .button1 { left: 50%; top: 0; }
    .button2 { left: 93%; top: 25%; }
    .button3 { left: 93%; top: 67%; }
    .button4 { left: 50%; top: 89%; }
    .button5 { left: 6%;  top: 67%; }
    .button6 { left: 6%;  top: 25%; }
</style>
