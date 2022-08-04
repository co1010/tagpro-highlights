<script>
    import admins from '../util/admins';
    export let user;
</script>

{#if admins.includes(user)}
    <div>welcome admin</div>
{:else}
    <div>you suck</div>
{/if}
