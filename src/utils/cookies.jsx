export function createCookie(key, value, expHours = 1/6) {
    const d = new Date();
    d.setTime(d.getTime() + (expHours * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
}

export function getCookie(cookieKey) {
    const cookies = document.cookie.split(';');
 
    for (let cookie of cookies) {
        const [key, val] = cookie.trim().split('=');
        
        if (key === cookieKey) 
            return val;
    }

    return null;
}

export function deleteCookie(key) {
    createCookie(key, '', 0);
}

