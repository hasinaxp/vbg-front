export const HostAddress = 'http://localhost:3000/'

export const JsonQuery = async (type, url, info) => {
    const settings = {
        method: type,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
    };

    if (type == 'post') settings.body = JSON.stringify(info)

    const response = await fetch(`${HostAddress}api/${url}`, settings)
    if (response.status != 200) {
        console.log(`unable to query:${url}`)
        return { status: 100 }
    }
    const json = await response.json()
    return json
}

export const PostQuery = async (url, body) => {
    const settings = {
        method: 'POST',
        headers: {
        },
        credentials: 'same-origin',
        body: body
    };
    const response = await fetch(`${HostAddress}api/${url}`, settings)
    if (response.status != 200) {
        console.log(`unable to query:${url}`)
        return { status: 100 }
    }
    const json = await response.json()
    return json
}


export const JsonQueryAdmin = async (type, url, info) => {
    const settings = {
        method: type,
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(info)
    };

    const response = await fetch(`${HostAddress}api/${url}`, settings)
    if (response.status != 200) {
        console.log(`unable to query:${url}`)
        return { status: 100 }
    }
    const json = await response.json()
    return json
}


export const JsonQueryAuth = async (type, url, info) => {
    const settings = {
        method: type,
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache",
        headers: {
            Accept: 'application/json',
            'logautx' : `${getCookie('logautx')}`,
            'logauty' : `${getCookie('logauty')}`,
            'logauti' : `${getCookie('logauti')}`,
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(info)
    };

    const response = await fetch(`${HostAddress}api/${url}`, settings)
    if (response.status != 200) {
        console.log(`unable to query:${url}`)
        return { status: 100 }
    }
    const json = await response.json()
    return json
}

export const PostQueryAuth = async ( url, body) => {
    const settings = {
        method: 'POST',
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache",
        headers: {
            'logautx' : `${getCookie('logautx')}`,
            'logauty' : `${getCookie('logauty')}`,
            'logauti' : `${getCookie('logauti')}`
        },
        credentials: 'same-origin',
        body: body
    };

    const response = await fetch(`${HostAddress}api/${url}`, settings)
    if (response.status != 200) {
        console.log(`unable to query:${url}`)
        return { status: 100 }
    }
    const json = await response.json()
    return json
}

export const AuthData = () => {
    return {
        logautx: getCookie('logautx'),
        logauty: getCookie('logauty'),
        logauti: getCookie('logauti')
    }
}

export const SetCookie = (key, value) => {
    document.cookie = `${key}=${value};`;
}
export const getCookie = (cname) => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}