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
            setTokens(response.access, response.refresh);
            goto('/home'); // Redirect to the home after successful login
        } catch (err) {
            error = 'Invalid username or password';
            console.error(err);
        }
    };
</script>
<style>
    /* Styling for the container */
    .login-container {
        max-width: 400px;
        margin: 100px auto;
        padding: 20px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    }

    h1 {
        text-align: center;
        margin-bottom: 20px;
        color: #333;
        font-size: 24px;
    }

    label {
        font-size: 14px;
        margin-bottom: 5px;
        display: block;
        color: #555;
    }

    input {
        width: 90%;
        padding: 12px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
    }

    button {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 4px;
        background-color: #3498db;
        color: white;
        font-size: 16px;
        cursor: pointer;
    }

    button:hover {
        background-color: #2980b9;
    }

    p {
        color: red;
        text-align: center;
        font-size: 14px;
        margin-top: -10px;
        margin-bottom: 20px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .login-container input:focus {
        outline: none;
        border-color: #3498db;
    }
</style>

<div class="login-container">
    <h1>Login</h1>
    <form on:submit|preventDefault={handleLogin}>
        <div class="form-group">
            <label for="username">Email</label>
            <input id="username" bind:value={username} type="text" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input id="password" bind:value={password} type="password" placeholder="Enter your password" required />
        </div>
        {#if error}
            <p>{error}</p>
        {/if}
        <button type="submit">Login</button>
    </form>
</div>

