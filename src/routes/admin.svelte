<script>
    import admins from '../util/admins';
    export let user;
</script>

{#if admins.includes(user)}
    <div>welcome admin</div>
{:else}
    <div class="w-screen h-screen grid place-content-center">
        <div class="bg-white text-4xl p-8">Unauthorized. Contact me on discord if you want to help with moderation.</div>
    </div>
{/if}
