<script>
    import { onMount } from "svelte";
    import config from "../config.js";

    const animation_time = 1000;
    const animation_tick = 10;
    const animation_mod = animation_tick / animation_time;
    let completed = 0;
    let pending = 0;
    let failed = 0;

    async function fetch_gatekeeper_data() {
        return fetch(`${config.basepath}/api/stats`).then((r) => {
            return r.json();
        }).catch((e) => {
            console.error(e)
            return {};
        });
    }

    onMount(async () => {
        const gatekeeper_data = await fetch_gatekeeper_data();
        const rates = {
            completed: gatekeeper_data.completed * animation_mod,
            pending: gatekeeper_data.pending * animation_mod,
            failed: gatekeeper_data.failed * animation_mod,
        }
        const incrementer = setInterval(() => {
            failed += rates.failed;
            pending += rates.pending;
            completed += rates.completed;
            failed = Math.min(failed, gatekeeper_data.failed);
            pending = Math.min(pending, gatekeeper_data.pending);
            completed = Math.min(completed, gatekeeper_data.completed);

            if (failed >= gatekeeper_data.failed
                && pending >= gatekeeper_data.pending
                && completed >= gatekeeper_data.completed
            ) {
                clearInterval(incrementer);
            }
        }, animation_tick)
    })    
</script>

<div class="container">
    <h1>Gatekeeper</h1>
    <div class="stats">
        <div class="stat">
            <h4 class="green">Completed captchas</h4>
            <h2>{Math.floor(completed)}</h2>
        </div>
        <div class="stat">
            <h4 class="yellow">Pending captchas</h4>
            <h2>{Math.floor(pending)}</h2>
        </div>
        <div class="stat">
            <h4 class="red">Failed captchas</h4>
            <h2>{Math.floor(failed)}</h2>
        </div>
    </div>
</div>


<style>
    :global(html, body, #sapper) {
        width: 100%;
        height: 100%;
        margin: 0;
    }

    :global(body) {
        background-color: #282828;
        color: #eee;
        font-family: "Input Mono";
    }

    .container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto 1fr auto;
        padding: 50px;
        box-sizing: border-box;
    }

    .stats {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    h1 {
        font-size: 72px;
        text-align: center;
        margin: 0;
        color: #a89984;
    }

    h2 {
        font-size: 76px;
        margin: 0;
        color: #ebdbb2;
    }

    h4 {
        text-align: center;
        font-size: 26px;
    }

    h4.red {
        color: #fb4934;
    }

    h4.green {
        color: #279921;
    }

    h4.yellow {
        color: #98971a;
    }

    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
