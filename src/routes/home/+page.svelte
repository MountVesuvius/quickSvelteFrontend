<script lang='ts'>
    import { getUserById, getAccessToken } from '$lib';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let content: string = '';

    onMount(async () => {
        try {
            const response = await getUserById(1);
            console.log(response.data);
            content = JSON.stringify(response.data) ;
        } catch (err) {
            console.error(err);
            goto('/login')
        }
    })
</script>

you managed to login, wow
<br>
Content pulled from the backend: {content}
