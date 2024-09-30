<script lang='ts'>
    import { login, setTokens, getAccessToken } from '$lib';
    import { goto } from '$app/navigation';

    // the export from $lib is being a pain for some reason, figure out why
    interface ITokenPair {
        access: string,
        refresh: string,
    }

    let username: string = '';
    let password: string = '';
    let error: string = '';

    const handleLogin = async () => {
        try {
            const response = await login(username, password) as ITokenPair;
            console.log('logged in and got:', response);
            setTokens(response.access, response.refresh);
            console.log(getAccessToken());
            goto('/home'); // Redirect to the home after successful login
        } catch (err) {
            error = 'Invalid username or password';
            console.error(err);
        }
    };
</script>

<h1>Login</h1>
<form on:submit|preventDefault={handleLogin}>
    <div>
        <label for="username">Email</label>
        <input id="username" bind:value={username} type="text" required />
    </div>
    <div>
        <label for="password">Password</label>
        <input id="password" bind:value={password} type="password" required />
    </div>
    {#if error}
        <p>{error}</p>
    {/if}
    <button type="submit">Login</button>
</form>
