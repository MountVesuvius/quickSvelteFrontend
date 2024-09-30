<script lang='ts'>
    import { getUserById } from '$lib';
    import { onMount } from 'svelte';

    let content: string = '';

    onMount(async () => {
        try {
            const response = await getUserById(1);
            console.log(response.data);
            content = JSON.stringify(response.data) ;
        } catch (err) {
            error = 'Invalid username or password';
            console.error(err);
        }
    })
</script>

you managed to login, wow
<br>
Content pulled from the backend: {content}
